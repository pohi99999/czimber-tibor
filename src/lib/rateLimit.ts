// Best-effort per-IP limit for the two public endpoints (chat: the shared Claude credit; quote form:
// the mailbox). The counter lives in the memory of one serverless instance, so it slows a script
// down without being a hard guarantee.

const WINDOW_MS = 60 * 60 * 1000;

export function createLimiter(max: number, windowMs = WINDOW_MS) {
  const hits = new Map<string, number[]>();
  /** 0 when the request may go on, else the seconds until the oldest hit leaves the window. */
  return function check(key: string, now = Date.now()): number {
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
      if (hits.size > 20000) hits.clear();
    }
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
    }
    recent.push(now);
    hits.set(key, recent);
    return 0;
  };
}

/** The client IP as Vercel forwards it; one bucket for all when there is none. */
export function clientKey(headers: { get(name: string): string | null }): string {
  const raw = headers.get('x-vercel-forwarded-for') || headers.get('x-real-ip') || headers.get('x-forwarded-for') || '';
  return raw.split(',')[0].trim().slice(0, 64) || 'unknown';
}
