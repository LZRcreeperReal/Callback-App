interface SnippetProps {
  before: string;
  match: string;
  after: string;
  status: 'good' | 'warn';
}

export default function SnippetQuote({ before, match, after, status }: SnippetProps) {
  return (
    <p className="mt-2 rounded-md bg-paper px-3 py-2 font-mono text-xs leading-relaxed text-ink/70">
      {before && <span>{before} </span>}
      <mark
        className={`rounded px-1 ${
          status === 'good' ? 'bg-go/20 text-go' : 'bg-pen/15 text-pen'
        }`}
      >
        {match}
      </mark>
      {after && <span> {after}</span>}
    </p>
  );
}
