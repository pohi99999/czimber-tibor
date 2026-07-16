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
  return {
    title: `Czimber Tibor EV – ${t('titleAccent')}`,
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

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
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
