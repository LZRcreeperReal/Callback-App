'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Finding {
  id: string;
  label: string;
  status: 'good' | 'warn';
  detail: string;
}

export default function DemoForm() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'demo-used') {
          setLocked(true);
        } else {
          setError(data.message || 'Something went wrong.');
        }
        return;
      }
      setFindings(data.result.findings);
      setWordCount(data.result.wordCount);
    } catch {
      setError('Something went wrong — try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  if (locked) {
    return (
      <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-8 text-center">
        <Lock className="mx-auto h-6 w-6 text-ledger" />
        <p className="mt-4 font-display text-xl text-ink">You&rsquo;ve used your free scan</p>
        <p className="mt-2 text-sm text-ink/60">Free scans are limited to one per browser.</p>
        <Link
          href="/submit?service=resume-review"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ledger px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ledgerLight"
        >
          Get a full expert review — $49
        </Link>
      </div>
    );
  }

  if (findings) {
    return (
      <div className="mt-10 space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">{wordCount} words scanned</p>
        {findings.map((f) => (
          <div key={f.id} className="flex items-start gap-3 rounded-xl border border-ink/10 bg-white p-4">
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
        ))}

        <div className="flex items-start gap-3 rounded-xl border border-dashed border-ink/20 bg-paper p-4">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-ink/40" />
          <div>
            <p className="text-sm font-medium text-ink/70">
              Bullet-by-bullet rewrites, deeper ATS formatting check, role-specific feedback
            </p>
            <p className="text-sm text-ink/50">Unlocked with a full expert review.</p>
          </div>
        </div>

        <Link
          href="/submit?service=resume-review"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-ledger px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ledgerLight"
        >
          Get the full review — $49
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <textarea
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the text of your resume here…"
        rows={12}
        className="w-full rounded-xl border border-ink/15 bg-white p-4 text-sm text-ink placeholder:text-ink/30 focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
      />
      {error && <p className="mt-2 text-sm text-pen">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
      >
        {loading ? 'Scanning…' : 'Run free scan'}
      </button>
    </form>
  );
}
