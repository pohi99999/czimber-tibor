// Security audit 2026-10-15: /api/chat (the site's Claude credit) and /api/ajanlat (Tibor's mailbox)
// accepted POSTs from any web page. request.json() ignores the Content-Type, so another site could
// send text/plain "simple" requests from its own visitors' browsers (no CORS preflight), each visitor
// with a fresh IP, i.e. a fresh rate-limit bucket. A browser always says where a request comes from
// (Sec-Fetch-Site, Origin); a request from another site is refused. A request with neither header
// is not from a browser page and is left to the rate limit.

type Headers = { get(name: string): string | null };

/** true when a browser sent this request from a page of another site. */
export function isCrossSite(headers: Headers): boolean {
  const site = headers.get('sec-fetch-site');
  if (site === 'cross-site') return true;
  const origin = headers.get('origin');
  if (!origin) return false;
  const host = (headers.get('x-forwarded-host') || headers.get('host') || '').split(',')[0].trim().toLowerCase();
  try {
    return !host || new URL(origin).host.toLowerCase() !== host;
  } catch {
    return true; // "null" (sandboxed iframe, data: URL) or garbage
  }
}
