# Drizel Step 10 — Offline Sample Analysis

**Layer 9 · Audio characteristics and sample analysis**

Around 51 seconds into `guitar.wav`, the waveform gets smaller while the spectral centroid rises. Its average signal power drops while a greater share of that power sits at higher frequencies. I wanted Drizel to be able to tell those changes apart before using the sample itself to guide grain selection.

Step 9 made the granular cloud playable with MIDI. Step 10 builds an offline Python analyzer that describes what is happening inside the source WAV. It produces a sample map with integer source coordinates, four audio measurements per frame, and an optional plot that puts those measurements next to the waveform.

The second pass adds a small annotated recording set and a pitch study. `analyze.py` writes the four features to `sample-map.json`. `study.py` summarizes those features inside labeled regions and reports pitch separately.

Use the player above to listen around 51 seconds before looking at the plot.

## Table of contents

- [The guitar WAV and its analysis](#the-guitar-wav-and-its-analysis)
- [1. Decode the WAV into full-scale amplitudes](#1-decode-the-wav-into-full-scale-amplitudes)
- [2. Place frames on the source timeline](#2-place-frames-on-the-source-timeline)
- [3. Build a one-sided power spectrum](#3-build-a-one-sided-power-spectrum)
  - [A 750 Hz check at 48 kHz](#a-750-hz-check-at-48-khz)
- [4. Compute four features per frame](#4-compute-four-features-per-frame)
  - [RMS measures signal level](#rms-measures-signal-level)
  - [Onset strength measures positive spectral change](#onset-strength-measures-positive-spectral-change)
  - [Spectral centroid measures where the power is concentrated](#spectral-centroid-measures-where-the-power-is-concentrated)
  - [Spectral flatness measures how evenly power is distributed](#spectral-flatness-measures-how-evenly-power-is-distributed)
  - [How silence is represented](#how-silence-is-represented)
- [5. Read the guitar recording from the map](#5-read-the-guitar-recording-from-the-map)
- [6. Keep the analysis tied to its source](#6-keep-the-analysis-tied-to-its-source)
- [7. Verify the math against known signals](#7-verify-the-math-against-known-signals)
- [8. Label recordings before measuring them](#8-label-recordings-before-measuring-them)
- [9. Estimate pitch from waveform repetition](#9-estimate-pitch-from-waveform-repetition)
  - [Normalized autocorrelation](#normalized-autocorrelation)
  - [Choose a lag and turn it into hertz](#choose-a-lag-and-turn-it-into-hertz)
  - [How close was each estimate?](#how-close-was-each-estimate)
- [10. Compare the features with the labels](#10-compare-the-features-with-the-labels)
- [11. Reproduce the demo](#11-reproduce-the-demo)
  - [Plot a guitar WAV](#plot-a-guitar-wav)
  - [Create a local manifest for a guitar take](#create-a-local-manifest-for-a-guitar-take)
- [Where the map fits in Drizel](#where-the-map-fits-in-drizel)
- [Video walkthrough and rehearsal](#video-walkthrough-and-rehearsal)

## The guitar WAV and its analysis

I used a 69-second stereo WAV for this walkthrough. The analyzer kept its original sample rate and measured 6,470 overlapping frames. Each point on a feature trace describes a short interval around that point in the recording.

| Source or analysis property | Value |
|---|---:|
| WAV encoding | Stereo PCM16 |
| Sample rate | 48,000 Hz |
| Source sample frames | 3,312,466 |
| Source duration | 69.0097 s |
| FFT window | 2,048 samples · 42.67 ms |
| Hop | 512 samples · 10.67 ms |
| Window overlap | 1,536 samples · 75% |
| FFT bin spacing | 23.4375 Hz |
| Analysis frames | 6,470 |

![Analysis of guitar.wav, the 69-second stereo take, with waveform, spectrogram, RMS, onset strength, centroid and flatness](/guitar-analysis.png)

*Figure 1. Feature analysis of the 69-second guitar.wav recording. The two original channels appear in the waveform. The spectrogram and feature tracks summarize both channels. The horizontal axis is elapsed time in the source WAV.*

## 1. Decode the WAV into full-scale amplitudes

`load_wav()` reads the file bytes once. SciPy decodes that byte snapshot and SHA-256 identifies it in the exported map. The decoded NumPy array is shaped as $[\text{sample frame},\text{channel}]$, with a channel dimension added for mono sources. A stereo source sample frame holds one left and one right amplitude. The loader checks for a positive sample rate, a nonempty signal, one or two channels, and finite sample values.

The rest of the analysis uses `float64` amplitudes in full-scale units (FS). For this PCM16 file, each signed sample $q$ is converted by dividing it by $32{,}768$. The integer values $-32{,}768$, $0$, and $16{,}384$ therefore become $-1.0$, $0.0$, and $0.5$ FS. SciPy places packed PCM24 in a left-aligned `int32` container, so scaling by the container's signed range also works for that format. Unsigned PCM is centered about its midpoint before scaling. IEEE float32 input keeps its amplitude, including finite values above $1$ FS.

That conversion provides consistent units while preserving the level differences in the source. The analyzer uses the WAV's sample rate throughout, so the exported indices refer directly to the decoded recording. [WAV loader](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/analyze.py#L20)

## 2. Place frames on the source timeline

A Fourier transform of the entire take would tell me which frequencies occurred across 69 seconds. To find *where* they occurred, I compute a short-time Fourier transform (STFT) by applying an FFT to overlapping windows.

Let $N$ be the window and FFT length, $H$ the hop, $F_s$ the source sample rate, and $L$ the source length in sample frames. The window for frame $i$ is centered at sample $iH$.

$$
\text{center}_i = iH, \qquad \text{while } \text{center}_i < L
$$

$$
t_i = \frac{\text{center}_i}{F_s}
$$

$$
\text{FFT window} =
\left[\text{center}_i-\frac{N}{2},\ \text{center}_i+\frac{N}{2}\right)
$$

$$
\text{valid source interval} =
\left[\max\left(0,\text{center}_i-\frac{N}{2}\right),\;
\min\left(L,\text{center}_i+\frac{N}{2}\right)\right)
$$

The brackets describe a half-open interval. A window starting at sample $1{,}000$ and ending at sample $3{,}048$ uses sample $1{,}000$ through $3{,}047$. The time origin is the first decoded sample. At time zero, the FFT window has $1{,}024$ padded samples on the left and reads source samples $[0,1{,}024)$. At the end, padding fills the part of the window beyond the file. The actual source bounds are always recorded in the map.

At $48\ \text{kHz}$, each $42.67\ \text{ms}$ window advances by $10.67\ \text{ms}$. A sudden change can therefore influence multiple neighboring frames. The timestamp describes the **window center**, which can occur slightly before the event that raised the feature. A longer window gives closer frequency bins and spans more of each attack. A shorter hop measures the overlapping windows more often. These are separate controls in the CLI. [Frame placement and padding](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/analyze.py#L55)

## 3. Build a one-sided power spectrum

I multiply each channel by a periodic Hann window before transforming it. The taper reduces leakage from the abrupt edges of the windowed excerpt. It also spreads a narrow spectral component over neighboring bins, so the spacing between bins is only one part of frequency resolution.

$$
w[n] = \frac{1}{2}-\frac{1}{2}\cos\left(\frac{2\pi n}{N}\right),
\qquad n=0,\ldots,N-1
$$

$$
f[k] = \frac{kF_s}{N},
\qquad k=0,\ldots,\frac{N}{2}
$$

$$
X[k,c] = \sum_{n=0}^{N-1}
x_{\text{frame}}[n,c]\,w[n]\,
\exp\left(-j\frac{2\pi kn}{N}\right)
$$

Here $x_{\text{frame}}$ is the padded frame before windowing, $c$ indexes the channel, and $j$ is the imaginary unit. In code, `np.hanning(N + 1)[:-1]` generates the periodic taper. `rfft` runs along the time axis for each channel. Real input gives conjugate-symmetric positive and negative frequency coefficients, so the result retains $1{,}025$ bins from DC to the $24\ \text{kHz}$ Nyquist frequency for $N=2{,}048$.

The FFT coefficients are complex. Taking their squared magnitudes retains the energy at each frequency and discards phase. The algorithm averages those values across channels, normalizes for the window's squared weights, and folds the negative-frequency power into the interior bins. DC and Nyquist each have a single coefficient and keep their original weight.

```python
fft = np.fft.rfft(windowed, axis=0)
power = np.mean(np.abs(fft)**2, axis=1) / power_normalization
power[1:-1] *= 2.0
```

$$
E_w = \sum_{n=0}^{N-1} w[n]^2
$$

$$
\widetilde{P}[k] =
\frac{1}{CNE_w}\sum_{c=0}^{C-1}\left|X[k,c]\right|^2
$$

$$
P[k] =
\begin{cases}
\widetilde{P}[k], & k=0\ \text{or}\ k=N/2,\\
2\widetilde{P}[k], & 0<k<N/2
\end{cases}
$$

Here $C$ is the number of channels. The sum of the resulting bins equals the channel-averaged, Hann-weighted mean square. The factor of $N$ follows from Parseval's relation for the unscaled forward FFT. The squared-window sum accounts for how much of the frame the taper weights. Bin power is measured in $\text{FS}^2$.

Channel power averaging preserves energy even when the two channels have opposite polarity. If the left channel contains $x$ and the right channel contains $-x$, their sample-by-sample average cancels. Their squared magnitudes are equal, so this analysis still measures the energy of $x$.

The spectrogram plots $10\log_{10}\!\left(\max(P[k],10^{-12})\right)$, with a display range of $-120$ to $0\ \text{dBFS}$. Its frequency axis expands the lower part of the spectrum and has a linear region around DC. This makes low harmonics easier to see in the same panel as higher-frequency content. The floor applies to the plot conversion. The feature code uses the original bin powers. [NumPy FFT conventions](https://numpy.org/doc/2.3/reference/routines.fft.html)

### A 750 Hz check at 48 kHz

At this FFT length, $750\ \text{Hz}$ lands on bin $\frac{750}{23.4375}=32$. A steady sine with peak amplitude $0.5\ \text{FS}$ has mean square $\frac{0.5^2}{2}=0.125\ \text{FS}^2$. For a bin-centered sine, the periodic Hann spreads that normalized power across the main bin and its two adjacent bins. Their powers still sum to $0.125\ \text{FS}^2$, and the two side bins balance around $750\ \text{Hz}$. This gives a known target for both level and spectral centroid.

## 4. Compute four features per frame

### RMS measures signal level

RMS is the square root of mean squared amplitude. I calculate it on the unwindowed, valid samples of the current frame. The mean runs over source samples and channels, and the samples outside the WAV are excluded. A frame near a file edge therefore keeps the RMS of the source material it actually contains.

$$
\operatorname{RMS}_i
=
\sqrt{
\frac{1}{C\,|\mathcal{V}_i|}
\sum_{c=0}^{C-1}
\sum_{n\in\mathcal{V}_i}x[n,c]^2
}
$$

$$
L_{\mathrm{dBFS}}
=20\log_{10}\left(\frac{\operatorname{RMS}_i}{1\ \text{FS}}\right)
$$

Here $\mathcal{V}_i$ is the set of valid source samples in frame $i$, and $C$ is the channel count.

The steady $0.5$-peak sine has an RMS of about $0.35355\ \text{FS}$. The guitar's waveform peaks can be much higher than its RMS because a pick transient occupies only part of a frame. RMS gives a consistent signal-level measurement. Perceived loudness also depends on the spectrum and listening conditions.

### Onset strength measures positive spectral change

For each bin, I take the square root of power to get a magnitude in FS. The analyzer subtracts the previous frame's magnitude and keeps only increases. It summarizes those increases with a Euclidean norm.

$$
M[i,k] = \sqrt{P[i,k]}
$$

$$
r[i,k] = \max\left(M[i,k]-M[i-1,k],0\right)
$$

$$
\operatorname{onset}[i] = \sqrt{\sum_k r[i,k]^2}
$$

If two bins move from $[0.20,0.10]$ to $[0.12,0.16]$, the positive changes are $[0,0.06]$ and the score is $0.06\ \text{FS}$. A pick attack can raise the score by adding energy to many bins. Changes in texture and spectral spreading around an abrupt cutoff can also produce peaks. This is a continuous spectral flux score. Detecting discrete events from it would require a peak-picking rule.

### Spectral centroid measures where the power is concentrated

The centroid is the weighted mean of bin frequencies, using power as the weight.

$$
\operatorname{centroid}
=
\frac{\sum_k f[k]P[k]}{\sum_k P[k]}.
$$

Think of it as the spectrum's center of mass. A shift of power toward higher bins pulls it upward, even when the total power is falling. On guitar, the centroid responds to the balance of fundamentals, harmonics and other components. The pitch study in Section 9 estimates the fundamental by measuring how the waveform repeats.

### Spectral flatness measures how evenly power is distributed

Flatness compares the geometric and arithmetic means of bin power. The geometric mean drops sharply when many bins carry very little power. Evenly distributed power pushes the ratio toward one.

$$
\epsilon = 10^{-12}\max_k P[k]
$$

$$
G = \exp\left(\frac{1}{K}\sum_{k=0}^{K-1}
\ln\!\left(\max(P[k],\epsilon)\right)\right)
$$

$$
A = \frac{1}{K}\sum_{k=0}^{K-1}P[k]
$$

$$
\operatorname{flatness} = \frac{G}{A}
$$

Here $K$ is the number of frequency bins. The floor is relative to the strongest bin and is used only inside the logarithm. It keeps the calculation finite at zero-power bins while retaining the original arithmetic mean. A spectrum dominated by a few narrow harmonics tends to score low. Both broadband noise and a short impulse can score high, which is why the track describes spectral shape and needs context to interpret.

### How silence is represented

A frame at or below $0.0001\ \text{FS}$ RMS ($-80\ \text{dBFS}$) is flagged as silent. For that frame, centroid and flatness are `null` and its magnitude vector for flux is all zero. A frame with zero windowed power follows the same spectral policy. The first frame's onset strength is `null` because there is no preceding frame to compare with.

The waveform and spectrogram still show the measured samples and bin powers. The missing centroid and flatness values render as gaps. That distinction matters near the end of this take, where a small change in the residual signal can shift the centroid sharply even at a very low level. [Feature implementation](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/analyze.py#L80)

Uniform gain affects the four features differently. Multiplying the waveform by $a=2$ doubles RMS and the ungated flux score, and multiplies every bin's power by $a^2=4$. Centroid and flatness are ratios in which that factor cancels. This holds for frames whose silence flags stay the same. Crossing the gate changes which spectral values are available and which magnitude vectors enter the flux calculation.

## 5. Read the guitar recording from the map

I chose time intervals inside the passages visible in Figure 1 and calculated the median of each feature using the frames whose centers fall in $[\text{start},\text{end})$.

| Time in the WAV | Median RMS (FS) | Median onset strength (FS) | Median centroid (Hz) |
|---|---:|---:|---:|
| 2–12 s | 0.146 | 0.0303 | 771 |
| 14–26 s | 0.236 | 0.0272 | 335 |
| 28–38 s | 0.146 | 0.0244 | 413 |
| 40–50 s | 0.247 | 0.0444 | 426 |
| 52–62 s | 0.136 | 0.0318 | 936 |

**The largest spectral change is at 39.115 s.** Its onset strength is 0.1481 FS. The highest RMS, 0.3193 FS, arrives two hops later at 39.136 s. Both analysis windows cover part of the same transition. A spectral change score and an amplitude measurement can peak at different centers.

**The passage after the change near 51 s has a different energy balance.** The $52\text{–}62\ \text{s}$ median is about $5.2\ \text{dB}$ below the $40\text{–}50\ \text{s}$ median in RMS and about $2.2$ times higher in centroid. A brightness-based rule and an energy-based rule would favor different parts of this take.

**The tail shows why features need a level gate.** Between $64.000$ and $66.496\ \text{s}$, RMS falls from $0.02894$ to $0.000536\ \text{FS}$, about $34.7\ \text{dB}$, while the centroid rises from $1{,}150$ to $1{,}950\ \text{Hz}$. The playing passages above have median flatness values around $10^{-6}$ to $10^{-5}$, close to the bottom of the plot's scale. At $67.541\ \text{s}$, the last frame above the threshold has flatness $0.0377$, centroid $2{,}318\ \text{Hz}$, and RMS $0.000101\ \text{FS}$. By then, the ratio describes the shape of a very low-level remainder. The following frames fall below the gate, and their centroid and flatness traces end.

## 6. Keep the analysis tied to its source

The output is `sample-map.json` with `schema_version: 1`. It includes the filename and SHA-256 of the exact WAV bytes, the sample rate, channel count, source length, analysis settings and feature units. Each frame carries its center, time and half-open source interval alongside the features.

The strongest spectral-change frame from the guitar map has the following values, rounded for readability.

```json
{
  "center_sample": 1877504,
  "start_sample": 1876480,
  "end_sample_exclusive": 1878528,
  "time_seconds": 39.114667,
  "rms": 0.290707,
  "onset_strength": 0.148110,
  "centroid_hz": 561.374917,
  "flatness": 0.00004698,
  "is_silent": false
}
```

The interval allows another tool to open the exact source slice. The version, source hash and settings give a future C++ implementation a contract it can compare against. For instance, recomputing the map after changing the hop size changes both the frame locations and what adjacent-frame flux measures.

The CLI stages the JSON and optional PNG in a temporary directory and moves the result into place once the requested outputs are written. Every run takes a new destination directory. The analyzer retains the decoded recording and the frame records in memory. With `--plot`, it also retains the power matrix. The guitar example has $6{,}470\times1{,}025$ power values, about $50.6\ \text{MiB}$ of `float64` data before plotting overhead. Leaving out `--plot` skips that retained matrix. [Export and plot code](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/analyze.py#L118)

## 7. Verify the math against known signals

The guitar take shows how the features behave together. The two-second synthetic fixture gives the analyzer signals whose timing and amplitudes are known. [Plot for fixture.wav](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/docs/evidence/layer-9/analysis.png)

| Fixture | Check | Observed |
|---|---|---|
| Silence | RMS is zero and spectral shape is unavailable | 0 FS RMS, centroid and flatness `null` |
| Impulse at $0.250\ \text{s}$ | Local flux peak's window contains sample $12{,}000$ | Peak centered at $0.24533\ \text{s}$, interval $[10{,}752,12{,}800)$, flatness $0.99962$ |
| $750\ \text{Hz}$ sine with $0.5\ \text{FS}$ peak | Centroid near $750\ \text{Hz}$ and RMS near $0.35355\ \text{FS}$ | $750.00001\ \text{Hz}$, $0.35355\ \text{FS}$ RMS |
| Seeded white noise with nominal $0.1\ \text{FS}$ RMS | RMS near $0.1\ \text{FS}$ and flatter than the sine | $0.09861\ \text{FS}$ RMS, flatness $0.56094$ |

For the long guitar WAV, runs with and without plotting produced byte-identical maps. A fresh render also matched the decoded pixels of Figure 1. The generated fixture gives the analyzer known answers for level, spectrum and timing. Labeled recordings give me a way to test how those same measurements behave with the harmonics, noise and decays found in actual recordings. [Step 10 verification log](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/docs/devlog/2026-11-09-step-10-sample-analysis.md)

## 8. Label recordings before measuring them

For the public study I used five short recordings alongside the generated fixture. The manifest records where each excerpt came from, who made it, its reuse terms, what was trimmed or converted, and the SHA-256 of the WAV that is actually analyzed. Each label describes a half-open interval in source samples. That lets someone else run the comparison against the same bytes and the same region. [Corpus manifest and credits](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/corpus/manifest.json)

| Source | Labeled material | What I can check |
|---|---|---|
| Nylon-string guitar | E2 decay, 0.12–0.88 s | A plucked single note with strong harmonics |
| Guitar strum | Chord, 0.08–0.90 s | Whether a repeated waveform can pass a single-pitch test |
| Tenor sax | Concert C4 sustain, 0.18–0.85 s | A second single-note source with a different envelope and spectrum |
| Claves | Hit decay, 0.02–0.15 s, and quiet tail, 0.34–0.70 s | Timing of a sharp attack and feature availability during decay |
| Rain | Field recording, 0.20–0.96 s | Colored environmental noise |
| Generated fixture | Impulse, 750 Hz sine, seeded white noise and digital silence | Known event timing, frequency, level and spectral shape |

The guitar and sax reference pitches come from their source instrument maps, MIDI note numbers 40 and 60. The chord and percussion labels come from their source descriptions. For each recorded attack, I marked the first sample where the absolute waveform reached 10% of the excerpt's peak across channels. That gives a repeatable marker to compare with flux. The fixture's impulse has an exact marker from its generator.

The long-take summaries in Section 5 use frames whose **centers** are in each passage. The annotated study requires the **whole window** to fit inside the label, so a note window cannot borrow samples from an adjacent attack or gap. For flux, both the current and previous feature windows must fit. The study checks the WAV hash and bounds before reporting the medians. [Region and attack comparison](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/study.py#L66)

## 9. Estimate pitch from waveform repetition

I can hear a low E even when much of the string's power is in higher harmonics. The harmonics can still repeat together at the period of the low E. For a single sustained note, I can estimate that period by sliding a copy of the waveform against itself and looking for a strong match.

The study takes an 80 ms rectangular window at each center on the 512-sample hop grid. At 44.1 kHz, that is 3,528 samples and about six and a half cycles of E2. The longer pitch window gives slow notes room to repeat, while the 2,048-sample spectral window responds to shorter changes in the audio. For pitch, the code subtracts each channel's mean and skips windows below 0.001 FS RMS after that subtraction. This is the **−60 dBFS pitch gate**. The spectrum has its own **−80 dBFS silence threshold** based on the original amplitudes. [Pitch implementation](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/study.py#L27)

### Normalized autocorrelation

Let $y$ be the mean-subtracted window and $\ell$ a candidate delay in samples. Compare the overlapping slices $y[0:M-\ell]$ and $y[\ell:M]$, with $M$ samples in the full pitch window. I treat each slice as a vector across samples and channels, $\mathbf{a}_\ell$ and $\mathbf{b}_\ell$. The score is their dot product normalized by their lengths.

$$
\rho[\ell] =
\frac{\mathbf{a}_\ell \cdot \mathbf{b}_\ell}
{\lVert\mathbf{a}_\ell\rVert_2\,\lVert\mathbf{b}_\ell\rVert_2}
$$

A value near 1 means the overlapping waveform shapes line up closely. Normalization helps the match survive the overall level change in a plucked string's decay. Summing the correlations and energies across channels preserves the contribution from each channel, including when one channel's polarity is reversed. In code, an FFT convolution with a time-reversed copy computes the dot products. Cumulative squared amplitude gives the overlap energies at each lag.

### Choose a lag and turn it into hertz

The lag search targets 60–1,000 Hz. A waveform also matches when shifted by two or more periods. Among positive local peaks, the estimator takes the shortest lag scoring at least 95% of the highest peak. It fits a parabola through that peak and its neighbors to refine the delay between samples. The frequency uses this refined delay. The confidence score is the height of the selected peak at its integer lag.

```python
best = scores[peaks].max()
peak = peaks[scores[peaks] >= NEAR_PEAK_RATIO * best][0]
left, middle, right = scores[peak - 1:peak + 2]
offset = 0.5 * (left - right) / (left - 2 * middle + right)
return float(sample_rate / (lags[peak] + offset)), float(middle)
```

Suppose a sax window at 44.1 kHz has a peak of 0.98 at lag 169 and a peak of 0.99 at lag 338. Both pass the relative cutoff of $0.95 \times 0.99 = 0.9405$. The shorter lag gives roughly $44{,}100/169 \approx 261\ \text{Hz}$ before interpolation. The longer lag would give half that frequency. If a harmonic dominates the waveform, even a shorter lag can look convincing and produce an octave error.

The **95% peak-selection rule** chooses a candidate within one window. The **0.60, 0.80 and 0.95 confidence cutoffs** decide whether to count that window's candidate. The score measures how well the waveform lines up. Interpreting it as a probability of a correct note would require calibration against labeled data.

### How close was each estimate?

For the recorded notes, I converted each MIDI note number $m$ to an equal-tempered reference with A4 at 440 Hz.

$$
f_{\text{reference}} = 440 \cdot 2^{(m-69)/12}\ \text{Hz}
$$

The generated sine has a 750 Hz reference from the fixture. I compared each accepted window with its reference on a cents scale.

$$
\left|\text{error in cents}\right|
= \left|1200\log_2\left(\frac{f_{\text{estimate}}}{f_{\text{reference}}}\right)\right|
$$

A match falls within 50 cents, or half a semitone. The table shows accepted windows out of the full pitch windows inside each label. Frequency and error medians use the 0.80 cutoff.

| Region | Reference | At 0.60 | At 0.80 | At 0.95 | Median estimate at 0.80 | Median absolute error |
|---|---:|---:|---:|---:|---:|---:|
| Guitar E2 | 82.4069 Hz | 59/59 | 59/59 | 59/59 | 82.4438 Hz | 0.77 cents |
| Tenor sax C4 | 261.6256 Hz | 51/51 | 51/51 | 51/51 | 261.5956 Hz | 0.30 cents |
| Generated sine | 750 Hz | 21/21 | 21/21 | 21/21 | 749.9969 Hz | 0.01 cents |
| Guitar chord | — | 53/64 | 0/64 | 0/64 | — | — |
| Claves decay | — | 0/4 | 0/4 | 0/4 | — | — |
| Quiet claves tail | — | 0/24 | 0/24 | 0/24 | — | — |
| Rain | — | 0/59 | 0/59 | 0/59 | — | — |
| Seeded white noise | — | 0/30 | 0/30 | 0/30 | — | — |
| Digital silence | — | 0/2 | 0/2 | 0/2 | — | — |

All 110 windows from the two recorded single notes matched within 50 cents. At 0.60, the accepted chord windows returned a median candidate near 123.75 Hz. Several strings can create a combined waveform with a plausible repeat lag, so this would be a false accept for a single-note interpretation. The sweep measures coverage on these clips. Adjacent windows share samples, and the 0.80 result is specific to this chord. [Measured pitch results](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/docs/devlog/2026-11-09-step-10-sample-analysis.md#pitch-and-confidence)

## 10. Compare the features with the labels

- **Guitar note and chord.** The E2 decay's median centroid is 257.55 Hz while its median estimated fundamental is 82.44 Hz. The centroid follows the balance of power across the spectrum, including the higher harmonics. The chord also has low flatness because several strings can concentrate power in narrow bands.
- **Attack timing.** I searched for the strongest flux frame within 2,048 samples of each attack marker. The guitar note peak was centered 1.97 ms before its marker and the claves peak 3.02 ms after. Both windows include their markers. The chord peak came 26.83 ms after the first crossing and its window starts later than that crossing. The largest spectral change can occur later in a strum than the first audible motion.
- **Noise.** White noise had median flatness near 0.563 and rain near 0.000011. In this rain excerpt the power is concentrated toward the lower part of the analyzed band. The geometric mean drops when many bins have little power. Noise can also generate positive flux as energy shifts between bins.
- **Quiet decay.** The claves tail had median RMS near $0.000072\ \text{FS}$. Nineteen of its 27 feature windows were flagged silent, so the spectral medians summarize the other eight. All 24 pitch windows fell below the pitch level gate. A quiet tail can therefore have a few available spectral measurements and no pitch candidates.

The new tests exercise a low fundamental with a stronger harmonic in opposite-polarity stereo, the pitch gate in the presence of a DC offset, the known notes and the chord, noise and quiet controls. All 13 Python tests and 10 C++ checks passed. The study report reproduced byte for byte on the same machine. The recorded E2 sample map also matched across runs with and without plotting. [Feature comparisons and verification](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/docs/devlog/2026-11-09-step-10-sample-analysis.md#features-versus-the-annotations)

## 11. Reproduce the demo

Use Python 3.12 from the Drizel repo root on the updated Step 10 branch. The experiment pins NumPy 2.3.5, SciPy 1.17.0 and Matplotlib 3.10.8. [Step 10 draft PR](https://github.com/neuralmanacle/drizel/pull/12)

```bash
python3 -m venv build/sample-analysis-venv
source build/sample-analysis-venv/bin/activate
python -m pip install -r experiments/sample-analysis/requirements.txt
```

This produces the annotated report and a plot for the corpus E2 clip. Choose a fresh output directory for each run of `analyze.py`.

```bash
python experiments/sample-analysis/study.py > build/sample-analysis-study.json
python experiments/sample-analysis/analyze.py \
  experiments/sample-analysis/corpus/guitar-e2.wav build/sample-analysis-e2 --plot
python -m unittest discover -s experiments/sample-analysis -v
```

In the study report, open a recording's `regions` and look at `threshold_sweep`. Compare `accepted` with `pitch_frames` and use `within_tolerance` for regions with a reference frequency. The `feature_summary` contains the regional medians and the number of silent frames. A recording with an attack marker also has its peak offset and whether the window contains the marker.

### Plot a guitar WAV

```bash
python experiments/sample-analysis/analyze.py \
  "/path/to/guitar.wav" build/sample-analysis-guitar --plot
```

Open `build/sample-analysis-guitar/analysis.png` for the six panels and `sample-map.json` for the frame records. `--frame-size` sets the FFT length to a power of two from 32 to 16,384 samples. `--hop-size` sets the step from 1 sample to half the frame length. The default hop is a quarter of the frame length. [Experiment guide](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/experiments/sample-analysis/README.md)

### Create a local manifest for a guitar take

Use the existing plot to choose a single-note passage longer than 100 ms. The time values in the command are an example. Set them to the region you actually want to study. Run these commands from the repo root with the analysis environment active.

```bash
mkdir -p build/guitar-study
cp "/path/to/guitar.wav" build/guitar-study/guitar.wav

PYTHONPATH=experiments/sample-analysis python - <<'PY'
import json
from pathlib import Path
from analyze import load_wav

wav = Path("build/guitar-study/guitar.wav")
rate, samples, digest = load_wav(wav)
start_s, end_s = 0.25, 0.75
start, end = round(start_s * rate), round(end_s * rate)
if not 0 <= start < end <= len(samples):
    raise SystemExit(f"Choose a region inside the {len(samples) / rate:.2f}-second WAV.")
if end - start < round(0.1 * rate):
    raise SystemExit("Choose a region at least 100 ms long.")

region = {
    "label": "Guitar note",
    "start_sample": start,
    "end_sample_exclusive": end,
}
recording = {"file": wav.name, "sha256": digest, "regions": [region]}
manifest = {"recordings": [recording]}
wav.with_name("manifest.json").write_text(
    json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
)
PY
```

The script creates `build/guitar-study/manifest.json` with the WAV hash and the sample indices at the actual source rate. For a note with an independently known pitch, add `expected_f0_hz` to its region to get a cents error. For a marked attack, add `attack_sample` to the recording entry. Run the study with the manifest you created.

```bash
python experiments/sample-analysis/study.py \
  --manifest build/guitar-study/manifest.json > build/guitar-study/report.json
```

## Where the map fits in Drizel

A grain selector could use the frame intervals as candidates. High flux might favor sharper textures. An RMS range paired with a centroid range might favor quieter passages with more high-frequency weight. A grain can span several frames, so the selection rule needs to account for its duration and source position.

Layer 9 now has an offline sample map, a corpus and a measured pitch study. Layer 10 covers C++ feature agreement, map preparation off the audio thread, and feature-guided grain selection with manual fallback. The annotated failures suggest concrete cases to carry into that work, especially strums with several attacks and tails whose measurements are close to a level gate. [Drizel roadmap](https://github.com/neuralmanacle/drizel/blob/4ae526086440a363251fe64b0c83a9dee372e817/docs/roadmap.md#layer-10-sample-aware-granular-playback)

## Video walkthrough and rehearsal

| Time | On screen | Speaking prompt |
|---|---|---|
| 0:00–0:45 | Play just before and after 51 s in the long guitar take. Point to RMS and centroid. | “What changed in the sound when the waveform got smaller?” |
| 0:45–2:15 | Zoom into the waveform and spectrogram. Trace one window and its hop. | “Which samples does a single dot on the feature track describe?” |
| 2:15–3:45 | Show the four tracks and the transition near 39 s. | “How can the spectral change peak before the loudest frame?” |
| 3:45–4:45 | Open one sample-map row, then the E2 entry in the corpus manifest. | “How do the sample indices and WAV hash let me check the same slice twice?” |
| 4:45–7:00 | Play the E2 clip and the chord. Use the lag example and compare the acceptance counts. | “What does a repeat lag tell me about one note? How can a chord fool the same measurement?” |
| 7:00–9:00 | Show the rain and quiet-tail rows, run `study.py`, then point to a candidate grain region. | “Which measurements would I trust here, and what would I need before using them in playback?” |

Before recording, try explaining three checks without the equations in front of you.

1. Double the gain of the same WAV. Which tracks move if the silence flags stay the same?
2. Compare an 82 Hz guitar fundamental with a centroid near 258 Hz. What information is each number summarizing?
3. Follow the quiet claves tail from its waveform to the two gates. Which report values disappear first, and why?
