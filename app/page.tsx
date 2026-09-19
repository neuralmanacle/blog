import { Hero } from "@/components/hero"
import { FieldNoteCard } from "@/components/field-note-card"
import { ExperienceItem } from "@/components/experience-item"
import { FutureProjectCard } from "@/components/future-project-card"
import { CurrentReading } from "@/components/current-reading"
import { GoodreadsLink } from "@/components/goodreads-link"
import { NewsletterForm } from "@/components/newsletter-form"
import { AboutProfile } from "@/components/about-profile"

const featuredFieldNotes = [
  { number: 1, title: "Vosk as a Local STT Provider", date: "May 21, 2026", readingTime: "5 min read", tags: ["DSP", "Speech to Text", "Edge"], href: "/articles/vosk-stt-provider" },
  { number: 2, title: "AI is a Buzzword: Why?", date: "June 22, 2026", readingTime: "4 min read", tags: ["AI", "Systems"], href: "/articles/ai-buzzword-why" },
  { number: 3, title: "AES August '26 Seminar Summary", date: "August 26, 2026", readingTime: "6 min read", tags: ["Audio", "Meetup", "DSP"], href: "/articles/audio-engineering-comm-conf-aug-26" },
]

export default function Page() {
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

        <div className="mt-10 rounded-2xl border border-neutral-800 bg-[#0f0f0f]/75 p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#F7B904]">On the shelf</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#F7B904]">Currently Reading</p>
              <p className="mt-3 text-lg font-medium text-[#F2F2F2]">A Tour of C++, Third Edition — Bjarne Stroustrup</p>
            </div>
            <div className="rounded-xl border border-neutral-800 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#F7B904]">To Study</p>
              <div className="mt-3 space-y-2 text-lg font-medium text-[#F2F2F2]">
                <p>Computational Music Synthesis — Sean Luke</p>
              </div>
            </div>
          </div>
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

        <div className="space-y-2">
          {featuredFieldNotes.map((note) => (
            <FieldNoteCard
              key={note.number}
              number={note.number}
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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f]/80 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#F7B904]">Textbooks</p>
            <p className="mt-3 text-lg font-medium text-[#F2F2F2]">A Tour of C++</p>
            <p className="mt-2 text-sm text-neutral-400">C++ foundations and systems programming</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f]/80 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#F7B904]">Theory</p>
            <p className="mt-3 text-lg font-medium text-[#F2F2F2]">Computational Music Synthesis</p>
            <p className="mt-2 text-sm text-neutral-400">Models of sound, synthesis, and algorithmic composition</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f]/80 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#F7B904]">Tools</p>
            <p className="mt-3 text-lg font-medium text-[#F2F2F2]">JUCE + DSP tooling</p>
            <p className="mt-2 text-sm text-neutral-400">Audio processing, real-time systems, and plugin architecture</p>
          </div>
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
