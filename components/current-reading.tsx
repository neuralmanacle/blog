import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function CurrentReading() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative h-40 w-28 overflow-hidden rounded-md border border-border bg-muted shadow-[0_16px_35px_rgba(0,0,0,0.08)]">
          <Image
            src="/atourofc++.jpg"
            alt="A Tour of C++, Third Edition cover"
            fill
            className="object-cover grayscale"
            sizes="112px"
          />
        </div>

        <div className="flex-1">
          <Badge className="mb-3 border-[#F7B904]/40 bg-[#F7B904]/10 text-[#F7B904] hover:bg-[#F7B904]/15">
            Currently Reading
          </Badge>

          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            A Tour of C++, Third Edition — Bjarne Stroustrup
          </h3>

          <p className="mt-3 text-sm uppercase tracking-[0.22em] text-muted-foreground">
            Book • Current Study
          </p>

          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Working through C++ from first principles as part of my transition into audio software engineering.
          </p>
        </div>
      </div>
    </div>
  )
}
