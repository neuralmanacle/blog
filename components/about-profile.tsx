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
  "Nu-jazz",
  "Music production",
  "Instruments",
  "Systems thinking",
  "Learning in public",
]

export function AboutProfile({ id = "about" }: { id?: string }) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl overflow-x-clip px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20" aria-labelledby="about-heading">
      <div className="grid min-w-0 gap-6 sm:gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
        <div className="flex justify-center md:justify-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-950 shadow-[0_0_20px_rgba(0,0,0,0.18)] sm:h-40 sm:w-40 md:h-44 md:w-44">
            <Image
              src="/arjun.png"
              alt="Portrait of Arjun"
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
            />
          </div>
        </div>

        <div className="min-w-0 w-full">
          <h2 id="about-heading" className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Arjun · əɾ.d͡ʒʊn
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-neutral-300 sm:mt-6 sm:space-y-5 sm:text-base sm:leading-8">
            <p>
              I&apos;m an aspiring audio software engineer from India focused on digital signal processing,
              C++, JUCE, computational music synthesis, and game audio.
            </p>
            <p>
              This website is my public engineering notebook — a place to document what I&apos;m learning,
              the textbooks I&apos;m studying, and the audio software I&apos;m building.
            </p>
            <p>
              I&apos;m also drawn to nu-jazz, music production, and exploring how different instruments shape
              sound, expression, and improvisation.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
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

          <div className="mt-8 min-w-0 overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/60 py-3 sm:mt-10">
            <div className="animate-marquee flex min-w-max gap-4 whitespace-nowrap px-4 text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-4">
                  {item}
                  <span aria-hidden="true" className="text-neutral-500">•</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid w-full min-w-0 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              <ContactForm />
            </div>
            <div className="min-w-0">
              <CalBooking />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
