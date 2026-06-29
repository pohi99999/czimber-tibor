# Changelog

All notable changes to the Cimbi Weboldal project are documented here.

## [1.1.0] – 2026-06-29 – Visual & Layout Audit Fixes

### 🐛 Bug Fixes

#### Navbar (`src/components/layout/Navbar.tsx`)
- **REMOVED** duplicate mobile hamburger button that was incorrectly nested inside the `hidden md:flex` desktop container, causing double rendering on desktop
- **REMOVED** unused `import Link from 'next/link'` (dead import)
- **FIXED** broken `#about` anchor: merged the "Rólam" nav link with `#story` (TheatreOriginStory section carries this content) — previously navigated to a non-existent anchor
- **REDUCED** nav items from 6 to 5 — cleaner, less cluttered on tablet breakpoints
- **IMPROVED** mobile language switcher touch targets: added `min-h-[44px] px-2` per WCAG 2.5.5 (44×44px minimum)
- **IMPROVED** hamburger button: added `min-w-[44px] min-h-[44px]` and `aria-expanded` attribute

#### HeroSection (`src/components/sections/HeroSection.tsx`)
- **REMOVED** unused `import Link from 'next/link'` (dead import)
- **FIXED** duplicate `<h1>` tags (SEO violation): merged into single `<h1>` with two `<span>` children — one page should have only one `<h1>`
- **FIXED** mobile typography overflow: headings were `text-5xl` (48px) on mobile (375px viewport) causing overflow; updated to `text-3xl sm:text-5xl md:text-7xl`
- **FIXED** CTA buttons not full-width on mobile: added `w-full sm:w-auto` so buttons fill the screen width on small devices
- **IMPROVED** tagline tracking: `tracking-[0.2em]` on mobile, `tracking-[0.3em]` on sm+ (was fixed, caused overflow on narrow screens)
- **IMPROVED** content padding: changed `px-4` to `px-6` for better breathing room and added `w-full` to content container

#### Global CSS (`src/app/globals.css`)
- **FIXED** section anchor scrolling: added `scroll-padding-top: 6rem` to `html` element — previously all anchor links scrolled sections underneath the fixed navbar (96px tall)

#### TheatreOriginStory (`src/components/sections/TheatreOriginStory.tsx`)
- **FIXED** StatCard mobile layout: reduced padding from `p-6` to `p-3 sm:p-6` — on 375px wide mobile with 3-column grid, each card was ~108px wide, causing text overflow
- **FIXED** StatCard font sizes: `text-2xl sm:text-4xl` for value, `text-[10px] sm:text-sm` for label — prevents CLS and overflow on narrow screens

#### ProjectsGallery (`src/components/sections/ProjectsGallery.tsx`)
- **FIXED** Lightbox navigation buttons clipping off-screen on mobile: previously used `-translate-x-14` / `translate-x-14` (56px outside image), which pushed buttons off a 375px screen. Replaced with `left-0 sm:-left-14` / `right-0 sm:-right-14` — buttons now sit inside the padded container on mobile, outside on desktop
- **FIXED** Missing body scroll lock: added `document.body.style.overflow = 'hidden'` on Lightbox open, restored on close — previously background was scrollable while Lightbox was visible
- **FIXED** Lightbox `<img>` missing `loading="lazy"` attribute — potential performance regression for large gallery sets
- **IMPROVED** Lightbox close button positioning: `top-2 right-2` on mobile (inside viewport), `-top-4 -right-4` on sm+ (outside image) — was hidden behind the image edge on small screens
- **IMPROVED** Lightbox max-height: `max-h-[80vh]` on mobile (was 85vh) — leaves room for browser chrome on mobile

#### QuoteForm (`src/components/sections/QuoteForm.tsx`)
- **FIXED** Budget RadioGroup layout: was `sm:grid-cols-3` with 4 options, creating an asymmetric 3+1 row at sm breakpoint; changed to `cols2` prop → `sm:grid-cols-2` for a clean 2×2 grid
- **FIXED** Insufficient touch targets on all form buttons: increased `py-3` → `py-3.5` and added `min-h-[44px]` per WCAG 2.5.5 — critical for mobile UX
- **ADDED** `cols2` prop to `RadioGroup` component — allows per-instance column configuration without duplicating the component

### ✅ Performance
- No additional JavaScript bundle size increase
- All changes are CSS/class-level (Tailwind utilities)
- Build remains clean: 0 TypeScript errors, 0 warnings

---

## [1.0.0] – 2026-06-29 – Initial Next.js Modernization

### ✨ Features
- Migrated single-file HTML to Next.js 16.2.9 App Router architecture
- Implemented next-intl v4 with URL-based i18n (HU `/`, DE `/de`, EN `/en`)
- Brand design system: walnut/oak/spotlight CSS custom properties, Playfair Display + Inter fonts
- HeroSection: full-screen video background with theatrical tagline
- TheatreOriginStory: 3-act timeline storytelling (USP: theatrical background)
- ServicesSection: animated service card grid
- ProjectsGallery: `next/image` optimized gallery with keyboard-navigable Lightbox
- QuoteForm: 3-step wizard with lead scoring (hot🔥 / warm🌡️ / cold❄️)
- ContactSection: contact details + embedded Google Maps
- API route `/api/ajanlat` with Resend email integration and lead scoring
- Migrated all 44 assets (photos + video) to `public/` with `next/image` optimization
- `proxy.ts` (Next.js 16 renamed middleware convention)
- Git branch strategy: `main` (production) + `develop` (active development)
