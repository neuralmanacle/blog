type VideoExplanationProps = {
  title: string
  videoId: string
}

export default function VideoExplanation({
  title,
  videoId,
}: VideoExplanationProps) {
  return (
    <section className="font-mono" aria-label={`${title} video explanation`}>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
        Video explanation
      </h2>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 dark:border-white/10">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  )
}
