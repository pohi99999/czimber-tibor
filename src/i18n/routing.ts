import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hu', 'de', 'en'],
  defaultLocale: 'hu',
  localePrefix: 'as-needed', // /hu omitted, /de, /en present
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
