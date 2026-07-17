# Műszaki SEO Tervezési Specifikáció – Czimber Tibor Weboldal

Ez a dokumentum rögzíti a Czimber Tibor asztalos weboldalához készített keresőoptimalizálási (SEO) beállításokat és dizájn döntéseket.

## Cél
A weboldal organikus láthatóságának maximalizálása, a többnyelvű tartalom (magyar, német, angol) megfelelő indexelése, valamint a keresőmotorok és közösségi oldalak számára optimális metaadatok biztosítása.

## Technikai Architektúra

### 1. Keresőrobotok Kezelése (Robots.txt)
- **Fájl:** `src/app/robots.ts`
- **Konfiguráció:** Minden keresőrobot számára engedélyezi a weboldal teljes körű feltérképezését, és hivatkozik a dinamikus sitemapre.
- **Sitemap URL:** `https://czimber-tibor.vercel.app/sitemap.xml`

### 2. Nyelvi Verziók Feltérképezése (Sitemap.xml)
- **Fájl:** `src/app/sitemap.ts`
- **Konfiguráció:** Dinamikus Next.js sitemap, amely tartalmazza a 3 nyelvi verziót:
  - Magyar (alapértelmezett, nincs nyelvi előtag): `https://czimber-tibor.vercel.app`
  - Német: `https://czimber-tibor.vercel.app/de`
  - Angol: `https://czimber-tibor.vercel.app/en`
- **Prioritások:** Főoldal: 1.0, Nyelvi változatok: 0.8.
- **Alternatívák:** A sitemapen belül az `alternates.languages` használatával a Google számára jelezzük a nyelvek közötti kapcsolatot.

### 3. Globális és Helyi Metadata
- **Globális fájl:** `src/app/layout.tsx` (Fallback értékek, OpenGraph, Twitter beállítások)
- **Helyi fájl:** `src/app/[locale]/layout.tsx` (Nyelvtől függő Title, hreflang / alternates beállítások)
- **MetadataBase:** `https://czimber-tibor.vercel.app`
- **Title sablon:**
  - Alapértelmezett: `Czimber Tibor Mesterasztalos | Prémium Egyedi Bútorok`
  - Sablon: `%s | Czimber Tibor Mesterasztalos`
- **Description:** Színházi precizitás, egyedi konyhabútorok, beépített szekrények Zalaegerszegen és Ausztriában.
