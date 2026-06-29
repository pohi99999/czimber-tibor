import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['hu', 'de', 'en'],
  defaultLocale: 'hu',
  localePrefix: 'as-needed', // /hu omitted, /de, /en present
});
