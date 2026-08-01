import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Don't throw at import time — this file is imported by pages that should
  // still render (with a clear error) even before Stripe is configured.
  console.warn(
    'STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example) before testing checkout.'
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
