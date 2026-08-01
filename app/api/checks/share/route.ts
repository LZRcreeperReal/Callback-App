import { NextRequest, NextResponse } from 'next/server';
import { CREDIT_COOKIES, CREDIT_COOKIE_OPTS, SHARE_BONUS_COOKIE, MAX_SHARE_BONUSES, readCredit } from '@/lib/creditCookies';

export async function POST(req: NextRequest) {
  const bonusUsed = Number(req.cookies.get(SHARE_BONUS_COOKIE)?.value ?? '0');
  const safeBonusUsed = Number.isFinite(bonusUsed) ? bonusUsed : 0;

  if (safeBonusUsed >= MAX_SHARE_BONUSES) {
    return NextResponse.json(
      { error: 'limit-reached', message: "You've earned the max number of bonus free checks." },
      { status: 400 }
    );
  }

  const currentFree = readCredit(req, 'free');
  const newFree = currentFree + 1;

  const res = NextResponse.json({
    free: newFree,
    bonusesEarned: safeBonusUsed + 1,
    bonusesMax: MAX_SHARE_BONUSES,
  });
  res.cookies.set(CREDIT_COOKIES.free, String(newFree), CREDIT_COOKIE_OPTS);
  res.cookies.set(SHARE_BONUS_COOKIE, String(safeBonusUsed + 1), CREDIT_COOKIE_OPTS);
  return res;
}
