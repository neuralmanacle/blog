"use client"

import Image from "next/image"
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
        "relative w-full overflow-hidden border-b border-neutral-800 pb-20 pt-16 sm:pb-24 sm:pt-20",
        "bg-[#0D0D0D]/40"
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/logo.svg"
          alt=""
          fill
          className="h-full w-full scale-150 object-contain object-center opacity-10 blur-3xl saturate-150"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8">
        <div className="max-w-4xl">
          {tagline && (
            <p className="text-xs uppercase tracking-[0.32em] text-gradient-secondary italic">{tagline}</p>
          )}

          <h1
            id="hero-heading"
            className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-7xl"
          >
            {title}
          </h1>

          <blockquote className="mt-8 max-w-2xl border-l border-transparent pl-4 text-base leading-8 text-neutral-300 sm:text-lg" style={{ borderImage: 'var(--site-accent) 1' }}>
            {description}
          </blockquote>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="h-11 rounded-lg border border-transparent bg-[length:200%_200%] px-6 text-sm font-semibold text-[#0D0D0D] [background-image:var(--site-accent)] hover:brightness-110">
              <Link href={primaryCta.href}>{primaryCta.label === "Explore Ideas" ? "Explore Projects" : primaryCta.label}</Link>
            </Button>

            {secondaryCta && (
              <Button asChild variant="outline" className="h-11 rounded-lg border border-neutral-700 bg-transparent px-6 text-sm font-semibold text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)] hover:border-transparent hover:bg-[length:200%_100%] hover:[background-image:var(--site-accent)] hover:text-[#0D0D0D]">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
