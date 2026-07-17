# Technical SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement dynamic sitemap, robots.txt, and localized metadata configuration for a multi-language Next.js App Router application.

**Architecture:** Create dynamic `robots.ts` and `sitemap.ts` in the root app directory. Separate metadata between root `layout.tsx` (global fallback configurations) and `[locale]/layout.tsx` (locale-specific title and hreflang properties).

**Tech Stack:** Next.js 16, TypeScript, next-intl.

---

### Task 1: Create Robots Configuration

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Write dynamic robots.ts**

```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://czimber-tibor.vercel.app/sitemap.xml',
  };
}
```

- [ ] **Step 2: Commit Robots.ts**

```bash
git add src/app/robots.ts
git commit -m "feat: add dynamic robots.txt configuration"
```

---

### Task 2: Create Dynamic Sitemap

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Write dynamic sitemap.ts**

```typescript
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
```

- [ ] **Step 2: Commit sitemap.ts**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add dynamic localized sitemap.xml configuration"
```

---

### Task 3: Update Global Root Layout Metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update metadata in layout.tsx**

Replace lines 4-13 with:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://czimber-tibor.vercel.app'),
  title: {
    default: 'Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok',
    template: '%s | Czimber Tibor Mesterasztalos',
  },
  description:
    'Czimber Tibor prémium egyedi bútorok készítése mesteri és színházi precizitással. Konyhabútorok, beépített szekrények és belsőépítészeti munkák Zalaegerszegen és Ausztria egész területén.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: 'https://czimber-tibor.vercel.app',
    siteName: 'Czimber Tibor Mesterasztalos',
    title: 'Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok',
    description:
      'Czimber Tibor prémium egyedi bútorok készítése mesteri és színházi precizitással. Konyhabútorok, beépített szekrények és belsőépítészeti munkák Zalaegerszegen és Ausztria egész területén.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Czimber Tibor Mesterasztalos - Prémium Egyedi Bútorok',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok',
    description:
      'Czimber Tibor prémium egyedi bútorok készítése mesteri és színházi precizitással. Konyhabútorok, beépített szekrények és belsőépítészeti munkák Zalaegerszegen és Ausztria egész területén.',
    images: ['/logo.png'],
  },
};
```

- [ ] **Step 2: Commit layout.tsx changes**

```bash
git add src/app/layout.tsx
git commit -m "feat: add global root SEO metadata options, OG, and Twitter config"
```

---

### Task 4: Update Locale Layout Dynamic Metadata

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Update generateMetadata function in [locale]/layout.tsx**

Modify `generateMetadata` function (lines 24-30):
```typescript
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
      url: canonicalUrl,
      locale: locale === 'hu' ? 'hu_HU' : locale === 'de' ? 'de_AT' : 'en_US',
    },
  };
}
```

- [ ] **Step 2: Commit [locale]/layout.tsx changes**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: implement localized hreflang alternates and title dynamic metadata"
```

---

### Task 5: Run Production Build and Push

- [ ] **Step 1: Run local npm run build**

Run: `npm run build`
Expected: Successfully generates the Next.js static and dynamic assets without TypeScript or route errors.

- [ ] **Step 2: Push changes to main branch**

Run: `git push origin main`

---

### Task 6: Log Execution Status

**Files:**
- Modify: `status.log`

- [ ] **Step 1: Log Technical SEO deploy status**

Append the deploy log to the status.log file.
