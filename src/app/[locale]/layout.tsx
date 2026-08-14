import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
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

export async function generateMetadata(props: LayoutProps<'/[locale]'>) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  
  const baseUrl = 'https://czimber-tibor.vercel.app';
  const canonicalUrl = locale === 'hu' ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: t('titleAccent'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        hu: baseUrl,
        de: `${baseUrl}/de`,
        en: `${baseUrl}/en`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title: t('titleAccent'),
      url: canonicalUrl,
      locale: locale === 'hu' ? 'hu_HU' : locale === 'de' ? 'de_AT' : 'en_US',
      siteName: 'Czimber Tibor Mesterasztalos',
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 1200,
          height: 630,
          alt: 'Czimber Tibor Mesterasztalos',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('titleAccent'),
      images: [`${baseUrl}/logo.png`],
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
    image: 'https://czimber-tibor.vercel.app/logo.png',
    url: 'https://czimber-tibor.vercel.app',
    telephone: '+36 30 272 4460',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dukai Takács Judit utca 9.',
      addressLocality: 'Zalaegerszeg',
      postalCode: '8900',
      addressCountry: 'HU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.8417,
      longitude: 16.8416,
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
          <main className="flex-1">{children}</main>
          <Footer />
          <AudioPlayer />
          <AIAssistant />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

