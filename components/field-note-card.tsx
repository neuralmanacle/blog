import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface FieldNoteCardProps {
  number: number
  title: string
  date: string
  readingTime: string
  tags: string[]
  href: string
}

export function FieldNoteCard({
  number,
  title,
  date,
  readingTime,
  tags,
  href,
}: FieldNoteCardProps) {
  const paddedNumber = number.toString().padStart(3, "0")

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 border-b border-border text-foreground")}>
      <div className="sm:w-20 shrink-0">
        <span className="font-mono text-sm tracking-wider text-gradient-secondary">
          {paddedNumber}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs text-gradient-secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
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
