import { Scissors } from 'lucide-react';

// A real, working discount — not a fake one. This only pays off once you've
// created a matching coupon + promotion code named LAUNCH10 in the Stripe
// Dashboard (see README → "Setting up a real launch discount"). Checkout
// already has allow_promotion_codes: true wired up to accept it.
export default function CouponClip() {
  return (
    <div className="mx-auto flex max-w-md items-center gap-4 rounded-lg border-2 border-dashed border-ink/25 bg-white px-6 py-4">
      <Scissors className="h-5 w-5 shrink-0 -rotate-90 text-ink/30" />
      <div>
        <p className="font-mono text-sm font-semibold tracking-wide text-ink">
          LAUNCH10
        </p>
        <p className="text-xs text-ink/50">$10 off your first request, at checkout</p>
      </div>
    </div>
  );
}
