import Link from "next/link"

const navItems = [
  { label: "Projects", href: "/#projects" },
  { label: "Reading", href: "/#reading" },
  { label: "Articles", href: "/#field-notes" },
  { label: "Experience", href: "/#experience" },
  { label: "Newsletter", href: "/#newsletter" },
  { label: "About", href: "/#about" },
  { label: "Book a Call", href: "https://cal.com/neuralmanacle" },
]

export function SiteNavigation() {
  return (
    <nav aria-label="Main navigation" className="hidden md:flex items-center justify-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          className="rounded-md px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:!text-[#0D0D0D] hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rainbow-4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
