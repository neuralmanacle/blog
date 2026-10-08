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
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors font-mono"
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

              <p>
                A granular synthesizer plays a sound as many tiny overlapping fragments, called grains, typically 1-100 ms long. Each grain is a short slice of a sample shaped by a smooth window (fade in and out) so it doesn't click. Grains are triggered rapidly, and each can have its own start position, pitch, and length. Summed together, they form a continuous texture whose character comes from controlling those parameters: where in the sample grains are taken from, how dense they are, and how much they vary.
              </p>

              <p>
                I'd been reading the lecture notes from George Mason University called 'Computational Music Synthesis' and C++ too, which would lay the basic foundation that would be required to build more blocks of this objective.
              </p>

              <p>
                I aim to build a custom granular synthesizer where I'll be able to add features and technologies as it evolves through the development. I named it 'Drizel,' as the sound synthesized by a granular synthesizer sounds like a drizzle of rain. Very Subjective xD. A log of rambutan is a bit open, as I wanted a red fruit on a light green background. Again, creativity.
              </p>

              <p>
                On presenting this idea to a connection on LinkedIn whose name is Tero, he came up with an idea of LLM modulation, which I'm picking up in an experimental angle, sounds fun, and is definitely futuristic.
              </p>

              <p>
                The code is licensed and open-sourced on GitHub. <a href="https://github.com/neuralmanacle/drizel" target="_blank" rel="noreferrer">https://github.com/neuralmanacle/drizel</a>
              </p>

              <p>
                In the Read Me section you could find the architecture and game plan for the development and testing.
              </p>

              <p>
                The major milestones are
              </p>

              <ol className="list-decimal space-y-2 pl-6">
                <li>Set up the project. Create a JUCE and Projucer project, get a clean build, and add one test. This is a good place to explain why you chose C++ and building from scratch.</li>

                <li>Load a sound. Read a WAV file into a buffer and write it back out. The blog angle is what audio actually is in memory.</li>

                <li>Build the small pieces. Make window shapes and interpolation, and show how each one changes the sound. Plots and audio clips of aliasing and clicks work well here.</li>

                <li>Play one grain. Take a short slice, fade it in and out, and change its pitch. The first audible result makes a good post.</li>

                <li>Play many games. Add a scheduler that triggers grains at a chosen density, with random variation, and mix them together. This is where the sound turns into a texture.</li>

                <li>Run it live. Move the engine into a real-time audio callback. Cover the rules for the audio thread: no allocation, no locks, and measuring CPU cost.</li>

                <li>Add modulation. Move position and pitch with LFOs and random walks, so the sound evolves on its own.</li>

                <li>Make it playable. Add MIDI input, an envelope, and presets.</li>

                <li>Build the interface. Add a waveform display, controls, and a plugin build.</li>

                <li>Add AI control. Have a language model steer position and density slowly in the background. Cover the latency limits, the lookahead trick, and what happens when the network drops.</li>
              </ol>
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
    </div>
  </main>
  )
}
