import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

// Next.js 16: export named 'proxy' instead of default
export function proxy(request: Parameters<typeof handleI18n>[0]) {
  return handleI18n(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
