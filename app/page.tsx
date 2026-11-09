import { Hero } from "@/components/hero"
import { FieldNotesCarousel } from "@/components/field-notes-carousel"
import { ExperienceItem } from "@/components/experience-item"
import { FutureProjectCard } from "@/components/future-project-card"
import { CurrentReading } from "@/components/current-reading"
import { GoodreadsLink } from "@/components/goodreads-link"
import { NewsletterForm } from "@/components/newsletter-form"
import { AboutProfile } from "@/components/about-profile"
import { getFieldNotes } from "@/lib/articles"

const allFieldNotes = Array.from(
  new Map(
    getFieldNotes()
      .filter((note) => !!note.href)
      .map((note) => [note.href, note]),
  ).values(),
)

export default function Page() {
  return (
    <main className="relative z-10">
      <Hero
        title="Audio Software Engineer"
        tagline="in a synthetic dream"
        description="I build and document audio plugins with C++ and JUCE, focusing on real-time DSP and computational music synthesis while exploring audio ML, embedded neural networks, and game audio."
        primaryCta={{ label: "Explore Projects", href: "#projects" }}
        secondaryCta={{ label: "Read Articles", href: "#field-notes" }}
      />

      <section id="experience" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Experience</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Experience</h2>
          </div>
        </div>
        <ExperienceItem />
      </section>

      <section id="projects" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Project</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Project</h2>
          </div>
        </div>
        <FutureProjectCard />
      </section>

      <section id="reading" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Reading</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Currently Reading</h2>
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
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Journal</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Articles</h2>
          </div>
        </div>

        <FieldNotesCarousel notes={allFieldNotes} />
      </section>

      <section id="resources" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Resources</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">References and study notes</h2>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f]/80 p-5 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Theory</p>
          <a
            href="https://people.cs.gmu.edu/~sean/book/synthesis/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-lg font-medium text-[#675016] underline decoration-[#9a7737] underline-offset-4 transition hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)] dark:text-amber-300 dark:decoration-amber-400/70"
          >
            Computational Music Synthesis — Sean Luke
          </a>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Newsletter</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Neural Manacle Dispatch</h2>
        </div>
        <NewsletterForm />
      </section>

      <AboutProfile id="about" />
    </main>
  )
}
