'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

function localeHref(pathname: string, newLocale: Locale, currentLocale: Locale): string {
  const stripped =
    currentLocale !== routing.defaultLocale
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: '#story', label: t('about') },
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

  const headerClass = scrolled
    ? 'bg-[var(--color-smoke)] backdrop-blur-xl shadow-xl shadow-black/30'
    : 'bg-[var(--color-smoke)]/85 backdrop-blur-lg';

  return (
    <>
      <header className={`fixed w-full z-50 top-0 transition-all duration-300 ${headerClass}`}>
        <div className="container mx-auto px-6 md:px-8">
          {/* Top row: logo + right controls */}
          <div className="flex items-center justify-between h-16 md:h-auto md:py-4">
            <a href="#home" className="flex items-center gap-3 group flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Czimber Tibor EV Logó"
                width={44}
                height={44}
                className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-white font-semibold text-base md:text-lg transition-colors duration-300 group-hover:text-[var(--color-spotlight)] leading-tight">
                Czimber Tibor
              </span>
            </a>

            <div className="flex items-center gap-3">
              {/* Language switcher – desktop only */}
              <div className="hidden md:flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-md border border-white/5">
                {locales.map(({ code, label }, i) => (
                  <span key={code} className="flex items-center gap-2">
                    {i > 0 && <span className="text-[var(--color-stone)]">|</span>}
                    <button
                      onClick={() => router.push(localeHref(pathname, code, locale))}
                      className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 py-1 px-0.5 ${
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

              {/* Animated hamburger – mobile only */}
              <button
                className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-spotlight)]"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <span className="flex flex-col gap-1.5 w-5">
                  <span
                    className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                      menuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
                      menuOpen ? 'opacity-0 scale-x-0' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                      menuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center justify-center py-2 border-t border-white/8">
            <div className="flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="relative text-sm uppercase tracking-widest text-[var(--color-birch)]/70 hover:text-white transition-colors duration-300 py-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--color-spotlight)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[var(--color-stage)]/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Slide-down drawer */}
        <nav
          className={`absolute top-16 left-0 right-0 bg-[var(--color-smoke)] border-b border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-y-0' : '-translate-y-2'
          }`}
        >
          <div className="px-6 py-5 space-y-1">
            {navLinks.map(({ href, label }, i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center min-h-[52px] text-sm uppercase tracking-widest text-[var(--color-birch)]/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors duration-200"
                style={{ transitionDelay: menuOpen ? `${i * 35}ms` : '0ms' }}
              >
                {label}
              </a>
            ))}

            {/* Language switcher */}
            <div className="flex items-center justify-center gap-6 pt-4 mt-2 border-t border-white/10">
              {locales.map(({ code, label }, i) => (
                <span key={code} className="flex items-center gap-6">
                  {i > 0 && <span className="text-[var(--color-stone)] text-xs">|</span>}
                  <button
                    onClick={() => {
                      router.push(localeHref(pathname, code, locale));
                      setMenuOpen(false);
                    }}
                    className={`text-xs font-bold uppercase tracking-widest min-h-[44px] px-3 transition-colors duration-200 ${
                      locale === code
                        ? 'text-[var(--color-spotlight)]'
                        : 'text-[var(--color-stone)] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
