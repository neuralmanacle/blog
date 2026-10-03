"use client"

import Link from "next/link"
import RevealOnView from "@/components/reveal-on-view"
import { useSupabaseData } from "@/components/supabase-provider"
import { siteChanges as fallbackChanges } from "@/lib/changes"

export default function ChangesPage() {
  const { siteChanges } = useSupabaseData()
  const todayChange = fallbackChanges[0]
  const changes = siteChanges.some((change) => change.date === todayChange.date)
    ? siteChanges
    : [todayChange, ...siteChanges]
  const visibleChanges = changes.filter((change) => change.date === todayChange.date)
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-[68px] md:pt-36 pb-8">
      <RevealOnView intensity="soft">
        {/* HEADER */}
        <section className="mb-12">
          <div className="flex items-center gap-2 font-mono text-sm mb-4">
            <Link href="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              index
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white font-medium">changes</span>
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
            site changes
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
            release notes, feature updates, and design iteration log.
          </p>
        </section>

        {/* TIMELINE LIST */}
        <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-4 pl-6 space-y-12">
          {visibleChanges.map((change, idx) => (
            <div key={idx} className="relative group">
              {/* TIMELINE DOT */}
              <div className="absolute -left-[31px] top-1.5 size-2.5 rounded-full border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black group-hover:bg-neutral-900 dark:group-hover:bg-white transition-colors" />

              <time className="block text-sm font-mono text-neutral-400 dark:text-neutral-500 mb-3">
                {change.date}
              </time>

              <div className="space-y-4">
                {change.added && change.added.length > 0 && (
                  <div>
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 rounded mb-2 font-mono">
                      Added
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-300 font-mono pl-1">
                      {change.added.map((item, itemIdx) => (
                        <li key={itemIdx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {change.changed && change.changed.length > 0 && (
                  <div>
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 rounded mb-2 font-mono">
                      Changed
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-300 font-mono pl-1">
                      {change.changed.map((item, itemIdx) => (
                        <li key={itemIdx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {change.fixed && change.fixed.length > 0 && (
                  <div>
                    <span className="inline-block rounded mb-2 border border-transparent bg-[length:200%_100%] bg-clip-text px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-transparent [background-image:var(--site-accent)]">
                      Fixed
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-300 font-mono pl-1">
                      {change.fixed.map((item, itemIdx) => (
                        <li key={itemIdx} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </RevealOnView>
    </main>
  )
}
