import { cookies } from 'next/headers';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DemoForm from '@/components/DemoForm';

export const metadata = {
  title: 'Free resume scan — Callback',
};

export default function DemoPage() {
  const used = cookies().get('callback_demo_used')?.value === '1';

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Free, one-time</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Quick resume scan</h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          Paste your resume text below for a handful of quick, automated checks — no account, no card. It&rsquo;s a
          lightweight heuristic pass, not a substitute for a real read from someone who&rsquo;s actually hired for
          your target role. One free scan per browser.
        </p>

        {used ? (
          <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8 text-center">
            <Lock className="mx-auto h-6 w-6 text-ledger" />
            <p className="mt-4 font-display text-xl text-ink">You&rsquo;ve used your free scan</p>
            <p className="mt-2 text-sm text-ink/60">
              Free scans are limited to one per browser. For the full line-by-line breakdown, an expert review is
              the next step.
            </p>
            <Link
              href="/submit?service=resume-review"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-ledger px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ledgerLight"
            >
              Get a full expert review — $49
            </Link>
          </div>
        ) : (
          <DemoForm />
        )}
      </main>
      <Footer />
    </>
  );
}
