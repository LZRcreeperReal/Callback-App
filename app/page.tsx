import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CouponClip from '@/components/CouponClip';
import PricingCard from '@/components/PricingCard';
import ResumeMockup from '@/components/ResumeMockup';
import ServiceQuiz from '@/components/ServiceQuiz';
import Reveal from '@/components/Reveal';
import { SERVICES } from '@/lib/services';

const STEPS = [
  {
    label: 'Send it in',
    detail: "Pick resume review, mock interview critique, or both. Tell us the role you're going for.",
  },
  {
    label: 'An expert marks it up',
    detail: 'Someone who has actually hired for that kind of role reviews it — async, on their own time.',
  },
  {
    label: 'You get it back',
    detail: 'Written feedback or a recorded critique, within 48 hours. No call to schedule.',
  },
];

const FAQS = [
  {
    q: 'Who actually reviews my resume or interview?',
    a: "Every request is matched to a reviewer with real hiring experience in that field — not a generic template checker. You'll see their background before your feedback arrives.",
  },
  {
    q: "What if I'm not happy with the feedback?",
    a: "Tell us within 7 days and we'll have another reviewer take a fresh pass at no extra cost.",
  },
  {
    q: 'Is my resume kept private?',
    a: "It's shared only with the reviewer assigned to your request, used only to give you feedback.",
  },
  {
    q: 'How is this different from the free scan?',
    a: 'The free scan runs a few automated pattern checks — it\'s a quick sanity check, not a real review. The paid tiers get you a person who has actually hired for the role.',
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
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Async career feedback</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              Get marked up by someone who&rsquo;s actually <span className="italic text-ledger">hired</span> for
              the role.
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-ink/70">
              Send your resume or interview answers. A real hiring expert sends back specific, written feedback
              within 48 hours — no call to schedule, no generic advice.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#pricing"
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
              >
                Get expert feedback
              </Link>
              <Link
                href="/demo"
                className="rounded-full border border-ink/15 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/30"
              >
                Try a free scan first
              </Link>
            </div>
            <p className="mt-4 font-mono text-xs text-ink/40">
              One free scan per person. No card needed. Not sure which tier?{' '}
              <Link href="/#quiz" className="underline decoration-dotted underline-offset-2 hover:text-ink/70">
                Take the 30-second quiz
              </Link>
              .
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
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Three steps, no scheduling.</h2>
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
              No back-and-forth scheduling. No &ldquo;let&rsquo;s hop on a call.&rdquo; Just{' '}
              <span className="text-highlighter">specific, written feedback</span> — sent back to you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Guided quiz */}
      <section id="quiz" className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Not sure which one?</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Answer two questions.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
              We&rsquo;ll point you at the right tier — no pressure, no email required to see the answer.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <ServiceQuiz />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ledger">Pricing</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Pick what you need.</h2>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <CouponClip />
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {Object.values(SERVICES).map((service, i) => (
              <Reveal key={service.id} delay={i * 100}>
                <PricingCard service={service} featured={service.id === 'complete-bundle'} index={i} />
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
              Stop guessing what&rsquo;s wrong with it.
            </h2>
            <Link
              href="/#pricing"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-ledger px-8 py-4 text-sm font-medium text-paper transition-colors hover:bg-ledgerLight"
            >
              Get expert feedback
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
