import type { CheckTier } from './tiers';

// This engine is plain pattern-matching — regexes and word lists, nothing
// generative, nothing that "understands" the resume. That's a deliberate
// choice, not a limitation to hide: it means every finding below can point
// at the exact text that triggered it, instead of a vague AI-style verdict.

export interface Snippet {
  before: string;
  match: string;
  after: string;
}

export interface Finding {
  id: string;
  label: string;
  status: 'good' | 'warn';
  minTier: CheckTier;
  detail: string;
  snippets?: Snippet[];
}

export interface CheckResult {
  wordCount: number;
  findings: Finding[];
}

const WEAK_PHRASES = [
  'responsible for', 'duties included', 'helped with', 'worked on',
  'in charge of', 'assisted with',
];

const CLICHES = [
  'team player', 'hard worker', 'detail oriented', 'detail-oriented',
  'results-driven', 'results driven', 'self-starter', 'go-getter',
  'think outside the box', 'synergy', 'passionate about',
];

const STRONG_VERBS = [
  'led', 'built', 'launched', 'designed', 'reduced', 'increased', 'created',
  'drove', 'delivered', 'owned', 'shipped', 'managed', 'grew', 'cut',
  'improved', 'negotiated', 'scaled', 'founded', 'automated',
];

const SECTION_HEADERS = ['experience', 'education', 'skills', 'projects', 'summary'];

const STOPWORDS = new Set([
  'the', 'and', 'a', 'to', 'of', 'in', 'for', 'on', 'with', 'as', 'at',
  'by', 'an', 'is', 'was', 'were', 'be', 'this', 'that', 'from', 'or',
]);

function extractSnippets(text: string, regex: RegExp, max = 2): Snippet[] {
  const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
  const re = new RegExp(regex.source, flags);
  const results: Snippet[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) && results.length < max) {
    const idx = m.index;
    const lineStart = text.lastIndexOf('\n', idx) + 1;
    let lineEnd = text.indexOf('\n', idx);
    if (lineEnd === -1) lineEnd = text.length;
    const line = text.slice(lineStart, lineEnd);
    const localIdx = idx - lineStart;
    results.push({
      before: line.slice(0, localIdx).trim(),
      match: m[0],
      after: line.slice(localIdx + m[0].length).trim(),
    });
    if (re.lastIndex === idx) re.lastIndex += 1;
  }
  return results;
}

function findStrongBullets(text: string, max = 2): Snippet[] {
  const results: Snippet[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const hasVerb = STRONG_VERBS.some((v) => new RegExp(`^[-•*]?\\s*${v}\\b`, 'i').test(line));
    const hasNumber = /(\$\s?\d|\d+%|\d+x\b)/i.test(line);
    if (hasVerb && hasNumber) {
      results.push({ before: '', match: line, after: '' });
      if (results.length >= max) break;
    }
  }
  return results;
}

export function runCheck(rawText: string): CheckResult {
  const text = rawText.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = text.toLowerCase();
  const findings: Finding[] = [];

  // --- FREE tier ---

  findings.push(
    wordCount < 150
      ? { id: 'length', label: 'Length', status: 'warn', minTier: 'free', detail: `Only ${wordCount} words — most one-page resumes land between 350–600. This may be reading as thin.` }
      : wordCount > 900
      ? { id: 'length', label: 'Length', status: 'warn', minTier: 'free', detail: `${wordCount} words is long. If this is more than two pages, it's worth trimming.` }
      : { id: 'length', label: 'Length', status: 'good', minTier: 'free', detail: `${wordCount} words — a reasonable length for a one-to-two page resume.` }
  );

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  findings.push({
    id: 'contact',
    label: 'Contact info',
    status: hasEmail ? 'good' : 'warn',
    minTier: 'free',
    detail: hasEmail ? 'Email address found.' : "Couldn't find an email address — make sure it's easy to spot near the top.",
  });

  const numberSnippets = extractSnippets(text, /(\$\s?\d[\d,]*|\d+%|\d+x\b)/gi, 2);
  findings.push({
    id: 'numbers',
    label: 'Quantified impact',
    status: numberSnippets.length ? 'good' : 'warn',
    minTier: 'free',
    detail: numberSnippets.length
      ? 'Found lines where you quantify impact — this is exactly what stands out to a reader.'
      : 'No numbers, percentages, or dollar figures found. Bullets that quantify impact tend to stand out more than ones that only describe duties.',
    snippets: numberSnippets.length ? numberSnippets : undefined,
  });

  const strongBullets = findStrongBullets(text, 2);
  findings.push({
    id: 'strong-bullets',
    label: 'Strong bullets',
    status: strongBullets.length ? 'good' : 'warn',
    minTier: 'free',
    detail: strongBullets.length
      ? 'These bullets pair a strong verb with a real number — this is the pattern to repeat.'
      : "No bullets found that combine a strong opening verb with a number. Pairing the two is usually the single biggest upgrade.",
    snippets: strongBullets.length ? strongBullets : undefined,
  });

  // --- BASIC tier ---

  const weakSnippets = extractSnippets(text, new RegExp(WEAK_PHRASES.join('|'), 'i'), 2);
  findings.push({
    id: 'weak-phrases',
    label: 'Generic phrasing',
    status: weakSnippets.length ? 'warn' : 'good',
    minTier: 'basic',
    detail: weakSnippets.length
      ? 'These phrases describe a duty rather than a result — they tend to read as filler.'
      : 'No obvious duty-description filler phrases detected.',
    snippets: weakSnippets.length ? weakSnippets : undefined,
  });

  const verbHits = STRONG_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(text));
  findings.push({
    id: 'verbs',
    label: 'Action verb variety',
    status: verbHits.length >= 3 ? 'good' : 'warn',
    minTier: 'basic',
    detail: verbHits.length >= 3
      ? `Spotted ${verbHits.length} varied action verbs (${verbHits.slice(0, 4).join(', ')}) — good range.`
      : 'Bullets could lean on a wider variety of strong opening verbs (led, built, cut, shipped, etc.).',
  });

  const foundHeaders = SECTION_HEADERS.filter((h) => lower.includes(h));
  findings.push({
    id: 'sections',
    label: 'Section structure',
    status: foundHeaders.length >= 2 ? 'good' : 'warn',
    minTier: 'basic',
    detail: foundHeaders.length >= 2
      ? `Found clear sections (${foundHeaders.join(', ')}) — easy to scan.`
      : "Couldn't find clearly labeled sections like Experience, Education, or Skills — headers help a fast reader orient.",
  });

  // --- ADVANCED tier ---

  const passiveSnippets = extractSnippets(text, /\b(was|were|is|are|been)\s+\w+ed\b/gi, 2);
  findings.push({
    id: 'passive',
    label: 'Passive voice',
    status: passiveSnippets.length ? 'warn' : 'good',
    minTier: 'advanced',
    detail: passiveSnippets.length
      ? 'These lines use passive voice — active voice ("I led," not "was assigned to lead") usually reads stronger.'
      : 'No obvious passive-voice constructions detected.',
    snippets: passiveSnippets.length ? passiveSnippets : undefined,
  });

  const bulletLines = text.split('\n').map((l) => l.trim()).filter((l) => /^[-•*]/.test(l));
  const verbStartCount = bulletLines.filter((l) =>
    STRONG_VERBS.some((v) => new RegExp(`^[-•*]\\s*${v}\\b`, 'i').test(l))
  ).length;
  findings.push({
    id: 'bullet-consistency',
    label: 'Bullet consistency',
    status: bulletLines.length === 0 || verbStartCount / Math.max(bulletLines.length, 1) > 0.5 ? 'good' : 'warn',
    minTier: 'advanced',
    detail: bulletLines.length === 0
      ? "Didn't detect bullet points — if this was pasted from a formatted resume, bullets may have been stripped."
      : `${verbStartCount} of ${bulletLines.length} bullets start with a clear action verb.`,
  });

  const clicheSnippets = extractSnippets(text, new RegExp(CLICHES.join('|'), 'i'), 2);
  findings.push({
    id: 'cliches',
    label: 'Buzzwords & clichés',
    status: clicheSnippets.length ? 'warn' : 'good',
    minTier: 'advanced',
    detail: clicheSnippets.length
      ? 'These are common resume clichés — they rarely differentiate you from other applicants.'
      : 'No overused buzzwords detected.',
    snippets: clicheSnippets.length ? clicheSnippets : undefined,
  });

  // --- SUPER tier ---

  const wordFreq = new Map<string, number>();
  for (const w of lower.match(/[a-z]{4,}/g) || []) {
    if (STOPWORDS.has(w)) continue;
    wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
  }
  let topWord: string | null = null;
  let topCount = 0;
  for (const [w, c] of wordFreq) {
    if (c > topCount) {
      topWord = w;
      topCount = c;
    }
  }
  findings.push({
    id: 'repetition',
    label: 'Word repetition',
    status: topCount >= 6 ? 'warn' : 'good',
    minTier: 'super',
    detail: topCount >= 6 && topWord
      ? `"${topWord}" appears ${topCount} times — consider swapping in synonyms for variety.`
      : 'No single word appears often enough to feel repetitive.',
  });

  const bulletWordCounts = bulletLines.map((l) => l.split(/\s+/).filter(Boolean).length);
  const longBullets = bulletWordCounts.filter((c) => c > 28).length;
  findings.push({
    id: 'readability',
    label: 'Bullet length',
    status: longBullets === 0 ? 'good' : 'warn',
    minTier: 'super',
    detail: longBullets === 0
      ? 'Bullets are a scannable length.'
      : `${longBullets} bullet${longBullets === 1 ? '' : 's'} run long — bullets over ~28 words get skimmed, not read.`,
  });

  return { wordCount, findings };
}
