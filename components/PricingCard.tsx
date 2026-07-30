import Link from 'next/link';
import { Check } from 'lucide-react';
import type { Service } from '@/lib/services';

export default function PricingCard({
  service,
  featured = false,
}: {
  service: Service;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        featured ? 'border-ledger bg-ledger text-paper' : 'border-ink/10 bg-white text-ink'
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-highlighter px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wide text-ink">
          Best value
        </span>
      )}
      <p className={`font-mono text-xs uppercase tracking-[0.2em] ${featured ? 'text-paper/60' : 'text-ink/50'}`}>
        {service.turnaround}
      </p>
      <h3 className="mt-3 font-display text-2xl font-semibold">{service.name}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${featured ? 'text-paper/80' : 'text-ink/60'}`}>
        {service.description}
      </p>
      <p className="mt-6 font-display text-4xl font-semibold">
        ${(service.price / 100).toFixed(0)}
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {service.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? 'text-highlighter' : 'text-go'}`} />
            <span className={featured ? 'text-paper/90' : 'text-ink/70'}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/submit?service=${service.id}`}
        className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${
          featured ? 'bg-paper text-ink hover:bg-paper/90' : 'bg-ink text-paper hover:bg-ink/90'
        }`}
      >
        Get started
      </Link>
    </div>
  );
}
