// Security audit 2026-10-15: the per-IP limit must not be escapable by rotating IPv6 addresses
// inside one /64, nor resettable by flooding it with fresh keys.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLimiter, clientKey, ipBucket } from '../src/lib/rateLimit.ts';

const h = (map) => ({ get: (n) => map[n] ?? null });

test('IPv6 addresses of one /64 share a bucket; IPv4 and IPv4-mapped stay per address', () => {
  assert.equal(ipBucket('2001:db8:1:2:aaaa::1'), '2001:db8:1:2::/64');
  assert.equal(ipBucket('2001:0db8:0001:0002:ffff:ffff:ffff:ffff'), '2001:db8:1:2::/64');
  assert.equal(ipBucket('2001:db8::1'), '2001:db8:0:0::/64');
  assert.equal(ipBucket('::1'), '0:0:0:0::/64');
  assert.equal(ipBucket('[2001:db8:1:2::5]:443'), '2001:db8:1:2::/64');
  assert.equal(ipBucket('::ffff:203.0.113.7'), '203.0.113.7');
  assert.equal(ipBucket('203.0.113.7'), '203.0.113.7');
  assert.notEqual(ipBucket('2001:db8:1:2::1'), ipBucket('2001:db8:1:3::1'));
});

test('clientKey: Vercel header first, IPv6 bucketed, "unknown" when absent', () => {
  assert.equal(clientKey(h({ 'x-vercel-forwarded-for': '2001:db8:1:2::9', 'x-forwarded-for': '1.2.3.4' })), '2001:db8:1:2::/64');
  assert.equal(clientKey(h({ 'x-forwarded-for': '198.51.100.1, 10.0.0.1' })), '198.51.100.1');
  assert.equal(clientKey(h({})), 'unknown');
});

test('rotating addresses inside one /64 hits the same limit', () => {
  const limit = createLimiter(3);
  const now = 1_000_000;
  const waits = [1, 2, 3, 4, 5].map((i) => limit(clientKey(h({ 'x-vercel-forwarded-for': `2001:db8:1:2::${i}` })), now));
  assert.deepEqual(waits.map((w) => w > 0), [false, false, false, true, true]);
});

test('a flood of fresh keys does not reset an existing, limited key', () => {
  const limit = createLimiter(2);
  const now = 1_000_000;
  limit('victim-or-attacker', now);
  limit('victim-or-attacker', now);
  assert.ok(limit('victim-or-attacker', now) > 0);
  for (let i = 0; i < 25000; i++) limit(`fresh-${i}`, now + 1);
  // before the fix the map was cleared at 20000 keys and this key started over
  assert.ok(limit('victim-or-attacker', now + 2) > 0);
});
