// Quote-request delivery (Marveen 3362, 2026-10-12).
// Before: the e-mail went out from noreply@czimber-tibor.vercel.app, a domain Resend cannot verify,
// and with no RESEND_API_KEY on the project the endpoint answered ok:true while the request only
// reached the function log: the visitor saw success and nobody got the lead.
// Now the sender, the recipient and the key all come from env, and the endpoint fails closed: if
// any of them is missing, or Resend does not accept the message, the visitor sees an error with the
// phone number, never a success. Moving the leads to Tibor's mailbox is an env change + redeploy:
//   RESEND_API_KEY  a sending-only key of a Resend-verified domain
//   LEAD_FROM       e.g. "Cimbi weboldal <cimbi-weboldal@mail.pohankaestarsa.com>" (verified domain)
//   LEAD_TO         one or more addresses, comma separated
// The visitor's e-mail goes into reply_to, so "Reply" answers the visitor.
// Pure, with fetch injected, so it can be tested without a network.

export const PROJECT_TYPES = ['kitchen', 'wardrobe', 'stairs', 'interior', 'assembly', 'other'] as const;
const LOCATIONS = ['local', 'other', 'austria'] as const;
const TIMELINES = ['1_3', '3_6', 'undecided'] as const;
const BUDGETS = ['under500', '500_1500', 'over1500', 'unknown'] as const;

const TYPE_HU: Record<string, string> = {
  kitchen: 'Konyhabútor', wardrobe: 'Beépített szekrény / gardrób', stairs: 'Lépcső',
  interior: 'Belsőépítészet', assembly: 'Összeszerelés', other: 'Egyéb',
};
const LOCATION_HU: Record<string, string> = { local: 'Zalaegerszeg és 50 km', other: 'Más magyarországi helyszín', austria: 'Ausztria' };
const TIMELINE_HU: Record<string, string> = { '1_3': '1-3 hónapon belül', '3_6': '3-6 hónapon belül', undecided: 'Még nem döntötte el' };
const BUDGET_HU: Record<string, string> = {
  under500: '500 000 Ft alatt', '500_1500': '500 000 - 1 500 000 Ft', over1500: '1 500 000 Ft felett', unknown: 'Nem tudja / tájékozódna',
};

export const EMAIL_RE = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/;

export type Lead = {
  types: string[]; location: string; timeline: string; budget: string;
  name: string; email: string; phone: string; description: string; locale: string;
};

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max) : '';
}
const pick = (v: unknown, allowed: readonly string[]) => (typeof v === 'string' && allowed.includes(v) ? v : '');

/** The form body -> a clean lead, or the list of invalid fields. */
export function validateLead(raw: unknown): { lead: Lead } | { fields: string[] } {
  const b = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const types = Array.isArray(b.types) ? [...new Set(b.types.filter((t): t is string => typeof t === 'string' && (PROJECT_TYPES as readonly string[]).includes(t)))] : [];
  const lead: Lead = {
    types,
    location: pick(b.location, LOCATIONS),
    timeline: pick(b.timeline, TIMELINES),
    budget: pick(b.budget, BUDGETS),
    name: clean(b.name, 120),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    description: clean(b.description, 5000),
    locale: pick(b.locale, ['hu', 'de', 'en']) || 'hu',
  };
  const fields: string[] = [];
  if (!types.length) fields.push('types');
  if (lead.name.length < 2) fields.push('name');
  if (!EMAIL_RE.test(lead.email)) fields.push('email');
  if (lead.phone.replace(/\D/g, '').length < 7) fields.push('phone');
  if (lead.description.length < 50) fields.push('description');
  if (b.consent !== true) fields.push('consent');
  return fields.length ? { fields } : { lead };
}

/** The same score the form used to compute in the browser; now on the server, where it cannot be forged. */
export function leadScore(l: Lead): 'hot' | 'warm' | 'cold' {
  let s = 0;
  if (l.budget === 'over1500') s += 3;
  if (l.budget === '500_1500') s += 2;
  if (l.phone) s += 1;
  if (l.description.length > 100) s += 1;
  if (l.location === 'austria') s += 2;
  if (l.timeline === '1_3') s += 2;
  if (l.timeline === '3_6') s += 1;
  if (l.timeline === 'undecided') s -= 1;
  if (l.budget === 'unknown') s -= 1;
  return s >= 5 ? 'hot' : s >= 2 ? 'warm' : 'cold';
}

const SCORE_HU = { hot: 'FORRÓ', warm: 'MELEG', cold: 'HIDEG' } as const;

export function buildEmail(l: Lead, now: Date) {
  const score = leadScore(l);
  const subject = `Új ajánlatkérés a weboldalról: ${l.name} [${SCORE_HU[score]}]`;
  const text = [
    'Új ajánlatkérés érkezett a czimber-tibor.vercel.app oldalról.',
    '',
    `Lead minőség: ${SCORE_HU[score]}`,
    `Típus(ok): ${l.types.map((t) => TYPE_HU[t] ?? t).join(', ')}`,
    `Helyszín: ${LOCATION_HU[l.location] ?? 'nincs megadva'}`,
    `Kezdés: ${TIMELINE_HU[l.timeline] ?? 'nincs megadva'}`,
    `Büdzsé: ${BUDGET_HU[l.budget] ?? 'nincs megadva'}`,
    '',
    `Név: ${l.name}`,
    `E-mail: ${l.email}`,
    `Telefon: ${l.phone}`,
    `Az oldal nyelve: ${l.locale}`,
    '',
    'Leírás:',
    l.description,
    '',
    `Küldés ideje: ${now.toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}`,
    'A látogató az adatkezelési tájékoztatót elfogadta. A "Válasz" gomb a látogatónak válaszol.',
  ].join('\n');
  return { subject, text, score };
}

export type LeadEnv = { RESEND_API_KEY?: string; LEAD_FROM?: string; LEAD_TO?: string };
export type LeadResult = { status: number; body: { ok: true } | { ok: false; error: string; fields?: string[] } };
type FetchFn = (url: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;

/** Recipients from LEAD_TO, or null when it is missing or any address is malformed. */
export function recipients(to: string | undefined): string[] | null {
  const list = (to ?? '').split(',').map((x) => x.trim()).filter(Boolean);
  return list.length && list.every((x) => EMAIL_RE.test(x)) ? list : null;
}

/** Validates, then sends through Resend. Success only when Resend accepted the message. */
export async function deliverLead(raw: unknown, env: LeadEnv, fetchFn: FetchFn, log: (l: string) => void = console.error, now = new Date()): Promise<LeadResult> {
  const v = validateLead(raw);
  if ('fields' in v) return { status: 422, body: { ok: false, error: 'invalid', fields: v.fields } };
  const to = recipients(env.LEAD_TO);
  const key = env.RESEND_API_KEY?.trim();
  const from = env.LEAD_FROM?.trim();
  if (!key || !from || !to) {
    log(`lead not_configured key=${key ? 1 : 0} from=${from ? 1 : 0} to=${to ? 1 : 0}`);
    return { status: 503, body: { ok: false, error: 'not_configured' } };
  }
  const { subject, text, score } = buildEmail(v.lead, now);
  try {
    const res = await fetchFn('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: v.lead.email, subject, text }),
    });
    if (!res.ok) {
      // the Resend error body names the reason (domain, key scope); it never contains the key
      log(`lead resend_error status=${res.status} ${(await res.text()).slice(0, 300)}`);
      return { status: 502, body: { ok: false, error: 'send_failed' } };
    }
  } catch (err) {
    log(`lead resend_unreachable ${err instanceof Error ? err.name : 'error'}`);
    return { status: 502, body: { ok: false, error: 'send_failed' } };
  }
  log(`lead sent score=${score}`);
  return { status: 200, body: { ok: true } };
}
