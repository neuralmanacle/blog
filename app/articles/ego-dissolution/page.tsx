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
              July 13, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Ego Dissolution Through Carnatic Vocal Training
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              At the age of nearly 26, I finally crushed my stupid dumb ego by starting Carnatic vocal training.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                At the age of nearly 26, I finally crushed my stupid dumb ego by starting Carnatic vocal training. I had never been trained before, even though music is in my DNA. The first class itself was a massive surge of dopamine and spiritual rush. It took my soul many years to dissolve its ego. As my energies are moving up towards the Third Eye Chakra (Ajna), the universe is shifting and the ego is dissolving. The music of the soul is evolving into truth. I&apos;m more attuned to the Beatles, Stones, and George Harrison these days. The lush and crisp voices created by the vibrations of an acoustic guitar paired with a soulful voice are more than enough for an intimate, soulful experience. Simple is better and to just let things go. My cognitive biases are dissolving as I just see everything as energy, frequency, and vibration. I&apos;m awaiting launching my YT channel and want to pour my heart and soul into it. I&apos;ll launch it when I really feel like the time is right. The universe is right. Inshallah. Om Namah Shivaya.
              </p>
              <p>
                It is extremely egoistic and stupid to disrespect music by doing stage shows without rigid training. I&apos;m grateful that I realized about the ego trap at 26. Who knows if I&apos;ll join the 27 club? Haha. Life is short.
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
