'use client';

import { useEffect, useState } from 'react';

interface Balance {
  free: number;
  basic: number;
  advanced: number;
  super: number;
}

export default function CheckCounter() {
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then(setBalance)
      .catch(() => {});
  }, []);

  if (!balance) return null;

  const items: { label: string; count: number }[] = [
    { label: 'Free', count: balance.free },
    { label: 'Basic', count: balance.basic },
    { label: 'Adv', count: balance.advanced },
    { label: 'Super', count: balance.super },
  ];

  return (
    <div className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white px-1.5 py-1 font-mono text-[10px] uppercase tracking-wide md:flex">
      {items.map((item) => (
        <span
          key={item.label}
          className={`rounded-full px-2 py-1 ${item.count > 0 ? 'bg-go/10 text-go' : 'text-ink/30'}`}
        >
          {item.label} {item.count}
        </span>
      ))}
    </div>
  );
}
