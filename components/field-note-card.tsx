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
        <span className="font-mono text-[#A66B00] dark:text-[#F7B904] text-sm tracking-wider">
          {paddedNumber}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs text-foreground">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">
          <Link
            href={href}
            className="transition-colors hover:text-[#F7B904]"
          >
            {title}
          </Link>
        </h3>
        <div className="font-mono text-xs text-muted-foreground tracking-wide">
          {date} · {readingTime}
        </div>
      </div>
    </div>
  )
}
