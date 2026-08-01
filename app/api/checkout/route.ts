import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { TIERS, CheckTier } from '@/lib/tiers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier, email } = body as { tier: CheckTier; email: string };

    // Price is always looked up server-side from lib/tiers.ts — never
    // trust an amount sent from the client.
    const info = tier ? TIERS[tier] : undefined;
    if (!info || info.price <= 0) {
      return NextResponse.json({ error: 'Unknown or free tier — nothing to check out.' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      // Lets customers enter a real Stripe coupon code at checkout (e.g. one
      // you create in the Dashboard called LAUNCH10) — see README.
      allow_promotion_codes: true,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: info.price,
            product_data: {
              name: info.name,
              description: info.description,
            },
          },
          quantity: 1,
        },
      ],
      // tier is read back on /success to grant the right credit — see
      // app/api/checks/claim/route.ts. It's re-verified against Stripe
      // there, not trusted blindly.
      metadata: { tier: info.id },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    return NextResponse.json(
      { error: 'Something went wrong creating your checkout session.' },
      { status: 500 }
    );
  }
}
