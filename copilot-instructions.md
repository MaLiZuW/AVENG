# Copilot instructions: AddValueEngineering website

Repository: Next.js (App Router), static export (`output: "export"` → `out/`), deployed by FTP to Apache hosting (WebSupport). There is NO server runtime on the website itself: no Route Handlers, Server Actions or middleware. Server logic lives in Supabase Edge Functions.

## Language
- All user-facing copy is Slovak (sk-SK). Code, comments, commit messages and PR text are English.
- Use a non-breaking space between a number and "€" (e.g. `290&nbsp;€`) and in "s. r. o.".

## Source of truth for the current content update
Read `docs/content-v2/00-README-SK.md` first, then `docs/content-v2/GLOBAL-RULES.md`.
Page copy lives in `docs/content-v2/pages/*.md`. SEO data lives in `docs/content-v2/seo.json`.
Copy text VERBATIM from the spec. Do not paraphrase, shorten, "improve" or add claims.
`docs/content-v2/reference/aveng-novy-web-nahlad-v2.html` is a content/structure preview only. NEVER copy its CSS, colors, fonts or layout.

## Branding (do not change)
Keep the existing logo, color tokens, fonts, spacing scale, header/footer look and existing components. Reuse existing components and Tailwind tokens. Do not introduce new colors, fonts, icon sets or UI libraries. Any new element (breadcrumbs, related-projects list, sticky mobile CTA) must be styled from existing tokens/components.

## Do not touch
- audit calculation engine, question data files and their text, scoring constants, benchmarks
- `supabase/` (migrations, Edge Functions), `.env*`, secrets, `package.json` dependencies (no new dependencies; devDependencies only if unavoidable and explained in the PR)
- the audit tool UI logic on `/self-audit/` (only the intro, level cards and FAQ copy around it change)

## Hard content rules (enforced by `npm run check:content`)
- Never output: "fractional", "Head of Engineering", "Powered by", "Gemba Walk", "Morava", an hourly rate, "pilier/piliere" in rendered text.
- The only euro amount shown on the website (outside the audit tool itself) is "290 €" (Level 2).
- No photo, surname, social-network links or client names. BCTC is plain text only.
- Titles use the full brand: `... | AddValueEngineering`, never `| AVENG`.
- One `<h1>` per page. Exactly one canonical per page, absolute, with trailing slash.
- FAQ markup and FAQPage JSON-LD must be generated from the same data as the visible FAQ.

## Definition of done for every task
1. `npm ci`, `npm run lint`, `npm run build` pass (if fonts cannot be downloaded in your environment, say so in the PR; do not change font loading).
2. `npm run check:content -- --phase=<N>` passes (script is in `scripts/check-content.mjs`; add the npm script `check:content` if missing).
3. PR targets branch `remediation`. PR description lists: changed files, route → source-file map, check output, and every decision you could not make from the spec.
4. Stop after opening the PR. Do not start the next phase.
