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
  "step-09-drizel-playable-granular-instrument-explained.md",
)

export const metadata: Metadata = {
  title: "Step 9: Making Drizel a Playable Granular Instrument",
  description:
    "How MIDI notes, envelopes, modulation, and presets turn Drizel's continuous grain cloud into a playable instrument.",
  alternates: {
    canonical: "/articles/step-09-making-drizel-a-playable-granular-instrument",
  },
}

export default async function ArticlePage() {
  const markdown = await readFile(articleSource, "utf8")
  const body = markdown
    .replace(/^# Step 9: Making Drizel a Playable Granular Instrument\s*/m, "")
    .replace(
      /^\*How MIDI notes, envelopes, modulation, and presets turn a continuous grain cloud into a musical instrument—and what happens inside the audio callback when a key is pressed\.\*\s*/m,
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
              November 5, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 9: Making Drizel a Playable Granular Instrument
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              How MIDI notes, envelopes, modulation, and presets turn a
              continuous grain cloud into a musical instrument—and what happens
              inside the audio callback when a key is pressed.
            </p>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <MarkdownArticleContent source={body} />
            <ArticleTags />
          </div>
        </RevealOnView>
      </article>
    </main>
  )
}
