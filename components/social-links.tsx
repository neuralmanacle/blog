"use client"

import Link from "next/link"
import { BookOpen, Github, Linkedin, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

type SocialLinksProps = {
  onAction?: () => void
  className?: string
}

export function SocialLinks({ onAction, className }: SocialLinksProps) {
  const handleClick = () => onAction?.()

  const linkCls = cn(
    "inline-flex items-center justify-center rounded-md p-2 text-neutral-300 transition-colors hover:text-[#F7B904]",
    className,
  )

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Link href="mailto:neuralmanacle@gmail.com" onClick={handleClick} className={linkCls} aria-label="Email" title="Email">
        <Mail className="h-4 w-4" />
      </Link>
      <Link href="https://github.com/neuralmanacle" target="_blank" rel="noopener noreferrer" onClick={handleClick} className={linkCls} aria-label="GitHub" title="GitHub">
        <Github className="h-4 w-4" />
      </Link>
      <Link href="https://www.linkedin.com/in/neuralmanacle" target="_blank" rel="noopener noreferrer" onClick={handleClick} className={linkCls} aria-label="LinkedIn" title="LinkedIn">
        <Linkedin className="h-4 w-4" />
      </Link>
      <Link href="https://www.goodreads.com/neuralmanacle" target="_blank" rel="noreferrer" onClick={handleClick} className={linkCls} aria-label="Goodreads" title="Goodreads">
        <BookOpen className="h-4 w-4" />
      </Link>
    </div>
  )
}
