export default function ResumeMockup() {
  return (
    <div className="relative mx-auto w-[340px] origin-top scale-[0.85] sm:scale-100">
      {/* sticky note */}
      <div className="absolute -right-6 -top-6 z-20 rotate-6 rounded bg-highlighter px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-ink shadow-sm">
        Back in 48 hrs
      </div>

      {/* stamp — pops into place on load */}
      <div className="absolute -left-8 bottom-24 z-20 -rotate-12 animate-stamp rounded border-2 border-go px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-go opacity-90">
        ATS-safe ✓
      </div>

      {/* paper */}
      <div className="relative -rotate-2 rounded-sm border border-ink/10 bg-white p-6 shadow-xl">
        <p className="font-mono text-sm font-semibold tracking-wide text-ink">JORDAN REYES</p>
        <p className="mt-0.5 text-xs text-ink/50">Senior Product Manager</p>

        <div className="mt-5 border-t border-ink/10 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">Experience</p>

          <p className="relative mt-3 whitespace-nowrap text-xs leading-relaxed text-ink/30">
            Responsible for managing projects.
            <span className="absolute left-0 top-1/2 h-[1.5px] w-0 animate-strike bg-pen" />
          </p>
          <p className="relative mt-1 font-hand text-base leading-snug text-pen">
            Led a team of 6, cut onboarding time <span className="bg-highlighter/70 px-0.5">30%</span> ↑
          </p>

          <p className="mt-4 text-xs leading-relaxed text-ink/60">
            2021 — 2022 <span className="rounded-sm border border-pen/40 px-1 text-pen">gap?</span>
          </p>
          <p className="-mt-1 font-hand text-sm text-pen">add 1 line of context →</p>
        </div>
      </div>
    </div>
  );
}
