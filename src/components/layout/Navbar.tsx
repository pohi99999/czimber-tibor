'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

function localeHref(pathname: string, newLocale: Locale, currentLocale: Locale): string {
  // Strip existing locale prefix if present
  const stripped = currentLocale !== routing.defaultLocale
    ? pathname.replace(`/${currentLocale}`, '') || '/'
    : pathname;
  return newLocale === routing.defaultLocale ? stripped : `/${newLocale}${stripped}`;
}

export default function Navbar({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: t('about') },
    { href: '#story', label: t('story') },
    { href: '#services', label: t('services') },
    { href: '#references', label: t('references') },
    { href: '#quote', label: t('quote') },
    { href: '#contact', label: t('contact') },
  ];

  const locales: { code: Locale; label: string }[] = [
    { code: 'hu', label: 'HU' },
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <header
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-smoke)]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-[var(--color-smoke)]/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Top row: Logo + mobile toggle */}
        <div className="flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3 group flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Czimber Tibor EV Logó"
              width={48}
              height={48}
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-white font-semibold text-lg transition-colors duration-300 group-hover:text-[var(--color-spotlight)]">
              Czimber Tibor
            </span>
          </a>

          {/* Language switcher (desktop, top-right) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-md">
              {locales.map(({ code, label }, i) => (
                <span key={code} className="flex items-center gap-2">
                  {i > 0 && <span className="text-[var(--color-stone)]">|</span>}
                  <button
                    onClick={() => router.push(localeHref(pathname, code, locale))}
                    className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      locale === code
                        ? 'text-[var(--color-spotlight)]'
                        : 'text-[var(--color-stone)] hover:text-white'
                    }`}
                    aria-label={`Switch to ${label}`}
                  >
                    {label}
                  </button>
                </span>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-2 focus:outline-none"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu button (separate, visible on mobile) */}
          <button
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center justify-center py-2 border-t border-white/10">
          <div className="flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm uppercase tracking-wider text-[var(--color-birch)]/80 hover:text-white hover:tracking-widest transition-all duration-300"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-smoke)]/98 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-6 py-4 space-y-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block text-center py-3 text-sm uppercase tracking-wider text-[var(--color-birch)]/80 hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 mt-4">
              {locales.map(({ code, label }, i) => (
                <span key={code} className="flex items-center gap-4">
                  {i > 0 && <span className="text-[var(--color-stone)]">|</span>}
                  <button
                    onClick={() => { router.push(localeHref(pathname, code, locale)); setMenuOpen(false); }}
                    className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      locale === code ? 'text-[var(--color-spotlight)]' : 'text-[var(--color-stone)] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
