import { NextRequest, NextResponse } from 'next/server';
import { chatReply, asLang, busyMessage } from '@/lib/chat';
import { createLimiter, clientKey } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const limit = createLimiter(30);
// site-wide ceiling per instance on top of the per-IP one (security audit 2026-10-15): bounds the
// Claude bill when the requests come from many addresses; past it the visitor gets the busy text
const siteLimit = createLimiter(300);

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const wait = limit(clientKey(request.headers)) || siteLimit('site');
  if (wait) {
    return NextResponse.json({ reply: busyMessage(asLang((raw as { locale?: unknown })?.locale)) }, { status: 200, headers: { 'Retry-After': String(wait) } });
  }
  const result = await chatReply(raw, process.env.ANTHROPIC_API_KEY, (url, init) => fetch(url, init), process.env.ANTHROPIC_MODEL);
  // the reason only (ok, busy_429, claude_400, timeout, ...): never the question or the answer
  console.log(`chat status=${result.status} reason=${result.reason}`);
  return NextResponse.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
}
