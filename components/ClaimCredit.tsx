'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ClaimCredit({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<'claiming' | 'done' | 'error'>('claiming');
  const [message, setMessage] = useState<string | null>(null);
  const [tierName, setTierName] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/checks/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || 'Could not apply this purchase.');
          setStatus('error');
          return;
        }
        setTierName(data.tier);
        setStatus('done');
      })
      .catch(() => {
        setMessage('Something went wrong applying your purchase.');
        setStatus('error');
      });
  }, [sessionId]);

  if (status === 'claiming') {
    return <p className="mt-6 text-sm text-ink/50">Adding your check to this browser…</p>;
  }

  if (status === 'error') {
    return <p className="mt-6 text-sm text-pen">{message}</p>;
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <p className="flex items-center gap-2 text-sm font-medium text-go">
        <CheckCircle2 className="h-4 w-4" />
        {tierName ? `${tierName[0].toUpperCase()}${tierName.slice(1)} check added to this browser.` : 'Check added.'}
      </p>
      <Link
        href="/check"
        className="inline-flex items-center justify-center rounded-full bg-ledger px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ledgerLight"
      >
        Run your check now
      </Link>
    </div>
  );
}
