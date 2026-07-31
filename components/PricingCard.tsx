import Link from 'next/link';
import { Check } from 'lucide-react';
import type { Service } from '@/lib/services';

const ROTATIONS = ['-rotate-1', 'rotate-0', 'rotate-1'];

export default function PricingCard({
  service,
  featured = false,
  index = 0,
}: {
  service: Service;
  featured?: boolean;
  index?: number;
}) {
  return (
    <div className={`relative ${ROTATIONS[index % ROTATIONS.length]} transition-transform hover:rotate-0`}>
      {/* file-tab */}
      <div
        className={`absolute -top-3 left-6 rounded-t-md px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${
          featured ? 'bg-ledger text-paper' : 'bg-ink/10 text-ink/50'
        }`}
      >
        Tier {String(index + 1).padStart(2, '0')}
      </div>

      <div
        className={`relative flex flex-col overflow-hidden rounded-lg border p-8 pt-10 shadow-sm ${
          featured ? 'border-ledger bg-ledger text-paper' : 'border-ink/10 bg-white text-ink'
        }`}
      >
        {featured && (
          <div className="absolute -right-9 top-7 w-36 rotate-45 bg-highlighter py-1 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-ink">
            Best value
          </div>
        )}

        <h3 className="font-display text-2xl font-semibold">{service.name}</h3>
        <p className={`mt-1 font-mono text-xs uppercase tracking-[0.15em] ${featured ? 'text-paper/60' : 'text-ink/40'}`}>
          {service.turnaround}
        </p>
        <p className={`mt-4 text-sm leading-relaxed ${featured ? 'text-paper/80' : 'text-ink/60'}`}>
          {service.description}
        </p>

        <p className="mt-6 font-display text-4xl font-semibold">${(service.price / 100).toFixed(0)}</p>

        <ul className="mt-6 flex-1 space-y-3">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? 'text-highlighter' : 'text-go'}`} />
              <span className={featured ? 'text-paper/90' : 'text-ink/70'}>{f}</span>
            </li>
          ))}
        </ul>

        {/* perforation: punch holes + dashed tear line */}
        <div className="relative my-6">
          <div
            className={`absolute -left-8 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-paper`}
            aria-hidden
          />
          <div
            className={`absolute -right-8 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-paper`}
            aria-hidden
          />
          <div className={`border-t border-dashed ${featured ? 'border-paper/30' : 'border-ink/20'}`} />
        </div>

        <Link
          href={`/submit?service=${service.id}`}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${
            featured ? 'bg-paper text-ink hover:bg-paper/90' : 'bg-ink text-paper hover:bg-ink/90'
          }`}
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
