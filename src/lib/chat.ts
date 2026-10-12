// Cimbi site chat on Claude (Marveen 3362, owner decision 3367, 2026-10-12).
// Before: /api/chat called the GitHub Models host with GITHUB_TOKEN and gpt-4o-mini, and answered
// every question with HTTP 500 (Lumen's audit 3360, two live questions).
// Now: Claude Haiku 5.5 on the site's own ANTHROPIC_API_KEY, no web search, no second provider.
// The Gemini API terms allow only the paid service for apps used in the EEA, so there is no free
// Gemini fallback; any Claude failure gives the visitor a friendly text with the phone number and
// the quote form instead.
// Not sent on purpose: temperature, top_p/top_k, thinking / budget_tokens (Haiku 5.5 thinks
// adaptively; these come back 400 on the 5.x models). Its thinking counts against max_tokens, so
// the cap is generous: it is only a ceiling, output is billed as used.
// Pure, with fetch injected, so it can be tested without a network.

export const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';
export const ANTHROPIC_VERSION = '2023-06-01';
/** checked against GET /v1/models on 2026-10-12; ANTHROPIC_MODEL overrides it */
export const DEFAULT_MODEL = 'claude-haiku-5-5';
export const MAX_TOKENS = 8000;
export const TIMEOUT_MS = 25_000;

export const SITE = 'https://czimber-tibor.vercel.app';
export const PHONE = '+36 30 272 4460';
export const EMAIL = 'czimbertibor2@gmail.com';

/** At most this many turns of the history go to the model, each cut to MAX_TURN_CHARS. */
export const MAX_TURNS = 10;
export const MAX_TURN_CHARS = 2000;

// Only facts that are on the site itself. The chat must not promise a price, a deadline or a
// response time, and must not repeat the site's claims (years, percentages): the owner decides
// those with Tibor on 2026-10-13.
export const SYSTEM_PROMPT = `Te Czimber Tibor egyéni vállalkozó (asztalos, Zalaegerszeg) weboldalának asszisztense vagy.
Tények, amelyekre támaszkodhatsz:
- Czimber Tibor asztalos. Korábban a zalaegerszegi Hevesi Sándor Színház díszletépítő műhelyében dolgozott; ebből hozta a pontos, gondos munkát.
- Munkái: egyedi konyhabútor, beépített szekrény és gardrób, fürdőszobabútor, előszobabútor, fa lépcső és más belsőépítészeti elemek, valamint konyhák és bútorok összeszerelése bútorgyártóknak és -forgalmazóknak.
- Szolgáltatási terület: Zalaegerszeg és környéke, valamint Ausztria.
- Cím: 8900 Zalaegerszeg, Dukai Takács Judit u. 9. Telefon: ${PHONE}. E-mail: ${EMAIL}.
- Ajánlatot az oldalon lévő ajánlatkérő űrlapon lehet kérni; erre így hivatkozz: [Ajánlatkérés](#quote).
Szabályok:
- Mindig magázz (németül Sie, angolul udvarias forma). Közvetlen, barátságos, de udvarias hangnem.
- Arra a nyelvre válaszolj, amelyen a kérdés érkezett (magyar, német vagy angol); ha nem egyértelmű, magyarul.
- Árat, árkategóriát, határidőt, gyártási vagy szállítási időt, visszahívási időt és szabad kapacitást SOHA ne mondj és ne ígérj. Ilyen kérdésre mondd el, hogy ez a konkrét munkától függ, és Tibor személyesen egyeztet: ajánld az ajánlatkérő űrlapot vagy a telefonszámot.
- Csak a fenti tényekre támaszkodj. Amit nem tudsz (anyag, márka, garancia, referencia, évszám), azt ne találd ki: ajánld, hogy kérdezze meg Tibort.
- Ne kérj személyes adatot a chatben; az elérhetőséget az ajánlatkérő űrlapon lehet megadni.
- Rövid, jól olvasható válaszokat adj (legfeljebb 5-6 mondat). Sima szöveg, címsor és táblázat nélkül; kiemelésre legfeljebb **így**, linkre csak a fenti [Ajánlatkérés](#quote) formát használd.`;

export type Turn = { role: 'user' | 'assistant'; content: string };
export type ChatResult = { status: number; body: { reply: string } | { error: string }; reason: string };
type FetchFn = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{
  ok: boolean; status: number; json: () => Promise<unknown>; text: () => Promise<string>;
}>;

/**
 * The client history -> Messages API turns. The conversation must open with the user and the
 * roles must alternate; the widget's history opens with the welcome bubble. Unknown roles (a
 * client-sent "system") and empty turns are dropped, same-role runs merged, only the last
 * MAX_TURNS kept, each cut to MAX_TURN_CHARS.
 */
export function toMessages(raw: unknown): Turn[] {
  const list = Array.isArray(raw) ? raw : [];
  const turns: Turn[] = [];
  for (const m of list) {
    const role = (m as Turn)?.role;
    const content = (m as Turn)?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') continue;
    const text = content.trim().slice(0, MAX_TURN_CHARS);
    if (!text) continue;
    const prev = turns[turns.length - 1];
    if (prev && prev.role === role) prev.content = `${prev.content}\n\n${text}`;
    else turns.push({ role, content: text });
  }
  let recent = turns.slice(-MAX_TURNS);
  while (recent.length && recent[0].role !== 'user') recent = recent.slice(1);
  return recent;
}

export function buildClaudeBody(messages: Turn[], model: string) {
  return { model, max_tokens: MAX_TOKENS, system: SYSTEM_PROMPT, messages };
}

/** The answer text: the text blocks only (a thinking block comes first on Haiku 5.5), or null. */
export function readClaudeText(data: unknown): string | null {
  const d = data as { content?: { type?: string; text?: unknown }[]; stop_reason?: string };
  if (d?.stop_reason === 'max_tokens') return null; // cut off mid-answer: never show half a reply
  const blocks = Array.isArray(d?.content) ? d.content : [];
  const text = blocks.filter((b) => b?.type === 'text' && typeof b.text === 'string').map((b) => b.text as string).join('').trim();
  return text.length > 0 ? text : null;
}

export type Lang = 'hu' | 'de' | 'en';
export const asLang = (l: unknown): Lang => (l === 'de' || l === 'en' ? l : 'hu');

/** Over the rate limit / quota / credit: a 200 with this text, so the visitor gets a way forward. */
export function busyMessage(lang: Lang): string {
  if (lang === 'de') return `Der Chat ist gerade stark ausgelastet und kann im Moment nicht antworten. Bitte rufen Sie Tibor unter ${PHONE} an oder nutzen Sie das [Angebotsformular](#quote).`;
  if (lang === 'en') return `The chat is very busy right now and cannot answer at the moment. Please call Tibor at ${PHONE} or use the [quote form](#quote).`;
  return `Most nagy az érdeklődés, és a chat pillanatnyilag nem tud válaszolni. Kérjük, hívja Tibort a ${PHONE} számon, vagy használja az [Ajánlatkérés](#quote) űrlapot.`;
}

/** Any other failure: an error status with a friendly text the widget shows as is. */
export function unavailableMessage(lang: Lang): string {
  if (lang === 'de') return `Der Assistent ist gerade nicht erreichbar. Bitte rufen Sie ${PHONE} an oder nutzen Sie das [Angebotsformular](#quote).`;
  if (lang === 'en') return `The assistant is not available right now. Please call ${PHONE} or use the [quote form](#quote).`;
  return `Az asszisztens most nem érhető el. Kérjük, hívja a ${PHONE} számot, vagy használja az [Ajánlatkérés](#quote) űrlapot.`;
}

/** 429 rate limit, 529/503 overloaded, the 400 "credit balance is too low": the busy text. */
export function isBusy(status: number, body: string): boolean {
  return status === 429 || status === 529 || status === 503 || /credit balance/i.test(body);
}

/** One chat turn: validates the input, calls Claude once, and maps every outcome to a status + body + log reason. */
export async function chatReply(raw: unknown, apiKey: string | undefined, fetchFn: FetchFn, model = DEFAULT_MODEL): Promise<ChatResult> {
  const lang = asLang((raw as { locale?: unknown })?.locale);
  const messages = toMessages((raw as { messages?: unknown })?.messages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return { status: 400, body: { error: 'A messages tömb utolsó eleme a látogató kérdése legyen.' }, reason: 'bad_request' };
  }
  const key = apiKey?.trim();
  if (!key) return { status: 503, body: { error: unavailableMessage(lang) }, reason: 'no_key' };
  let res;
  try {
    res = await fetchFn(CLAUDE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': ANTHROPIC_VERSION },
      body: JSON.stringify(buildClaudeBody(messages, model || DEFAULT_MODEL)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const timeout = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    return { status: 502, body: { error: unavailableMessage(lang) }, reason: timeout ? 'timeout' : 'network' };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (isBusy(res.status, body)) return { status: 200, body: { reply: busyMessage(lang) }, reason: `busy_${res.status}` };
    return { status: 502, body: { error: unavailableMessage(lang) }, reason: `claude_${res.status}` };
  }
  let data: unknown;
  try { data = await res.json(); } catch { return { status: 502, body: { error: unavailableMessage(lang) }, reason: 'bad_json' }; }
  const reply = readClaudeText(data);
  return reply ? { status: 200, body: { reply }, reason: 'ok' } : { status: 502, body: { error: unavailableMessage(lang) }, reason: 'empty_or_truncated' };
}
