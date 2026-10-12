import { NextRequest, NextResponse } from 'next/server';
import { chatReply, asLang, busyMessage } from '@/lib/chat';
import { createLimiter, clientKey } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const limit = createLimiter(30);

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const wait = limit(clientKey(request.headers));
  if (wait) {
    return NextResponse.json({ reply: busyMessage(asLang((raw as { locale?: unknown })?.locale)) }, { status: 200, headers: { 'Retry-After': String(wait) } });
  }
  const result = await chatReply(raw, process.env.GEMINI_API_KEY, (url, init) => fetch(url, init));
  if (result.status !== 200) console.error(`chat status=${result.status}`);
  return NextResponse.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
}
