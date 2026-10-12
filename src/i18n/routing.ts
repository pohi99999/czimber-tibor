import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hu', 'de', 'en'],
  defaultLocale: 'hu',
  localePrefix: 'as-needed', // /hu omitted, /de, /en present
  // "/" is always the Hungarian page: no redirect by the browser language, and no NEXT_LOCALE
  // cookie (Lumen 3360 Kö1: an English-language phone sent a Hungarian visitor to /en). The
  // language switcher still works, the locale is in the URL.
  localeDetection: false,
  localeCookie: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
