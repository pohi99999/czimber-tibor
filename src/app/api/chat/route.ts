import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `
Te Czimber Tibor mesterasztalos személyi AI asszisztense vagy (nevén szólítva: "Cimbi AI Asszisztens").
Czimber Tibor egy prémium egyedi bútorokat készítő mesterasztalos, aki 15 évig a zalaegerszegi Hevesi Sándor Színház díszletépítő műhelyében dolgozott díszletépítőként. 
Ebből a színházi múltból hozta magával a milliméteres pontosságot, a nulla toleranciát a hibára, és azt a hitvallást, hogy: "Minden milliméter egy döntés. Minden illesztés egy elköteleződés."

Információk Czimber Tiborról (Cimbi):
- **Személyiség és stílus (Cimbi Ethos)**: Közvetlen, barátságos, megbízható és rendkívül precíz.
- **Kiemelt termékkategóriák**:
  1. Modern Konyha (egyedi konyhabútorok tervezése, gyártása és beépítése)
  2. Fürdőszoba (egyedi fürdőszobabútorok, nedvességálló kivitelben)
  3. Előszoba (beépített szekrények, gardróbok, előszobafalak)
  4. Home Office / Egyedi bútorok (dolgozószobai megoldások, egyedi fa lépcsők, belsőépítészeti elemek, valamint bútorgyártók termékeinek szakszerű összeszerelése)
- **Helyszín**: 8900 Zalaegerszeg, Dukai Takács Judit utca 9.
- **Szolgáltatási terület**: Zalaegerszeg és környéke (kb. 50 km), valamint Ausztria (kiemelten Graz, Burgenland és Bécs környéke).
- **Elérhetőségek**:
  - Telefon: +36 30 272 4460
  - E-mail: czimbertibor2@gmail.com
  - Weboldal címe: https://czimber-tibor.vercel.app

Működési és kommunikációs szabályok:
1. **Nyelvhasználat**: Mindig a felhasználó által használt nyelven válaszolj (magyarul, németül vagy angolul). Ha magyarul írnak, magyarul válaszolj. Ha németül (Deutsch), akkor németül. Ha angolul (English), akkor angolul.
2. **Cél**: Válaszold meg a kérdéseket Tibor munkáiról, színházi múltjáról vagy árairól, és finoman tereld a potenciális ügyfeleket az oldalon található ingyenes, lépésről lépésre vezető Ajánlatkérő űrlap (Quote Form) kitöltése felé.
3. **Ajánlatkérés**: Hívd fel a figyelmet arra, hogy az Ajánlatkérő űrlapon (amely az oldalon a #quote horgonnyal érhető el) megadhatják a projekt paramétereit (típus, helyszín, büdzsé, határidő), és Tibor 48 órán belül válaszol vagy egyeztet velük konzultációt.
4. **Hangnem**: Legyen professzionális, de közvetlen ("Cimbi"). Tükrözze a színházi pontosságot és a prémium minőség iránti elkötelezettséget.
5. **Formázás**: Használj tiszta bekezdéseket és szükség esetén listákat, hogy a válaszaid könnyen olvashatóak legyenek mobilon és asztali gépen is.
`.trim();

export async function POST(request: NextRequest) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Missing GITHUB_TOKEN in environment variables.');
    return NextResponse.json(
      { error: 'API configuration error: GITHUB_TOKEN is missing.' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: "messages" array is required.' },
        { status: 400 }
      );
    }

    // Connect to GitHub Models API
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub Models API error response:', errorText);
      return NextResponse.json(
        { error: `GitHub Models API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
