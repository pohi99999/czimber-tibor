import { NextRequest, NextResponse } from 'next/server';
import { deliverLead } from '@/lib/lead';
import { createLimiter, clientKey } from '@/lib/rateLimit';
import { isCrossSite } from '@/lib/origin';

export const runtime = 'nodejs';

const limit = createLimiter(8);
const MAX_BODY = 20000;

export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  if (isCrossSite(request.headers)) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403, headers });
  const rawText = await request.text();
  if (rawText.length > MAX_BODY) return NextResponse.json({ ok: false, error: 'bad_body' }, { status: 400, headers });
  let raw: unknown;
  try {
    raw = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_body' }, { status: 400, headers });
  }
  // honeypot: a bot fills the hidden field, a human never sees it; it gets a success and learns nothing
  if (typeof (raw as { website?: unknown })?.website === 'string' && (raw as { website: string }).website.trim()) {
    return NextResponse.json({ ok: true }, { status: 200, headers });
  }
  const wait = limit(clientKey(request.headers));
  if (wait) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429, headers: { ...headers, 'Retry-After': String(wait) } });
  const env = { RESEND_API_KEY: process.env.RESEND_API_KEY, LEAD_FROM: process.env.LEAD_FROM, LEAD_TO: process.env.LEAD_TO };
  const result = await deliverLead(raw, env, (url, init) => fetch(url, init));
  return NextResponse.json(result.body, { status: result.status, headers });
}
