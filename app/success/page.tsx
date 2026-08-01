import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClaimCredit from '@/components/ClaimCredit';
import { stripe } from '@/lib/stripe';

export const metadata = {
  title: "You're all set — Callback",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  let amount: number | null = null;
  let error: string | null = null;

  if (!sessionId) {
    error = 'Missing checkout session.';
  } else {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      amount = session.amount_total;
    } catch {
      error = 'Could not find that checkout session.';
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-6 py-20 text-center sm:py-28">
        {error ? (
          <>
            <h1 className="font-display text-3xl font-semibold text-ink">Something&rsquo;s off</h1>
            <p className="mt-3 text-ink/60">{error}</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-semibold text-ink">Payment received.</h1>
            <p className="mt-3 leading-relaxed text-ink/70">
              {amount != null && `$${(amount / 100).toFixed(0)} received. `}
              One more step — we&rsquo;re adding the check to this browser now.
            </p>
            {sessionId && <ClaimCredit sessionId={sessionId} />}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
