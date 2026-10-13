import Image from "next/image"
import Link from "next/link"
import ArticleTags from "@/components/article-tags"
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
              October 13, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Adding 4 Point Hermite Interpolation
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              A small addition to Step 3: window shapes and interpolation.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                An audio file stores amplitude values at whole-number sample positions. But a grain might need to read at <strong>11.5</strong>, halfway between samples 11 and 12. Fractional starting positions and changed playback speeds can both require reads between stored samples.
              </p>
              <p>
                <strong>Interpolation estimates the amplitude at that missing position.</strong> Drizel now has a four-point Hermite option alongside linear interpolation in its core reader API.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                From a straight line to a curve
              </h2>
              <p>
                Linear interpolation connects two neighboring samples with a straight line. Halfway between them, the result is their ordinary average; at other positions, it is a weighted average.
              </p>
              <p>
                Four-point Hermite interpolation uses two samples around the read position and one extra neighbor on each side. Those outer samples help estimate the direction, or slope, of the curve at its ends.
              </p>

              <figure className="space-y-3">
                <Image
                  src="/hermite-four-points.png"
                  alt="Four stored samples determine a Hermite segment between the middle two; a close-up compares linear and Hermite estimates at source position 11.5."
                  width={1800}
                  height={1800}
                  priority
                  className="h-auto w-full rounded-2xl border border-neutral-200 dark:border-white/10"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
                <figcaption className="font-sans text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                  The plotted values are a teaching example. Both methods pass through the middle stored samples, but their estimates differ between them. The curve is an estimate, not proof of the original waveform.
                </figcaption>
              </figure>

              <h3 className="pt-2 text-xl font-semibold text-neutral-900 dark:text-white">
                What do the four points do?
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
                <table className="w-full min-w-[34rem] border-collapse text-left font-sans text-base">
                  <thead className="bg-neutral-100 dark:bg-white/5">
                    <tr>
                      <th className="p-3">Point</th>
                      <th className="p-3">Source position</th>
                      <th className="p-3">Amplitude</th>
                      <th className="p-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
                    <tr><td className="p-3">p0</td><td className="p-3">10</td><td className="p-3">0.25</td><td className="p-3">Helps estimate the starting slope</td></tr>
                    <tr><td className="p-3">p1</td><td className="p-3">11</td><td className="p-3">0.00</td><td className="p-3">Start of the segment being read</td></tr>
                    <tr><td className="p-3">p2</td><td className="p-3">12</td><td className="p-3">0.25</td><td className="p-3">End of the segment being read</td></tr>
                    <tr><td className="p-3">p3</td><td className="p-3">13</td><td className="p-3">1.00</td><td className="p-3">Helps estimate the ending slope</td></tr>
                  </tbody>
                </table>
              </div>

              <p>
                Drizel uses the <strong>Catmull–Rom form of cubic Hermite interpolation</strong>, with slopes measured in amplitude per source sample:
              </p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li>Starting slope: <code>(p2 − p0) / 2</code></li>
                <li>Ending slope: <code>(p3 − p1) / 2</code></li>
              </ul>
              <p>
                For the values above, those slopes are <strong>0</strong> and <strong>0.5</strong>. The curve starts flat, then rises more steeply toward p2. At position <strong>11.5</strong>, the fractional offset <code>t</code> is <strong>0.5</strong>:
              </p>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li><strong>Linear:</strong> 0.125</li>
                <li><strong>Hermite:</strong> 0.0625</li>
              </ul>
              <p>
                Hermite is more than averaging four samples: their positions and the fractional offset determine the curve.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Why add it to a granular synth?
              </h2>
              <p>
                Linear interpolation can reduce high-frequency level, with the amount depending on the fractional offset. If grain starts are jittered by fractional samples, that can also vary their brightness. Hermite often preserves more high-frequency detail, making it useful for comparison on bright source material.
              </p>
              <p>
                It also takes more work per read and can <strong>overshoot</strong> the surrounding sample values. Hermite remains an approximation; it does not replace the filtering needed to prevent aliasing during resampling.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Where the window fits
              </h2>
              <p>
                Interpolation and windowing are separate operations in the planned grain voice:
              </p>
              <ol className="list-decimal space-y-2 pl-6 marker:text-emerald-300">
                <li><strong>Choose a source position:</strong> decide where this grain reads.</li>
                <li><strong>Interpolate:</strong> estimate the source amplitude at that position.</li>
                <li><strong>Apply the window:</strong> fade that amplitude according to the grain&apos;s age.</li>
                <li><strong>Mix:</strong> add the grain&apos;s contribution to the output.</li>
              </ol>
              <p>
                For example, a Hermite read of <strong>0.0625</strong>, multiplied by a window value of <strong>0.5</strong>, contributes <strong>0.03125</strong> before any additional gain or pan. Overlapping grains contribute their own values to the sum.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What changed in Drizel
              </h2>
              <p>
                The feature branch adds <code>readHermite()</code>, an <code>InterpolationMode</code> choice, and <code>readSample()</code> to dispatch between methods. Linear interpolation remains the default. Tests cover reconstruction, integer reads, boundaries, invalid inputs, and mode selection.
              </p>
              <p>
                This is a core DSP addition. Grain playback in the plugin and a UI selector still need to be connected.{" "}
                <a
                  href="https://github.com/neuralmanacle/drizel/pull/3"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-300 underline decoration-emerald-400/60 underline-offset-4 transition-colors hover:text-emerald-100"
                >
                  View the implementation in neuralmanacle/drizel#3
                </a>
              </p>

              <p>
                <strong>Takeaway:</strong> interpolation estimates what to read between samples; windowing shapes how that read contributes over the grain&apos;s lifetime.
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
