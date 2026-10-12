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
              June 22, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              AI is a Buzzword: Why?
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              An exploration of AI as a dystopian sales gimmick and the shift to agent-driven computing.
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
              <p>
                Artifical Intelligence is a very broad and deep concept and one of the biggest advancement in the history of science. It is the most valuable ouput by the scientific community. The early history dates back to a paper in 1950's and there is a huge role of Alan Turing. The dystopian world had been already warned by a lot of writers including George Orwell in his most sold novel, 1984. The latest update by Google is the accelaration of speculative-driven AI Engineering.
              </p>
              <p>
                Elon Musk gives inspiration regarding creating a net positive balance between creation and consumption. AI term is used frequently as a dystopian scare and as a sales gimmick. The cyclical data related debt created by LLM's, exponentially polarizes the rate of advancements for big enterprises and an average consumer. Algorithm driven market is shifting towards AI-driven market. The human creative and cognitive output is seriously hijacked by swarms of agent in the context of computation. How would the market get affected if the accelaration of technology is at this pace?
              </p>
              <p>
                The landscape of hard logic and legacy hard computing is ending and a fuzzy world of computing is shifting from textbooks to the real-world dynamics. The game is design engineering. System Design is one of the purest forms of engineering discipline. The cryptic code untangled into plain English. The gateway to sell yourself in the market has broadened.
              </p>
              <p>
                How? The rigid heirarchical systems are falling down as the constraints for writing software, marketing, UX Design and Product Prototyping is fundamentally ochestrated by agent-driven development. This brings to a conclusion that agentic engineering is a T-shaped skillset required. Verification, Security Architecture and Judgement happens to be the current skills required to sell in the tech business as a builder. The best practices at this point would be to be competitive in these skills combined with deep architectural mastery of systems. 
              </p>
              <p>Scarcity attracts value.</p>
              <p>
                The scarcity now is deep technical mastery in a craft. LLM's are probabilistic engines and not deterministic functions.
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
