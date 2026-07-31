import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  let email: string | null | undefined = null;
  let amount: number | null = null;
  let error: string | null = null;

  if (!sessionId) {
    error = 'Missing checkout session.';
  } else {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email || session.customer_email;
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
            <CheckCircle2 className="mx-auto h-10 w-10 text-go" />
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink">You&rsquo;re all set.</h1>
            <p className="mt-3 leading-relaxed text-ink/70">
              {amount != null && `$${(amount / 100).toFixed(0)} received. `}
              We&rsquo;re matching you with an expert now — feedback lands in your inbox
              {email ? ` at ${email}` : ''} within 48 hours.
            </p>
          </>
        )}
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
