"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { FieldNoteCard } from "@/components/field-note-card"
import type { FieldNote } from "@/lib/articles"

type FieldNotesCarouselProps = {
  notes: FieldNote[]
}

export function FieldNotesCarousel({ notes }: FieldNotesCarouselProps) {
  const [carouselRef, carouselApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  })
  const [selectedSlide, setSelectedSlide] = React.useState(0)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const slides = React.useMemo(
    () =>
      Array.from({ length: Math.ceil(notes.length / 3) }, (_, index) =>
        notes.slice(index * 3, index * 3 + 3),
      ),
    [notes],
  )

  React.useEffect(() => {
    if (!carouselApi) return

    const updateCarouselState = () => {
      setSelectedSlide(carouselApi.selectedScrollSnap())
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    updateCarouselState()
    carouselApi.on("select", updateCarouselState)
    carouselApi.on("reInit", updateCarouselState)

    return () => {
      carouselApi.off("select", updateCarouselState)
      carouselApi.off("reInit", updateCarouselState)
    }
  }, [carouselApi])

  return (
    <div>
      <div
        ref={carouselRef}
        className="cursor-grab overflow-hidden touch-pan-y active:cursor-grabbing"
        role="region"
        aria-label="Field notes"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault()
            carouselApi?.scrollPrev()
          } else if (event.key === "ArrowRight") {
            event.preventDefault()
            carouselApi?.scrollNext()
          }
        }}
      >
        <div className="flex">
          {slides.map((slide, slideIndex) => (
            <section
              key={slide[0]?.href ?? slideIndex}
              className="min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}
            >
              <div className="space-y-2">
                {slide.map((note) => (
                  <FieldNoteCard
                    key={note.href}
                    title={note.title}
                    date={note.date}
                    readingTime={note.readingTime}
                    tags={note.tags}
                    href={note.href}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Show previous field notes"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-2" aria-label="Choose slide">
            {slides.map((slide, index) => (
              <button
                key={slide[0]?.href ?? index}
                type="button"
                onClick={() => carouselApi?.scrollTo(index)}
                className={`size-2.5 rounded-full transition-colors ${
                  selectedSlide === index
                    ? "bg-foreground"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to field notes slide ${index + 1}`}
                aria-current={selectedSlide === index ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Show next field notes"
          >
            Next →
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Showing field notes slide {selectedSlide + 1} of {slides.length}
      </p>
      {slides.length > 1 && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Swipe or drag to browse · 3 field notes per slide
        </p>
      )}
    </div>
  )
}
