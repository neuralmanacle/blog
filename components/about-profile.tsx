import Image from "next/image"
import Link from "next/link"
import { BookOpen, Github, Linkedin, Mail } from "lucide-react"
import { CalBooking } from "@/components/cal-booking"
import ContactForm from "@/components/contact-form"

export function AboutProfile() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20" aria-labelledby="about-heading">
      <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
        <div className="flex justify-center md:justify-start">
          <div className="relative h-44 w-44 overflow-hidden rounded-full border border-neutral-700 bg-neutral-950 shadow-[0_0_30px_rgba(247,185,4,0.12)]">
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
            <Link href="https://www.linkedin.com/in/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-[#F7B904] hover:text-[#F7B904]">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Link>
            <Link href="https://github.com/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-[#F7B904] hover:text-[#F7B904]">
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link href="https://www.goodreads.com/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-[#F7B904] hover:text-[#F7B904]">
              <BookOpen className="h-4 w-4" />
              Goodreads
            </Link>
            <Link href="mailto:neuralmanacle@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-[#F7B904] hover:text-[#F7B904]">
              <Mail className="h-4 w-4" />
              Email
            </Link>
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
