import { NextRequest, NextResponse } from 'next/server';
import { runCheck } from '@/lib/checkEngine';
import { TIER_LEVEL, CheckTier } from '@/lib/tiers';
import { CREDIT_COOKIES, CREDIT_COOKIE_OPTS, readCredit } from '@/lib/creditCookies';

const VALID_TIERS: CheckTier[] = ['free', 'basic', 'advanced', 'super'];

export async function POST(req: NextRequest) {
  let body: { tier?: string; resumeText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad-request', message: 'Could not read your submission.' }, { status: 400 });
  }

  const tier = body.tier as CheckTier;
  const resumeText = (body.resumeText || '').toString();

  if (!tier || !VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: 'bad-tier', message: 'Unknown check tier.' }, { status: 400 });
  }
  if (resumeText.trim().length < 40) {
    return NextResponse.json(
      { error: 'too-short', message: 'Paste a bit more of your resume — at least a few bullet points.' },
      { status: 400 }
    );
  }

  const remaining = readCredit(req, tier);
  if (remaining < 1) {
    return NextResponse.json(
      { error: 'no-credit', message: `You don't have a ${tier} check available.`, tier },
      { status: 402 }
    );
  }

  const full = runCheck(resumeText.slice(0, 20000));
  const userLevel = TIER_LEVEL[tier];

  const findings = full.findings.map((f) => {
    const requiredLevel = TIER_LEVEL[f.minTier];
    if (requiredLevel > userLevel) {
      // Locked content is stripped entirely — not hidden with CSS — so it
      // can't be recovered by inspecting the response in devtools.
      return { id: f.id, label: f.label, locked: true as const, requiredTier: f.minTier };
    }
    return {
      id: f.id,
      label: f.label,
      status: f.status,
      detail: f.detail,
      snippets: f.snippets,
      locked: false as const,
    };
  });

  const res = NextResponse.json({ wordCount: full.wordCount, findings, tier, remaining: remaining - 1 });
  res.cookies.set(CREDIT_COOKIES[tier], String(remaining - 1), CREDIT_COOKIE_OPTS);
  return res;
}
