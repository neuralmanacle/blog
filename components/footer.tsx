"use client"

import Link from "next/link"
import { BookOpen, Github, Linkedin, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Footer() {
  return (
    <footer className={cn("relative z-10 mx-auto w-full max-w-5xl px-6 pb-12 pt-12 sm:px-8") }>
      <div className="border-t border-neutral-800 pt-8">
        <p className="text-sm italic text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">Neural Manacle</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="https://github.com/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)]">
            <Github className="h-4 w-4" /> GitHub
          </Link>
          <Link href="https://www.linkedin.com/in/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)]">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Link>
          <Link href="https://www.goodreads.com/neuralmanacle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)]">
            <BookOpen className="h-4 w-4" /> Goodreads
          </Link>
          <Link href="mailto:neuralmanacle@gmail.com" className="inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)]">
            <Mail className="h-4 w-4" /> Email
          </Link>
        </div>
      </div>
    </footer>
  )
}
