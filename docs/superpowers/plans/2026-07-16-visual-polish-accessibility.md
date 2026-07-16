# Visual Polish & Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement visual polish and WCAG AA accessibility recommendations identified during the Chrome AI audit.

**Architecture:** Use Approach A: Move HTML and body layout wrappers to the dynamic localized layout `[locale]/layout.tsx`, define high-contrast stone and oak colors, add accessibility properties to all interactive elements and images, and polish UI interactions with inner shadows and brand spotlight glows.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, `next-intl`.

---

### Task 1: Color & Contrast upgrades in globals.css

**Files:**
- Modify: `src/app/globals.css:1-25`

- [ ] **Step 1: Update design tokens for Stone and Oak-Light**
  Replace standard color tokens to ensure accessibility compliance.
  
  ```css
  /* Change color-stone and add color-oak-light */
  @theme inline {
    /* Colours */
    --color-walnut:       #3d2b1f;
    --color-walnut-light: #5a3e2b;
    --color-oak:          #8b6914;
    --color-oak-light:    #b58c26; /* High contrast variant for text */
    --color-spotlight:    #d4a853;
    --color-birch:        #e8dcc8;
    --color-linen:        #f5f0e8;
    --color-stage:        #1a1410;
    --color-stone:        #a8a29e; /* High contrast gray/stone (WCAG AA) */
    --color-smoke:        #2c2420;
    --color-smoke-light:  #3d332d;

    /* Typography */
    --font-display: var(--font-playfair);
    --font-body:    var(--font-inter);
  }
  ```

- [ ] **Step 2: Commit color changes**
  ```bash
  git add src/app/globals.css
  git commit -m "style: update stone color and add oak-light token for WCAG AA compliance"
  ```

---

### Task 2: Next.js Layout Restructuring

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Simplify root layout.tsx**
  Update `src/app/layout.tsx` to act as a pass-through component.
  
  ```tsx
  import type { Metadata } from 'next';
  import './globals.css';

  export const metadata: Metadata = {
    metadataBase: new URL('https://czimber-tibor.vercel.app'),
    title: {
      default: 'Czimber Tibor EV – Egyedi Bútorok és Asztalos Munkák',
      template: '%s | Czimber Tibor EV',
    },
    description:
      'Tapasztalt mesterasztalos Zalaegerszegen. Egyedi konyhabútorok, beépített szekrények, lépcsők és belsőépítészeti megoldások – milliméteres precizitással.',
    robots: { index: true, follow: true },
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return children;
  }
  ```

- [ ] **Step 2: Move HTML/body wrapper and font config to [locale]/layout.tsx**
  Update `src/app/[locale]/layout.tsx` to handle localization HTML attributes and load global fonts.
  
  ```tsx
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
  ```

- [ ] **Step 3: Commit layout changes**
  ```bash
  git add src/app/layout.tsx src/app/[locale]/layout.tsx
  git commit -m "refactor: restructure layout system to dynamically inject html lang attribute"
  ```

---

### Task 3: Interactive Components Accessibility & Polish

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/AudioPlayer.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/ui/AIAssistant.tsx`

- [ ] **Step 1: Update Footer Tagline color**
  Modify `src/components/layout/Footer.tsx:24` to use `--color-oak-light` instead of `--color-oak`.
  
  ```tsx
                <p className="text-[var(--color-oak-light)] text-xs italic mt-0.5">{t('tagline')}</p>
  ```

- [ ] **Step 2: Update AudioPlayer play toggle button aria-label**
  Modify `src/components/layout/AudioPlayer.tsx:164` to use a precise and descriptive Hungarian label.
  
  ```tsx
            aria-label="Háttérzene lejátszása és némítása"
  ```

- [ ] **Step 3: Update Navbar accessibility controls**
  In `src/components/layout/Navbar.tsx`, add a language helper map and update aria-labels for language select triggers and the mobile hamburger toggle.
  
  ```tsx
  // Define language names map at the top of Navbar.tsx
  const langNames: Record<Locale, string> = {
    hu: 'Magyar',
    de: 'Német',
    en: 'Angol',
  };
  ```
  
  Update desktop language button:
  ```tsx
                      aria-label={`Nyelvválasztás: ${langNames[code]}`}
  ```
  
  Update mobile hamburger button:
  ```tsx
                aria-label={menuOpen ? "Navigációs menü bezárása" : "Navigációs menü megnyitása"}
  ```
  
  Update mobile language button:
  ```tsx
                    aria-label={`Nyelvválasztás: ${langNames[code]}`}
  ```

- [ ] **Step 4: Update AIAssistant button trigger and portrait image alt**
  In `src/components/ui/AIAssistant.tsx`, update the FAB button trigger aria-label, remove any tabindex redundancy from the parent wrapper container if present, and give the avatar a descriptive alt tag.
  
  Update trigger button (`src/components/ui/AIAssistant.tsx:331`):
  ```tsx
          aria-label={isOpen ? "AI Asszisztens bezárása" : "AI Asszisztens megnyitása"}
  ```
  
  Update Avatar Image (`src/components/ui/AIAssistant.tsx:217`):
  ```tsx
                    <Image
                      src="/nkep.jpg"
                      alt="Czimber Tibor portréja"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--color-spotlight)]/40"
                    />
  ```

- [ ] **Step 5: Commit accessibility and interactive polish**
  ```bash
  git add src/components/layout/Footer.tsx src/components/layout/AudioPlayer.tsx src/components/layout/Navbar.tsx src/components/ui/AIAssistant.tsx
  git commit -m "fix: inject aria-labels and apply color contrast fixes to interactive widgets"
  ```

---

### Task 4: Graphic Elements Alt Text & Polish

**Files:**
- Modify: `src/components/sections/TheatreOriginStory.tsx`
- Modify: `src/components/sections/ProjectsGallery.tsx`

- [ ] **Step 1: Update image alt text in TheatreOriginStory**
  Modify `src/components/sections/TheatreOriginStory.tsx:96` to provide contextual description.
  
  ```tsx
                alt="Czimber Tibor asztalosmester a műhelyben, színházi díszletépítő háttérrel"
  ```

- [ ] **Step 2: Update image alt text in ProjectsGallery GalleryCard**
  Modify `src/components/sections/ProjectsGallery.tsx:257` to provide contextual description.
  
  ```tsx
            alt={`Czimber Tibor asztalos munkája: ${title} kategória borítóképe`}
  ```

- [ ] **Step 3: Refine Lightbox in ProjectsGallery to support dynamic descriptive alt**
  Update `Lightbox` in `src/components/sections/ProjectsGallery.tsx` to receive and display the category name.
  
  Update component definition:
  ```tsx
  function Lightbox({
    images,
    index,
    onClose,
    labelClose,
    labelPrev,
    labelNext,
    galleryTitle,
  }: {
    images: string[];
    index: number;
    onClose: () => void;
    labelClose: string;
    labelPrev: string;
    labelNext: string;
    galleryTitle: string;
  }) {
  ```
  
  Update image rendering in Lightbox:
  ```tsx
        <img
          src={`/${encodeURI(images[current])}`}
          alt={`Czimber Tibor asztalos munkája: ${galleryTitle} – ${current + 1}. kép a(z) ${images.length}-ből`}
          loading="lazy"
          onClick={(e) => e.stopPropagation()}
          className="max-w-[90vw] max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
  ```
  
  Pass `galleryTitle` in the main component:
  ```tsx
        <Lightbox
          images={galleries[lightbox.key]}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          labelClose={t('close')}
          labelPrev={t('prev')}
          labelNext={t('next')}
          galleryTitle={categories.find(c => c.key === lightbox.key)?.title || ''}
        />
  ```

- [ ] **Step 4: Refine GalleryCard interactions (hover shadow & Spotlight glow)**
  Modify `GalleryCard` styling in `src/components/sections/ProjectsGallery.tsx`:
  
  Update wrapper card hover effects to add the spot-light shadow glow (`shadow-[0_0_15px_rgba(212,168,83,0.35)]` along with a grounding dark shadow):
  ```tsx
      <div className="group flex flex-col rounded-xl overflow-hidden border border-[var(--color-walnut)]/30 bg-black/30 hover:border-[var(--color-spotlight)]/50 hover:shadow-[0_0_15px_rgba(212,168,83,0.35),0_10px_25px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300">
  ```
  
  Update button hover effects to add the inner shadow:
  ```tsx
          <button
            onClick={() => onOpen(galleryKey)}
            className="w-full bg-[var(--color-spotlight)] text-[var(--color-stage)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--color-oak)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] active:scale-95 transition-all duration-200 text-sm min-h-[44px]"
          >
  ```

- [ ] **Step 5: Commit visual gallery & asset updates**
  ```bash
  git add src/components/sections/TheatreOriginStory.tsx src/components/sections/ProjectsGallery.tsx
  git commit -m "fix: enhance projects gallery and story images description and add premium hover polish"
  ```

---

### Task 5: Local build check and Verification

- [ ] **Step 1: Run production build check**
  Run: `npm run build`
  Expected: Command completes successfully without TypeScript compilation or Next.js build errors.

---

### Task 6: Release & Logging

- [ ] **Step 1: Push changes to main branch**
  Run: `git push origin main`
  Expected: Push finishes successfully and triggers Vercel automated release.

- [ ] **Step 2: Update status.log**
  Write deployment logs in `status.log`.
  
  ```markdown
  [DEPLOYMENT STATUS LOG]
  Feature: Visual Polish and Accessibility Improvements
  Project: Czimber Tibor EV Website (czimber-tibor)
  Target Branch: main
  Repository: https://github.com/pohi99999/czimber-tibor.git
  Commit: fix: visual polish and accessibility improvements based on Chrome AI audit
  Timestamp: 2026-07-16T14:15:00+02:00
  Status: SUCCESS - Pushed to main branch, Vercel auto-deployment active. Visual polish and WCAG AA accessibility improvements are live.
  ```

- [ ] **Step 3: Commit and push status.log**
  ```bash
  git add status.log
  git commit -m "chore: update status.log for visual polish release"
  git push origin main
  ```
