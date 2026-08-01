export type CheckTier = 'free' | 'basic' | 'advanced' | 'super';

export const TIER_ORDER: CheckTier[] = ['free', 'basic', 'advanced', 'super'];

export const TIER_LEVEL: Record<CheckTier, number> = {
  free: 0,
  basic: 1,
  advanced: 2,
  super: 3,
};

export interface TierInfo {
  id: CheckTier;
  name: string;
  price: number; // cents (USD); 0 for free
  description: string;
  features: string[];
}

export const TIERS: Record<CheckTier, TierInfo> = {
  free: {
    id: 'free',
    name: 'Free Check',
    price: 0,
    description: 'A real look at a couple of things in your resume — not a watered-down teaser.',
    features: [
      'A few real findings, with the actual sentence highlighted',
      '1 free check to start',
      'Earn bonus free checks by sharing the link',
    ],
  },
  basic: {
    id: 'basic',
    name: 'Basic Check',
    price: 900,
    description: 'Everything in Free, plus the checks that catch generic, forgettable phrasing.',
    features: [
      'Everything in Free',
      'Generic phrasing detector',
      'Action verb variety check',
      'Section structure check',
    ],
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced Check',
    price: 1900,
    description: 'Everything in Basic, plus the checks that catch what a skim-reader would flag.',
    features: [
      'Everything in Basic',
      'Passive voice detector',
      'Bullet-point consistency check',
      'Buzzword / cliché detector',
    ],
  },
  super: {
    id: 'super',
    name: 'Super Check',
    price: 2900,
    description: 'Every check we run, including the ones about repetition and readability.',
    features: [
      'Everything in Advanced',
      'Word-repetition check',
      'Readability / sentence-length check',
      'Every current and future check included',
    ],
  },
};
