import { getTranslations } from 'next-intl/server';
import { type Metadata } from 'next';
import { alternatesFor, localeUrl, ogLocale, OG_IMAGE } from '@/lib/seo';
import HeroSection from '@/components/sections/HeroSection';
import TheatreOriginStory from '@/components/sections/TheatreOriginStory';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsGallery from '@/components/sections/ProjectsGallery';
import QuoteForm from '@/components/sections/QuoteForm';
import ContactSection from '@/components/sections/ContactSection';

export async function generateMetadata(props: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await props.params;
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const meta = await getTranslations({ locale, namespace: 'meta' });
  // one name in the title, the suffix in the page language (Lumen 3360 Kö3)
  const title = `${hero('title')} ${hero('titleAccent')} | ${meta('site')}`;
  const url = localeUrl(locale);
  return {
    title: { absolute: title },
    description: meta('description'),
    alternates: alternatesFor(locale),
    openGraph: {
      type: 'website',
      url,
      siteName: meta('site'),
      locale: ogLocale(locale),
      title,
      description: meta('description'),
      images: [{ ...OG_IMAGE, alt: meta('og_alt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta('description'),
      images: [OG_IMAGE.url],
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
