import type { Metadata } from 'next';
import LegalPage, { CONTROLLER } from '@/components/legal/LegalPage';
import { Link } from '@/i18n/routing';
import { legalMeta } from '@/lib/seo';

const TITLE = 'Általános szerződési feltételek (ÁSZF)';

export async function generateMetadata(props: PageProps<'/[locale]/aszf'>): Promise<Metadata> {
  const { locale } = await props.params;
  return { title: 'ÁSZF', ...legalMeta(locale, '/aszf') };
}

export default async function TermsPage(props: PageProps<'/[locale]/aszf'>) {
  const { locale } = await props.params;
  return (
    <LegalPage locale={locale} title={TITLE} updated="2026. október 12.">
      <h2>1. A szolgáltató</h2>
      <p>
        {CONTROLLER.name}, {CONTROLLER.address}. Elérhetőség: <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>,{' '}
        {CONTROLLER.phone}. A további adatok az <Link href="/impresszum">Impresszumban</Link> találhatók.
      </p>

      <h2>2. A weboldal célja</h2>
      <p>
        A weboldal a szolgáltató asztalosmunkáit mutatja be, és lehetőséget ad ajánlatkérésre. A weboldalon keresztül
        nem lehet vásárolni, és a weboldal használatával nem jön létre szerződés.
      </p>

      <h2>3. Ajánlatkérés</h2>
      <ul>
        <li>Az ajánlatkérés díjmentes, és semmilyen kötelezettséget nem keletkeztet sem a látogató, sem a szolgáltató számára.</li>
        <li>
          Az ajánlatkérő űrlapon megadott adatok tájékoztató jellegűek. Az árajánlat a konkrét igény egyeztetése után
          készül; a munkára vonatkozó szerződés a felek külön megállapodásával jön létre.
        </li>
        <li>Az ajánlatkéréskor megadott adatok kezeléséről az <Link href="/adatvedelem">Adatkezelési tájékoztató</Link> szól.</li>
      </ul>

      <h2>4. Az AI-asszisztens</h2>
      <p>
        A weboldalon elérhető chat automatikusan, mesterséges intelligenciával válaszol. Válaszai tájékoztató jellegűek,
        nem minősülnek ajánlatnak, árat vagy határidőt nem tartalmaznak, és hibát tartalmazhatnak. Pontos információt
        a szolgáltató ad, telefonon, e-mailben vagy az ajánlatkérés után.
      </p>

      <h2>5. Referenciaképek</h2>
      <p>
        A bemutatott munkák referenciák. Minden bútor egyedi: méretben, anyagban és kivitelben a megrendelő igényeihez
        igazodik, ezért a képeken látottól eltérhet.
      </p>

      <h2>6. Szerzői jog</h2>
      <p>A weboldal szövegei és képei szerzői jogi védelem alatt állnak; felhasználásukhoz a szolgáltató előzetes engedélye szükséges.</p>

      <h2>7. Irányadó jog</h2>
      <p>A jelen feltételekre a magyar jog az irányadó.</p>
    </LegalPage>
  );
}
