import { NextRequest, NextResponse } from 'next/server';
import { scanResume } from '@/lib/demoScan';

const COOKIE_NAME = 'callback_demo_used';
const MAX_CHARS = 20000;
const MIN_CHARS = 40;

export async function POST(req: NextRequest) {
  const alreadyUsed = req.cookies.get(COOKIE_NAME)?.value === '1';
  if (alreadyUsed) {
    return NextResponse.json(
      { error: 'demo-used', message: "You've already used your free scan on this browser." },
      { status: 403 }
    );
  }

  let body: { resumeText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad-request', message: 'Could not read your submission.' }, { status: 400 });
  }

  const resumeText = (body.resumeText || '').toString();

  if (resumeText.trim().length < MIN_CHARS) {
    return NextResponse.json(
      { error: 'too-short', message: 'Paste a bit more of your resume — at least a few bullet points.' },
      { status: 400 }
    );
  }

  const trimmedText = resumeText.slice(0, MAX_CHARS);
  const result = scanResume(trimmedText);

  const res = NextResponse.json({ result });
  // NOTE: this is a soft, cookie-based gate — clearing cookies or using a
  // private window resets it. Good enough friction for an MVP; if this
  // matters more later, pair it with a per-IP rate limit (e.g. Vercel KV
  // or Upstash) for a harder limit.
  res.cookies.set(COOKIE_NAME, '1', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });

  return res;
}
