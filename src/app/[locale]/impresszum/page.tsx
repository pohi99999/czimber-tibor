import type { Metadata } from 'next';
import LegalPage, { CONTROLLER, Missing } from '@/components/legal/LegalPage';
import { Link } from '@/i18n/routing';
import { legalMeta } from '@/lib/seo';

const TITLE = 'Impresszum';

export async function generateMetadata(props: PageProps<'/[locale]/impresszum'>): Promise<Metadata> {
  const { locale } = await props.params;
  // one Hungarian text for all languages: the canonical is the Hungarian page
  return { title: TITLE, ...legalMeta(locale, '/impresszum') };
}

export default async function ImprintPage(props: PageProps<'/[locale]/impresszum'>) {
  const { locale } = await props.params;
  return (
    <LegalPage locale={locale} title={TITLE} updated="2026. október 12.">
      <h2>A szolgáltató</h2>
      <ul>
        <li>Név: {CONTROLLER.name}</li>
        <li>Székhely: {CONTROLLER.address}</li>
        <li>E-mail: <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a></li>
        <li>Telefon: <a href={`tel:${CONTROLLER.phone.replace(/\s/g, '')}`}>{CONTROLLER.phone}</a></li>
        <li>Egyéni vállalkozói nyilvántartási szám: <Missing>nyilvántartási szám</Missing></li>
        <li>Közösségi adószám: {CONTROLLER.vat}</li>
      </ul>

      <h2>Tárhelyszolgáltató</h2>
      <ul>
        <li>Vercel Inc.</li>
        <li>Cím: 440 N Barranca Avenue #4133, Covina, CA 91723, Amerikai Egyesült Államok</li>
        <li>E-mail: <a href="mailto:privacy@vercel.com">privacy@vercel.com</a></li>
        <li>Weboldal: <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
      </ul>

      <h2>Szerzői jog</h2>
      <p>
        A weboldalon közzétett szövegek és képek szerzői jogi védelem alatt állnak. Felhasználásukhoz, másolásukhoz a
        szolgáltató előzetes engedélye szükséges.
      </p>

      <h2>További tájékoztatók</h2>
      <ul>
        <li><Link href="/adatvedelem">Adatkezelési tájékoztató</Link></li>
        <li><Link href="/aszf">Általános szerződési feltételek (ÁSZF)</Link></li>
      </ul>
    </LegalPage>
  );
}
