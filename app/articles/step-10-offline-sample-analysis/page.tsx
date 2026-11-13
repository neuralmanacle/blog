import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Metadata } from "next"
import Link from "next/link"
import ArticleTags from "@/components/article-tags"
import MarkdownArticleContent from "@/components/markdown-article-content"
import RevealOnView from "@/components/reveal-on-view"
import VideoExplanation from "@/components/video-explanation"

const articleSource = join(
  process.cwd(),
  "drafts",
  "step-10-offline-sample-analysis.md",
)

export const metadata: Metadata = {
  title: "Step 10: Offline Sample Analysis",
  description:
    "How an offline Python analyzer maps a WAV into source coordinates and audio features for feature-guided grain selection.",
  alternates: {
    canonical: "/articles/step-10-offline-sample-analysis",
  },
}

export default async function ArticlePage() {
  const markdown = await readFile(articleSource, "utf8")
  const body = markdown
    .replace(/^# Drizel Step 10 — Offline Sample Analysis\s*/m, "")
    .replace(/^\*\*Layer 9 · Audio characteristics and sample analysis\*\*\s*/m, "")

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
              November 9, 2026
            </p>

            <h1 className="article-header text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white font-mono">
              Step 10: Offline Sample Analysis
            </h1>

            <p className="text-2xl text-neutral-500 dark:text-neutral-400 font-mono italic leading-relaxed">
              Describing a source recording with sample coordinates, audio
              features, and a visual analysis map.
            </p>

            <section aria-labelledby="source-audio-heading">
              <h2
                id="source-audio-heading"
                className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white font-mono"
              >
                Listen to the guitar recording
              </h2>
              <audio
                controls
                preload="metadata"
                className="w-full"
                aria-label="Guitar recording used for the Step 10 sample analysis"
              >
                <source src="/audio/guitar.wav" type="audio/wav" />
                Your browser does not support audio playback.
              </audio>
            </section>

            <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />

            <div className="step-10-equations">
              <MarkdownArticleContent source={body} />
            </div>
            <VideoExplanation
              videoId="kFyqUuTV-oE"
              startAtSeconds={146}
              title="Step 10: Offline Sample Analysis"
            />
            <ArticleTags />
          </div>
        </RevealOnView>
      </article>
    </main>
  )
}
