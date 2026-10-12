import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { BASE_URL, OG_IMAGE, ogLocale } from '@/lib/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AudioPlayer from '@/components/layout/AudioPlayer';
import AIAssistant from '@/components/ui/AIAssistant';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

export async function generateMetadata(props: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    // absolute: the root layout's Hungarian template must not wrap the per-language default
    title: { absolute: t('site'), template: `%s | ${t('site')}` },
    description: t('description'),
    openGraph: {
      type: 'website',
      siteName: t('site'),
      locale: ogLocale(locale),
      images: [{ ...OG_IMAGE, alt: t('og_alt') }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [OG_IMAGE.url],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Czimber Tibor Mesterasztalos',
    image: OG_IMAGE.url,
    logo: `${BASE_URL}/logo.png`,
    url: BASE_URL,
    telephone: '+36 30 272 4460',
    email: 'czimbertibor2@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dukai Takács Judit utca 9.',
      addressLocality: 'Zalaegerszeg',
      postalCode: '8900',
      addressCountry: 'HU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // OSM Nominatim for "Dukai Takács Judit utca 9, 8900 Zalaegerszeg", re-measured 2026-10-12
      // (46.8653976, 16.8034972); the old point was 3.9 km away (Lumen 3360 M4)
      latitude: 46.8654,
      longitude: 16.8035,
    },
    areaServed: [
      'Zalaegerszeg',
      'Zala vármegye',
      'Vas vármegye',
      'Burgenland',
      'Graz',
      'Austria',
    ],
    priceRange: '$$$',
    knowsAbout: [
      'Egyedi konyhabútor',
      'Beépített szekrény',
      'Bútorasztalos',
      'Tischlerei',
      'Custom Furniture',
    ],
    sameAs: [
      'https://www.facebook.com/profile.php?id=100054574504806',
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          {/* clip, not hidden: the slide-in offset of FadeIn widened the page by 16 px at 390 px before
              the section was scrolled into view; clip keeps position: sticky working */}
          <main className="flex-1 overflow-x-clip">{children}</main>
          <Footer />
          <AudioPlayer />
          <AIAssistant />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

