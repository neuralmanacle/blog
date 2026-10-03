export function GoodreadsLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.goodreads.com/neuralmanacle"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 text-sm font-medium text-transparent bg-[length:200%_100%] bg-clip-text [background-image:var(--site-accent)] transition-colors hover:text-[#0D0D0D] hover:[background-image:var(--site-accent)] ${className}`}
    >
      Find me on Goodreads <span aria-hidden="true">→</span>
    </a>
  )
}
