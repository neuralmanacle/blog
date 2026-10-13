"use client"

import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import RevealOnView from "@/components/reveal-on-view"
import { InterpolationDemo, WindowShapeDemo } from "@/components/window-shapes-demo"

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
              Step 3: Window Shapes and Interpolation
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Tiny pieces that make granular synthesis sound smoother.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                In Step 3, Drizel starts shaping each grain more carefully. Two small ideas do much of the work: window shapes decide how a grain fades in and out, while interpolation estimates the audio value between stored samples. Neither is magic; they are the small details that make grains cleaner and more musical.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What is a grain?
              </h2>
              <p>
                A grain is a very short slice of sound. Rather than playing a whole sample from beginning to end, a granular synthesizer plays many tiny slices, often overlapping them to form a larger texture. Each grain needs a clean beginning and ending. If its signal starts or stops abruptly, the sudden jump can sound like a click.
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-sans text-base dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">One sample becomes a cloud of grains</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center text-neutral-600 dark:text-neutral-300">
                  <span className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-white/15">Audio sample</span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">Grain 1</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">Grain 2</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">Grain 3</span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded-lg border border-emerald-400/40 px-3 py-2">Cloud of sound</span>
                </div>
              </div>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Why use a window?
              </h2>
              <p>
                Imagine cutting a waveform with scissors. A hard cut can leave the signal at a non-zero value, then force it instantly to zero. That discontinuity introduces broadband energy that we hear as a click. A window multiplies the grain by a changing volume curve: it fades the sound in, lets it speak, and fades it out.
              </p>
              <p>
                The window does not change where the grain comes from. It changes how strongly each point in that grain contributes to the output.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Hann and triangle windows
              </h2>
              <p>
                A Hann window starts at zero, rises smoothly to its peak, and returns smoothly to zero. Its rounded shape is useful for reducing clicks and creating gentle overlapping textures. One common definition is{" "}
                <code className="rounded bg-neutral-100 px-2 py-1 text-lg dark:bg-white/10">
                  w(t) = 0.5 − 0.5 cos(2πt)
                </code>
                , where t moves from 0 to 1 across the grain.
              </p>
              <p>
                A triangle window rises and falls in straight lines. It is simple to implement and useful for learning because its fade is easy to see and hear. A rectangular window applies no fade at all, so it is useful as a comparison but can leave clicks at the edges.
              </p>
              <WindowShapeDemo />

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What is interpolation?
              </h2>
              <p>
                Digital audio stores a signal as a sequence of samples. But a grain may need to read from a position between two stored samples, especially when playback speed or pitch changes. Interpolation estimates a sensible value at that in-between position instead of simply jumping from one sample to the next.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Linear interpolation
              </h2>
              <p>
                Linear interpolation draws a straight line between two sample values. If sample A is 0.20 and sample B is 0.80, halfway between them the estimated value is 0.50. In code, the calculation is:
              </p>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-4">
                <code className="block font-mono text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                  value = a + (b - a) * t;
                </code>
              </pre>
              <p>
                Here, <code>a</code> is the first sample, <code>b</code> is the next sample, and <code>t</code> is the fractional position between them. At t = 0 the result is a; at t = 1 it is b; at t = 0.5 it is their midpoint.
              </p>
              <InterpolationDemo />

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                What changes in the engine?
              </h2>
              <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
                <li><strong className="text-emerald-300">Window shapes</strong> multiply each grain by an amplitude curve to reduce abrupt edges.</li>
                <li><strong className="text-emerald-300">A Hann window</strong> gives a smooth, rounded fade in and out.</li>
                <li><strong className="text-emerald-300">A triangle window</strong> provides a straightforward linear fade that is easy to test.</li>
                <li><strong className="text-emerald-300">Linear interpolation</strong> estimates audio values between sample positions for smoother playback movement.</li>
              </ul>
              <p>
                The architectural change is small, but it matters at the sample level. Granular synthesis becomes more musical when every tiny grain is both shaped and read cleanly.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                A beginner’s mental model
              </h2>
              <p>
                Think of a grain as a tiny flashlight beam. The window controls how its light fades in and fades out. Interpolation controls how smoothly the flashlight moves between points. Rough windowing can click; rough sample reading can step. Smooth windows and interpolation help the grain cloud feel less broken.
              </p>

              <h2 className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white">
                Step 3 summary
              </h2>
              <p>
                Step 3 makes the small pieces better. Window shapes help each grain enter and leave smoothly, and interpolation makes reads between samples cleaner. Together, they turn raw grain playback into something closer to a playable instrument.
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
