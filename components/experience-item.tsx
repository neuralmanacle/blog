export function ExperienceItem() {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_0_0_1px_rgba(247,185,4,0.06)] backdrop-blur-sm">
      <div className="absolute left-6 top-7 h-2.5 w-2.5 rounded-full bg-[#F7B904] shadow-[0_0_18px_rgba(247,185,4,0.7)]" aria-hidden="true" />

      <div className="pl-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          Software Engineer Intern
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Pitch Innovations
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <span>Internship</span>
          <span>·</span>
          <span>Remote</span>
        </div>

        <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
          <li>Developed production-grade audio applications, bridging desktop audio architectures with modern web technologies.</li>
          <li>Engineered C++ based music plugins for Digital Audio Workstations (DAWs) and seamlessly integrated them with Node.js-based user interfaces.</li>
        </ul>

        <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em] text-[#F7B904]">
          <span className="rounded-full border border-[#F7B904]/40 bg-[#F7B904]/10 px-2.5 py-1">C++</span>
          <span className="rounded-full border border-[#F7B904]/40 bg-[#F7B904]/10 px-2.5 py-1">JavaScript</span>
          <span className="rounded-full border border-[#F7B904]/40 bg-[#F7B904]/10 px-2.5 py-1">CI/CD</span>
          <span className="rounded-full border border-[#F7B904]/40 bg-[#F7B904]/10 px-2.5 py-1">JUCE</span>
        </div>

        <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Oct 2025 — Nov 2025 · 2 mos
        </p>
      </div>
    </div>
  )
}
