export function GoodreadsLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.goodreads.com/neuralmanacle"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 text-sm font-medium text-[#F7B904] transition-colors hover:text-[#f8c12a] ${className}`}
    >
      Find me on Goodreads <span aria-hidden="true">→</span>
    </a>
  )
}
