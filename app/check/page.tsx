import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckRunner from '@/components/CheckRunner';

export const metadata = {
  title: 'Run a check — Callback',
};

export default function CheckPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Run a check</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Paste it in. See exactly why.
        </h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          This runs an automated pattern check — not a person, not AI. Every finding points at the
          actual sentence that triggered it, so you can see the reasoning, not just a verdict.
        </p>
        <Suspense fallback={<div className="mt-10 text-sm text-ink/40">Loading…</div>}>
          <CheckRunner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
