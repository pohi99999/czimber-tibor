// One place for the absolute URLs of the metadata (Lumen 3360 Kö3: og:url and the x-default
// hreflang were missing from the page head, the share image was the logo).
export const BASE_URL = 'https://czimber-tibor.vercel.app';
export const OG_IMAGE = { url: `${BASE_URL}/og-cimbi.jpg`, width: 1200, height: 630 };

/** The URL of a path on the locale's site: hu has no prefix (localePrefix 'as-needed'). */
export function localeUrl(locale: string, path = ''): string {
  return `${BASE_URL}${locale === 'hu' ? '' : `/${locale}`}${path}` || BASE_URL;
}

/** canonical + hreflang alternates for a path that exists in all three languages. */
export function alternatesFor(locale: string, path = '') {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      hu: localeUrl('hu', path),
      de: localeUrl('de', path),
      en: localeUrl('en', path),
      'x-default': localeUrl('hu', path),
    },
  };
}

export const ogLocale = (locale: string) => (locale === 'de' ? 'de_AT' : locale === 'en' ? 'en_US' : 'hu_HU');

/**
 * The legal pages have one Hungarian text on all three languages (Lumen 3375): the Hungarian URL is
 * the canonical, the /de and /en copies are noindex, follow, and no hreflang points at them.
 */
export function legalMeta(locale: string, path: string) {
  return {
    alternates: { canonical: localeUrl('hu', path) },
    ...(locale === 'hu' ? {} : { robots: { index: false, follow: true } }),
  };
}

export const LEGAL_PATHS = ['/adatvedelem', '/impresszum', '/aszf'] as const;
