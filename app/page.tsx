import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CouponClip from '@/components/CouponClip';
import PricingCard from '@/components/PricingCard';
import ResumeMockup from '@/components/ResumeMockup';
import Reveal from '@/components/Reveal';
import { TIERS, TIER_ORDER } from '@/lib/tiers';

const PAID_TIERS = TIER_ORDER.filter((t) => TIERS[t].price > 0);

const STEPS = [
  {
    label: 'Paste your resume',
    detail: 'No upload, no account — just paste the text in.',
  },
  {
    label: 'Pick a check depth',
    detail: 'Free, Basic, Advanced, or Super — each one unlocks more of the checks we run.',
  },
  {
    label: 'See exactly why',
    detail: 'Every finding points at the actual line that triggered it — not just a score.',
  },
];

const FAQS = [
  {
    q: 'Is this AI?',
    a: "No. It's rule-based pattern matching — regexes and word lists, not a model. That's on purpose: every finding points at the exact text that triggered it, instead of a black-box verdict you have to just trust.",
  },
  {
    q: 'What do the paid tiers actually add?',
    a: 'More categories of checks, not a "better" version of the same ones. Basic adds phrasing and structure checks, Advanced adds passive-voice and cliché detection, Super adds repetition and readability checks.',
  },
  {
    q: 'Is my resume stored anywhere?',
    a: "It's only used to generate your results and isn't saved on our end. Your check balance is stored in your browser's cookies — see the notice on the check page for what that means.",
  },
  {
    q: 'What happens if I lose my purchased checks?',
    a: "Since there's no account system, checks are tied to the browser you bought them in. Clearing cookies or switching browsers means we can't recover them — details are on the check page.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Automated resume checks</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              See exactly what&rsquo;s <span className="italic text-ledger">flagged</span> — and why.
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-ink/70">
              Paste your resume and get instant, specific findings — the actual sentence, highlighted,
              next to the reason it's flagged. Not a score. Not a black box.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/check"
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
              >
                Run your first check — free
              </Link>
              <Link
                href="/#pricing"
                className="rounded-full border border-ink/15 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/30"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-4 font-mono text-xs text-ink/40">
              1 free check to start. Earn more by sharing. No account needed.
            </p>
          </div>
          <ResumeMockup />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-ink/10 bg-white/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Three steps, instant results.</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.label} delay={i * 100}>
                <div className="inline-flex h-10 w-10 -rotate-6 items-center justify-center rounded-sm border-2 border-ink/20 font-mono text-sm font-semibold text-ink/60">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-ink">{step.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interlude — palette break */}
      <section className="border-t border-ink/10 bg-ledger">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <p className="font-display text-2xl font-medium leading-snug text-paper sm:text-3xl">
              No waiting. No guessing what a score means. Just{' '}
              <span className="text-highlighter">your actual sentence, highlighted</span> — and why it matters.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Pricing</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Pick a depth.</h2>
            <p className="mt-3 max-w-md text-sm text-ink/60">
              Each purchase adds 1 check at that tier to your Check Counter — spend it whenever you're
              ready on the check page.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <CouponClip />
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {PAID_TIERS.map((t, i) => (
              <Reveal key={t} delay={i * 100}>
                <PricingCard service={TIERS[t]} featured={t === 'super'} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-ink/10 bg-white/50">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Questions people ask.</h2>
          </Reveal>
          <div className="mt-10 divide-y divide-ink/10">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 60} className="py-6">
                <p className="font-display text-lg font-medium text-ink">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Your first check is free. See what it finds.
            </h2>
            <Link
              href="/check"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-ledger px-8 py-4 text-sm font-medium text-paper transition-colors hover:bg-ledgerLight"
            >
              Run your first check
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
