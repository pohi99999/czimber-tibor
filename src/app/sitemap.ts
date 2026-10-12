import type { MetadataRoute } from 'next';
import { LEGAL_PATHS } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://czimber-tibor.vercel.app';
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          hu: baseUrl,
          de: `${baseUrl}/de`,
          en: `${baseUrl}/en`,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/de`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          hu: baseUrl,
          de: `${baseUrl}/de`,
          en: `${baseUrl}/en`,
          'x-default': baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          hu: baseUrl,
          de: `${baseUrl}/de`,
          en: `${baseUrl}/en`,
          'x-default': baseUrl,
        },
      },
    },
    // the Hungarian legal pages only: the /de and /en copies are the same text, noindex (Lumen 3375)
    ...LEGAL_PATHS.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
