import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink"
        >
          <span className="h-2 w-2 rounded-full bg-go" />
          Callback
        </Link>
        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.15em] text-ink/60 sm:flex">
          <Link href="/#how-it-works" className="transition-colors hover:text-ink">
            How it works
          </Link>
          <Link href="/#quiz" className="transition-colors hover:text-ink">
            Not sure?
          </Link>
          <Link href="/#pricing" className="transition-colors hover:text-ink">
            Pricing
          </Link>
          <Link href="/demo" className="transition-colors hover:text-ink">
            Free scan
          </Link>
          <Link href="/#faq" className="transition-colors hover:text-ink">
            FAQ
          </Link>
        </nav>
        <Link
          href="/#pricing"
          className="rounded-full bg-ledger px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-paper transition-colors hover:bg-ledgerLight"
        >
          Get feedback
        </Link>
      </div>
    </header>
  );
}
