// Security audit 2026-10-15: the chat and the quote form refuse POSTs a browser sends from another site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isCrossSite } from '../src/lib/origin.ts';

const h = (map) => ({ get: (n) => map[n] ?? null });
const HOST = 'czimber-tibor.vercel.app';

test('the site itself is allowed (same-origin fetch, with or without Sec-Fetch-Site)', () => {
  assert.equal(isCrossSite(h({ host: HOST, origin: `https://${HOST}`, 'sec-fetch-site': 'same-origin' })), false);
  assert.equal(isCrossSite(h({ host: HOST, origin: `https://${HOST}` })), false);
  assert.equal(isCrossSite(h({ host: 'localhost:3000', origin: 'http://localhost:3000' })), false);
  assert.equal(isCrossSite(h({ host: 'a.example', 'x-forwarded-host': HOST, origin: `https://${HOST}` })), false);
});

test('another site is refused (Sec-Fetch-Site, a foreign Origin, or Origin "null")', () => {
  assert.equal(isCrossSite(h({ host: HOST, 'sec-fetch-site': 'cross-site' })), true);
  assert.equal(isCrossSite(h({ host: HOST, origin: 'https://evil.example' })), true);
  assert.equal(isCrossSite(h({ host: HOST, origin: `https://${HOST}.evil.example` })), true);
  assert.equal(isCrossSite(h({ host: HOST, origin: 'null' })), true);
  assert.equal(isCrossSite(h({ host: HOST, origin: 'https://other-project.vercel.app', 'sec-fetch-site': 'cross-site' })), true);
});

test('no browser headers (curl, server-to-server) is left to the rate limit', () => {
  assert.equal(isCrossSite(h({ host: HOST })), false);
});
