# STEP 12 - Metadata, social previews, structured data, FAQ, sitemap (static export)
Attach: rules, `docs/REPO_MAP.md`, `src/config/company.ts`, `src/config/social.ts`.

## Tasks
1. Per route `generateMetadata` (or static `metadata`): unique `title` (<= 60 chars), `description` (<= 155), `canonical`, OG and Twitter tags, plus `metadataBase` with the production origin from config. Homepage title, SK: "AVENG | Procesný audit a technické vedenie pre MSP".
2. OG image: social networks do not render SVG. Create a 1200x630 PNG as a static file in `public/` and reference it with an absolute URL; PNG favicon/apple-touch-icon variants from `logo.svg`. Avoid dynamic `opengraph-image.tsx` unless it exports cleanly with `output: 'export'`.
3. JSON-LD via a typed `JsonLd` component rendered at build time:
   - one main `ProfessionalService` (AVENG) linked to `Organization` (AV – Agency, s. r. o.) via `parentOrganization`/`provider`, not two unrelated entities with the same `url`
   - address: `addressLocality` "Košeca", `postalCode` "01864", `addressCountry` "SK"; never put the postal code into `streetAddress` (omit the field if the street is unknown)
   - `founder.name` "Vladimir"; `sameAs` from `src/config/social.ts`, omitted when empty
   - `Service` on pillar pages, `BreadcrumbList`
4. FAQPage: a VISIBLE FAQ section (8-12 questions) whose content matches the schema. Write it in Slovak as a draft for owner approval: what a fractional engineering manager is, when it pays off, what Level 1/2/3 include, how data is processed, who it is for. No promo codes, no unverifiable claims, no "average of Slovak MSP".
5. `src/app/sitemap.ts` and `src/app/robots.ts` with `export const dynamic = 'force-static'` (or static `public/sitemap.xml` and `public/robots.txt`); list all public routes; sitemap URLs use the trailing-slash form used by the export. Audit results are client state, not routes: no `noindex` route needed.
6. Check `lang="sk"`, one `h1` per page, heading order, `alt` on images, internal linking.

## Done when
After `npm run build`, `out/sitemap.xml`, `out/robots.txt`, the PNG OG image and per-route metadata exist; JSON-LD parses as valid JSON on every page; every route has a unique title/description.

## Commit
`feat(seo): static-export-safe metadata, OG image, JSON-LD, FAQ, sitemap`

## Report then STOP
