"use client"

import Link from "next/link"
import RevealOnView from "@/components/reveal-on-view"
import ArticleTags from "@/components/article-tags"

export default function ArticlePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <RevealOnView intensity="soft">
          <div className="space-y-6">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors font-mono"
            >
              ← Back
            </Link>

            <p className="text-sm font-mono text-neutral-500 dark:text-white/40">
              September 25, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Learning C++
            </h1>

            <p className="text-base text-neutral-500 dark:text-neutral-400 font-mono italic">
              Why I’m choosing traditional learning over prompting, and why real systems thinking still matters.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-base leading-relaxed">
              <div className="my-4 mx-auto w-1/2 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
                <img
                  src="/learningtocode.jpeg"
                  alt="Learning C++ concept image"
                  className="h-auto w-full object-cover"
                />
              </div>

              <p>
                Why am I choosing traditional learning over prompting? The most advanced models are still producing code that is shallow, brittle, or simply wrong. The issue is not that models are useless; it is that they do not substitute for deep understanding in real systems work. The future still needs a human who can judge correctness, reason about tradeoffs, and repair failure at the level of architecture.
              </p>

              <p>
                I graduated during the period when LLMs became accessible to end users, and like many people I started leaning on them as a substitute for thinking. Humans often optimize for low energy expenditure, and cognition is expensive. But that shortcut comes with a cost: without training and careful repetition, intuition fades and the quality of decisions drops.
              </p>

              <p>
                Audio technology is still dominated by C++ and Python, with niche exceptions like Pure Data and Csound. C++ powers the low-level work that matters most in plugin development, audio DSP, machine learning inference, synth engines, and DAW architecture. Python is still the standard for research and ML-heavy workflows. For the work I want to do, C++ is not a side topic; it is a foundation.
              </p>

              <p>
                I picked up a C++ book written by the language’s founder. It feels unconventional in the age of tutorials and bootcamps, but that is exactly why it matters. My objective is to build muscle memory and intuition so that I can guide LLMs and reason about systems without blindly trusting generated output.
              </p>

              <p>
                I’ve met seniors who carry an edge from the pre-AI era because they know how to prompt, debug, and reason in a way that is grounded in real production understanding. In this era, the most valuable skill is not the fastest prompt; it is the ability to distinguish good engineering from plausible nonsense. Real-time systems especially demand rigor. Production code in audio is tight, constrained, and unforgiving. That demands more than prompting and surface-level debugging.
              </p>
            </div>

            <ArticleTags />

            <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                href="/"
                className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors font-mono"
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
