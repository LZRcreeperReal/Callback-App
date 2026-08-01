'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { TIERS, TIER_ORDER, CheckTier } from '@/lib/tiers';
import SnippetQuote from './SnippetQuote';
import ShareToEarn from './ShareToEarn';
import CookieWarning from './CookieWarning';

interface Balance {
  free: number;
  basic: number;
  advanced: number;
  super: number;
}

interface Snippet {
  before: string;
  match: string;
  after: string;
}

interface FindingUnlocked {
  id: string;
  label: string;
  locked: false;
  status: 'good' | 'warn';
  detail: string;
  snippets?: Snippet[];
}
interface FindingLocked {
  id: string;
  label: string;
  locked: true;
  requiredTier: CheckTier;
}
type FindingResult = FindingUnlocked | FindingLocked;

interface RunResult {
  wordCount: number;
  findings: FindingResult[];
  tier: CheckTier;
  remaining: number;
}

export default function CheckRunner() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') as CheckTier | null;

  const [balance, setBalance] = useState<Balance | null>(null);
  const [tier, setTier] = useState<CheckTier>(initialTier && TIERS[initialTier] ? initialTier : 'free');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);

  function refreshBalance() {
    fetch('/api/account')
      .then((r) => r.json())
      .then(setBalance)
      .catch(() => {});
  }

  useEffect(() => {
    refreshBalance();
  }, []);

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    const started = Date.now();
    try {
      const res = await fetch('/api/checks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, resumeText: text }),
      });
      const data = await res.json();

      // Keep the loading state up for at least half a second so it doesn't
      // flash — plain perceptual smoothing, not a claim that anything took
      // longer than it did.
      const elapsed = Date.now() - started;
      if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        setLoading(false);
        return;
      }
      setResult(data);
      refreshBalance();
    } catch {
      setError('Something went wrong — try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  const currentCount = balance ? balance[tier] : null;

  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-3 sm:grid-cols-4">
        {TIER_ORDER.map((t) => {
          const info = TIERS[t];
          const count = balance ? balance[t] : null;
          const selected = tier === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selected ? 'border-ledger bg-ledger/5' : 'border-ink/10 bg-white hover:border-ink/25'
              }`}
            >
              <p className="font-display text-sm font-semibold text-ink">{info.name}</p>
              <p className="mt-1 font-mono text-xs text-ink/50">
                {count === null
                  ? '…'
                  : count > 0
                  ? `${count} available`
                  : info.price === 0
                  ? 'Used'
                  : `$${(info.price / 100).toFixed(0)}`}
              </p>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleRun}>
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text of your resume here…"
          rows={12}
          className="w-full rounded-xl border border-ink/15 bg-white p-4 text-sm text-ink placeholder:text-ink/30 focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
        />
        {error && <p className="mt-2 text-sm text-pen">{error}</p>}

        {currentCount !== null && currentCount < 1 ? (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/buy?tier=${tier}`}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
            >
              {TIERS[tier].price === 0
                ? 'Get more free checks'
                : `Buy a ${TIERS[tier].name} — $${(TIERS[tier].price / 100).toFixed(0)}`}
            </Link>
            {tier === 'free' && <ShareToEarn onEarned={() => refreshBalance()} />}
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Scanning…' : `Run ${TIERS[tier].name}`}
          </button>
        )}
      </form>

      {result && (
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            {result.wordCount} words scanned · {TIERS[result.tier].name}
          </p>
          {result.findings.map((f) =>
            f.locked ? (
              <div
                key={f.id}
                className="flex items-start gap-3 rounded-xl border border-dashed border-ink/20 bg-paper p-4"
              >
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-ink/40" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink/50">{f.label}</p>
                  <p className="text-sm text-ink/40">Unlock with {TIERS[f.requiredTier].name}.</p>
                </div>
                <Link
                  href={`/buy?tier=${f.requiredTier}`}
                  className="shrink-0 rounded-full bg-ink/10 px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-ink/20"
                >
                  Show
                </Link>
              </div>
            ) : (
              <div key={f.id} className="rounded-xl border border-ink/10 bg-white p-4">
                <div className="flex items-start gap-3">
                  {f.status === 'good' ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-go" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-pen" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-ink">{f.label}</p>
                    <p className="text-sm text-ink/60">{f.detail}</p>
                  </div>
                </div>
                {f.snippets?.map((s, i) => (
                  <SnippetQuote key={i} before={s.before} match={s.match} after={s.after} status={f.status} />
                ))}
              </div>
            )
          )}
        </div>
      )}

      <CookieWarning />
    </div>
  );
}
