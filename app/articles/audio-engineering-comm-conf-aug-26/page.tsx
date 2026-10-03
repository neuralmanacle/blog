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
              August 26, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              AES August '26 Seminar Summary
            </h1>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-base leading-relaxed text-justify">
              <p>
                A few yet valuable insights from the seminar hosted by the <a href="https://aes2.org/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Audio Engineering Society</a> on August '26.
              </p>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">1. The evolution of music technology</p>
                <p>The evolution of music technology from the 60s is something that needs to be studied to analyze how far we've come.</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">2. Building in public</p>
                <p>Building in public is the key in these times of automation. This doesn't mean that one should ditch the fundamentals altogether. The line between a music producer and an audio programmer has blurred.</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">3. Why should anyone care?</p>
                <p>This should be the key query while developing a product or starting a portfolio project. There are millions of EQs in the market, and many developers are creating customs too, but what's new? Why should anyone care about the game?</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">4. Be irreplaceable</p>
                <p>Key questions to ask yourself:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>What are your roots?</li>
                  <li>What is unique in you?</li>
                  <li>Why should this exist? The product.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">5. What's the future of workflows?</p>
                <p>This is subjective and quite philosophical too. An inspiring figure from the good old 70s, <a href="https://en.wikipedia.org/wiki/Tom_Scholz" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Tom Scholz</a>, who is the lead guitarist of the band <a href="https://en.wikipedia.org/wiki/Boston_(band)" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Boston</a>, comes to our attention as an example.</p>
                <p>He was an <a href="https://www.mit.edu/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">MIT</a>-trained engineer who used his skills to invent gears and custom analog studio effects, which are the signature sound of the band <a href="https://en.wikipedia.org/wiki/Boston_(band)" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Boston</a>.</p>
                <p>The message here is that now things are subjective when it comes to the workflow, and a clear definition of what, why, who, how, and which is the deciding factor.</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">6. LLMs and creative synthesis</p>
                <p><a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">LLM's</a> are generic. The development workflow is all about synthesis in the creative flow. Craft custom sounds, taste and beyond.</p>
              </div>

              <p>
                Special thanks to <a href="https://www.linkedin.com/in/joshuajameshodge/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Joshua Hodge</a> and <a href="https://www.linkedin.com/in/stephen-oxnard-69361991/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Stephen Oxnard</a>, and a shoutout to <a href="https://www.linkedin.com/company/savannah-dsp/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Savannah DSP</a> and its founder <a href="https://www.linkedin.com/in/joel-kiptoo/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Joel Kiptoo</a>.
              </p>

              <div className="space-y-2">
                <p className="font-bold text-neutral-900 dark:text-white">Keywords noted during the session:</p>
                <p>
                  <a href="https://cycling74.com/products/max" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">MaxMSP</a>, <a href="https://www.ableton.com/en/live/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Ableton Live</a>, <a href="https://en.wikipedia.org/wiki/Model_predictive_control" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">MPC</a>, <a href="https://en.wikipedia.org/wiki/Field-programmable_gate_array" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">FPGA</a>, <a href="https://www.ableton.com/en/live/extensions/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Ableton Extensions</a>, <a href="https://en.wikipedia.org/wiki/Autopilot" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Auto/Pilot</a>, <a href="https://www.roland.com/global/products/aiformusic/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">aiformusic by Roland</a>, <a href="https://en.wikipedia.org/wiki/LTV" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">LTV System</a>, <a href="https://ziglang.org/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Zig</a>, <a href="https://knockaudio.com/" target="_blank" rel="noreferrer" className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] hover:bg-clip-text dark:hover:text-[#0D0D0D]">Knock Drum Plugin</a>
                </p>
              </div>
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
