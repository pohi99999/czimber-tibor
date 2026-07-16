# Design Specification: Visual Polish & Accessibility (A11y/WCAG AA) Improvements

**Date:** 2026-07-16  
**Status:** Approved  
**Author:** Senior Frontend Developer & UI/UX Accessibility Expert  
**Target:** Next.js Application (`czimber-tibor`)

---

## 1. Goal & Requirements
Implement accessibility (WCAG AA compliance) and premium visual polish recommendations:
1. **Contrast & Color (WCAG AA):** Update `--color-stone` from `#6b5e52` to `#a8a29e` to ensure at least 4.5:1 contrast against dark backgrounds. Introduce `--color-oak-light` (`#b58c26`) for text rendered on dark backgrounds.
2. **Structure & SEO:** Set the dynamically active locale (e.g. `lang="hu"`) directly to the `<html>` element on render.
3. **Interactive A11y:** Inject descriptive `aria-label` attributes to interactive elements without visible text (audio player, mobile menu hamburger, language switchers, and AI Assistant trigger). Clean up redundant `tabindex` attributes.
4. **Descriptive Media:** Add descriptive `alt` tags to all `<img>` and `<Image>` components instead of generic filenames.
5. **Premium Polish:** Add an inner shadow to the "Galéria megtekintése" buttons on hover. Apply a spotlight border-glow effect on category cards on hover.

---

## 2. Technical Architecture & File Changes

### 2.1 Design Tokens & Styles (`src/app/globals.css`)
- Update `--color-stone` to `#a8a29e`.
- Define `--color-oak-light` as `#b58c26` in the `@theme inline` block.

### 2.2 Next.js Layout Structure
- **Root Layout (`src/app/layout.tsx`):**
  - Simplify to only return `{children}`.
- **Locale Layout (`src/app/[locale]/layout.tsx`):**
  - Move the `<html>` and `<body>` tags here.
  - Set the `lang` attribute to the dynamic `{locale}` param.
  - Import the fonts (`Inter`, `Playfair_Display`) and `globals.css` here to ensure correct rendering and styling scoping.

### 2.3 UI/UX Components A11y & Polish
- **Footer (`src/components/layout/Footer.tsx`):**
  - Use `text-[var(--color-oak-light)]` instead of `text-[var(--color-oak)]` for the tagline text.
- **AudioPlayer (`src/components/layout/AudioPlayer.tsx`):**
  - Update the play/mute toggle button `aria-label` to `"Háttérzene lejátszása és némítása"`.
- **Navbar (`src/components/layout/Navbar.tsx`):**
  - Update mobile menu toggle button `aria-label` dynamically: `aria-label={menuOpen ? "Navigációs menü bezárása" : "Navigációs menü megnyitása"}`.
  - Set localized `aria-label` for desktop and mobile language buttons: `aria-label={`Nyelvválasztás: ${langNames[code]}`}`.
- **AIAssistant (`src/components/ui/AIAssistant.tsx`):**
  - Set floating action button `aria-label` dynamically: `aria-label={isOpen ? "AI Asszisztens bezárása" : "AI Asszisztens megnyitása"}`.
  - Ensure parent containers do not have redundant `tabindex` attributes.
  - Make the portrait `Image` `alt` descriptive: `alt="Czimber Tibor portréja"`.
- **TheatreOriginStory (`src/components/sections/TheatreOriginStory.tsx`):**
  - Update the main image `alt` to: `alt="Czimber Tibor asztalosmester a műhelyben, színházi díszletépítő háttérrel"`.
- **ProjectsGallery (`src/components/sections/ProjectsGallery.tsx`):**
  - Update cover image `alt` in `GalleryCard`: `alt={`Czimber Tibor asztalos munkája: ${title} kategória borítóképe"}`.
  - Pass category `title` to `Lightbox` and set the main lightbox `img` `alt` dynamically: `alt={`Czimber Tibor asztalos munkája: ${galleryTitle} – ${current + 1}. kép a(z) ${images.length}-ből"`}`.
  - Add `hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]` to the "Galéria megtekintése" button.
  - Add `hover:shadow-[0_0_15px_rgba(212,168,83,0.35),0_10px_25px_rgba(0,0,0,0.5)]` to the `GalleryCard` container.

---

## 3. Verification Plan
1. **Local Build:** Run `npm run build` to verify there are no compilation, hydration, or TypeScript errors.
2. **Local Lint & Typecheck:** Ensure files compile correctly.
3. **Git & Deploy:** Commit changes with the message `fix: visual polish and accessibility improvements based on Chrome AI audit`, push to the remote repository, and verify deployment.
