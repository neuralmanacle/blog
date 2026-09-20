export function CalBooking() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f]/80 p-6 sm:p-8">
      <h3 className="text-2xl font-semibold tracking-tight text-[#F2F2F2]">
        Book a 20-minute Call
      </h3>
      <p className="mt-3 max-w-xl text-base leading-7 text-neutral-300">
        If you're working in music technology, audio software, DSP, or related areas, I&apos;m open to thoughtful conversations.
      </p>
      <a
        href="https://cal.com/neuralmanacle"
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#F7B904] transition-colors hover:text-[#f8c12a]"
      >
        Schedule a conversation <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}
