"use client"

import Link from "next/link"
import RevealOnView from "@/components/reveal-on-view"
import ArticleTags from "@/components/article-tags"

export default function ArticlePage() {
  return (
    <main className="relative z-10 min-h-screen text-neutral-200">
      <div className="relative mx-auto w-full max-w-2xl px-4 py-20">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <RevealOnView intensity="soft">
            <div className="space-y-6">
            <Link
              href="/"
              className="text-xs font-mono text-emerald-300 underline decoration-emerald-400/50 underline-offset-4 transition-colors hover:text-emerald-100 hover:decoration-emerald-200"
            >
              ← Back
            </Link>

            <p className="text-sm font-mono text-neutral-500 dark:text-white/40">
              October 8, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight font-mono leading-tight text-transparent bg-[length:200%_100%] bg-clip-text [background-image:linear-gradient(90deg,#a7f3d0_0%,#4ade80_28%,#bbf7d0_65%,#86efac_100%)]">
              Introducing Drizel
            </h1>

            <p className="text-2xl leading-relaxed text-neutral-500 dark:text-neutral-400 font-mono italic">
              A granular synthesizer project shaped by DSP, JUCE, and a long-term curiosity for electronic sound design.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                The idea for a granular synthesizer wasn't new to me. I had been dreaming of building a studio with electronic gear mostly filled with synthesizers. My thought process is why not build something valuable and complex for a portfolio project through which I could learn a lot regarding music technology, especially digital signal processing and audio programming, with the JUCE framework?
              </p>
              <div className="mb-4 flex justify-center">
              <img
                src="/drizel-logo-large.png"
                alt="Drizel logo"
                className="h-auto w-full max-w-[320px] rounded-2xl shadow-[0_0_28px_rgba(74,222,128,0.18)]"
              />
            </div>

              <p>
                I had heard many songs earlier along the years where a granular synthesizer was used. A minimal definition of a granular synthesizer would be
              </p>

              <blockquote className="border-l-4 border-emerald-400/70 bg-emerald-950/30 px-6 py-4 text-neutral-200 not-italic">
                A granular synthesizer plays a sound as many tiny overlapping fragments, called grains, typically 1-100 ms long. Each grain is a short slice of a sample shaped by a smooth window (fade in and out) so it doesn't click. Grains are triggered rapidly, and each can have its own start position, pitch, and length. Summed together, they form a continuous texture whose character comes from controlling those parameters: where in the sample grains are taken from, how dense they are, and how much they vary.
              </blockquote>

              <p>
                I'd been reading the lecture notes from George Mason University called 'Computational Music Synthesis' and C++ too, which would lay the basic foundation that would be required to build more blocks of this objective.
              </p>

              <p>
                I aim to build a custom granular synthesizer where I'll be able to add features and technologies as it evolves through the development. I named it 'Drizel,' as the sound synthesized by a granular synthesizer sounds like a drizzle of rain. Very Subjective xD. A logo of rambutan is a bit open, as I wanted a red fruit on a light green background. Again, creativity.
              </p>

              <p>
                On presenting this idea to a connection on LinkedIn whose name is Tero, he came up with an idea of LLM modulation, which I'm picking up in an experimental angle, sounds fun, and is definitely futuristic.
              </p>

              <p>
                The code is licensed and open-sourced on GitHub. <a className="font-semibold text-emerald-300 underline decoration-emerald-400/60 underline-offset-4 transition-colors hover:text-emerald-100 hover:decoration-emerald-200" href="https://github.com/neuralmanacle/drizel" target="_blank" rel="noreferrer">https://github.com/neuralmanacle/drizel</a>
              </p>

              <p>
                In the Read Me section you could find the architecture and game plan for the development and testing.
              </p>

              <p>
                The major milestones are
              </p>

              <ol className="list-decimal space-y-2 pl-6 marker:text-emerald-300">
                <li><strong className="text-emerald-300">Set up the project:</strong> a clean <span className="font-semibold text-emerald-200">JUCE and Projucer</span> build with a first <span className="font-semibold text-emerald-200">automated test</span>.</li>

                <li><strong className="text-emerald-300">Load a sound:</strong> read a <span className="font-semibold text-emerald-200">WAV file</span> into memory and write it back out.</li>

                <li><strong className="text-emerald-300">Build the small pieces:</strong> <span className="font-semibold text-emerald-200">window shapes</span> and <span className="font-semibold text-emerald-200">interpolation</span>, and how each changes the sound.</li>

                <li><strong className="text-emerald-300">Play one grain:</strong> a short, faded slice at a chosen <span className="font-semibold text-emerald-200">pitch</span>.</li>

                <li><strong className="text-emerald-300">Play many grains:</strong> a <span className="font-semibold text-emerald-200">scheduler</span> that triggers <span className="font-semibold text-emerald-200">overlapping grains</span> with random variation.</li>

                <li><strong className="text-emerald-300">Run it live:</strong> move the engine into a <span className="font-semibold text-emerald-200">real-time audio callback</span>.</li>

                <li><strong className="text-emerald-300">Add modulation:</strong> <span className="font-semibold text-emerald-200">LFOs</span> and <span className="font-semibold text-emerald-200">random walks</span> so the sound evolves.</li>

                <li><strong className="text-emerald-300">Make it playable:</strong> <span className="font-semibold text-emerald-200">MIDI input</span>, an envelope, and presets.</li>

                <li><strong className="text-emerald-300">Build the interface:</strong> waveform display, controls, and a <span className="font-semibold text-emerald-200">plugin build</span>.</li>

                <li><strong className="text-emerald-300">Add AI control:</strong> a <span className="font-semibold text-emerald-200">language model</span> steering position and density slowly in the background.</li>
              </ol>
            </div>

            <ArticleTags />

            <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                href="/"
                className="text-sm font-mono text-emerald-300 underline decoration-emerald-400/50 underline-offset-4 transition-colors hover:text-emerald-100 hover:decoration-emerald-200"
              >
                ← Back to Index
              </Link>
            </div>
          </div>
        </RevealOnView>
      </article>
    </div>
  </main>
  )
}
