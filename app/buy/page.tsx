import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BuyForm from '@/components/BuyForm';

export const metadata = {
  title: 'Buy a check — Callback',
};

export default function BuyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Buy a check</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Pick a tier.</h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          You&rsquo;ll be sent to secure checkout, then straight back to run your check — no waiting.
        </p>
        <Suspense fallback={<div className="mt-10 text-sm text-ink/40">Loading…</div>}>
          <BuyForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
