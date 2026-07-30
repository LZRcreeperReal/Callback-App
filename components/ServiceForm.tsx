'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SERVICES, ServiceId } from '@/lib/services';

const SERVICE_LIST = Object.values(SERVICES);

export default function ServiceForm() {
  const searchParams = useSearchParams();
  const initial = searchParams.get('service') as ServiceId | null;

  const [serviceId, setServiceId] = useState<ServiceId>(
    initial && SERVICES[initial] ? initial : 'resume-review'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsResumeLink = serviceId !== 'mock-interview';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, name, email, role, resumeLink, notes }),
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
        {SERVICE_LIST.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setServiceId(s.id)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              serviceId === s.id ? 'border-ledger bg-ledger/5' : 'border-ink/10 bg-white hover:border-ink/25'
            }`}
          >
            <p className="font-display text-base font-semibold text-ink">{s.name}</p>
            <p className="mt-1 font-mono text-sm text-ink/60">${(s.price / 100).toFixed(0)}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Target role or company</span>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Senior PM at a mid-size B2B SaaS company"
          className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink/30 focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
        />
      </label>

      {needsResumeLink && (
        <label className="block">
          <span className="text-sm font-medium text-ink">
            Resume link {serviceId === 'resume-review' ? '(required)' : '(optional)'}
          </span>
          <input
            required={serviceId === 'resume-review'}
            value={resumeLink}
            onChange={(e) => setResumeLink(e.target.value)}
            placeholder="Google Drive or Dropbox link, set to 'anyone with the link'"
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink/30 focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-medium text-ink">Anything specific you want feedback on?</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Optional"
          className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink/30 focus:border-ledger focus:outline-none focus:ring-2 focus:ring-ledger/20"
        />
      </label>

      {error && <p className="text-sm text-pen">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
      >
        {loading ? 'Redirecting to payment…' : `Continue to payment — $${(SERVICES[serviceId].price / 100).toFixed(0)}`}
      </button>
    </form>
  );
}
