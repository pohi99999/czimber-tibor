// Marveen 3362: a quote request is a success for the visitor ONLY when Resend accepted it; the
// sender, the recipient and the key come from env (moving the leads to Tibor = env change).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliverLead, validateLead, recipients, buildEmail } from '../src/lib/lead.ts';

const ENV = { RESEND_API_KEY: 're_test', LEAD_FROM: 'Cimbi weboldal <cimbi-weboldal@mail.example.com>', LEAD_TO: 'owner@example.com' };
const GOOD = {
  types: ['kitchen', 'bogus'], location: 'local', timeline: '1_3', budget: 'over1500',
  name: 'TESZT - Brunella', email: 'visitor@example.com', phone: '+36 30 123 4567',
  description: 'Teszt leírás: egyedi konyhabútor egy 12 négyzetméteres konyhába, tölgy front.', consent: true, locale: 'hu',
};

function fake(res) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (res instanceof Error) throw res;
    return res;
  };
  return { fn, calls };
}
const accepted = { ok: true, status: 200, text: async () => '{"id":"x"}' };
const quiet = () => {};

test('accepted by Resend -> 200 ok; from/to/reply_to come from env and the form', async () => {
  const f = fake(accepted);
  const r = await deliverLead(GOOD, ENV, f.fn, quiet);
  assert.deepEqual(r, { status: 200, body: { ok: true } });
  const b = f.calls[0].body;
  assert.equal(f.calls[0].url, 'https://api.resend.com/emails');
  assert.equal(f.calls[0].init.headers.Authorization, 'Bearer re_test');
  assert.equal(b.from, ENV.LEAD_FROM);
  assert.deepEqual(b.to, ['owner@example.com']);
  assert.equal(b.reply_to, 'visitor@example.com');
  assert.match(b.subject, /TESZT - Brunella/);
  assert.match(b.text, /Konyhabútor/);
  assert.equal(b.text.includes('bogus'), false);
});

test('moving the leads to another mailbox is an env change: LEAD_TO decides, a list works', async () => {
  const f = fake(accepted);
  await deliverLead(GOOD, { ...ENV, LEAD_TO: 'tibor@example.com, owner@example.com' }, f.fn, quiet);
  assert.deepEqual(f.calls[0].body.to, ['tibor@example.com', 'owner@example.com']);
});

test('the old ok:true-without-sending path is gone: a missing key, sender or recipient -> 503, nothing sent', async () => {
  for (const env of [{ ...ENV, RESEND_API_KEY: '' }, { ...ENV, LEAD_FROM: undefined }, { ...ENV, LEAD_TO: '' }, { ...ENV, LEAD_TO: 'not-an-address' }, {}]) {
    const f = fake(accepted);
    const lines = [];
    const r = await deliverLead(GOOD, env, f.fn, (l) => lines.push(l));
    assert.equal(r.status, 503);
    assert.equal(r.body.ok, false);
    assert.equal(f.calls.length, 0);
    assert.match(lines[0], /not_configured/);
  }
});

test('Resend refuses (unverified domain 403) or is unreachable -> 502, the visitor sees no success', async () => {
  for (const res of [{ ok: false, status: 403, text: async () => '{"message":"The domain is not verified"}' }, new TypeError('fetch failed')]) {
    const lines = [];
    const r = await deliverLead(GOOD, ENV, fake(res).fn, (l) => lines.push(l));
    assert.equal(r.status, 502);
    assert.equal(r.body.ok, false);
    assert.equal(lines.join(' ').includes('re_test'), false);
  }
});

test('validation: consent must be exactly true, plus name, email, phone, a 50+ description and a type', () => {
  assert.deepEqual(validateLead({ ...GOOD, consent: 'true' }), { fields: ['consent'] });
  assert.deepEqual(validateLead({ ...GOOD, consent: undefined }), { fields: ['consent'] });
  const bad = validateLead({ types: [], name: 'A', email: 'x@y', phone: '12', description: 'rövid', consent: true });
  assert.deepEqual(bad.fields, ['types', 'name', 'email', 'phone', 'description']);
  assert.ok('lead' in validateLead(GOOD));
});

test('an invalid form is a 422 and calls nothing', async () => {
  const f = fake(accepted);
  const r = await deliverLead({ ...GOOD, consent: false }, ENV, f.fn, quiet);
  assert.equal(r.status, 422);
  assert.equal(f.calls.length, 0);
});

test('the lead score is computed on the server: a forged leadScore in the body is ignored', () => {
  const { lead } = validateLead({ ...GOOD, leadScore: 'hot', budget: 'unknown', timeline: 'undecided', location: 'other', description: 'x'.repeat(60) });
  assert.match(buildEmail(lead, new Date(0)).subject, /HIDEG/);
  assert.match(buildEmail(validateLead(GOOD).lead, new Date(0)).subject, /FORRÓ/);
});

test('recipients: a malformed address anywhere in the list -> null (fail closed)', () => {
  assert.deepEqual(recipients('a@b.hu'), ['a@b.hu']);
  assert.equal(recipients('a@b.hu, nope'), null);
  assert.equal(recipients(undefined), null);
});
