// Cimbi site chat on Google Gemini (Marveen 3362, 2026-10-12).
// Before: /api/chat called the GitHub Models host with GITHUB_TOKEN and gpt-4o-mini, and answered
// every question with HTTP 500 (Lumen's audit 3360, two live questions). Same pattern as the
// pohankaestarsa.com and Némethy chats: gemini-2.5-flash, on a free-tier 429 the same request once
// on gemini-3.5-flash-lite (which rejects thinkingBudget with 400), and a friendly 200 if both are
// out. The key is the site's own GEMINI_API_KEY (never the P-Search or P-Szakrajz key).
// Pure, with fetch injected, so it can be tested without a network.

export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash-lite';
export const geminiUrl = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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
- Rövid, jól olvasható válaszokat adj (legfeljebb 5-6 mondat). Sima szöveg; kiemelésre legfeljebb **így**, linkre csak a fenti [Ajánlatkérés](#quote) formát használd.`;

export type Turn = { role: 'user' | 'assistant'; content: string };
export type ChatResult = { status: number; body: { reply: string } | { error: string } };
type FetchFn = (url: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{
  ok: boolean; status: number; json: () => Promise<unknown>;
}>;

/** thinkingBudget is a Gemini 2.5 setting; gemini-3.5-flash-lite answers 400 to it (measured 2026-10-09). */
export const usesThinkingBudget = (model: string) => model.startsWith('gemini-2.5-');

/**
 * The client history -> Gemini contents. Gemini wants the conversation to open with the user and
 * the roles to alternate; the widget's history opens with the welcome bubble. Empty turns are
 * dropped, same-role runs merged, only the last MAX_TURNS kept, each cut to MAX_TURN_CHARS.
 */
export function toContents(raw: unknown): { role: 'user' | 'model'; parts: { text: string }[] }[] {
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
  return recent.map((t) => ({ role: t.role === 'user' ? 'user' : 'model', parts: [{ text: t.content }] }));
}

export function buildGeminiBody(contents: ReturnType<typeof toContents>, model: string) {
  return {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      maxOutputTokens: 700,
      temperature: 0.6,
      ...(usesThinkingBudget(model) ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  };
}

/** The reply text of a generateContent response, or null when there is none. */
export function readGeminiText(data: unknown): string | null {
  const parts = (data as { candidates?: { content?: { parts?: { text?: unknown }[] } }[] })?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('').trim();
  return text.length > 0 ? text : null;
}

export type Lang = 'hu' | 'de' | 'en';
export const asLang = (l: unknown): Lang => (l === 'de' || l === 'en' ? l : 'hu');

/** Both models over the free quota: a 200 with this text, so the visitor gets a way forward. */
export function busyMessage(lang: Lang): string {
  if (lang === 'de') return `Der Chat ist gerade stark ausgelastet und kann im Moment nicht antworten. Bitte rufen Sie Tibor unter ${PHONE} an oder nutzen Sie das [Angebotsformular](#quote).`;
  if (lang === 'en') return `The chat is very busy right now and cannot answer at the moment. Please call Tibor at ${PHONE} or use the [quote form](#quote).`;
  return `Most nagy az érdeklődés, és a chat pillanatnyilag nem tud válaszolni. Kérjük, hívja Tibort a ${PHONE} számon, vagy használja az [Ajánlatkérés](#quote) űrlapot.`;
}

/** Any other failure: an error status with a friendly text the widget shows as is. */
export function unavailableMessage(lang: Lang): string {
  if (lang === 'de') return `Der Assistent ist gerade nicht erreichbar. Bitte versuchen Sie es später erneut oder rufen Sie ${PHONE} an.`;
  if (lang === 'en') return `The assistant is not available right now. Please try again later or call ${PHONE}.`;
  return `Az asszisztens most nem érhető el. Kérjük, próbálja újra később, vagy hívja a ${PHONE} számot.`;
}

/** One chat turn: validates the input, calls Gemini with the fallback, and maps every outcome to a status + body. */
export async function chatReply(raw: unknown, apiKey: string | undefined, fetchFn: FetchFn): Promise<ChatResult> {
  const lang = asLang((raw as { locale?: unknown })?.locale);
  const contents = toContents((raw as { messages?: unknown })?.messages);
  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    return { status: 400, body: { error: 'A messages tömb utolsó eleme a látogató kérdése legyen.' } };
  }
  const key = apiKey?.trim();
  if (!key) return { status: 503, body: { error: unavailableMessage(lang) } };
  const call = (model: string) =>
    fetchFn(geminiUrl(model), {
      method: 'POST',
      // the key goes in a header, never in the URL: URLs end up in logs
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(buildGeminiBody(contents, model)),
    });
  let res;
  try {
    res = await call(GEMINI_MODEL);
    if (res.status === 429) {
      res = await call(GEMINI_FALLBACK_MODEL);
      if (res.status === 429) return { status: 200, body: { reply: busyMessage(lang) } };
    }
  } catch {
    return { status: 502, body: { error: unavailableMessage(lang) } };
  }
  if (!res.ok) return { status: 502, body: { error: unavailableMessage(lang) } };
  let data: unknown;
  try { data = await res.json(); } catch { return { status: 502, body: { error: unavailableMessage(lang) } }; }
  const reply = readGeminiText(data);
  return reply ? { status: 200, body: { reply } } : { status: 502, body: { error: unavailableMessage(lang) } };
}
