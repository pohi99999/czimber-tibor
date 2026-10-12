import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// The site's own 404 in the page language (Lumen 3360 Kö2: it was the bare Next.js English page).
export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <section className="min-h-[70vh] flex items-center pt-28 pb-16">
      <div className="container mx-auto px-6 text-center">
        <p className="text-[var(--color-spotlight)] text-sm tracking-[0.4em] mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>{t('title')}</h1>
        <p className="text-[var(--color-birch)]/80 mb-8">{t('text')}</p>
        <Link href="/" className="inline-block px-6 py-3.5 min-h-[44px] bg-[var(--color-spotlight)] text-[var(--color-stage)] font-semibold rounded-lg hover:bg-[var(--color-oak)] transition-colors duration-200">
          {t('back')}
        </Link>
      </div>
    </section>
  );
}
