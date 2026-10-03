import Link from "next/link"
import { AboutProfile } from "@/components/about-profile"

const connectLinks = [
  { label: "Projects", href: "/#projects", description: "Selected work and experiments." },
  { label: "Reading", href: "/#reading", description: "The books and ideas in motion." },
  { label: "Field Notes", href: "/#field-notes", description: "Notes from the workbench and the road." },
]

export default function AboutPage() {
  return (
    <main className="relative z-10">
      <div className="mx-auto max-w-5xl px-6 pt-20 sm:px-8 sm:pt-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">About</p>
      </div>

      <AboutProfile />

      <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-8 sm:pb-24">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)]">
            Continue exploring
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {connectLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-xl border border-neutral-800 bg-[#0D0D0D]/60 p-5 transition-colors hover:border-transparent hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%]"
              >
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-200 group-hover:text-[#0D0D0D]">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-300 group-hover:text-[#0D0D0D]">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
