import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CheckTier } from '@/lib/tiers';
import {
  CREDIT_COOKIES,
  CREDIT_COOKIE_OPTS,
  CLAIMED_SESSIONS_COOKIE,
  MAX_CLAIMED_HISTORY,
  readCredit,
} from '@/lib/creditCookies';

export async function POST(req: NextRequest) {
  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  const sessionId = body.sessionId;
  if (!sessionId) {
    return NextResponse.json({ error: 'missing-session' }, { status: 400 });
  }

  const claimedRaw = req.cookies.get(CLAIMED_SESSIONS_COOKIE)?.value || '';
  const claimed = claimedRaw ? claimedRaw.split(',').filter(Boolean) : [];
  if (claimed.includes(sessionId)) {
    return NextResponse.json(
      { error: 'already-claimed', message: 'This purchase was already applied to your account.' },
      { status: 400 }
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: 'invalid-session', message: 'Could not find that checkout session.' }, { status: 400 });
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'not-paid', message: 'This session has not been paid yet.' }, { status: 400 });
  }

  const tier = session.metadata?.tier as CheckTier | undefined;
  if (!tier || !(tier in CREDIT_COOKIES) || tier === 'free') {
    return NextResponse.json({ error: 'unknown-tier' }, { status: 400 });
  }

  const current = readCredit(req, tier);
  const updatedClaimed = [...claimed, sessionId].slice(-MAX_CLAIMED_HISTORY);

  const res = NextResponse.json({ tier, remaining: current + 1 });
  res.cookies.set(CREDIT_COOKIES[tier], String(current + 1), CREDIT_COOKIE_OPTS);
  res.cookies.set(CLAIMED_SESSIONS_COOKIE, updatedClaimed.join(','), CREDIT_COOKIE_OPTS);
  return res;
}
