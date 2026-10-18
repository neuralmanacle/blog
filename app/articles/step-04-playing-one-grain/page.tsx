import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import CodeBlock from "@/components/code-block"
import RevealOnView from "@/components/reveal-on-view"

export default function ArticlePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <RevealOnView intensity="soft">
          <div className="space-y-6">
            <Link
              href="/"
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200 font-mono"
            >
              ← Back
            </Link>

            <p className="text-sm font-mono text-neutral-500 dark:text-white/40">
              October 18, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 4: Playing One Grain
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Turn a short sample slice into a small, pitched sound.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                So far, Drizel can load audio and has the small tools a grain needs: a window to shape its edges and interpolation to read between samples. Step 4 puts those pieces together. We will render one short slice at a chosen pitch, without a scheduler or a cloud of overlapping grains yet.
              </p>
              <p>
                Keeping it to one grain makes the path through the engine easier to understand: choose a source position, read the sample, apply a window, and add the result to the output.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                A grain has a small set of controls
              </h2>
              <p>
                A single grain can be described with a few values. The <strong>start position</strong> says where to read in the loaded sound. The <strong>duration</strong> says how many output frames it lasts. The <strong>pitch</strong> changes how quickly the read position moves through the source. The window gives the grain its fade in and fade out.
              </p>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-sans text-base dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">One grain, from source to output</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center text-neutral-600 dark:text-neutral-300">
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-white/15">Start in sample</span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-white/15">Read at pitch</span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">Apply window</span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">Output frames</span>
                </div>
              </div>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Pitch is a read-speed change
              </h2>
              <p>
                A digital sample does not contain a note that can be shifted independently of its playback. To change pitch in a simple sampler, we change how far the source read position advances for each output frame. A larger step moves through the source faster, making the sound higher and shorter; a smaller step makes it lower and longer.
              </p>
              <p>
                If pitch is expressed in semitones relative to the original sample, convert it to a playback ratio:
              </p>
              <CodeBlock
                language="cpp"
                code="const double pitchRatio = std::pow(2.0, semitones / 12.0);"
              />
              <p>
                Zero semitones gives a ratio of 1, so the source is read at its original rate. Twelve semitones gives 2, which advances twice as far per output frame and raises the pitch by an octave. Minus twelve gives 0.5, half the read speed and an octave down.
              </p>
              <p>
                The complete source-position increment also accounts for the sample rates. When the loaded sound and output device use different rates, the ratio is:
              </p>
              <CodeBlock
                language="cpp"
                code="const double sourceStep = (sourceSampleRate / outputSampleRate) * pitchRatio;"
              />
              <p>
                For example, reading a 48 kHz file on a 48 kHz output at the original pitch advances one source sample per output frame. Reading it one octave up advances two source samples per frame.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Render the grain frame by frame
              </h2>
              <p>
                For each output frame, the renderer uses the current source position to get an interpolated sample, multiplies it by the window value, then advances the source position. This is the core loop in pseudocode:
              </p>
              <CodeBlock
                language="cpp"
                code={`double sourcePosition = grainStart;
const double sourceStep = sampleRateRatio * pitchRatio;

for (int frame = 0; frame < grainLength; ++frame) {
    const double t = grainLength == 1
        ? 0.5
        : static_cast<double>(frame) / (grainLength - 1);
    const float sample = readInterpolated(sourcePosition);
    output[frame] += sample * window(t);
    sourcePosition += sourceStep;
}`}
              />
              <p>
                The interpolation and window functions are the ones introduced in{" "}
                <Link
                  href="/articles/step-03-window-shapes-and-interpolation"
                  className="text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"
                >
                  Step 3
                </Link>
                . The grain length here is measured in output frames; the source position can move by a fractional amount, which is why the reader needs interpolation.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Why multiply by a window?
              </h2>
              <p>
                A grain is a short excerpt, so its first and last samples may not be near zero. Cutting it off abruptly can create a discontinuity and an audible click. A Hann or triangle window brings the gain from zero up and back down, making the edges gentler.
              </p>
              <p>
                In the loop, the window is a gain applied to each sample. It does not move the read position or change the source audio; it controls how much each point contributes. At the start and end, the gain is zero. In the middle, it is strongest.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                A few boundaries to handle
              </h2>
              <p>
                A renderer also needs to be deliberate about edges. The requested grain length must be positive; a one-frame grain needs a defined window value instead of dividing by zero when calculating <code>t</code>. As pitch increases, the read position can reach the end of the source before the output grain finishes, so the implementation must stop or safely handle reads outside the available audio.
              </p>
              <p>
                These are not special cases to hide. They define the limits of the grain and make the result predictable. For a first version, it is useful to choose a valid start position and duration, keep the whole read inside the sample, and test pitches above and below the original rate.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Listen for the pieces
              </h2>
              <p>
                Test the grain at its original pitch first. Then try one octave up and one octave down. A clean result should have a clear beginning and ending, no edge clicks, and a pitch change that matches the read-speed ratio. If it clicks, inspect the window and the sample boundaries. If it sounds rough while changing pitch, inspect the interpolated reads.
              </p>
              <p>
                One grain is not yet the continuous, evolving sound people associate with granular synthesis. But this is the smallest complete unit of that sound: a chosen piece of audio, read at a chosen rate, shaped into a short event.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Step 4 summary
              </h2>
              <p>
                Step 4 combines sample reading, pitch, and windowing to play one grain. Pitch changes the rate at which the source position advances; interpolation makes fractional reads possible; and the window smooths the grain’s edges. With this unit working, the next step can focus on scheduling many grains and overlapping them into a texture.
              </p>
            </div>

            <ArticleTags />

            <div className="border-t border-neutral-200 pt-12 dark:border-neutral-800">
              <Link
                href="/"
                className="text-sm font-mono text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200"
              >
                ← Back to Index
              </Link>
            </div>
          </div>
        </RevealOnView>
      </article>
    </main>
  )
}
