import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { articles } from "@/lib/articles"

export const metadata: Metadata = {
  title: "Drizel — Granular Synthesizer",
  description:
    "Explore Drizel, a JUCE-based granular synthesizer, its open-source code, and the articles documenting its development.",
  alternates: {
    canonical: "/projects/drizel",
  },
  openGraph: {
    title: "Drizel — Granular Synthesizer",
    description:
      "A JUCE-based granular synthesizer and a development series covering DSP, grain scheduling, and real-time audio.",
    url: "/projects/drizel",
    siteName: "Neural Manacle",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drizel — Granular Synthesizer",
    description:
      "A JUCE-based granular synthesizer and a development series covering DSP, grain scheduling, and real-time audio.",
    images: ["/logo.png"],
  },
}

const drizelArticleHrefs = new Set([
  "/articles/step-07-giving-sound-movement-with-modulation",
  "/articles/step-06-playing-the-grain-cloud-live",
  "/articles/step-05-from-one-grain-to-a-texture",
  "/articles/step-04-playing-one-grain",
  "/articles/four-point-hermite-interpolation",
  "/articles/step-03-window-shapes-and-interpolation",
  "/articles/introducing-drizel",
])

const drizelArticles = articles.filter(
  (article) => article.href && drizelArticleHrefs.has(article.href),
)

export default function DrizelProjectPage() {
  return (
    <main className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
      <Link
        href="/#projects"
        className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
      >
        ← Back to projects
      </Link>

      <header className="mt-8 grid items-center gap-8 rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-10 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gradient-secondary">
            Project · In Development
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Drizel — Granular Synthesizer
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            An open-source, JUCE-based granular synthesizer exploring digital
            signal processing, sample playback, overlapping grains, and
            real-time sound design.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://github.com/neuralmanacle/drizel"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-[#0D0D0D] [background-image:var(--site-accent)]"
            >
              View source on GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/neuralmanacle"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-500"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[180px]">
          <Image
            src="/drizel-logo-large.png"
            alt="Drizel logo"
            fill
            priority
            sizes="180px"
            className="object-contain"
          />
        </div>
      </header>

      <section className="mt-14" aria-labelledby="articles-heading">
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gradient-secondary">
            Build log
          </p>
          <h2
            id="articles-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
          >
            Articles about Drizel
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Follow the project from its first idea through grain-level DSP and
            the real-time engine.
          </p>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {drizelArticles.map((article, index) => (
            <li key={article.href} className="py-6">
              <p className="font-mono text-xs tracking-wide text-muted-foreground">
                {article.date} · {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
                <Link
                  href={article.href}
                  className="transition-colors hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)]"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {article.takeaway}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
