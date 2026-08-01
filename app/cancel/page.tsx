import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Payment cancelled — Callback',
};

export default function CancelPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-6 py-20 text-center sm:py-28">
        <h1 className="font-display text-3xl font-semibold text-ink">Payment cancelled</h1>
        <p className="mt-3 leading-relaxed text-ink/70">
          No charge was made. Your details weren&rsquo;t saved — you can start over whenever you&rsquo;re ready.
        </p>
        <Link
          href="/buy"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Try again
        </Link>
      </main>
      <Footer />
    </>
  );
}
