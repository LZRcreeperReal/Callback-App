import type { NextRequest } from 'next/server';
import type { CheckTier } from './tiers';

export const CREDIT_COOKIES: Record<CheckTier, string> = {
  free: 'callback_credit_free',
  basic: 'callback_credit_basic',
  advanced: 'callback_credit_advanced',
  super: 'callback_credit_super',
};

export const SHARE_BONUS_COOKIE = 'callback_share_bonus_count';
export const CLAIMED_SESSIONS_COOKIE = 'callback_claimed_sessions';
export const MAX_SHARE_BONUSES = 3;
export const MAX_CLAIMED_HISTORY = 20;

// Everyone starts with 1 free check without ever needing to set a cookie —
// only the free tier has a non-zero default.
const DEFAULTS: Record<CheckTier, number> = { free: 1, basic: 0, advanced: 0, super: 0 };

export function readCredit(req: NextRequest, tier: CheckTier): number {
  const raw = req.cookies.get(CREDIT_COOKIES[tier])?.value;
  if (raw === undefined) return DEFAULTS[tier];
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export const CREDIT_COOKIE_OPTS = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
  sameSite: 'lax' as const,
};
