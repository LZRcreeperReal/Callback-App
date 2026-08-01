import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 400 });
  }

  // Stripe needs the RAW request body to verify the signature — don't
  // parse it as JSON first.
  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // IMPORTANT: this webhook does NOT grant the purchased credit — it
      // can't. Webhooks are server-to-server calls from Stripe; they have
      // no access to the customer's browser cookies, which is where credit
      // balances live in this cookie-only setup. Credit is granted by
      // app/api/checks/claim/route.ts instead, which runs in the
      // customer's browser on the /success page and re-verifies the
      // session with Stripe before writing the cookie.
      //
      // What this webhook IS good for: an independent, tamper-proof record
      // of what was actually paid for, since it comes straight from
      // Stripe rather than from a cookie the customer's browser controls.
      // Right now it just logs. Ideas for what to add:
      //   - Save the order to a database — this becomes the real source of
      //     truth once you're ready to move credit balances off cookies
      //   - Email a receipt (e.g. with Resend or SendGrid)
      //   - Alert you if a session's tier doesn't match what was charged
      console.log('✅ Payment completed for session:', session.id, session.metadata);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
