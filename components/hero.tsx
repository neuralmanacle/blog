"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroProps {
  title: string
  tagline?: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function Hero({
  title, tagline, description, primaryCta, secondaryCta,
}: HeroProps) {
  return (
    
    <section
      aria-labelledby="hero-heading"
      className={cn(
        "relative w-full overflow-hidden border-b border-neutral-800 px-6 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20",
        "bg-[#0D0D0D]/40"
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-4xl">
          {tagline && (
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground italic">{tagline}</p>
          )}

          <h1
            id="hero-heading"
            className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-7xl"
          >
            {title}
          </h1>

          <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[#F7B904]">
            in a synthetic dream
          </p>

          <blockquote className="mt-8 max-w-2xl border-l border-[#F7B904]/60 pl-4 text-base leading-8 text-neutral-300 sm:text-lg">
            {description}
          </blockquote>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="h-11 rounded-lg border border-[#F7B904] bg-[#F7B904] px-6 text-sm font-semibold text-[#0D0D0D] hover:bg-[#f8c12a]">
              <Link href={primaryCta.href}>{primaryCta.label === "Explore Ideas" ? "Explore Projects" : primaryCta.label}</Link>
            </Button>

            {secondaryCta && (
              <Button asChild variant="outline" className="h-11 rounded-lg border border-neutral-700 bg-transparent px-6 text-sm font-semibold text-[#F7B904] hover:border-[#F7B904] hover:bg-[#F7B904]/10 hover:text-[#f8c12a]">
                <Link href={secondaryCta.href}>{secondaryCta.label === "Read Field Notes" ? "Read Field Notes" : secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
