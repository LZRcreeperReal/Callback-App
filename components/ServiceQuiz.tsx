'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { SERVICES, ServiceId } from '@/lib/services';

const NEED_OPTIONS: { label: string; value: ServiceId }[] = [
  { label: 'Polishing my resume', value: 'resume-review' },
  { label: 'Prepping for an interview', value: 'mock-interview' },
  { label: 'Both, honestly', value: 'complete-bundle' },
];

const TIMING_OPTIONS = [
  { label: 'This week — something is coming up fast', value: 'soon' },
  { label: "No rush, I just want it right", value: 'later' },
];

export default function ServiceQuiz() {
  const [need, setNeed] = useState<ServiceId | null>(null);
  const [timing, setTiming] = useState<'soon' | 'later' | null>(null);

  const result = need ? SERVICES[need] : null;

  function reset() {
    setNeed(null);
    setTiming(null);
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-8">
      {!need && (
        <>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Question 1 of 2</p>
          <p className="mt-3 font-display text-xl font-semibold text-ink">What&rsquo;s on your plate right now?</p>
          <div className="mt-5 grid gap-3">
            {NEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setNeed(opt.value)}
                className="flex items-center justify-between rounded-xl border border-ink/10 px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:border-ledger hover:bg-ledger/5"
              >
                {opt.label}
                <ArrowRight className="h-4 w-4 text-ink/30" />
              </button>
            ))}
          </div>
        </>
      )}

      {need && !timing && (
        <>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Question 2 of 2</p>
          <p className="mt-3 font-display text-xl font-semibold text-ink">How soon do you need it back?</p>
          <div className="mt-5 grid gap-3">
            {TIMING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTiming(opt.value as 'soon' | 'later')}
                className="flex items-center justify-between rounded-xl border border-ink/10 px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:border-ledger hover:bg-ledger/5"
              >
                {opt.label}
                <ArrowRight className="h-4 w-4 text-ink/30" />
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink/40 hover:text-ink/60"
          >
            <RotateCcw className="h-3 w-3" /> Start over
          </button>
        </>
      )}

      {result && timing && (
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Good fit</p>
          <p className="mt-3 font-display text-2xl font-semibold text-ink">{result.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            {result.description}{' '}
            {timing === 'soon'
              ? 'The 48-hour turnaround should fit your timeline.'
              : "No deadline pressure — you'll still get it back within 48 hours."}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/submit?service=${result.id}`}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
            >
              Get started — ${(result.price / 100).toFixed(0)}
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink/40 hover:text-ink/60"
            >
              <RotateCcw className="h-3 w-3" /> Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
