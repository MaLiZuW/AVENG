# Prompts for GitHub Copilot coding agent (copy and paste)

Where: GitHub → repository → **Agents** tab. Base branch: `remediation`. One prompt = one session = one pull request. Merge each PR into `remediation` and run `git pull` before the next prompt.

---

## PROMPT 1 — Content, metadata, redirects, privacy (phase 1)

```
ROLE
You are a senior Next.js (App Router, static export) engineer. Implement a content and SEO update on branch `remediation`. Branding must not change.

READ FIRST (in this order)
1. .github/copilot-instructions.md
2. docs/content-v2/00-README-SK.md
3. docs/content-v2/GLOBAL-RULES.md
4. docs/content-v2/seo.json
5. docs/content-v2/pages/01-domov.md ... 10-kontakt.md (phase 1 pages only; ignore 11 and 12)
6. docs/content-v2/REDIRECTS.md and docs/content-v2/PRIVACY-ADDITIONS.md
7. .cursor/rules/*.mdc and docs/REPO_MAP.md if present

STEP 0 (before editing)
Map every route in GLOBAL-RULES.md section 2 to the source files that render it (pages, layout, shared components, metadata). Write the map into the PR description (not into the repo).

TASKS
1. For each phase-1 page, replace the page copy with the spec text verbatim, in the given section order, using existing components and styles. Do not paraphrase. Keep the audit tool UI on /self-audit/ untouched; only change intro, level cards and FAQ around it. Keep the contact form fields and submission logic; change only the labels/texts listed in the spec.
2. Metadata: set title, description, canonical, Open Graph and Twitter for every route from docs/content-v2/seo.json via the Next.js metadata API. OG/Twitter derive from the same object. Use the full brand "AddValueEngineering" (never "AVENG") in titles. og:image stays /og-image.png; og:image:alt = "AddValueEngineering – projektové riešenie problémov vo výrobe". Remove the redundant googlebot meta. Ensure <html lang="sk">.
3. Global: apply GLOBAL-RULES.md sections 4, 5 and 7 (navigation, remove "HTTPS | GDPR" badge, footer region line, terminology: replace "Pilier 0X" eyebrows with "Projekt", "Súvisiace piliere" with "Súvisiace projekty").
4. Redirects: merge the legacy-URL rules from REDIRECTS.md into public/.htaccess without removing existing rules. Keep or add meta-refresh stubs with noindex + canonical only as fallback.
5. sitemap.xml and robots.txt via app/sitemap.ts and app/robots.ts (force-static) per REDIRECTS.md.
6. Privacy policy: apply PRIVACY-ADDITIONS.md. Verify in code whether any analytics/tracking is used before adding the cookies sentence.
7. Add scripts/check-content.mjs usage: add npm script "check:content": "node scripts/check-content.mjs" in package.json (script file already exists; do not modify its logic).

CONSTRAINTS
Do not touch the audit engine, question data, Supabase code, env files or dependencies. No new colors, fonts or UI libraries. Level 2 price "290 €" appears on the self-audit level card, the self-audit FAQ and the home price card; no other price anywhere. No hourly rate. No "fractional", "Head of Engineering", "Powered by", "Gemba Walk", "Morava", "pilier" in rendered text.

VERIFY
npm ci; npm run lint; npm run build; npm run check:content -- --phase=1. Fix every FAIL that your changes caused. If a FAIL is caused by existing audit-question text, report it instead of editing the questions.

DELIVERY
Small logical commits (copy, metadata, redirects/crawl files, privacy). Open a PR into `remediation` with: changed files, route → source map, full check output, and a list of decisions you could not make from the spec. Stop after the PR.
```

---

## PROMPT 2 — Structured data (phase 2)

```
ROLE
Senior Next.js engineer. Phase 1 is merged. Implement structured data on branch `remediation`.

READ: .github/copilot-instructions.md, docs/content-v2/STRUCTURED-DATA.md, docs/content-v2/seo.json, docs/content-v2/pages/*.md.

TASKS
1. Create one JSON-LD helper component (server-rendered, escapes "<" as <) and use it in the root layout (ProfessionalService + WebSite) and per page (Service on the five project pages and /self-audit/, AboutPage on /o-nas/, ContactPage on /kontakt/, BreadcrumbList on every page except "/", FAQPage on every page with a visible FAQ).
2. FAQPage must be generated from the same data array that renders the visible FAQ. Refactor the FAQ so the data lives in one place per page.
3. Use exactly the field values from STRUCTURED-DATA.md. No offers, ratings, reviews, sameAs, person data or invented fields.

VERIFY
npm run build; npm run check:content -- --phase=2. Also open out/index.html and one project page and confirm the JSON-LD is in the static HTML.

DELIVERY
PR into `remediation` with changed files and the check output. Stop after the PR.
```

---

## PROMPT 3 — UX and information flow (phase 3)

```
ROLE
Senior Next.js/Tailwind engineer. Phases 1 and 2 are merged. Implement UX additions on branch `remediation` WITHOUT changing branding.

READ: .github/copilot-instructions.md, docs/content-v2/UX-ADDITIONS.md, docs/content-v2/GLOBAL-RULES.md, docs/content-v2/pages/01-domov.md, 02-sluzby.md.

TASKS
1. Breadcrumb component (visible + feeds the existing BreadcrumbList helper), on every page except "/".
2. A single shared constant with route + label of the five project pages; use it for the home cards, /sluzby/ cards, breadcrumbs and a "Súvisiace projekty" block at the end of each project page.
3. Exactly one link per card (remove the duplicated "Viac o pilieri").
4. Trust strip and "Pre koho to nie je" block on the home page exactly as in the spec.
5. Mobile sticky CTA per UX-ADDITIONS.md section 6 (hidden on /kontakt/ and /self-audit/).
6. Heading structure per section 7 (first H2 on the home page must not repeat the H1).

Use only existing components and Tailwind tokens. No new colors, fonts or libraries.

VERIFY
npm run build; npm run check:content -- --phase=3. Take screenshots at 1280 px and 390 px width of "/", "/sluzby/", one project page, and attach or describe them in the PR (check: no horizontal scroll, sticky CTA does not cover content).

DELIVERY
PR into `remediation`. Stop after the PR.
```

---

## PROMPT 4 — Znalosti section (phase 4, OPTIONAL)

```
ROLE
Senior Next.js engineer. Phases 1-3 are merged. Add the optional "Znalosti" section on branch `remediation`.

READ: .github/copilot-instructions.md, docs/content-v2/pages/11-znalosti.md, 12-clanok-eco.md, seo.json, STRUCTURED-DATA.md (Article), GLOBAL-RULES.md.

TASKS
1. Routes /znalosti/ and /znalosti/co-je-eco/ with the spec text verbatim, using existing page layout and typography components.
2. Add "Znalosti" to the main navigation (before "Kontakt") and to the footer navigation. Add both routes to the sitemap. Add Article + BreadcrumbList JSON-LD.
3. Do NOT build the lead magnet or any e-mail capture (the spec contains it only as an owner note and must not be rendered).
4. Planned articles in the spec are shown as cards labelled "Plán" only if the spec says so; otherwise show only the finished article. If the "Plán" cards would be visible as empty promises, render them as plain text list without links under "Pripravujeme".

VERIFY
npm run build; npm run check:content -- --phase=4.

DELIVERY
PR into `remediation`. Stop after the PR.
```

---

## PROMPT 5 — Final QA (after all merges)

```
ROLE
QA engineer for a Next.js static export. Do not add features.

TASKS
1. npm ci; npm run lint; npm run build; npm run check:content -- --phase=4 (or the highest phase merged).
2. Fix only failures caused by content or markup (never the audit engine or question data).
3. Review out/ for: duplicate titles, duplicate descriptions, pages with more than one H1, internal links without trailing slash, images without alt, missing lang attribute.
4. Report the result in the PR description as a table: route | title length | description length | H1 count | JSON-LD types | status.

DELIVERY
PR into `remediation` with the fixes (if any) and the table. Stop after the PR.
```
