import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Metadata } from "next"
import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import MarkdownArticleContent from "@/components/markdown-article-content"
import RevealOnView from "@/components/reveal-on-view"

const articleSource = join(
  process.cwd(),
  "drafts",
  "step-11-teaching-drizel-where-to-start-a-grain.md",
)

export const metadata: Metadata = {
  title: "Step 11: Teaching Drizel Where to Start a Grain",
  description:
    "How Drizel measures transients, sustain, and brightness to guide grain starts while keeping real-time playback predictable.",
  alternates: {
    canonical: "/articles/step-11-teaching-drizel-where-to-start-a-grain",
  },
}

export default async function ArticlePage() {
  const markdown = await readFile(articleSource, "utf8")
  const body = markdown
    .replace(/^# Step 11: Teaching Drizel Where to Start a Grain\s*/m, "")
    .replace(
      /^> How a C\+\+ granular synth measures transients, sustain, and brightness, then uses those measurements to choose where each grain begins\.\s*/m,
      "",
    )

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
              November 11, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 11: Teaching Drizel Where to Start a Grain
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              How Drizel measures transients, sustain, and brightness to guide
              grain starts while keeping real-time playback predictable.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="step-11-equations">
              <MarkdownArticleContent source={body} />
            </div>
            <ArticleTags />
          </div>
        </RevealOnView>
      </article>
    </main>
  )
}
