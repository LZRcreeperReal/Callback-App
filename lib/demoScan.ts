// Lightweight, deterministic heuristic checks for the free demo.
// This is intentionally NOT an AI call or a real ATS engine — it's a handful
// of pattern checks meant to be "somewhat helpful," not authoritative. Keep
// the copy humble so it doesn't overclaim accuracy.

export interface DemoFinding {
  id: string;
  label: string;
  status: 'good' | 'warn';
  detail: string;
}

export interface DemoScanResult {
  wordCount: number;
  findings: DemoFinding[];
}

const WEAK_PHRASES = [
  'responsible for',
  'duties included',
  'helped with',
  'worked on',
  'team player',
  'hard worker',
  'detail oriented',
  'detail-oriented',
  'assisted with',
  'in charge of',
];

const STRONG_VERBS = [
  'led', 'built', 'launched', 'designed', 'reduced', 'increased', 'created',
  'drove', 'delivered', 'owned', 'shipped', 'managed', 'grew', 'cut',
  'improved', 'negotiated', 'scaled', 'founded', 'automated',
];

export function scanResume(rawText: string): DemoScanResult {
  const text = rawText.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = text.toLowerCase();

  const findings: DemoFinding[] = [];

  // Length
  if (wordCount < 150) {
    findings.push({
      id: 'length',
      label: 'Length',
      status: 'warn',
      detail: `Only ${wordCount} words. Most one-page resumes land between 350–600 — yours may be reading as thin.`,
    });
  } else if (wordCount > 900) {
    findings.push({
      id: 'length',
      label: 'Length',
      status: 'warn',
      detail: `${wordCount} words is long. If this is more than two pages, it's worth trimming.`,
    });
  } else {
    findings.push({
      id: 'length',
      label: 'Length',
      status: 'good',
      detail: `${wordCount} words — a reasonable length for a one-to-two page resume.`,
    });
  }

  // Quantified impact
  const numberMatches = text.match(/(\$\s?\d|\d+%|\d+x\b)/gi) || [];
  if (numberMatches.length === 0) {
    findings.push({
      id: 'numbers',
      label: 'Quantified impact',
      status: 'warn',
      detail:
        'No numbers, percentages, or dollar figures found. Bullets that quantify impact tend to stand out more than ones that only describe duties.',
    });
  } else {
    findings.push({
      id: 'numbers',
      label: 'Quantified impact',
      status: 'good',
      detail: `Found ${numberMatches.length} metric${numberMatches.length === 1 ? '' : 's'} — good sign you're quantifying results.`,
    });
  }

  // Generic phrasing
  const weakHits = WEAK_PHRASES.filter((p) => lower.includes(p));
  if (weakHits.length > 0) {
    findings.push({
      id: 'weak-phrases',
      label: 'Generic phrasing',
      status: 'warn',
      detail: `Found phrasing like "${weakHits[0]}" that tends to read as filler rather than impact.`,
    });
  } else {
    findings.push({
      id: 'weak-phrases',
      label: 'Generic phrasing',
      status: 'good',
      detail: 'No obvious filler phrases detected.',
    });
  }

  // Action verbs
  const verbHits = STRONG_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(text));
  if (verbHits.length < 3) {
    findings.push({
      id: 'verbs',
      label: 'Action verbs',
      status: 'warn',
      detail: 'Bullets could lean on a wider variety of strong opening verbs (led, built, cut, shipped, etc.).',
    });
  } else {
    findings.push({
      id: 'verbs',
      label: 'Action verbs',
      status: 'good',
      detail: `Spotted ${verbHits.length} varied action verbs — good range.`,
    });
  }

  // Contact info
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  findings.push({
    id: 'contact',
    label: 'Contact info',
    status: hasEmail ? 'good' : 'warn',
    detail: hasEmail
      ? 'Email address found.'
      : "Couldn't find an email address — make sure it's easy to spot near the top.",
  });

  return { wordCount, findings };
}
