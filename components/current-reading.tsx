import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const readingBooks = [
  {
    title: "A Tour of C++, Third Edition",
    author: "Bjarne Stroustrup",
    cover: "/atourofc++.jpg",
    alt: "A Tour of C++, Third Edition cover",
    description: "Working through C++ from first principles as part of my transition into audio software engineering.",
  },
  {
    title: "The Guitarist's Introduction to Jazz",
    author: "Randy Vincent",
    cover: "/jazz.jpg",
    alt: "The Guitarist's Introduction to Jazz cover",
    description: "I’m reading this alongside my C++ studies to keep growing my musical ear and understanding of jazz language, phrasing, and improvisation.",
  },
]

export function CurrentReading() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6">
      <Badge className="mb-5 border-transparent bg-[length:200%_100%] text-gradient-secondary hover:brightness-110">
        Currently Reading
      </Badge>

      <div className="space-y-6">
        {readingBooks.map((book) => (
          <div key={book.title} className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-40 w-28 overflow-hidden rounded-md border border-border bg-muted shadow-[0_16px_35px_rgba(0,0,0,0.08)]">
              <Image
                src={book.cover}
                alt={book.alt}
                fill
                className="object-cover grayscale"
                sizes="112px"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                {book.title} — {book.author}
              </h3>

              <p className="mt-3 text-sm uppercase tracking-[0.22em] text-gradient-secondary">
                Book • Current Study
              </p>

              <p className="mt-4 max-w-xl text-base leading-7 text-gradient-secondary">
                {book.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
