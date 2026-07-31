export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink">
          <span className="h-2 w-2 rounded-full bg-go" />
          Callback
        </div>
        <p className="text-sm text-ink/50">
          Async feedback from people who&rsquo;ve actually hired. © {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
}
