import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Allow unoptimized images for local dev convenience
    unoptimized: false,
  },
};

export default withNextIntl(nextConfig);
