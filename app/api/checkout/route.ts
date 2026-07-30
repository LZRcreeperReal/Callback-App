import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { SERVICES, ServiceId } from '@/lib/services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, name, email, role, resumeLink, notes } = body as {
      serviceId: ServiceId;
      name: string;
      email: string;
      role?: string;
      resumeLink?: string;
      notes?: string;
    };

    // Price is always looked up server-side from lib/services.ts — never
    // trust an amount sent from the client.
    const service = SERVICES[serviceId];
    if (!service) {
      return NextResponse.json({ error: 'Unknown service selected.' }, { status: 400 });
    }
    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: service.price,
            product_data: {
              name: service.name,
              description: service.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        serviceId: service.id,
        name,
        role: (role || '').slice(0, 200),
        resumeLink: (resumeLink || '').slice(0, 400),
        notes: (notes || '').slice(0, 400),
      },
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
