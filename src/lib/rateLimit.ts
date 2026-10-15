// Best-effort per-IP limit for the two public endpoints (chat: the shared Claude credit; quote form:
// the mailbox). The counter lives in the memory of one serverless instance, so it slows a script
// down without being a hard guarantee.
// Security audit 2026-10-15: an IPv6 client owns a whole /64 (2^64 addresses), so IPv6 keys are cut
// to their /64; a flood of fresh keys no longer wipes every counter (it used to clear the map at
// 20000 keys, resetting the limit for everyone); the chat also has a site-wide ceiling per instance.

const WINDOW_MS = 60 * 60 * 1000;

export function createLimiter(max: number, windowMs = WINDOW_MS) {
  const hits = new Map<string, number[]>();
  /** 0 when the request may go on, else the seconds until the oldest hit leaves the window. */
  return function check(key: string, now = Date.now()): number {
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
      // still too many live keys: drop the ones under the limit, never a key that is being blocked
      for (const [k, v] of hits) {
        if (hits.size <= 20000) break;
        if (v.length < max) hits.delete(k);
      }
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

/** An IPv6 address -> its /64 prefix (the unit one subscriber or one VPS gets); IPv4 as is. */
export function ipBucket(ip: string): string {
  if (!ip.includes(':')) return ip;
  const addr = ip.replace(/^\[|\](:\d+)?$/g, '').split('%')[0].toLowerCase();
  if (/^::ffff:\d+\.\d+\.\d+\.\d+$/.test(addr)) return addr.slice(7); // IPv4-mapped
  const [head, tail] = addr.split('::');
  const left = head ? head.split(':') : [];
  const right = tail !== undefined && tail ? tail.split(':') : [];
  const groups = tail === undefined ? left : [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right];
  return `${groups.slice(0, 4).map((g) => (g || '0').replace(/^0+(?=.)/, '')).join(':')}::/64`;
}

/** The client IP as Vercel forwards it (IPv6 cut to its /64); one bucket for all when there is none. */
export function clientKey(headers: { get(name: string): string | null }): string {
  const raw = headers.get('x-vercel-forwarded-for') || headers.get('x-real-ip') || headers.get('x-forwarded-for') || '';
  return ipBucket(raw.split(',')[0].trim().slice(0, 64)) || 'unknown';
}
