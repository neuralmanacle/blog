"use client"

import * as React from "react"
import { Hero } from "@/components/hero"
import { FieldNoteCard } from "@/components/field-note-card"
import { ExperienceItem } from "@/components/experience-item"
import { FutureProjectCard } from "@/components/future-project-card"
import { CurrentReading } from "@/components/current-reading"
import { GoodreadsLink } from "@/components/goodreads-link"
import { NewsletterForm } from "@/components/newsletter-form"
import { AboutProfile } from "@/components/about-profile"
import { getFieldNotes } from "@/lib/articles"

const allFieldNotes = getFieldNotes().filter((note) => !!note.href)

export default function Page() {
  const [startIndex, setStartIndex] = React.useState(0)
  const windowSize = 3
  const maxStartIndex = Math.max(0, allFieldNotes.length - windowSize)
  const visibleNotes = allFieldNotes.slice(startIndex, startIndex + windowSize)
  const hasMoreNotes = allFieldNotes.length > windowSize

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setStartIndex((current) => Math.min(current + 1, maxStartIndex))
      }
      if (event.key === "ArrowLeft") {
        setStartIndex((current) => Math.max(current - 1, 0))
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [maxStartIndex])

  const goToPrevious = () => {
    if (allFieldNotes.length <= windowSize) return
    setStartIndex((current) => Math.max(current - 1, 0))
  }

  const goToNext = () => {
    if (allFieldNotes.length <= windowSize) return
    setStartIndex((current) => Math.min(current + 1, maxStartIndex))
  }

  return (
    <main className="relative z-10">
      <Hero
        title="Audio Software Engineer"
        tagline="in a synthetic dream"
        description="I document the systems, ideas, and experiments behind DSP, C++, JUCE, computational music synthesis, and audio software engineering in public."
        primaryCta={{ label: "Explore Projects", href: "#projects" }}
        secondaryCta={{ label: "Read Field Notes", href: "#field-notes" }}
      />

      <section id="experience" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">Experience</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F2F2] sm:text-4xl">Experience</h2>
          </div>
        </div>
        <ExperienceItem />
      </section>

      <section id="projects" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">Project</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F2F2] sm:text-4xl">Project</h2>
          </div>
        </div>
        <FutureProjectCard />
      </section>

      <section id="reading" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">Reading</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F2F2] sm:text-4xl">Currently Reading</h2>
          </div>
        </div>

        <CurrentReading />

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-800 pt-6">
          <GoodreadsLink />
        </div>

        <p className="mt-8 max-w-3xl text-base leading-7 text-neutral-300">
          I&apos;m working through foundational texts and turning what I learn into practical experiments and field notes. The goal is to become rigorous enough to understand audio systems from first principles and build software that feels musical, useful, and resilient.
        </p>
      </section>

      <section id="field-notes" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">Journal</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F2F2] sm:text-4xl">Field Notes</h2>
          </div>
        </div>

        {hasMoreNotes && (
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Show previous articles"
              disabled={startIndex === 0}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-lg text-[#F7B904] transition hover:border-[#F7B904] hover:text-[#F7B904] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Show next articles"
              disabled={startIndex >= maxStartIndex}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-lg text-[#F7B904] transition hover:border-[#F7B904] hover:text-[#F7B904] disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}

        <div className="space-y-2">
          {visibleNotes.map((note, index) => (
            <FieldNoteCard
              key={`${note.href}-${startIndex + index}`}
              number={startIndex + index + 1}
              title={note.title}
              date={note.date}
              readingTime={note.readingTime}
              tags={note.tags}
              href={note.href}
            />
          ))}
        </div>
      </section>

      <section id="resources" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">Resources</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F2F2] sm:text-4xl">References and study notes</h2>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f]/80 p-5 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#F7B904]">Theory</p>
          <a
            href="https://people.cs.gmu.edu/~sean/book/synthesis/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-lg font-medium text-[#F2F2F2] underline decoration-[#F7B904]/60 underline-offset-4 transition hover:text-[#F7B904]"
          >
            Computational Music Synthesis — Sean Luke
          </a>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">Newsletter</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2F2F2] sm:text-4xl">Neural Manacle Dispatch</h2>
        </div>
        <NewsletterForm />
      </section>

      <AboutProfile />
    </main>
  )
}
