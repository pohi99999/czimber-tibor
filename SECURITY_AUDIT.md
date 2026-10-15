# Security audit — czimber-tibor.vercel.app

Date: 2026-10-15 · Scope: the whole repository at `a61e684` (main), its 24-commit git history and its npm dependency tree.
Method: manual review of every server entry point (2 API routes, the `proxy.ts` i18n middleware, layouts/pages), the chat and lead libraries, the client widgets that talk to them, git history scans for secrets and personal data, `npm audit`, and a local production build probed with curl.

What the site has, for context: public pages (hu/de/en), `POST /api/chat` (Claude on the site's `ANTHROPIC_API_KEY`), `POST /api/ajanlat` (quote form → e-mail through Resend on `RESEND_API_KEY` / `LEAD_FROM` / `LEAD_TO`). There are **no** admin routes, logins, cookies, server actions, database, payment code or price calculation. Hosting is Vercel.

## Summary

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| H1 | High | One chat request could send ~1 MB (hundreds of thousands of tokens) to Claude | **Fixed** (0007672) |
| H2 | High | Rate limit escapable by IPv6 rotation, resettable by flooding; no site-wide chat ceiling | **Fixed** (9816d0c) |
| H3 | High | Chat and quote endpoints accept cross-site POSTs (other sites can spend the credit / fill the mailbox via their visitors) | **Fixed** (ab9d7b3) |
| H4 | High (advisory: Critical) | `next@16.2.9` has 17 published advisories incl. image-optimizer RCE/SSRF and cache confusion | **Fixed** (040c6ec, → 16.3.8) |
| M1 | Medium | Rate limits live in one instance's memory; no hard spend cap on the Claude key | Recommendation |
| M2 | Medium | No security headers (CSP, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy) | Recommendation |
| M3 | Medium | `max_tokens` 8000 per chat answer makes each abusive request ~4× costlier than needed | Recommendation |
| L1 | Low | Chat widget renders model-written links with any `href` | Recommendation |
| L2 | Low | Client supplies the whole history, including "assistant" turns (jailbreak aid; no secrets to leak) | Recommendation |
| L3 | Low | Lead e-mail: CR/LF kept in the name (goes into the subject); `reply_to` is visitor-chosen | Recommendation |
| L4 | Low | `/api/chat` reads the body with no size cap (Vercel's 4.5 MB limit only) | Recommendation |
| L5 | Low | `clientKey` falls back to spoofable `x-real-ip` / `x-forwarded-for` (safe on Vercel only) | Recommendation |
| L6 | Low | Quote form spam protection is a honeypot + per-IP limit only | Recommendation |
| L7 | Low | Remaining `npm audit` items are build-time only | Recommendation |
| I1–I6 | Info | Secrets, personal data, cookies/analytics, redirects/SSRF, price logic, prompt leakage: clean | — |

---

## Fixed (Critical/High, small and safe fixes; one commit each, each with a test)

### H1 — Chat input-token amplification · High · fixed
- **Where:** `src/lib/chat.ts:70` (`toMessages`), reached from `src/app/api/chat/route.ts`.
- **Problem:** each incoming turn was cut to `MAX_TURN_CHARS` (2000), but consecutive same-role turns were then merged with **no** cap. 500 consecutive user messages became a single ~1,000,000-character turn (reproduced: `turns 1 chars 1000998`). The "last 10 turns" limit did not help, because the whole flood was one turn.
- **Exploit:** `curl -X POST /api/chat -d '{"messages":[{"role":"user","content":"xxxx…2000"}, … ×500]}'`. Each request bills up to the model's context window in input tokens on the site's key, 30 times per hour per IP (and see H2 for why "per IP" did not hold). Requests bigger than the context come back as a 400; anything just under it is billed in full.
- **Fix:** the merged turn is cut to its newest `MAX_TURN_CHARS`, so one request carries at most `MAX_TURNS × MAX_TURN_CHARS` = 20,000 characters. Test: `tests/chat.test.mjs` ("cannot merge past MAX_TURN_CHARS"); it fails on the old code.

### H2 — Rate limiter bypass and reset · High · fixed
- **Where:** `src/lib/rateLimit.ts` (`clientKey`, `createLimiter`), `src/app/api/chat/route.ts:8-11`, `src/app/api/ajanlat/route.ts:8`.
- **Problems and exploits:**
  1. Keys were full IP addresses. Any IPv6 host (a €3 VPS, most home connections) owns a /64 = 2^64 addresses; rotating the source address gives a fresh 30/hour chat budget (8/hour for the quote form) per request. Effectively unlimited.
  2. When the map passed 20,000 live keys it called `hits.clear()`, which reset **every** counter, including the attacker's own blocked one. Flooding with 20,000 cheap requests (or addresses) restored the full budget.
  3. There was no site-wide ceiling, so cost scaled linearly with the number of addresses.
- **Fix:** IPv6 keys are cut to their /64 (`ipBucket`); on overflow, only keys still under the limit are evicted, never a blocked key; `/api/chat` also checks a site-wide limiter (300 requests/hour per instance) and above it returns the existing friendly "busy" text with the phone number. Tests: `tests/rateLimit.test.mjs`.
- **What remains:** the limits are still per serverless instance (see M1).

### H3 — Cross-site POSTs to the chat and the quote form · High · fixed
- **Where:** `src/app/api/chat/route.ts:14`, `src/app/api/ajanlat/route.ts:13`, new `src/lib/origin.ts`.
- **Problem:** neither route checked where a request came from, and `request.json()` / `JSON.parse(text)` ignore `Content-Type`. A `fetch(..., {method:'POST', body: JSON.stringify(...)})` with the default `text/plain` content type is a CORS "simple request", so the browser sends it without a preflight. The response cannot be read, but the side effect (a billed Claude call, a sent e-mail) still happens.
- **Exploit:** any website, ad or forum embed adds a hidden script that, for each of its visitors, POSTs 30 chat requests and 8 quote forms to this site. Every visitor is a new IP and so a new rate-limit bucket. This turns someone else's traffic into an unbounded spend on the Claude credit (until the credit runs out and the chat goes dark for real customers) and a flood of fake leads in Tibor's inbox.
- **Fix:** `isCrossSite()` returns 403 when the browser marks the request `Sec-Fetch-Site: cross-site`, or when an `Origin` header names a different host than `Host` / `X-Forwarded-Host` (also `Origin: null`). Requests with neither header (curl, scripts) are not browser relays and stay under the rate limit. Tests: `tests/origin.test.mjs`. Checked on a local production build: a cross-site chat/quote POST gets 403, a same-origin one works as before.

### H4 — Vulnerable Next.js · High (advisories rated Critical) · fixed
- **Where:** `package.json` (`next` 16.2.9, `eslint-config-next` 16.2.9).
- **Problem:** `npm audit` lists 17 advisories for `next >=16.0.0 <16.3.8`, among them unauthenticated RCE in the Image Optimization API with AVIF files, SSRF in image optimization, response-cache confusion for requests with bodies, image-optimizer SVG DoS, and Server Function endpoint disclosure. It also pulled vulnerable `postcss`, `nanoid` and `sharp`.
- **Real exposure:** the site uses `next/image` with the optimizer on (`next.config.ts:7-9`), and `/api/*` takes request bodies. On Vercel the image optimization runs on Vercel's own service, which lowers the RCE risk, but the framework code is still deployed and some of the advisories (cache confusion, DoS) are not host-specific. Rated High, not Critical, for that reason.
- **Fix:** upgraded to `16.3.8`, the lowest release that clears every listed advisory (`16.4.x` was not needed). The lock file was regenerated. It had been out of sync with `package.json`, so `npm ci` failed before; it works now. Verified: `next build` succeeds, all 25 unit tests pass, `tsc --noEmit` is clean after the build, and `/`, `/de`, `/en`, legal pages, `robots.txt`, `sitemap.xml` and both API routes respond as before on a local production server. `npm run lint` shows 6 errors, all of them already on `main` and all in UI files this PR does not touch.

---

## Recommendations (not changed in this PR)

### M1 — No hard ceiling on Claude spend · Medium
- **Where:** `src/lib/rateLimit.ts:1-3` (by design: in-memory, per instance).
- **Scenario:** Vercel runs several instances in parallel and recycles them. Each instance has its own 30/IP and 300/site counters, so a distributed attacker can still spend N × 300 requests/hour. A cold start resets the counters.
- **Fix:** (a) set a monthly **spend limit on the Anthropic workspace** that owns `ANTHROPIC_API_KEY` (Console → Limits). This is the only real hard cap, and the code already turns "credit balance too low" into the friendly busy text. (b) Add a Vercel Firewall rate-limit rule on `/api/chat` and `/api/ajanlat`, or move the counters into a shared store (e.g. Upstash Redis). Both are configuration of external services, so they are left to the owner.

### M2 — Missing security headers · Medium
- **Where:** `next.config.ts` (no `headers()`); a production response only carries `X-Powered-By: Next.js`.
- **Scenario:** the page can be framed by any site (clickjacking the quote form's consent/submit, low impact). There is no CSP to contain an XSS, no `nosniff`, and the Referrer-Policy is left to the browser default.
- **Fix:** add to `next.config.ts`:
  ```ts
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // then a CSP: start with Content-Security-Policy-Report-Only and allow
      // 'self', www.youtube-nocookie.com + www.youtube.com (audio player), www.google.com (map embed),
      // and the inline JSON-LD/Next bootstrap scripts (nonce or 'unsafe-inline' for script-src)
    ]}];
  },
  ```
  The CSP was not added in this PR because the YouTube and Google Maps embeds need careful allow-listing and a wrong policy would break the live site. Roll it out in Report-Only mode first. HSTS is already sent by Vercel for `*.vercel.app`; add it on a custom domain.

### M3 — `max_tokens: 8000` per answer · Medium
- **Where:** `src/lib/chat.ts:17`.
- **Scenario:** answers are meant to be 5-6 sentences, but every request can bill up to 8000 output tokens (adaptive thinking included). A jailbroken "write me a long essay" request costs about 4× more than a legitimate one.
- **Fix:** lower it to ~2000–3000 after checking real answers (the code already treats `stop_reason: max_tokens` as a failure, so measure how often thinking hits the cap first).

### L1 — Model-written links rendered with any href · Low
- **Where:** `src/components/ui/AIAssistant.tsx:150-191` (`<a href={href} target="_blank">`).
- **Scenario:** a visitor who prompt-injects the model gets a clickable `[label](https://phish.example)` link in **their own** chat. No third-party content reaches the model, so there is no cross-user path. React 19 blocks `javascript:` URLs.
- **Fix:** render only `#anchor` links (the system prompt already allows only `[Ajánlatkérés](#quote)`) and show anything else as plain text.

### L2 — Client-controlled history, including assistant turns · Low
- **Where:** `src/lib/chat.ts:58-76`.
- **Scenario:** the client can forge earlier "assistant" turns to steer the model, for example to use the endpoint as a free general-purpose LLM, within H1–H3's now-tighter limits. The system prompt (`chat.ts:31`) contains only facts already published on the site, and the model has no tools or internal data, so **prompt leakage exposes nothing confidential**.
- **Fix (optional):** keep the history server-side, or sign assistant turns with an HMAC. Not worth the complexity unless abuse shows up in the logs (`chat status=… reason=…`).

### L3 — Lead e-mail fields · Low
- **Where:** `src/lib/lead.ts:36-38` (`clean` keeps `\n`, `\r`, `\t`), `:85` (name in the subject), `:135` (`reply_to` = visitor e-mail).
- **Scenario:** a name containing CR/LF reaches the subject. Resend's JSON API encodes headers, so this is not a header injection, but the subject can look odd. Anyone can submit a lead with someone else's e-mail address, so pressing "Reply" can mail an uninvolved person. The recipient (`LEAD_TO`) is fixed server-side: **no open relay**.
- **Fix:** strip `\r\n` from `name` and `phone`; in the e-mail body, note that the address is unverified.

### L4 — Unbounded chat request body · Low
- **Where:** `src/app/api/chat/route.ts:17` (`request.json()`).
- **Scenario:** a client can send up to Vercel's 4.5 MB per request, which is only parsing cost now that H1 caps what reaches Claude.
- **Fix:** read `request.text()` and reject anything above ~200 KB, as `/api/ajanlat` already does with 20 KB.

### L5 — IP header trust · Low
- **Where:** `src/lib/rateLimit.ts:46-48`.
- **Scenario:** on Vercel, `x-vercel-forwarded-for` / `x-forwarded-for` are set by the edge and cannot be spoofed. If the site is ever self-hosted, or put behind another proxy/CDN, a client could set `x-real-ip` / `x-forwarded-for` and pick its own rate-limit bucket.
- **Fix:** if the hosting changes, read only the header the trusted proxy sets.

### L6 — Quote-form spam · Low
- **Where:** `src/app/api/ajanlat/route.ts`.
- **Scenario:** the honeypot stops naive bots. A distributed spammer (many IPv4 addresses) can still send 8 leads/hour per address.
- **Fix:** if spam appears, add Cloudflare Turnstile (privacy-friendly, needs a consent/privacy-notice update) or a Vercel Firewall rule.

### L7 — Remaining npm audit items · Low
- `source-map-js` (high) and `baseline-browser-mapping` (moderate) are build-time tools that only process this repo's own CSS/config, so there is no runtime or attacker-controlled input path. Run `npm audit fix` in a routine dependency update.

---

## Checked and clean (Info)

- **I1 Secrets:** no API keys, tokens or private keys in the working tree or in any of the 24 commits (scanned for Anthropic, GitHub, Resend, Google, Slack and PEM patterns). `.env*` is git-ignored. The secrets the server reads are `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `RESEND_API_KEY`, `LEAD_FROM` and `LEAD_TO`, all server-side only. The only `NEXT_PUBLIC_*` variable is `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, which is public by design. Error logs print only presence flags and Resend's error text, never key values. The old `GITHUB_TOKEN` chat integration has been removed; if that token still exists in the Vercel project, delete or revoke it (owner action).
- **I2 Personal data in the repo:** only the business owner's own public business contact details, which also appear on the Impresszum page. Test fixtures use `example.com` and placeholder numbers. Commit authors use GitHub noreply addresses plus the owner's public business address. No customer names, e-mails, phones or notes. 18 gallery photos (`public/r*.jpg`) carry EXIF with **only a timestamp**: no GPS, device or author. Strip it on the next image update anyway.
- **I3 Cookies / analytics:** no analytics or tracking scripts. The locale cookie is disabled, fonts are self-hosted through `next/font`, and YouTube (nocookie host) and Google Maps load only after a click. Nothing is set or loaded before consent.
- **I4 Redirects / SSRF / injection:** both server-side `fetch` targets are constants (`api.anthropic.com`, `api.resend.com`). There is no user-controlled URL anywhere. The i18n proxy excludes `/api` and was probed with `//evil.com`, `%2F%2F`, `%5C`, `\` and `..` paths: it never redirects off-site. The JSON-LD `dangerouslySetInnerHTML` (`src/app/[locale]/layout.tsx:111`) serializes static constants only. No SQL, shell or template evaluation exists.
- **I5 Price / quote logic:** the site calculates no price. The form sends budget *bands* chosen by the visitor, and the lead score that used to be computed in the browser is now recomputed server-side (`lead.ts:67`), so the client cannot forge it. Nothing the server trusts can be raised or lowered by the client.
- **I6 Authentication:** there are no admin or authenticated routes, server actions or payment endpoints to protect.

## Verification of this PR
- `npm test`: 25/25 pass. The new tests fail on the pre-fix code.
- `npm ci`, `next build` and `tsc --noEmit` are clean. `npm run lint` shows only the 6 errors already on `main`, all in UI files this PR does not change.
- Local `next start` probes: pages 200; cross-site POSTs 403; same-origin chat/quote POSTs behave as before.
- Not done (out of scope): no deploy, no environment-variable or external-service changes.
