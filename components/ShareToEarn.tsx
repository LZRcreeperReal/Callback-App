'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareToEarn({ onEarned }: { onEarned?: (free: number) => void }) {
  const [status, setStatus] = useState<'idle' | 'sharing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleShare() {
    setStatus('sharing');
    const url = typeof window !== 'undefined' ? window.location.origin : '';

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Callback', text: 'Free resume check', url });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Share sheet was cancelled — don't block the reward on that, since
      // we're not claiming to verify the share anyway (see below).
    }

    try {
      const res = await fetch('/api/checks/share', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Couldn't add a bonus check.");
        setStatus('error');
        return;
      }
      setStatus('done');
      onEarned?.(data.free);
    } catch {
      setStatus('error');
      setMessage('Something went wrong.');
    }
  }

  if (status === 'done') {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-go">
        <Check className="h-4 w-4" /> Bonus check added.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={handleShare}
        disabled={status === 'sharing'}
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 disabled:opacity-50"
      >
        <Share2 className="h-4 w-4" />
        {status === 'sharing' ? 'Opening share…' : 'Share the link, get a bonus check'}
      </button>
      {message && <p className="mt-2 text-xs text-pen">{message}</p>}
      <p className="mt-2 text-xs text-ink/40">
        Opens your share sheet (or copies the link) — the bonus is yours either way, up to 3 times.
      </p>
    </div>
  );
}
