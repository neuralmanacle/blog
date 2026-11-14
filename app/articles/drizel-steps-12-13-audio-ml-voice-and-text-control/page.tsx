import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Metadata } from "next"
import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import MarkdownArticleContent from "@/components/markdown-article-content"
import RevealOnView from "@/components/reveal-on-view"

const title = "Steps 12–13: From Audio ML to Voice and Text Control"
const description =
  "I tested whether a classifier could pick better grain starts, then built a way to describe how those starts should move through a sample."

const articleSource = join(
  process.cwd(),
  "drafts",
  "drizel-steps-12-13-audio-ml-voice-and-text-control.md",
)

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/articles/drizel-steps-12-13-audio-ml-voice-and-text-control",
  },
}

export default async function ArticlePage() {
  const markdown = await readFile(articleSource, "utf8")
  const body = markdown.replace(`# ${title}\n\n> ${description}\n\n`, "")

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
              November 14, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              {title}
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              {description}
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
