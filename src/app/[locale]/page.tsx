import { getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import TheatreOriginStory from '@/components/sections/TheatreOriginStory';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsGallery from '@/components/sections/ProjectsGallery';
import QuoteForm from '@/components/sections/QuoteForm';
import ContactSection from '@/components/sections/ContactSection';

export async function generateMetadata(props: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: `Czimber Tibor EV – ${t('title')} ${t('titleAccent')}`,
    description: t('subtitle'),
    alternates: {
      canonical: locale === 'hu' ? '/' : `/${locale}`,
      languages: {
        hu: '/',
        de: '/de',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'hu' ? 'hu_HU' : locale === 'de' ? 'de_DE' : 'en_GB',
      title: `Czimber Tibor EV – ${t('title')} ${t('titleAccent')}`,
      description: t('subtitle'),
      images: [{ url: '/nkep.jpg', width: 1200, height: 630 }],
    },
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TheatreOriginStory />
      <ServicesSection />
      <ProjectsGallery />
      <QuoteForm />
      <ContactSection />
    </>
  );
}
