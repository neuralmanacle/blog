export function FutureProjectCard() {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_0_0_1px_rgba(247,185,4,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-[#F7B904]/50 bg-[#F7B904]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#F7B904]">
          In Development
        </span>
        <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Project
        </span>
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-foreground">
        Drizel — Granular Synthesizer
      </h3>

      <div className="mt-4 text-sm text-muted-foreground">
        <span className="font-medium uppercase tracking-[0.22em] text-[#F7B904]">Repository</span>
        <a
          href="https://github.com/neuralmanacle/drizel"
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-all text-base text-foreground transition-colors hover:text-[#F7B904]"
        >
          https://github.com/neuralmanacle/drizel
        </a>
      </div>

      <p className="mt-5 text-base leading-7 text-muted-foreground">
        A JUCE-based granular synthesizer exploring real-time grain scheduling,
        expressive texture generation, and experimental sound design.
      </p>

      <ul className="mt-5 flex flex-wrap gap-2 text-sm text-foreground">
        {[
          "C++",
          "JUCE",
          "DSP",
          "Real-time Audio",
          "Granular Synthesis",
        ].map((item) => (
          <li key={item} className="rounded-full border border-border bg-secondary px-2.5 py-1.5 text-foreground">
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}
