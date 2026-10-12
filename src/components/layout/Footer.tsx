import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Czimber Tibor EV Logó"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <p className="text-[var(--color-stone)] text-sm">
                &copy; {year} {t('copyright')}
              </p>
              <p className="text-[var(--color-oak-light)] text-xs italic mt-0.5">{t('tagline')}</p>
            </div>
          </div>

          {/* Legal pages (Marveen 3362) */}
          <nav aria-label="Jogi információk" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/adatvedelem" className="text-[var(--color-stone)] hover:text-white underline-offset-4 hover:underline">{t('privacy')}</Link>
            <Link href="/impresszum" className="text-[var(--color-stone)] hover:text-white underline-offset-4 hover:underline">{t('imprint')}</Link>
            <Link href="/aszf" className="text-[var(--color-stone)] hover:text-white underline-offset-4 hover:underline">{t('terms')}</Link>
          </nav>

          {/* Social links */}
          <a
            href="https://www.facebook.com/profile.php?id=100054574504806"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-stone)] hover:text-white transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
