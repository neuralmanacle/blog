import Image from "next/image"
import Link from "next/link"
import { BookOpen, Github, Linkedin, Mail } from "lucide-react"
import { CalBooking } from "@/components/cal-booking"
import ContactForm from "@/components/contact-form"

const marqueeItems = [
  "Audio software engineering",
  "DSP",
  "C++",
  "JUCE",
  "Computational music synthesis",
  "Game audio",
  "Systems thinking",
  "Learning in public",
]

export function AboutProfile({ id = "about" }: { id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="about-heading">
      <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
        <div className="flex justify-center md:justify-start">
          <div className="relative h-44 w-44 overflow-hidden rounded-full border border-neutral-700 bg-neutral-950 shadow-[0_0_20px_rgba(0,0,0,0.18)]">
            <Image
              src="/arjun.png"
              alt="Portrait of Arjun"
              fill
              className="object-cover"
              sizes="176px"
            />
          </div>
        </div>

        <div>
          <h2 id="about-heading" className="text-4xl font-semibold tracking-tight text-[#F2F2F2] sm:text-5xl">
            Arjun · əɾ.d͡ʒʊn
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-neutral-300">
            <p>
              I&apos;m an aspiring audio software engineer from India focused on digital signal processing,
              C++, JUCE, computational music synthesis, and game audio.
            </p>
            <p>
              This website is my public engineering notebook — a place to document what I&apos;m learning,
              the textbooks I&apos;m studying, and the audio software I&apos;m building.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="https://www.linkedin.com/in/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition-colors hover:border-transparent hover:!text-[#0D0D0D] hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%]">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Link>
            <Link href="https://github.com/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition-colors hover:border-transparent hover:!text-[#0D0D0D] hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%]">
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link href="https://www.goodreads.com/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition-colors hover:border-transparent hover:!text-[#0D0D0D] hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%]">
              <BookOpen className="h-4 w-4" />
              Goodreads
            </Link>
            <Link href="mailto:neuralmanacle@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition-colors hover:border-transparent hover:!text-[#0D0D0D] hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%]">
              <Mail className="h-4 w-4" />
              Email
            </Link>
          </div>

          <div className="mt-10 overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/60 py-3">
            <div className="animate-marquee flex min-w-max gap-4 whitespace-nowrap px-4 text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-4">
                  {item}
                  <span aria-hidden="true" className="text-neutral-500">•</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ContactForm />
            <CalBooking />
          </div>
        </div>
      </div>
    </section>
  )
}
