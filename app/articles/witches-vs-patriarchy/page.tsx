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
              July 17, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Witches vs Patriarchy
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              There are only two sides one could pick: either that of the witch or that of the dreaded patriarchy.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                There are only two sides one could pick: either that of the witch or that of the dreaded patriarchy. The former moves towards nurturing, love, peace, harmony, inner truth, spiritual healing, and prosperity, and the latter goes towards anger, power, destruction, darkness, and wars. I went through the biggest transformation of my life these past months as I got into wellness, or in other words, I listened to me, the witch, the witch who had been silenced from the time of Eve. To all the witches who had been burnt have left a karmic debt to the rest of humanity. The more I cultivate my awareness and heal from my trauma, the more I can feel the collective feminine and the amount of darkness that is in the world, and it is sad that dark times are ahead and the only light should come from our hearts through love. Make Art. Write. Paint. Make music and express yourself; have liberty. If it is not outward, then have inward liberty. Meditate. Feel the Life Force.🙏
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
