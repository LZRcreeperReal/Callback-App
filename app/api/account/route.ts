import { NextRequest, NextResponse } from 'next/server';
import { readCredit } from '@/lib/creditCookies';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    free: readCredit(req, 'free'),
    basic: readCredit(req, 'basic'),
    advanced: readCredit(req, 'advanced'),
    super: readCredit(req, 'super'),
  });
}
