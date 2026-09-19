import Image from "next/image"
import { Github, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface ProjectCardProps {
  imageSrc: string
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  projectUrl?: string
}

export function ProjectCard({
  imageSrc,
  title,
  description,
  techStack,
  githubUrl,
  projectUrl,
}: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-none transition-colors duration-300 hover:border-[#F7B904]"
      )}
    >
      <CardContent className="p-0">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </AspectRatio>
      </CardContent>
      <CardHeader className="gap-2 px-5 pb-2 pt-5">
        <CardTitle className="text-lg text-foreground">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="border-border bg-secondary text-[11px] font-normal text-foreground transition-colors duration-200 group-hover:border-[#F7B904]/50"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 px-5 pb-5 pt-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 transition-colors duration-200 hover:border-[#F7B904] hover:bg-[#F7B904]/10 hover:text-[#F7B904]"
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on GitHub`}
          >
            <Github className="size-4" />
            GitHub
          </a>
        </Button>
        {projectUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 transition-colors duration-200 hover:border-[#F7B904] hover:bg-[#F7B904]/10 hover:text-[#F7B904]"
          >
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} live`}
            >
              <ExternalLink className="size-4" />
              Live
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
