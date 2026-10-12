import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

// Shared frame of the three legal pages (Marveen 3362). The text is Hungarian on every language;
// the German and English versions say so on top and link the same content.
export default async function LegalPage({ locale, title, updated, children }: { locale: string; title: string; updated: string; children: React.ReactNode }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const nf = await getTranslations({ locale, namespace: 'notFound' });
  return (
    <section className="pt-32 pb-20 md:pt-40">
      <div className="container mx-auto px-6 md:px-8">
        <article lang="hu" className="legal max-w-3xl mx-auto text-[var(--color-birch)]/85 leading-relaxed">
          {locale !== 'hu' && (
            <p lang={locale} className="mb-8 p-4 rounded-lg border border-[var(--color-spotlight)]/40 bg-[var(--color-spotlight)]/10 text-sm">
              {t('hu_only')}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
          <p className="text-sm text-[var(--color-stone)] mb-10">Hatályos: {updated}</p>
          {children}
          <p className="mt-12">
            <Link href="/" className="text-[var(--color-spotlight)] underline hover:text-white" lang={locale}>{nf('back')}</Link>
          </p>
        </article>
      </div>
    </section>
  );
}

/** A visible gap in the legal text: a fact we do not have yet and must not invent. */
export function Missing({ children }: { children: React.ReactNode }) {
  return <mark className="bg-amber-300/90 text-black px-1 rounded">[pótlandó: {children}]</mark>;
}

export const CONTROLLER = {
  name: 'Czimber Tibor egyéni vállalkozó (Czimber Tibor e.v.)',
  address: '8900 Zalaegerszeg, Dukai Takács Judit u. 9.',
  email: 'czimbertibor2@gmail.com',
  phone: '+36 30 272 4460',
  vat: 'HU58746093',
};
