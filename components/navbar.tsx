"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SocialLinks } from "@/components/social-links"

const navigationItems = [
  { label: "Projects", href: "/#projects" },
  { label: "Reading", href: "/#reading" },
  { label: "Field Notes", href: "/#field-notes" },
  { label: "Experience", href: "/#experience" },
  { label: "Resources", href: "/#resources" },
  { label: "Newsletter", href: "/#newsletter" },
  { label: "About", href: "/about" },
]

export default function Navbar({ className }: { className?: string }) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const closeMenu = React.useCallback(() => setMenuOpen(false), [])

  React.useEffect(() => {
    if (!menuOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)

    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen, closeMenu])

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-[#0D0D0D]/70 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center rounded-full border border-neutral-700 bg-black/20 p-1.5 text-[#F5F1E8] transition-colors hover:border-[#F7B904] hover:text-[#F7B904] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B904] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]" aria-label="Home">
          <Image
            src="/logo.png"
            alt="Logo"
            width={20}
            height={20}
            className="h-5 w-5 rounded-sm object-cover"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-md px-3 py-2 text-[12px] font-medium uppercase tracking-[0.22em] text-neutral-300 transition-colors hover:text-[#F7B904] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B904] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SocialLinks />
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-overlay"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-md border border-neutral-700 p-2 text-neutral-200 transition-colors hover:border-[#F7B904] hover:text-[#F7B904] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B904] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D] md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-overlay"
        className={cn(
          "fixed inset-x-0 top-[68px] z-50 bg-[#0D0D0D]/90 backdrop-blur-lg transition-all duration-300 md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      >
        <div className="mx-auto max-w-5xl space-y-4 px-6 pb-8 pt-4" onClick={(event) => event.stopPropagation()}>
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              onClick={closeMenu}
              className="block rounded-md border border-neutral-800 px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-200 hover:border-[#F7B904] hover:text-[#F7B904]"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <SocialLinks onAction={closeMenu} />
          </div>
        </div>
      </div>
    </header>
  )
}
