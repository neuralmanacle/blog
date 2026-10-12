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
              I live in India but I&apos;m English.
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              This is the postcolonial cognitive dissonance.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed text-justify">
              <p>
                This is the postcolonial cognitive dissonance. I&apos;m physically in India, which used to be a former colony of the English. Colonization is an irreversible process, which is what I&apos;m accepting. A systemic erosion of resources of a land, only leaving a corroded system left to be in constant political instability. In India, English is the currency and capital, and I accept it. The colonizer could be only confronted with the colonizer&apos;s language. When I travel across India, the more I see the colonial remnants, and it is sad. Around the turn of adolescence I got exposed to rock music, which I clung to for trauma release, and naturally the music became part of my DNA. The strong relation I formed with the soul of David Gilmour and how I lately matched with the frequency of George Harrison. The land of Surrey, which I considered a &quot;holy land&quot; where the musicians like Eric Clapton and Roger Waters channeled the ambience of the English countryside. What is 1947? It is just an illusion. The more I live in India, the cognitive dissonance is heavy. My soul is deeply drawn to the land of the music that is in my DNA. When I was cycling in the morning, I thought of George Harrison&apos;s spirit, with which I&apos;m possessed. It could be a pipe dream or delusion, but that&apos;s me.
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
