# STEP 11 - Split the single page into routes (static-export safe)
Attach: rules, `docs/REPO_MAP.md`.

## Routes
| Route | Content |
|---|---|
| `/` | Hero, 4 pillars (links to subpages), audit summary, FAQ slot, CTA |
| `/o-nas` | Story and approach (no invented references) |
| `/sluzby` | Overview |
| `/sluzby/fractional-technical-leadership` | Pillar 1 |
| `/sluzby/zavadzanie-procesov-plm-pdm` | Pillar 2 |
| `/sluzby/riadenie-zmien-eco` | Pillar 3 |
| `/sluzby/rozvoj-liderov-koucing` | Pillar 4 |
| `/optimalizacia-a-ai` | Processes, IS and AI for manufacturing MSP |
| `/self-audit` | Audit application |
| `/kontakt` | Form, booking, company details |
| `/ochrana-osobnych-udajov` | Already exists |

## Tasks
1. Create the routes. Base subpage copy ONLY on existing site content (extend factually, invent nothing). Move audit components under `/self-audit` without changing behaviour.
2. Static export rules: all routes statically generated; no dynamic routes without `generateStaticParams`; `trailingSlash: true` (each page exports as `route/index.html`, works on plain Apache without rewrites); `images: { unoptimized: true }`; a `404` page exported as `404.html`.
3. Create `public/.htaccess` (copied into `out/` by the build) with: HTTPS redirect, canonical host (www or non-www, matching `metadataBase`), `ErrorDocument 404 /404.html`, sensible caching for hashed assets, `X-Content-Type-Options: nosniff` and `Referrer-Policy`. Do not add a strict CSP without testing. Mark `TODO(owner): verify the hosting honours .htaccess`.
4. Redirects from the old WordPress site in the same `.htaccess` (301): `/zadarmo-pre-vas/` -> `/self-audit/`, `/category/category-1/` -> `/`. `/o-nas/`, `/sluzby/`, `/kontakt/` keep the same paths. List any other old URLs you can find in the repo notes; do not invent URLs.
5. Update header/nav and footer to real links. The homepage keeps short summary sections that link to subpages.
6. Do not add case studies or references. Create an empty, not rendered `CaseStudies` component and data file with `TODO(owner)`.

## Done when
`npm run build` produces `out/` with an `index.html` per route, `404.html` and `.htaccess`; internal links resolve (verify by scanning `out/` for broken internal hrefs with a small script); the audit works at `/self-audit`.

## Commit
`feat: split site into static routes, htaccess and legacy redirects`

## Report then STOP
