import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface FieldNoteCardProps {
  title: string
  date: string
  readingTime: string
  tags?: string[]
  href: string
}

export function FieldNoteCard({
  title,
  date,
  readingTime,
  tags = [],
  href,
}: FieldNoteCardProps) {
  return (
    <div className={cn("flex flex-col gap-4 border-b border-border py-6 text-foreground")}>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs text-gradient-secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
          <Link
            href={href}
            className="transition-colors hover:text-transparent hover:bg-[length:200%_100%] hover:bg-clip-text hover:[background-image:var(--site-accent)]"
          >
            {title}
          </Link>
        </h3>
        <div className="font-mono text-xs tracking-wide text-gradient-secondary">
          {date} · {readingTime}
        </div>
      </div>
    </div>
  )
}
