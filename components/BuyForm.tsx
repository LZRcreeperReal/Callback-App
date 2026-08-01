'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TIERS, TIER_ORDER, CheckTier } from '@/lib/tiers';

const PAID_TIERS = TIER_ORDER.filter((t) => TIERS[t].price > 0);

export default function BuyForm() {
  const searchParams = useSearchParams();
  const initial = searchParams.get('tier') as CheckTier | null;

  const [tier, setTier] = useState<CheckTier>(
    initial && TIERS[initial] && TIERS[initial].price > 0 ? initial : 'basic'
  );
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Something went wrong. Try again.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {PAID_TIERS.map((t) => {
          const info = TIERS[t];
          return (
            <button
              type="button"
              key={t}
              onClick={() => setTier(t)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                tier === t ? 'border-ledger bg-ledger/5' : 'border-ink/10 bg-white hover:border-ink/25'
              }`}
            >
              <p className="font-display text-base font-semibold text-ink">{info.name}</p>
              <p className="mt-1 font-mono text-sm text-ink/60">${(info.price / 100).toFixed(0)}</p>
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="For your receipt — checks themselves stay in this browser"
          className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink/30 focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
        />
      </label>

      {error && <p className="text-sm text-pen">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
      >
        {loading ? 'Redirecting to payment…' : `Continue to payment — $${(TIERS[tier].price / 100).toFixed(0)}`}
      </button>
    </form>
  );
}
