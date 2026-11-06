# Step 9: Making Drizel a Playable Granular Instrument

*How MIDI notes, envelopes, modulation, and presets turn a continuous grain cloud into a musical instrument—and what happens inside the audio callback when a key is pressed.*

Drizel is a sample-based granular synthesizer built in C++ with JUCE. It creates sound by reading short fragments of a WAV recording, shaping each fragment with a window, and adding the overlapping fragments together. Before Step 9, the instrument already supported a continuous grain cloud, live controls, and LFO modulation. It could generate evolving textures, but it did not yet give a keyboard performance a precise musical meaning.

Step 9 introduces that performance layer: monophonic MIDI input, last-note priority, velocity-sensitive attack and release, pitch bend, controller mappings, and preset files. The existing granular engine remains the sound source. MIDI controls how that source is played.

The central design question is broader than “Can the plugin receive a note?” A playable instrument must decide which overlapping key takes priority, how a released note ends, how a controller combines with modulation, and what a recalled preset should do to notes that are already held. Those decisions must also fit within the audio thread’s processing deadline.

This article explains the implementation alongside the DSP and software concepts behind it. Examples use a 48 kHz output sample rate unless stated otherwise.

> **Source checkpoint:** The behavior described here is based on implementation commit [`8754378`](https://github.com/neuralmanacle/drizel/commit/87543785e7bff86793294e160912d79b48117f9f), merged by [`341d211`](https://github.com/neuralmanacle/drizel/commit/341d211). Existing engine mechanisms are explained where they affect Step 9. Possible extensions are identified separately from implemented behavior. Code excerpts omit surrounding context; they are not standalone replacements for the source files.

## 1. The architectural change: configuration, performance, and DSP history

Three kinds of state coexist inside the plugin:

| Kind of state | Examples | What it describes |
| --- | --- | --- |
| Patch configuration | Root note, attack, release, density, LFO rate and depth | How the instrument is configured |
| Performance state | Held keys, selected note, stored velocities, bend and controller values | What the musician is doing now |
| DSP history | Grain ages, read positions, scheduler countdown, smoother values | How sound generation has progressed |

These categories have different lifetimes. A preset should preserve the patch configuration. It should not bring back a note that happened to be held when it was saved. Reproducing the exact output waveform would require much more DSP history than a normal patch file contains.

Step 9 also adds two operating modes:

| Mode | Behavior |
| --- | --- |
| Drone | The cloud is heard continuously through the existing output controls. |
| MIDI | The same cloud is multiplied by a note-controlled amplitude envelope. |

Drone remains the default. MIDI mode begins silent, becomes audible when a note opens the envelope, and returns to silence when the last note’s release finishes.

The new host parameters are `midiMode`, `attack`, `release`, and `rootNote`. They join the same parameter tree as position, pitch, density, gain, and the LFO controls.

## 2. What a grain cloud actually computes

A grain is a short reading of the source recording. It has a source starting position, playback rate, output duration, amplitude window, gain, and stereo placement.

A simplified mathematical description of grain $k$ is:

$$
g_k[n]
=a_k\,w_k[n-n_k]\,
x\left(q_k+r_k(n-n_k)\right)
$$

Here, $x$ is the source recording, $n_k$ is the grain’s launch time, $q_k$ is its source starting position, $r_k$ is its read increment, $w_k$ is its window, and $a_k$ is its gain. The window is understood to contribute only during that grain’s lifetime. Fractional source positions require interpolation, discussed below.

The cloud adds active grains:

$$
c[n]=\sum_k g_k[n]
$$

This is **overlap-add synthesis**. Stereo processing performs the corresponding sum for left and right separately.

### Why each grain needs a window

Abruptly cutting a waveform can create a discontinuity. A sudden step has broad spectral content and is often heard as a click. A window fades a grain in and out rather than exposing an arbitrary hard cut.

Drizel prepares Hann windows:

$$
w[m]=\frac12\left(1-\cos\frac{2\pi m}{L-1}\right),
\qquad 0\le m<L
$$

Their endpoints are zero. This improves the entry and exit of each grain, although it does not guarantee constant loudness when many grains overlap.

There are two separate amplitude-shaping mechanisms after Step 9:

| Mechanism | Scope | Purpose |
| --- | --- | --- |
| Grain window | One grain | Shape the grain’s short lifetime |
| MIDI envelope | The entire cloud | Shape the musician’s played note |

A held note may contain many generations of grains. Releasing that note fades the combined cloud rather than individually sending note-off to each grain.

## 3. One musical voice can contain many grains

Drizel uses one shared cloud and one selected MIDI note. This makes it a **monophonic instrument**, even though many grains can overlap and the output is stereo.

The terminology describes different things:

| Term | Meaning |
| --- | --- |
| Monophonic | One independently controlled musical note voice |
| Polyphonic | Multiple independently controlled musical note voices |
| Mono audio | One output channel |
| Stereo audio | Two output channels |
| Active grains | Short fragments currently contributing to the cloud |

Holding three keys does not create three independent clouds. Instead, those keys compete to control the existing cloud.

This choice limits additional CPU cost and avoids introducing a polyphonic voice allocator, per-voice grain resources, and voice stealing in the same development step.

### Last-note priority

The newest held note wins. When that key is released, selection returns to the most recently pressed key that is still held.

| Action | Held-note order | Selected note |
| --- | --- | --- |
| Press 60 | 60 | 60 |
| Hold 60 and press 64 | 60, 64 | 64 |
| Press 67 | 60, 64, 67 | 67 |
| Release 67 | 60, 64 | 64 |
| Release 64 | 60 | 60 |
| Release 60 | Empty | Release begins |

This is based on press order. It does not necessarily choose the highest or lowest pitch.

The instrument stores note numbers and their velocities in fixed arrays:

```cpp
std::array<int, 128> notes_ {};
std::array<double, 128> velocities_ {};
int count_ = 0, note_ = 60, remaining_ = 0;
```

The number 128 follows from MIDI 1.0’s note-number range, 0–127. A new note removes an earlier entry for the same key before appending itself:

```cpp
void noteOn(int note, double velocity) noexcept
{
    if (note < 0 || note > 127) return;
    if (velocity <= 0.0) { noteOff(note); return; }
    remove(note);
    notes_[count_] = note;
    velocities_[count_++] = std::clamp(velocity, 0.0, 1.0);
    select();
}
```

Removing duplicates ensures that repeated note-ons cannot grow the stack beyond its capacity. It also defines a musical policy: repeated note-ons for one key replace that key’s entry rather than creating separately counted instances.

Removal searches and shifts array entries. Its complexity is $O(N)$, but $N$ is bounded by 128. The important real-time property is predictable, limited work without container growth or heap allocation.

### What happens when a key is released?

```cpp
void noteOff(int note) noexcept
{
    if (!remove(note)) return;
    if (count_ > 0) select();
    else ramp(0.0, release_);
}
```

An unmatched note-off has no effect. If keys remain, selection and a ramp toward the selected key’s stored velocity occur. Otherwise, the amplitude ramps toward zero.

One detail follows directly from this code: removing any held key while others remain calls `select()`, even if the released key was not the selected key. That can restart the ramp toward the already-selected velocity. The pitch selection can remain unchanged while the amplitude ramp is recalculated.

## 4. Root notes connect a recording to a keyboard

A source recording needs a musical reference. `rootNote` declares which MIDI note corresponds to playing that source without note-derived transposition.

The instrument computes:

```cpp
double pitchOffset(int root) const noexcept
{
    return note_ - root + bend_;
}
```

With root 60 and no bend:

| Played note | Note offset | Result |
| --- | --- | --- |
| 60 | 0 semitones | Original source pitch |
| 67 | +7 semitones | A perfect fifth above the source |
| 72 | +12 semitones | An octave above the source |
| 48 | −12 semitones | An octave below the source |

The root setting does not detect or correct the source’s fundamental frequency. If a recording contains D and its root is assigned to the C key, pressing that C key preserves the recorded D, assuming other pitch controls are neutral.

For an unpitched texture, the root is simply a reference point for transposition. For a pitched sample, a correctly assigned root makes the keyboard mapping musically meaningful.

## 5. Semitones become a source-reading increment

Equal temperament uses equal frequency ratios between adjacent semitones. Twelve semitones make an octave, so the ratio $a$ per semitone satisfies:

$$
a^{12}=2
\quad\Rightarrow\quad
a=2^{1/12}
$$

For an offset of $p$ semitones:

$$
r_{\text{pitch}}=2^{p/12}
$$

| Offset | Ratio |
| --- | --- |
| −12 semitones | 0.5 |
| 0 semitones | 1 |
| +7 semitones | Approximately 1.498 |
| +12 semitones | 2 |

Semitone offsets add, while their frequency ratios multiply:

$$
2^{(p_1+p_2)/12}
=2^{p_1/12}\,2^{p_2/12}
$$

This makes semitones a convenient unit for combining knob pitch, MIDI note offset, pitch bend, and LFO pitch modulation.

### Correcting for different sample rates

The source recording and output device may use different sample rates. The complete read increment is:

$$
r_{\text{read}}
=2^{p/12}\frac{f_{\text{source}}}{f_{\text{output}}}
$$

The units are **source frames per output frame**. A frame is one time position across all channels: a stereo frame contains both a left and a right sample.

For a 44.1 kHz source and 48 kHz output at zero transposition:

$$
r_{\text{read}}=\frac{44100}{48000}=0.91875
$$

After 48,000 output frames, the reader has advanced through 44,100 source frames. Both represent one second. Reading one source frame per output frame instead would play the recording too fast and too high.

### Grain duration and source traversal are separate

The current real-time preparation uses approximately 100 ms grains. At 48 kHz, that means 4,800 output frames. A grain’s window advances in output time, while its source position advances at `r_read`.

Assuming matching source/output sample rates:

| Pitch ratio | Grain output duration | Approximate source time traversed |
| --- | --- | --- |
| 0.5 | 100 ms | 50 ms |
| 1 | 100 ms | 100 ms |
| 2 | 100 ms | 200 ms |

The grain lasts the same amount of output time at every pitch. Higher pitch makes it traverse more source material during that lifetime. Reading beyond the source boundary contributes zero-padded values in the current reader.

This is playback-rate transposition inside a granular renderer. It is not a phase-vocoder algorithm, and it does not automatically preserve the original timing and structure of a complete recording.

## 6. Fractional source positions and interpolation

A read increment such as 0.91875 produces positions between stored samples. Interpolation estimates the value at those positions.

For a position $j+\mu$, where $j$ is an integer and $0\le\mu<1$, linear interpolation is:

$$
\hat{x}(j+\mu)=(1-\mu)x[j]+\mu x[j+1]
$$

For neighboring values 0.2 and 0.6, a position one-quarter of the way between them gives:

$$
0.75(0.2)+0.25(0.6)=0.3
$$

This approximation is inexpensive, but it has frequency-dependent error. The engine infrastructure also supports a Hermite reader; the prepared real-time settings at this checkpoint use the default linear mode.

### Interpolation is not complete anti-aliasing

Interpolation answers “What value lies between these stored samples?” Anti-aliasing addresses “Which frequencies can the output represent without folding?”

The Nyquist limit is half the output sample rate:

$$
f_N=\frac{f_s}{2}
$$

At 48 kHz, the limit is 24 kHz. A 15 kHz source component transposed up an octave would become 30 kHz. Sampling at 48 kHz can fold it to an audible alias at:

$$
|30\,000-48\,000|=18\,000\text{ Hz}
$$

Linear interpolation does not provide the selective filtering required to prevent this across arbitrary transposition ratios. A more accurate interpolator may improve reconstruction without independently solving anti-aliasing. A band-limited resampling strategy would be a separate extension.

## 7. A finite, velocity-sensitive note envelope

The MIDI envelope has an attack, a held level determined by velocity, and a release. There is no separate decay stage or independently adjustable sustain level.

Its state consists of a current value, target, remaining sample count, and per-sample step. The ramp is prepared as follows:

```cpp
void ramp(double target, double seconds) noexcept
{
    target_ = target;
    remaining_ = static_cast<int>(
        std::max(1.0, std::round(seconds * rate_)));
    step_ = (target_ - envelope_) / remaining_;
}
```

For current level $E_0$, target $T$, duration $t$, and sample rate $f_s$:

$$
N=\max(1,\operatorname{round}(t f_s)),
\qquad
\Delta=\frac{T-E_0}{N}
$$

At 48 kHz, a 10 ms attack lasts 480 samples. Starting at zero with velocity target 0.8 gives:

$$
\Delta=\frac{0.8}{480}\approx0.001667
$$

The level reaches 0.8 after 480 envelope ticks. On release, the same mechanism targets zero using the configured release duration.

### Why the endpoint is assigned explicitly

```cpp
double nextAmplitude() noexcept
{
    if (remaining_ > 0)
    {
        --remaining_;
        envelope_ = remaining_ == 0
            ? target_ : envelope_ + step_;
    }
    return envelope_;
}
```

Repeated floating-point additions can accumulate small rounding errors. Assigning the target on the final tick makes the endpoint explicit. A release reaches exact zero after a finite number of samples and remains there.

The first increment occurs on the frame where the event is dispatched, because dispatch precedes `nextAmplitude()`. The final tick uses the target directly. This detail matters when writing sample-exact tests.

### Retriggering from the current level

If the current envelope is 0.4 and a new note requests 0.9, the next attack begins at 0.4. It does not force an instantaneous reset to zero.

This preserves amplitude continuity and reduces the chance of a click caused by a gain jump. It does not guarantee continuity of the envelope’s slope, nor does it restart the source waveform or every grain.

The duration is always the configured attack time, even when the target is close to the current level. The implementation recalculates the slope for the remaining distance.

### Velocity and perceived loudness

The velocity mapping is linear in amplitude:

$$
v=\frac{V}{127}
$$

Velocity 64 maps to approximately 0.504. Relative to full amplitude, that is:

$$
20\log_{10}(0.504)\approx-5.95\text{ dB}
$$

Half velocity therefore produces roughly half amplitude for otherwise identical cloud audio. It does not necessarily sound half as loud. Perception depends on frequency content, duration, listening level, and other factors.

A future velocity curve could use $v^\gamma$, or velocity could also affect brightness and density. Step 9 deliberately uses the direct amplitude mapping.

## 8. MIDI messages and sample-accurate dispatch

MIDI carries performance instructions, not audio samples. A channel-1 note-on might contain these three bytes:

| Byte | Example | Meaning |
| --- | --- | --- |
| Status | `0x90` | Note-on on channel 1 |
| Data 1 | `60` | Note number |
| Data 2 | `100` | Velocity |

For channel voice messages, the upper four status bits identify the message type. The lower four identify the channel, represented internally as 0–15 for user-facing channels 1–16.

```cpp
status & 0xf0  // message type
status & 0x0f  // channel
```

Drizel’s dispatcher accepts channel 1 only and handles four message families:

| Family | Meaning |
| --- | --- |
| `0x90` | Note-on; zero velocity is treated as note-off |
| `0x80` | Note-off; release velocity is currently unused |
| `0xb0` | Control change |
| `0xe0` | Pitch bend |

Other message types do not affect the instrument in this version.

### A block contains a timeline

The host requests a block of audio and provides MIDI events with frame offsets inside that block. A 256-frame block might contain note-on at 37, pitch bend at 90, and note-off at 180.

| Frame range or position | Required behavior |
| --- | --- |
| 0–36 | Render before the note-on |
| 37 | Apply note-on, then render that frame |
| 90 | Apply bend, then render that frame |
| 180 | Apply note-off, then render that frame |

The callback dispatches events inside the sample loop:

```cpp
while (event != eventEnd && (*event).samplePosition <= i)
{
    const auto message = *event++;
    const auto* data = message.data;
    if (useMidi && message.numBytes >= 3
        && (data[0] & 0x0f) == 0)
    {
        switch (data[0] & 0xf0)
        {
            case 0x90:
                instrument.noteOn(data[1], data[2] / 127.0);
                break;
            case 0x80:
                instrument.noteOff(data[1]);
                break;
            case 0xb0:
                instrument.controller(data[1], data[2]);
                break;
            case 0xe0:
                instrument.pitchBend(data[1] | (data[2] << 7));
                break;
            default: break;
        }
    }
}
```

The `while` handles every event due at that frame, including several events at the same offset. Their order is preserved, which matters when messages immediately counteract one another.

At 48 kHz, 256 frames span about 5.33 ms. Processing every event at the block’s beginning would shift some gestures by almost that entire interval.

Sample-accurate dispatch means the instrument state changes at the event’s offset. It does not guarantee that a newly requested pitch is immediately audible: smoothing and grain scheduling still follow.

Ordinary host parameters are read once per block in this implementation. Their timing path is different from the sample-offset MIDI path.

### Borrowing event bytes

The dispatcher reads bytes owned by the incoming MIDI buffer rather than constructing an owning `MidiMessage` copy for every event. This avoids unnecessary copying and possible dynamic storage for larger message types such as SysEx. Small note messages are not inherently heap-heavy.

The borrowed pointers are used only while their buffer is valid. The MIDI buffer is cleared after dispatch and rendering, because the plugin consumes MIDI and does not emit MIDI output.

## 9. Pitch bend and expressive controllers

Pitch bend uses fourteen bits, assembled from two seven-bit data bytes:

$$
B=\text{LSB}+128\,\text{MSB}
$$

Its integer range is 0–16,383, with center at 8,192. Step 9 maps the range to −2 through +2 semitones:

```cpp
void pitchBend(int value) noexcept
{
    value = std::clamp(value, 0, 16383);
    bend_ = 2.0 * (value - 8192)
        / (value < 8192 ? 8192.0 : 8191.0);
}
```

There are 8,192 integer steps below center and 8,191 above it. The two denominators make the negative and positive endpoints exactly −2 and +2. Bend sensitivity is fixed here; interpreting a requested sensitivity through MIDI RPN messages would require additional implementation.

Control changes provide additional performance mappings:

| Controller | Implemented behavior |
| --- | --- |
| CC1 | Add normalized wheel value to LFO depth, capped at 1 |
| CC74 | Override source position with a normalized value from 0 to 1 |
| CC71 | Override density with a value from 1 to 100 grains per second |
| CC123 | Clear held notes and begin the release ramp |
| CC120 | Reset instrument state and immediately silence its envelope |
| CC121 | Reset bend/wheel and clear position/density overrides |

The synthesis assignments for CC71 and CC74 are Drizel’s own mapping choices. The normalized controller value is $u=V/127$; density becomes $1+99u$.

Position and density use an override policy. Before their controller is received, the instrument uses the corresponding patch value. Afterward, it uses the controller value until a reset clears the override. A negative internal sentinel marks “no override.” Moving the associated UI knob does not remove that override.

CC1 follows an additive policy:

$$
d_{\text{effective}}=\min(1,d_{\text{patch}}+d_{\text{wheel}})
$$

It adds depth to the existing modulation route. If the route is Off, moving the wheel does not independently enable a destination.

CC123 and CC120 intentionally differ. All Notes Off allows the configured release. All Sound Off cuts the MIDI envelope immediately and can produce an abrupt waveform discontinuity. In this engine, that immediate output silence does not require stopping the underlying cloud.

## 10. Combining MIDI with the existing modulation system

The processor must merge several controls into one set of engine targets:

1. Start with patch position, pitch, and density.
2. Apply MIDI position/density overrides when active.
3. Combine patch LFO depth with CC1.
4. Route the current LFO value to position or pitch.
5. Add MIDI note offset and pitch bend to pitch.
6. Pass the combined targets through the existing engine.
7. Multiply the returned audio by the MIDI envelope.

The main rendering calls express this order:

```cpp
const auto targets = modulation.apply(
    useMidi ? instrument.position(pos) : pos,
    semitones,
    lfo.next());

const auto frame = engine.next(
    targets.position,
    targets.pitch + (useMidi ? instrument.pitchOffset(root) : 0.0),
    useMidi ? instrument.density(grains) : grains,
    level);
```

### The LFO is a control signal

An LFO is an oscillator whose output changes a parameter instead of directly becoming the audible waveform. Drizel generates sine or triangle values between −1 and +1.

Phase is stored in cycles and advances by:

$$
\Delta\phi=\frac{f_{\text{LFO}}}{f_s}
$$

For a sine:

$$
l[n]=\sin(2\pi\phi[n])
$$

Subtracting the integer part wraps phase into a single cycle. At 0.5 Hz, one cycle takes two seconds.

The modulation router uses these target formulas, with depth $d$ and LFO value $l$:

$$
P_{\text{target}}
=\operatorname{clamp}(P+0.25dl,0,1)
$$

or:

$$
p_{\text{routed}}
=\operatorname{clamp}(p_{\text{patch}}+12dl,-24,24)
$$

At full depth, position can move by one-quarter of the sample length in either direction; pitch can move by twelve semitones before the router’s limits apply. Position modulation changes the region used by newly launched grains. Pitch modulation changes their playback-rate target.

Clamping changes the control waveform near boundaries. Position modulation centered near zero can flatten against the start of the sample instead of tracing a symmetric sine motion.

The MIDI offset is added after the router’s pitch clamp. The ±24-semitone router limit therefore does not limit the complete keyboard-plus-bend target to that range; the real-time engine has a wider final pitch bound.

## 11. Why a precisely timed note can change sound gradually

Three mechanisms intervene between a MIDI pitch change and the resulting cloud: exponential smoothing, grain launch timing, and the lifetime of existing grains.

### The 20 ms smoother

The engine updates its current control value $s[n]$ toward target $u[n]$:

$$
s[n]=s[n-1]+\alpha\left(u[n]-s[n-1]\right)
$$

with:

$$
\alpha=1-e^{-1/(f_s\tau)},
\qquad \tau=0.020\text{ s}
$$

This is a one-pole low-pass filter applied to the control signal. It reduces abrupt parameter steps and the audible discontinuities they can cause.

For a fixed target, the remaining error follows approximately:

$$
e(t)=e(0)e^{-t/\tau}
$$

| Time after a target change | Approximate progress toward the target |
| --- | --- |
| 20 ms | 63.2% |
| 60 ms | 95.0% |
| 100 ms | 99.3% |

The 20 ms value is a **time constant**, not a delay and not a finite ramp duration. Smoothing begins immediately, but the response approaches the target gradually. It also attenuates sufficiently rapid control modulation.

Pitch smoothing happens in semitone space before conversion to playback ratio. Equal increments in semitones correspond to equal musical intervals, rather than equal increments in frequency ratio.

### A grain captures settings when it starts

The cloud’s live-control update changes the settings used for future launches. An already-active grain keeps its captured source position, read rate, window, and other launch settings.

After a note change:

1. The selected-note target changes at the MIDI frame offset.
2. The engine’s smoothed pitch begins approaching that target.
3. The next launch captures the current smoothed pitch.
4. Older grains continue with their previous read rates.
5. Overlap-add combines those generations until the older grains finish.

Drizel does not continuously retune every active grain. Its transition can briefly contain grains with different pitches, even though there is only one independently selected musical voice.

The LFO phase and cloud scheduler are not restarted by every note-on. Repeated notes can expose different moments of the ongoing texture rather than reproduce the same transient or waveform phase.

## 12. Why the note envelope is multiplied at the output

The engine already smooths gain, fades around source replacement, and applies output safety handling. Sending the note envelope into its gain target would filter the intended attack and release through another smoother.

Step 9 applies the note envelope after the engine returns the current stereo frame:

```cpp
const float amplitude = useMidi
    ? static_cast<float>(instrument.nextAmplitude())
    : 1.0f;

left[i] = amplitude * (right != nullptr
    ? frame.left
    : 0.5f * (frame.left + frame.right));

if (right != nullptr)
    right[i] = amplitude * frame.right;
```

This happens **for every frame inside the block**, not once at the end of the block.

A simplified output equation is:

$$
y[n]=E[n]\;S\left(c[n]G[n]F[n]\right)
$$

Here, $E$ is the MIDI envelope, $c$ is the cloud, $G$ is smoothed gain, $F$ is the source-swap fade, and $S$ is the safety stage. Once $E=0$, the finite returned engine frame is multiplied by zero.

### Example: the extra tail avoided by final multiplication

Suppose a held envelope is 0.8 and release takes 200 ms. A direct linear ramp reaches zero after that finite interval.

If the same ramp were subsequently passed through a 20 ms exponential smoother, the smoothed output would lag behind. At the ramp’s endpoint, it would still be approximately 0.08 in the idealized continuous-time case. It would then decay further instead of stopping at the configured endpoint.

Applying the MIDI envelope last preserves its finite timing. The existing engine gain smoother still performs its own role independently.

### Stereo and metering

The same amplitude multiplier is applied to left and right, preserving their relative balance. For mono output, the processor uses:

$$
y_{\text{mono}}=\frac{L+R}{2}
$$

The factor of one-half limits simple summation gain. It does not prevent opposite-phase content from canceling during downmixing.

The output meter is measured after note-envelope multiplication, while the grain counter describes internal cloud activity. A silent meter and nonzero active-grain count can therefore both be correct. MIDI silence also does not imply that the cloud’s CPU work has stopped.

## 13. Density, overlap, and apparent onset

For density $D$ grains per second, the nominal launch interval is:

$$
T_{\text{launch}}=\frac1D
$$

For grain duration $T_g$, the approximate steady overlap is:

$$
N_{\text{overlap}}\approx D T_g
$$

With 100 ms grains:

| Density | Nominal launch interval | Approximate overlap |
| --- | --- | --- |
| 5 grains/s | 200 ms | 0.5 |
| 20 grains/s | 50 ms | 2 |
| 100 grains/s | 10 ms | 10 |

An overlap below one permits gaps. Greater overlap generally produces a more continuous texture, while source content, windows, and stereo placement still influence the result.

Because note-on does not restart the scheduler, a fast envelope can open between grain launches. The perceived onset depends on the cloud already present at that moment. At low density, the response may feel sparse even with a short attack setting.

The scheduler keeps a fractional countdown rather than rounding every interval to an integer frame. This avoids accumulating the same rounding error on every launch. When density changes, the countdown is scaled to preserve its phase relative to the new interval.

### Conservative gain compensation

If $N$ signals line up coherently, their amplitudes can add roughly in proportion to $N$. Uncorrelated contributions tend to combine in RMS roughly as $\sqrt{N}$. These are different assumptions about signal relationships.

Drizel prepares grain gain using a conservative overlap bound at the maximum live density of 100 grains per second. It also accounts for source peak magnitude and the chosen reader’s bound. That gain remains fixed as live density changes.

This avoids active-count-driven gain pumping, but it does not maintain equal perceived loudness at every density. Sparse settings may be quieter.

The final safety stage replaces non-finite output with zero and clamps finite values into $[-1,1]$. That is a numerical safeguard and hard clip, rather than a transparent limiter.

## 14. Real-time ownership and the audio callback

The host repeatedly calls `processBlock()` to ask for the next block of audio. A block of $B$ frames at sample rate $f_s$ spans:

$$
T_{\text{block}}=\frac{B}{f_s}
$$

For 128 frames at 48 kHz:

$$
T_{\text{block}}\approx2.67\text{ ms}
$$

The audio processing must meet its deadline consistently within the host’s overall workload. A low average processing time does not compensate for occasional long stalls that cause an underrun.

Drizel assigns work to distinct execution contexts:

| Context | Responsibilities |
| --- | --- |
| Audio thread | MIDI dispatch, note state, envelopes, smoothers, grain rendering |
| UI/message thread | Editor controls, attachments, preset dialogs and explicit preset file operations |
| Background loader | WAV decoding, window preparation, prepared-sample publication, old-sample reclamation |

The **editor** is the graphical interface. The processor owns audio behavior, so synthesis can continue when the editor window is closed.

UI attachments connect controls to JUCE parameters. Those values can also be changed by the host. The callback reads cached atomic parameter pointers; it does not query graphical widgets.

### Single-thread ownership instead of shared mutation

During processing, the audio thread alone mutates the `MidiInstrument` object. A UI action or state recall requests a reset rather than directly editing its note arrays or envelope.

```cpp
if (resetInstrument.exchange(false)
    || useMidi != previousMidiMode)
    instrument.reset();
previousMidiMode = useMidi;
```

The atomic exchange reads and clears the request in one indivisible operation. A separate load followed by a store could lose a request arriving between those operations.

Several pending reset requests may collapse into one. That is acceptable because the desired action is simply to clear the transient instrument state. A mode change also triggers a reset at the callback boundary.

An atomic flag does not make the entire preset operation, parameter tree, or engine state one atomic transaction. It provides a safe handoff for this particular request.

### Why locks still exist elsewhere

The request mutex protects paths, revisions, and status shared by non-audio operations. The sample loop does not acquire that mutex. This avoids making audio wait for a loader or UI operation that might be delayed by the operating system.

The loader constructs a prepared sample and publishes it through an atomic ownership handoff. The audio thread adopts it when the source-swap fade has reached silence, then hands the old storage back for destruction on the worker.

The current swap fade takes approximately 10 ms down and 10 ms up. It is separate from the note envelope. The handoff also rejects prepared samples for an outdated output sample rate.

The loader uses request revisions so a slow decode from an earlier selection does not replace a newer requested source. If the newest load fails, its status reports the failure while current audio can continue.

### Supporting callback details

Several small choices reinforce these boundaries:

- `buffer.clear()` initializes output channels before rendering.
- A zero-channel guard prevents invalid channel access and resets transient instrument state.
- `ScopedNoDenormals` avoids costly arithmetic on extremely small floating-point values on relevant platforms.
- The sample loop uses the actual block length rather than assuming every callback has one fixed size.
- Atomic peak and grain-count telemetry lets the UI observe results without mutating DSP state.
- `noexcept` marks functions that do not propagate exceptions; it does not by itself prove that a function is fast, allocation-free, or real-time safe.

## 15. Presets reuse the host-state representation

Serialization converts patch configuration into bytes. Deserialization validates and reconstructs the configuration.

JUCE’s `AudioProcessorValueTreeState` associates parameter IDs with values and supports UI attachments and state storage. Drizel’s host-state callbacks copy that tree, include the source path, and convert the state through JUCE’s XML-to-binary representation.

The explicit preset writer reuses that path:

```cpp
bool DrizelAudioProcessor::savePreset(const juce::File& file)
{
    juce::MemoryBlock data;
    getStateInformation(data);
    return file.replaceWithData(data.getData(), data.getSize());
}
```

This keeps DAW session state and `.drizel` preset files based on one configuration format. The extension identifies a Drizel preset; the file is not simply a WAV or a recording of the output.

| Stored or restored | Excluded from the patch snapshot |
| --- | --- |
| Parameter values, including root and envelope times | Held-note stack and current note envelope level |
| LFO configuration | Current LFO phase |
| Requested source WAV path | Embedded source audio bytes |
| Patch position, pitch, density, and gain | Exact active-grain and scheduler history |

### Loading and validation

The explicit preset loader rejects files larger than 1 MiB, attempts to decode the state, and checks the expected tree type before applying it. These checks reject malformed and unrelated files; they are not exhaustive semantic validation of every possible state value.

State recall requests an instrument reset, restores parameter values, and queues the source path for background loading. Preset acceptance and sample readiness are therefore different events.

The path references an external WAV. Moving or deleting that recording can prevent successful source restoration. The preset is not a portable bundle containing the audio.

The reset prevents the patch from recalling a held note. It does not create a sample-identical rerender of the original performance. Exact reproduction would require additional histories such as grain ages, scheduler timing, random-generator position, and smoothers.

## 16. Build configuration makes MIDI reachable

A processor can contain correct MIDI logic while its wrapper fails to advertise MIDI input. The host must know what kind of plugin it is loading and which event/audio connections it supports.

The processor reports:

```cpp
bool acceptsMidi() const override { return true; }
bool producesMidi() const override { return false; }
```

The CMake plugin configuration includes:

```cmake
IS_SYNTH TRUE
NEEDS_MIDI_INPUT TRUE
NEEDS_MIDI_OUTPUT FALSE
```

The project’s host-facing configuration must remain consistent across its build paths. The processor supports no audio input bus and mono or stereo audio output, while MIDI arrives through the event path.

The reported tail is 5.1 seconds, allowing for the envelope’s release range of up to five seconds. Tail and latency describe different things:

| Term | Meaning |
| --- | --- |
| Tail | How long sound may continue after an input gesture ends |
| Latency | Delay between input and corresponding output |

Drone mode intentionally produces ongoing sound, so the reported tail should not be interpreted as a claim that the cloud always stops after 5.1 seconds. Host suspension and routing still need practical validation.

## 17. Tests define specific guarantees

The test boundary mirrors the architecture. Core instrument tests exercise note logic without requiring a DAW, and processor tests exercise the JUCE integration.

| Layer | Examples of checked behavior |
| --- | --- |
| Core instrument | Initial silence, note priority, return to a held key, velocity target, exact release silence |
| Core controllers | Bend endpoints, wheel and position/density mappings, controller reset, immediate sound-off |
| Core storage and timing | Bounded repeated note-ons, the same event/envelope timeline under different block partitions |
| Processor integration | Channel filtering, nonzero MIDI offsets, output gating, consumed MIDI input |
| State integration | Preset write/read, parameter recall, invalid-file rejection, clearing a held note on recall |

Core tests use a 1,000 Hz test sample rate so durations become easy to count: a 10 ms attack is ten samples and a 20 ms release is twenty samples. This makes endpoint reasoning transparent without changing the algorithm.

### Block-partition invariance

A useful property is that one event timeline should produce the same envelope sequence regardless of how the timeline is split into blocks.

For example, note-on at global frame 17 and note-off at frame 41 should behave consistently whether the harness advances one frame at a time or groups frames into larger blocks. The instrument state must persist across those boundaries.

The core test checks this envelope property. Processor integration separately checks real MIDI offsets inside `processBlock()`. Together, they cover different responsibilities; they should not be mistaken for exhaustive proof of every host-block arrangement in the full plugin.

### What automated success does not establish

A constant-source test can reveal output gating errors without establishing transposition fidelity on complex material. Preset round-trips can verify configuration recall without proving that every WAV path remains available on another machine.

The project records Linux Debug builds and plugin-enabled CTest passes for this step. That evidence supports the tested behavior; it does not establish complete release readiness. This article describes those checks rather than claiming a new build was run during its preparation.

Remaining acceptance work includes listening, host validation, and measuring worst-case callback time under stressful conditions. Allocating nothing in the callback is valuable, but it is not a substitute for deadline measurements.

## 18. A practical build and listening session

For a fresh checkout, with a JUCE checkout available at `../JUCE` relative to the Drizel directory:

```bash
git clone https://github.com/neuralmanacle/drizel.git
cd drizel

# Optional: reproduce the implementation checkpoint discussed here.
git checkout 87543785e7bff86793294e160912d79b48117f9f

cmake -S . -B cmake-build-step9 \
  -DDRIZEL_JUCE_PATH=../JUCE \
  -DDRIZEL_BUILD_PLUGIN=ON \
  -DCMAKE_BUILD_TYPE=Debug

cmake --build cmake-build-step9 --parallel 2
ctest --test-dir cmake-build-step9 --output-on-failure
```

The optional checkout selects the article’s historical implementation rather than whichever version is currently on `main`. Required compiler, platform, JUCE, and plugin-format dependencies still need to be available.

Configuration generates the build; compilation/linking produces the binaries; CTest runs the registered checks. Loading the resulting plugin in a host exercises additional discovery, routing, device, and lifecycle behavior.

Listening is most informative when one mechanism changes at a time:

| Experiment | Procedure | What it reveals |
| --- | --- | --- |
| Drone baseline | Load a WAV and confirm continuous output | Source loading and the existing cloud work |
| MIDI silence | Switch to MIDI without pressing a key | Final output is gated despite cloud activity |
| Root mapping | Use a known pitched source and play its root and octave | Reference pitch and playback ratio |
| Note priority | Hold 60, add 64, then release 64 | Selection returns to the earlier held key |
| Velocity | Play the same note softly and strongly | Linear envelope scaling, with cloud variation as a separate factor |
| Attack/release | Vary times while keeping density fixed | Macro amplitude shape |
| Density | Compare sparse and dense settings at one envelope setting | Grain timing affects texture and apparent onset |
| Controllers | Exercise bend, CC1, CC74, and CC71 on channel 1 | Gesture mappings and override behavior |
| Reset behavior | Compare CC123 with CC120 | Release versus immediate cut |
| Preset recall | Save, alter controls, then recall while a note is held | Patch restoration and performance reset |

For pitch and modulation checks, start with LFO depth at zero, neutral bend, and cleared controller overrides. Then introduce one controller at a time. This makes it easier to connect an audible result to the responsible mechanism.

## 19. A note-on traced through the complete instrument

Consider a known pitched source with root 60. The output is 48 kHz, attack is 10 ms, release is 200 ms, base pitch is zero, and LFO depth is zero. The instrument begins in MIDI mode with no held notes. A channel-1 note-on for 72 with velocity 64 arrives at frame offset 37.

1. **Frames before 37:** The MIDI envelope remains zero. The engine can continue generating its cloud, but output is silent.
2. **Event dispatch:** Before rendering frame 37, the dispatcher selects note 72 and stores velocity $64/127\approx0.504$.
3. **Envelope setup:** The instrument schedules a 480-sample ramp from its current level to 0.504.
4. **Pitch target:** The note offset becomes $72-60=12$ semitones.
5. **Engine smoothing:** The smoothed pitch moves toward +12. It does not jump to its final value or finish after exactly 20 ms.
6. **Grain launches:** New grains capture the evolving pitch. Existing grains retain their previous playback rates.
7. **Output:** Each returned frame is multiplied by the current MIDI envelope level. The first attack increment is used on the event frame.
8. **Note-off:** When the final held key is released, a 9,600-sample ramp toward zero begins.
9. **Release completion:** The envelope is assigned exactly zero on its final tick. Output becomes silent while the cloud remains internally active.

The gesture has one MIDI timestamp, but its audible consequences unfold through multiple stateful systems.

## 20. What Step 9 establishes—and what comes later

Step 9 connects performance gestures to an existing granular renderer through explicit policies: one cloud, one selected note, last-note priority, linear velocity ramps, sample-offset MIDI dispatch, smoothed engine controls, and configuration-based preset recall.

Its boundaries are also clear:

- The instrument is monophonic; held keys do not create independent voices.
- Only MIDI channel 1 is interpreted.
- Sustain pedal, aftertouch, and MPE are not implemented in this step.
- The envelope controls final amplitude and is not a general modulation source.
- A note does not restart source playback or reproduce a fixed transient.
- Playback-rate transposition still has interpolation and aliasing limitations.
- Gain protection does not provide equal perceived loudness across textures.
- Presets reference source files and do not capture complete DSP history.

Each extension requires a different architectural addition:

| Extension | Additional design work |
| --- | --- |
| Polyphony | Independent note voices, resource budgets, allocation, voice stealing |
| Sustain pedal | Separate physical key state from notes sustained after release |
| MPE | Associate expression with individual notes, commonly through separate channels |
| Modulation network | Multiple sources and destinations, combination rules, depth scaling |
| Routable envelope | Expose envelope output to destinations beyond final amplitude |
| Improved transposition | A more complete band-limited resampling strategy |

The practical achievement is that Drizel now assigns a defined time, pitch, strength, and ending to a musical gesture. Understanding how those meanings travel through the state machine and renderer explains both the instrument’s playability and its continuing granular character.

## Source and further reading

### Article and implementation

- [Original Step 9 article](https://www.neuralmanacle.blog/articles/step-09-making-drizel-a-playable-granular-instrument)
- [Implementation commit](https://github.com/neuralmanacle/drizel/commit/87543785e7bff86793294e160912d79b48117f9f)
- [`MidiInstrument.h`: note selection, envelope, bend, and controllers](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/audio/MidiInstrument.h)
- [`PluginProcessor.cpp`: parameters, event dispatch, output, loading, and state](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/PluginProcessor.cpp)
- [`PluginProcessor.h`: processor capabilities and ownership](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/PluginProcessor.h)
- [`RealtimeEngine.h`: smoothers, sample handoff, fades, and safety](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/audio/RealtimeEngine.h)
- [`GrainCloud.h`: scheduling, overlap, and launch settings](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/audio/GrainCloud.h)
- [`Grain.h`: one grain’s source reader and window lifetime](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/audio/Grain.h)
- [`Modulation.h`: LFO and routing](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/src/audio/Modulation.h)
- [`MidiInstrumentTests.cpp`: isolated performance-state tests](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/tests/MidiInstrumentTests.cpp)
- [`PluginProcessorTests.cpp`: MIDI and preset integration tests](https://github.com/neuralmanacle/drizel/blob/87543785e7bff86793294e160912d79b48117f9f/tests/PluginProcessorTests.cpp)

### Technical references

- [MIDI Association: Summary of MIDI 1.0 Messages](https://midi.org/summary-of-midi-1-0-messages)
- [JUCE: `MidiBuffer`](https://docs.juce.com/master/classjuce_1_1MidiBuffer.html)
- [JUCE: `AudioProcessorValueTreeState`](https://docs.juce.com/master/classjuce_1_1AudioProcessorValueTreeState.html)
- [Julius O. Smith III: Linear Interpolation, *Physical Audio Signal Processing*](https://www.dsprelated.com/freebooks/pasp/Linear_Interpolation.html)
