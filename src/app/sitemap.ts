import type { MetadataRoute } from 'next';

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
        },
      },
    },
  ];
}
