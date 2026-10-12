import type { Metadata } from 'next';
import LegalPage, { CONTROLLER, Missing } from '@/components/legal/LegalPage';
import { alternatesFor, localeUrl } from '@/lib/seo';

const TITLE = 'Adatkezelési tájékoztató';

export async function generateMetadata(props: PageProps<'/[locale]/adatvedelem'>): Promise<Metadata> {
  const { locale } = await props.params;
  return { title: TITLE, alternates: { ...alternatesFor(locale, '/adatvedelem'), canonical: localeUrl('hu', '/adatvedelem') } };
}

// Processors and addresses as their own pages state them (read 2026-10-12): vercel.com/legal/privacy-policy,
// resend.com/legal/privacy-policy, policies.google.com/privacy; supervisory authority: naih.hu.
export default async function PrivacyPage(props: PageProps<'/[locale]/adatvedelem'>) {
  const { locale } = await props.params;
  return (
    <LegalPage locale={locale} title={TITLE} updated="2026. október 12.">
      <p>
        Ez a tájékoztató azt írja le, milyen személyes adatokat kezelünk a czimber-tibor.vercel.app weboldalon, milyen
        célból, meddig, és milyen jogai vannak ezzel kapcsolatban.
      </p>

      <h2>1. Az adatkezelő</h2>
      <ul>
        <li>{CONTROLLER.name}</li>
        <li>Cím: {CONTROLLER.address}</li>
        <li>E-mail: <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a></li>
        <li>Telefon: {CONTROLLER.phone}</li>
      </ul>

      <h2>2. Ajánlatkérő űrlap</h2>
      <ul>
        <li>
          <strong>Kezelt adatok:</strong> név, e-mail-cím, telefonszám, a projekt leírása, a választott munkatípus,
          helyszín, kezdési idő és költségkeret, az oldal nyelve és a küldés időpontja.
        </li>
        <li><strong>Cél:</strong> az ajánlatkérés megválaszolása, kapcsolatfelvétel, ajánlat készítése.</li>
        <li>
          <strong>Jogalap:</strong> az Ön hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), illetve a szerződés megkötését
          megelőzően, az Ön kérésére megtett lépések (GDPR 6. cikk (1) bekezdés b) pont).
        </li>
        <li><strong>Megőrzési idő:</strong> <Missing>megőrzési idő</Missing></li>
        <li>
          <strong>Hogyan jut el hozzánk:</strong> az űrlap tartalmát e-mailben kapjuk meg. A levelet a Resend
          e-mail-szolgáltatás kézbesíti, és a vállalkozó e-mail-fiókjába (Gmail) érkezik.
        </li>
        <li>
          Hozzájárulását bármikor visszavonhatja a fenti e-mail-címen; ez nem érinti a visszavonás előtti adatkezelés
          jogszerűségét.
        </li>
      </ul>

      <h2>3. AI-asszisztens (chat)</h2>
      <ul>
        <li>
          A chatbe írt kérdéseket és a beszélgetés előzményeit a válasz előállításához a Google Gemini szolgáltatásnak
          továbbítjuk. A weboldal a beszélgetést nem tárolja; az ablak bezárásával vagy az oldal újratöltésével az előzmény törlődik.
        </li>
        <li>Kérjük, a chatbe ne írjon személyes adatot (név, telefonszám, cím). Ajánlatot az űrlapon kérhet.</li>
        <li><strong>Jogalap:</strong> az Ön által kezdeményezett kérdés megválaszolása (GDPR 6. cikk (1) bekezdés f) pont, jogos érdek).</li>
      </ul>

      <h2>4. Tárhely és szervernaplók</h2>
      <p>
        A weboldalt a Vercel Inc. szolgáltatja ki. A működéshez és a biztonsághoz a tárhelyszolgáltató technikai
        adatokat naplóz (például IP-cím, időpont, a kért oldal, a böngésző típusa). Jogalap: jogos érdek a weboldal
        biztonságos működtetéséhez (GDPR 6. cikk (1) bekezdés f) pont). A naplók megőrzéséről a tárhelyszolgáltató
        saját szabályai döntenek.
      </p>

      <h2>5. Sütik, térkép, háttérzene</h2>
      <ul>
        <li>A weboldal saját sütit nem használ, és nem futtat látogatottságmérő vagy hirdetési kódot.</li>
        <li>
          A Google Térkép csak akkor töltődik be, ha a Kapcsolat részben a „Térkép betöltése” gombra kattint. Ekkor a
          Google adatot kap (például az IP-címét), és sütiket állíthat be.
        </li>
        <li>
          A háttérzene a YouTube-ról szól, és csak a zene gomb megnyomása után töltődik be (a YouTube adatvédelmi
          szempontból kíméletesebb, youtube-nocookie.com címéről). Ekkor a YouTube adatot kap, és sütiket állíthat be.
        </li>
      </ul>

      <h2>6. Adatfeldolgozók és címzettek</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Szolgáltató</th><th>Feladat</th></tr>
          </thead>
          <tbody>
            <tr><td>Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA</td><td>tárhely, a weboldal kiszolgálása, szervernaplók</td></tr>
            <tr><td>Plus Five Five, Inc. (Resend), 2261 Market Street #5039, San Francisco, CA 94114, USA</td><td>az ajánlatkérő e-mail kézbesítése</td></tr>
            <tr><td>Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Írország</td><td>Gemini (a chat válaszai), Gmail (a beérkező ajánlatkérések), Google Térkép és YouTube (csak kattintás után)</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        A Vercel és a Resend az Amerikai Egyesült Államokban működik, így az adatok az Európai Gazdasági Térségen kívülre
        is továbbítódhatnak. A továbbítás garanciáiról a szolgáltatók saját tájékoztatói szólnak:{' '}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a>,{' '}
        <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend</a>,{' '}
        <a href="https://policies.google.com/privacy?hl=hu" target="_blank" rel="noopener noreferrer">Google</a>.
      </p>

      <h2>7. Az Ön jogai</h2>
      <p>
        Kérheti, hogy tájékoztassuk az Önről kezelt adatokról, és hogy azokat helyesbítsük, töröljük vagy kezelésüket
        korlátozzuk; tiltakozhat az adatkezelés ellen, kérheti az adatai átadását (adathordozhatóság), és a hozzájárulását
        bármikor visszavonhatja. Kérését a fenti e-mail-címre küldje; legkésőbb egy hónapon belül válaszolunk.
      </p>

      <h2>8. Jogorvoslat</h2>
      <p>
        Ha úgy érzi, hogy adatai kezelése sérti a jogait, panaszt tehet a Nemzeti Adatvédelmi és Információszabadság
        Hatóságnál (NAIH): 1055 Budapest, Falk Miksa utca 9-11.; postacím: 1363 Budapest, Pf. 9.; e-mail:{' '}
        <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>; <a href="https://naih.hu" target="_blank" rel="noopener noreferrer">naih.hu</a>.
        Bírósághoz is fordulhat; a pert a lakóhelye vagy tartózkodási helye szerinti törvényszék előtt is megindíthatja.
      </p>
    </LegalPage>
  );
}
