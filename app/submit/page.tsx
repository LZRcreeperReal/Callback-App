import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceForm from '@/components/ServiceForm';

export const metadata = {
  title: 'Get feedback — Callback',
};

export default function SubmitPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Get feedback</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Tell us what you need.</h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          A few details, then you&rsquo;ll be sent to secure checkout. You&rsquo;ll hear back within 48 hours.
        </p>
        <Suspense fallback={<div className="mt-10 text-sm text-ink/40">Loading…</div>}>
          <ServiceForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
