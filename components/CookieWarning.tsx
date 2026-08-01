import { AlertTriangle } from 'lucide-react';

export default function CookieWarning() {
  return (
    <div className="flex items-start gap-3 rounded-xl border-2 border-pen/30 bg-pen/5 p-5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-pen" />
      <div className="text-sm leading-relaxed text-ink/80">
        <p className="font-semibold text-ink">Your checks live in this browser only.</p>
        <p className="mt-1">
          There's no account or login — free and purchased checks are tracked with cookies on this
          device. If you clear cookies, switch browsers, use a different device, or browse in
          private/incognito mode, any checks you've paid for will be lost and we have no way to
          restore them.
        </p>
        <p className="mt-2 font-medium text-ink">To keep your checks safe:</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          <li>Keep cookies enabled for this site</li>
          <li>Use the same browser and device you purchased from</li>
          <li>Avoid clearing browsing data while you still have unused checks</li>
        </ul>
      </div>
    </div>
  );
}
