# Step 11: Teaching Drizel Where to Start a Grain

> How a C++ granular synth measures transients, sustain, and brightness, then uses those measurements to choose where each grain begins.

Take a recording of a single picked guitar note. The first few milliseconds contain the pick striking the string. Later, the note settles into a steadier tone. If a granular synth repeatedly reads from the front of that note, the pick can become part of the texture. Move the grain starts into the tail and the texture can become smoother, even with the same pitch, density, and grain envelope.

In Step 9, I made Drizel’s grain cloud playable from a MIDI keyboard. Step 10 measured features across a WAV and saved them as a sample map. Step 11 uses those measurements to choose grain starts. **Position sets the region to search. Grain selection sets the preference within that region.** [Step 9 article](https://www.neuralmanacle.blog/articles/step-09-making-drizel-a-playable-granular-instrument) · [Step 10 devlog](https://github.com/neuralmanacle/drizel/blob/99368fc/docs/devlog/2026-11-09-step-10-sample-analysis.md)

The new menu works in Drone and MIDI modes. Keep Position fixed, switch from **Attack** to **Sustain**, and listen as grains from different parts of the recording enter the cloud. Grains already playing finish with the start and pitch they captured at launch. [Step 11 implementation at `99368fc`](https://github.com/neuralmanacle/drizel/commit/99368fc)

## From a WAV to an analysis frame

The Step 10 Python analyzer is the numerical reference. Step 11 ports three of its measurements to framework-independent C++: RMS, onset strength, and spectral centroid. The plugin builds its selection tables directly from the decoded WAV on the loader thread. Python still produces the JSON sample map, flatness measurements, and plots for offline inspection. [C++ feature analyzer](https://github.com/neuralmanacle/drizel/blob/99368fc/src/audio/SampleFeatures.h)

The analyzer takes a centered window of $N = 2048$ source frames every $H = 512$ source frames. At a source rate of $f_s = 48{,}000\,\mathrm{Hz}$, those sizes correspond to:

$$
T_{\mathrm{window}} = \frac{N}{f_s} \approx 42.67\,\mathrm{ms},
\qquad
T_{\mathrm{hop}} = \frac{H}{f_s} \approx 10.67\,\mathrm{ms}.
$$

![Overlapping analysis windows, showing the 2048-frame window and 512-frame hop.](/step11/01-analysis-window-hop.svg)

*Figure: Overlapping analysis windows, showing the 2048-frame window and 512-frame hop. Colors and labels adapt to the reader’s light or dark color scheme.*

These times depend on the WAV’s sample rate. A 48 kHz WAV yields the same analysis timing in a 44.1 kHz or 96 kHz host session.

### Hann window and RMS

For each channel, the analyzer applies a periodic Hann window before taking a radix-2 FFT. Here, $n$ indexes a sample within the window:

$$
w[n] = \frac{1}{2}
\left(
  1 - \cos\!\left(\frac{2\pi n}{N}\right)
\right),
\qquad
0 \le n < N.
$$

![Periodic Hann analysis window.](/step11/02-hann-window.svg)

*Figure: Periodic Hann analysis window. Colors and labels adapt to the reader’s light or dark color scheme.*

The periodic Hann taper reduces spectral leakage from the edges of the analysis window. The playback engine uses a separate, symmetric Hann envelope with $L - 1$ in the denominator, where $L$ is the grain length in output frames. That makes both endpoints of the playback envelope zero.

At the beginning or end of the WAV, samples beyond the file boundary contribute zeros to the FFT. RMS uses the original, untapered samples inside the file. For analysis frame $t$, let $I_t$ be the set of valid source indices in that window, $C$ the channel count, and $x_c[j]$ the sample in channel $c$ at source index $j$:

$$
\operatorname{RMS}_t =
\sqrt{
  \frac{1}{C \, \lvert I_t \rvert}
  \sum_{c=1}^{C}
  \sum_{j \in I_t}
  x_c[j]^2
}.
$$

![RMS amplitude of a sine wave.](/step11/03-rms.svg)

*Figure: RMS amplitude of a sine wave. Colors and labels adapt to the reader’s light or dark color scheme.*

Dividing by the number of real samples keeps zero padding from lowering the measured level at either end of the file.

### One-sided power spectrum

Let $X_{t,c}[k]$ be the FFT of the tapered, zero-padded samples for analysis frame $t$ and channel $c$. The analyzer averages the squared FFT magnitudes across channels and folds the power of the negative-frequency bins into their positive-frequency counterparts:

$$
P_t[k] =
\frac{
  d[k] \, \displaystyle\sum_{c=1}^{C} \lvert X_{t,c}[k] \rvert^2
}{
  C \, N \, \displaystyle\sum_{n=0}^{N-1} w[n]^2
}.
$$

![Illustrative one-sided power spectrum.](/step11/04-power-spectrum.svg)

*Figure: Illustrative one-sided power spectrum. Colors and labels adapt to the reader’s light or dark color scheme.*

The DC and Nyquist bins each occur once, so their fold factor is one:

$$
d[k] =
\begin{cases}
  1, & k = 0 \text{ or } k = N/2, \\
  2, & 0 < k < N/2.
\end{cases}
$$

![DC, interior, and Nyquist FFT folding factors.](/step11/05-fold-factor.svg)

*Figure: DC, interior, and Nyquist FFT folding factors. Colors and labels adapt to the reader’s light or dark color scheme.*

Averaging power across channels preserves energy in opposite-polarity stereo. If the right waveform is the inverse of the left, the two channels still contribute equal power.

### Spectral centroid and onset strength

The center frequency of FFT bin $k$ is:

$$
f[k] = \frac{k \, f_s}{N}.
$$

![FFT bin frequencies from DC to Nyquist.](/step11/06-bin-frequency.svg)

*Figure: FFT bin frequencies from DC to Nyquist. Colors and labels adapt to the reader’s light or dark color scheme.*

At 48 kHz, adjacent bins are about 23.44 Hz apart. The spectral centroid is the power-weighted mean of those frequencies:

$$
\operatorname{Centroid}_t =
\frac{
  \displaystyle\sum_{k=0}^{N/2} f[k] \, P_t[k]
}{
  \displaystyle\sum_{k=0}^{N/2} P_t[k]
}.
$$

![Power-weighted spectral centroid.](/step11/07-spectral-centroid.svg)

*Figure: Power-weighted spectral centroid. Colors and labels adapt to the reader’s light or dark color scheme.*

The centroid is defined when total power is positive. It rises as more power moves toward higher frequencies, which makes it a practical brightness cue.

For onset strength, Drizel takes the square root of each bin’s power and keeps only the increases in magnitude from the previous frame. It combines those increases with a Euclidean norm:

$$
\begin{aligned}
M_t[k] &= \sqrt{P_t[k]}, \\[4pt]
\Delta_t[k] &= \max\!\left(0, \, M_t[k] - M_{t-1}[k]\right), \\[4pt]
\operatorname{Onset}_t &=
  \sqrt{\sum_{k=0}^{N/2} \left(\Delta_t[k]\right)^2}.
\end{aligned}
$$

![Positive spectral changes between consecutive frames.](/step11/08-onset-strength.svg)

*Figure: Positive spectral changes between consecutive frames. Colors and labels adapt to the reader’s light or dark color scheme.*

Frames with $\operatorname{RMS}_t \le 10^{-4}$, or −80 dBFS in amplitude, contribute zero magnitude to the onset history. The first frame has no predecessor. Python represents its onset and undefined centroids as `null`. The C++ selector uses zero for those cases.

## Turning measurements into grain starts

Each guided mode assigns a weight to eligible analysis frames. All four guided modes share the RMS gate. The thresholds are first-pass settings that can be evaluated across recordings.

| Mode | Eligibility and weighting |
| --- | --- |
| Manual | Use the smoothed, modulated Position directly, including fractional source frames. |
| Attack | Require onset divided by RMS to be at least 0.2. Weight by absolute onset. Start 25 ms before the selected frame center, clamped at the start of the WAV. |
| Sustain | Require a preceding frame and onset divided by RMS below 0.2. Weight by RMS multiplied by how far the ratio lies below that cutoff, scaled to 0–1. |
| Avoid silence | Give each nonsilent analysis hop equal weight when building the table. |
| Bright | Require centroid to reach 5% of Nyquist. Weight by the square of centroid divided by Nyquist. At a 48 kHz source rate, the threshold is 1.2 kHz. |

For a frame that passes the RMS gate, define relative onset $r_t$ and normalized brightness $b_t$ as:

$$
r_t =
\frac{\operatorname{Onset}_t}{\operatorname{RMS}_t},
\qquad
b_t =
\frac{\operatorname{Centroid}_t}{f_s / 2}.
$$

![Normalized onset and brightness examples.](/step11/09-normalized-features.svg)

*Figure: Normalized onset and brightness examples. Colors and labels adapt to the reader’s light or dark color scheme.*

The eligible-frame weights are:

$$
\begin{aligned}
a_{\mathrm{attack},t} &=
  \operatorname{Onset}_t,
  && r_t \ge 0.2, \\[4pt]
a_{\mathrm{sustain},t} &=
  \operatorname{RMS}_t
  \left(1 - \frac{r_t}{0.2}\right),
  && t > 0,\quad r_t < 0.2, \\[4pt]
a_{\mathrm{audible},t} &=
  1,
  && \operatorname{RMS}_t > 10^{-4}, \\[4pt]
a_{\mathrm{bright},t} &=
  b_t^2,
  && b_t \ge 0.05.
\end{aligned}
$$

![Illustrative weights for the four guided grain selection modes.](/step11/10-selection-weights.svg)

*Figure: Illustrative weights for the four guided grain selection modes. Colors and labels adapt to the reader’s light or dark color scheme.*

The Attack rule uses relative onset for eligibility and absolute onset for weighting. An event can qualify at a lower level if the spectral change is large relative to its RMS. Among eligible frames, stronger absolute changes get more weight.

The 25 ms pre-roll gives the 100 ms grain envelope time to rise before the event. At unity playback speed, an event exactly at the selected frame center arrives a quarter of the way into the grain, where the Hann envelope is close to 0.5. Transposing the grain changes when it reaches that event. These features can overlap. A pick attack can have a high centroid, and a sustained noise can be bright.

### Regional tables and weighted sampling

The worker groups consecutive hops into up to 16 regions. Within each region, it groups the hops into at most 128 consecutive buckets. Each bucket keeps the strongest eligible representative for each mode. Avoid silence keeps the first eligible hop and weights its bucket by the number of eligible hops it contains. This bounds the table size on long WAVs while giving buckets with more audible material more weight.

Position selects a region in source coordinates. Inside that region, the selector draws from the cumulative weights. For $m$ candidates with weights $a_i$, it chooses the first index $i$ whose cumulative weight $S_i$ exceeds the draw $u$:

$$
S_i = \sum_{j=1}^{i} a_j,
\qquad
u \sim \mathcal{U}\!\left(0, \, S_m\right),
\qquad
\Pr(\text{select } i) = \frac{a_i}{S_m}.
$$

Suppose three candidates have weights 1, 2, and 5. Their cumulative endpoints are 1, 3, and 8. A draw of 2.4 selects the second candidate. The third candidate occupies five of the eight units of total weight, so its selection probability is $5/8$.

![Cumulative weighted random grain selection.](/step11/11-weighted-sampling.svg)

*Figure: Cumulative weighted random grain selection. Colors and labels adapt to the reader’s light or dark color scheme.*

The audio thread uses an upper-bound binary search over at most 128 entries in one region and mode. Across all regions and modes, the tables hold at most 8,192 entries. At two doubles per entry, that is up to 128 KiB of entry payload on the tested build. [C++ table builder and lookup](https://github.com/neuralmanacle/drizel/blob/99368fc/src/audio/SampleSelection.h)

If the region has no eligible candidates, the selector uses the exact Manual position, including MIDI and LFO modulation. The region constrains the **feature anchor**. Attack pre-roll can cross its left boundary, and a grain can continue reading across either region boundary. At the end of the WAV, the interpolator supplies zeros. Avoid silence measures the analysis window around a candidate, so a grain may still read into a quiet patch.

## Keeping the audio thread predictable

Drizel already transfers prepared WAVs from the loader to playback through two atomic pointer mailboxes. One transfers a prepared packet to audio. The other returns the retired packet to the loader for reclamation. The decoded source, candidate tables, and grain cloud now travel in the same packet. The audio thread reads the table paired with its active source. [Real-time engine](https://github.com/neuralmanacle/drizel/blob/99368fc/src/audio/RealtimeEngine.h)

Each load, preset recall, or device preparation increments a revision. The worker checks for a superseding request or shutdown between analysis windows and checks the revision again before publication. The audio thread checks the revision and output rate at handoff. The existing 10 ms fades handle the transition around a successful swap. The worker discards partial work for a superseded request, and the current source can continue playing while the replacement is prepared.

The processor reads the selection mode once per audio block. The grain cloud consults the table only at a scheduled launch. A dedicated seeded generator drives selection, so the draws for pan, pitch, length, and jitter follow their own sequence. Preparing the cloud resets the selection seed. Switching modes continues the guided sequence from its last draw.

Preset and host state store the mode and WAV path. Recall rebuilds the table from the WAV at that path. Older presets recall in Manual mode. Device preparation also rebuilds the tables as part of the worker flow that prepares the output-rate-dependent grain windows.

## What the checks showed

I compared C++ with the Step 10 Python implementation on 188 windows of the two-second synthetic fixture. It combines silence, an impulse, a 750 Hz tone, and noise. I used an inverted copy of the first channel as the second channel to exercise the power averaging.

| Field | Maximum absolute difference | Test tolerance |
| --- | ---: | ---: |
| Center | 0 source frames | Exact |
| RMS | 0 | $1 \times 10^{-12}$ |
| Onset | $1.11 \times 10^{-16}$ | $1 \times 10^{-12}$ |
| Centroid | $2.66 \times 10^{-10}\,\mathrm{Hz}$ | $1 \times 10^{-8}\,\mathrm{Hz}$ |

The committed tests also check a smaller set of Python reference values, local Manual fallback, and rejection of a superseded packet with a matching sample rate. The render-thread guard checks for allocation and reclamation during guided playback. The processor tests cover selection-mode recall and compatibility with older presets. [Real-time engine tests](https://github.com/neuralmanacle/drizel/blob/99368fc/tests/RealtimeEngineTests.cpp) · [Processor tests](https://github.com/neuralmanacle/drizel/blob/99368fc/tests/PluginProcessorTests.cpp)

For a same-source comparison, I rendered at Position 0, with 100 grains per second and output gain set to 0.8. The fixture starts with silence, and its first selection region contains the impulse. Manual produced zero peak amplitude. Avoid silence selected from nonsilent windows in that region and produced a left-channel peak of 0.0110 full scale, about −39.2 dBFS.

An optimized C++ probe rendered ten seconds at 48 kHz on an arm64 Mac using 256-frame blocks. The table shows the median of seven render times and the median of their 99th-percentile block times. In the rebuild condition, another thread repeatedly built tables from the same fixture while the engine used an already-prepared packet. One table build took about 6.9 ms, excluding WAV decoding.

| Render condition | Time for 10 seconds of audio | Block p99 |
| --- | ---: | ---: |
| Manual | 101.5 ms | 63.0 µs |
| Avoid silence | 101.5 ms | 64.3 µs |
| Avoid silence during worker rebuilds | 101.9 ms | 56.8 µs |

![Step 11 measured render timing comparison.](/step11/12-render-timing.svg)

*Figure: Step 11 measured render timing comparison. Colors and labels adapt to the reader’s light or dark color scheme.*

A 256-frame block at 48 kHz spans about 5.33 ms. The probe measured the core render loop on one machine, and the small timing differences are within its run-to-run variation. DAW scheduling, file decoding, and other plugins can affect host timing. The macOS Standalone, VST3, and AU targets built successfully. All 11 CTest entries and 13 Step 10 Python tests passed.

## Reproduce the checks

With a JUCE 8.0.15 checkout next to the Drizel repository, build the pinned revision and run the plugin-enabled tests:

```sh
git clone --branch step-11-sample-aware-playback https://github.com/neuralmanacle/drizel.git
cd drizel
git checkout 99368fc

cmake -S . -B build-step11 \
  -DDRIZEL_JUCE_PATH=../JUCE \
  -DDRIZEL_BUILD_PLUGIN=ON \
  -DCMAKE_BUILD_TYPE=Release

cmake --build build-step11 --parallel
ctest --test-dir build-step11 --output-on-failure
```

The committed tests reproduce the smaller fixed-reference comparison. The 188-window comparison and timing table report measurements from the development probe. The offline fixture guide shows how to generate the silence, impulse, tone, and noise WAV and plot its features. [Step 10 fixture instructions](https://github.com/neuralmanacle/drizel/blob/99368fc/experiments/sample-analysis/README.md#run-it)

## Listening for the difference

Load a recording with a pick attack and a sustained note inside the same region. Keep Position, Pitch, and Density fixed. Switch from Attack to Sustain and listen for how often the pick enters the cloud. Then move Position to the next phrase and repeat. A sparse recording makes Avoid silence easier to hear. For Bright, try a WAV that moves between muted and brighter passages.

The next checks are a DAW listening pass across more recordings and host-level timing while replacing long WAVs. The current selector gives future region classifiers a DSP baseline to compare against using the same recording and grain settings.