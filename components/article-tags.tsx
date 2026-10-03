"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabaseData } from "@/components/supabase-provider"

export default function ArticleTags() {
  const { articles } = useSupabaseData()
  const pathname = usePathname()
  const article = articles.find((a) => a.href === pathname)

  if (!article || !article.tags || article.tags.length === 0) return null

  const visibleTags = article.tags.filter((tag) => tag !== "tech")

  if (visibleTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 pt-6 font-mono text-xs">
      <span className="mr-1 flex items-center text-gradient-secondary">tags:</span>
      {visibleTags.map((tag) => (
        <Link
          key={tag}
          href={`/?tag=${tag}`}
          className="rounded border border-transparent px-2 py-0.5 text-gradient-secondary transition-colors hover:border-transparent hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] hover:bg-[length:200%_100%]"
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
