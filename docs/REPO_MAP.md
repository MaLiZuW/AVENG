# AVENG repo map (STEP 00)

Static Next.js 14 App Router site → `out/` via FTP to WebSupport. Server logic = Supabase Edge Functions + DB.

## Next / Tailwind / deploy

| Item | Path |
|---|---|
| Next config | `next.config.mjs` — `output: "export"`, `trailingSlash: true`, `images.unoptimized: true` |
| Tailwind tokens | `tailwind.config.ts` — colors `ink`, `steel`, `signal`, `ember`; fonts `display`/`sans` |
| Env template | `.env.example` |
| Build / upload | `npm run build` → upload whole `out/` (incl. `.htaccess` from `public/.htaccess`) — `README.md`, `docs/AUDIT_REPORT_EMAIL.md` |
| Static assets | `public/` (`.htaccess`, logos) |

**Static-export incompatible (none present):** no `middleware.ts`, no `app/**/route.ts`, no Server Actions. Script `start` (`next start`) is unused for WebSupport. `robots.ts` / `sitemap.ts` lack `export const dynamic = 'force-static'` (export still builds them).

## Calculation engine

| Concept | Code mapping | Path |
|---|---|---|
| Engine / VDA numeric maps / `w_q` weights | `computeWeightedProcessPercent`, `NUMERIC_MAPPERS` | `src/lib/audit/calculationEngine.ts` |
| L1 public API | re-exports core | `src/lib/audit/scoring.ts` → `scoring-core.ts` |
| Gaps / overall | `buildResult`: `costFactor` (= **C_Pi**), `wcMultiplier` (M_WC path), `sme`/`wc` % (= **S_SME**/**S_WC**) | `src/lib/audit/scoring-core.ts` |
| Process constants | `PROCESSES[].weight`, `costFactor`, `wcMultiplier` | `src/lib/audit/benchmarks.ts` |
| Sector KPI → process benches | `getProcessBenchmarks()` | `src/lib/audit/benchmarks.ts` |
| Source copy | expert-estimate note | `src/config/benchmarks.ts` |
| Display bands / WC UI cap | bands + `MAX_DISPLAYED_POTENTIAL_SHARE` | `src/config/audit-bands.ts`, `src/config/audit-display.ts`, `src/lib/audit/presentation.ts` |
| L2/L3 + DTO (post-unlock) | dynamic import | `src/lib/audit/scoring-premium.ts` |

Identifier `k_Pi`: **not found** in source (docs refer to it conceptually).

## Results UI

- Dashboard / radar / banners / lead: `src/components/audit/ResultsDashboard.tsx`, `RadarChart.tsx`, `ResumeBanner.tsx`, `GdprBanner.tsx`, `LeadForm.tsx`, `MetricExplainer.tsx`
- Orchestration: `src/components/audit/AuditSection.tsx` (`/self-audit/` → `src/app/self-audit/page.tsx`)
- Presentation helpers: `src/lib/audit/presentation.ts`

## Questions / exact input

- L1 data: `src/lib/audit/questions.ts` (`NUMERIC_INPUT` + `numericUnit`)
- Card UI (“Poznáte presné číslo?”): `src/components/audit/AuditQuestionCard.tsx`
- L2: `src/lib/audit/level2-questions.ts` + `level2/p1.ts`…`p5.ts`
- L3: `src/lib/audit/level3-questions.ts` → `level3-questions.generated.ts` (`scripts/generate-l3.mjs`)

## Unlock / promo

| Role | Path |
|---|---|
| Client session + POST | `src/lib/unlock/session.ts` → `NEXT_PUBLIC_UNLOCK_API_URL` |
| Gates | `src/components/audit/Level2Gate.tsx` (`LevelGates.tsx` re-export) |
| Admin issue UI | `src/components/admin/AdminUnlockPanel.tsx`, `src/app/admin/page.tsx` |
| Verify EF | `supabase/functions/verify-promo/index.ts` (DB `unlock_codes` + legacy env lists; HMAC token) |
| Issue EF | `supabase/functions/issue-unlock-code/index.ts` |
| Table | `supabase/migrations/20261008170000_unlock_codes.sql` |
| Docs | `docs/ADMIN_UNLOCK_CODES.md` |

## Report e-mail (HTML/PDF)

- Client: `src/lib/sendAuditReport.ts` → `NEXT_PUBLIC_AUDIT_REPORT_API_URL`
- EF: `supabase/functions/send-audit-report/` (`index.ts`, `html.ts`, `pdf.ts`, `mark.ts`, `_shared.ts`)
- Payload: `{ lead_id?, full_name, work_email, company_name, phone, result: Pick<AuditResult,…> }` (`sendAuditReport.ts` / `_shared.ts` `ReportBody`)
- Owner doc: `docs/AUDIT_REPORT_EMAIL.md`

## Leads / retention / mail

- Schema: `supabase/schema.sql` — `audit_leads`, `audit_results` (anon INSERT RLS)
- Client insert: `src/lib/supabase.ts`; progress: `src/lib/audit/persist.ts`
- Contact forms: `src/lib/submitContactRequest.ts` (Web3Forms / FormSubmit)
- Purge scripts: `supabase/purge-28day.sql`; proposal `supabase/migrations/20261008140000_data_retention.sql`
- Flags: `src/config/retention.ts` (`RETENTION_JOB_VERIFIED=false`)
- Inventory: `docs/DATA_INVENTORY.md`

## Layout / SEO / chrome

- Root layout + fonts: `src/app/layout.tsx`
- JSON-LD: `src/components/JsonLd.tsx` + FAQ `src/components/sections/FaqSection.tsx`
- Header / Footer: `src/components/Header.tsx`, `src/components/sections/Footer.tsx`
- Company / social: `src/config/company.ts`, `src/config/social.ts`
- `src/app/robots.ts`, `src/app/sitemap.ts`

## Scripts / tests

- npm: `dev`, `build`/`export`, `lint`, `typecheck`, `smoke:audit`, `smoke:calc`, `audit:sanity`, `generate:l3` (`package.json`)
- Smoke / sanity: `scripts/smoke-*.mjs`, `scripts/audit-sanity.ts` (no Jest/Vitest runner)

## Wave 2

### Verejné metadáta (per route)
- Helper: `src/lib/seo.ts` — `pageMetadata` (title, description, canonical, OG, Twitter).
- Koreň: `src/app/layout.tsx` — `title.template` `%s | AVENG`, `keywords`, OG `url` = celý web, obrázok `/og-image.png`.
- `pageMetadata`: `src/app/page.tsx` (`absoluteTitle`), `o-nas/page.tsx`, `self-audit/page.tsx`, `sluzby/page.tsx`, `sluzby/[slug]/page.tsx` (`generateMetadata`), `optimalizacia-a-ai/page.tsx`, `ochrana-osobnych-udajov/page.tsx`, `kontakt/layout.tsx`.
- Bez helpera: `src/app/admin/page.tsx`. `robots` / `sitemap`: `src/app/robots.ts`, `src/app/sitemap.ts`.

### Päta
- `src/components/sections/Footer.tsx` — jeden plný kontaktný blok, bez `variant`.
- Všetky stránky v `src/app/` vrátane `kontakt/page.tsx` a `not-found.tsx`.

### Texty auditu (disclaimer, hint, titulky, päty)
- Spoločné L1 vety: `shared/audit-presentation.ts` (`LEVEL1_DISCLAIMER_SK`, `RELIABILITY_HINT_SK`, peňažné labely).
- Ten istý disclaimer aj mimo L1: `src/lib/audit/presentation.ts` `buildLevel1Presentation`.
- Zrkadlo pre správu: `supabase/functions/send-audit-report/_shared.ts` (`DISCLAIMER_SK`).
- Päta PDF, pevný L1 text: `supabase/functions/send-audit-report/pdf.ts` (reťazec „Indikatívny skríning“).
- Titulok výsledku a „Celok je súčet procesov.“: `src/components/audit/ResultsDashboard.tsx`.
- Hlavička („odvetvový benchmark“, štítok Premium): `src/components/audit/AuditSection.tsx`.
- Silver / Gold: `src/components/sections/AuditTeaser.tsx`, `src/components/audit/Level2Gate.tsx`.
- Anglické zátvorky sektorov: `src/lib/audit/benchmarks.ts` (`label`, napr. plastics).
- FAQ a vety pre vývojára: `src/components/sections/FaqSection.tsx`.
- Tri oznámenia na `/self-audit/`: `src/components/audit/GdprBanner.tsx` (intro aj setup) a odsek `auditStartNoticeSk()` v `AuditSection.tsx`; texty `src/config/retention.ts`.
- Sídlo bez ulice: `src/config/company.ts` `addressDisplay`; kópia `supabase/functions/_shared/company.ts`.
- Koncept stránky: `src/app/ochrana-osobnych-udajov/page.tsx` (banner, retention, sprostredkovatelia).

### Formát čísel a zaokrúhlenie
- Rozsah a 2 platné číslice: `shared/audit-presentation.ts` `round2sig`, `formatEurRange`.
- KPI percentá s čiarkou: `src/lib/audit/presentation.ts` `skNumber`.
- Percentá s bodkou: `ResultsDashboard.tsx` (`toFixed`).
- Eurá cez `Intl`: `src/lib/audit/scoring-core.ts` `formatEur` (aj `DtoSimulator.tsx`, `Level4OnsiteCard.tsx`).
- E-mail / PDF: `supabase/functions/send-audit-report/_shared.ts` `eur`, `pct` (`toFixed`).
- Zaokrúhlenie skóre (výpočet, nemeniť): `src/lib/audit/calculationEngine.ts`, `Math.round` v `scoring-core.ts`.

### Rozsah a spoľahlivosť
- Prahy: `shared/audit-presentation.ts` — `RELIABILITY_STREDNA_MIN` 0,25, `RELIABILITY_VYSSIA_MIN` 0,55; `reliabilityLevelFromShare`, `reliabilityWording`.
- Rozsah aj podiel presných odpovedí len pri `auditLevel === 1`: `src/lib/audit/presentation.ts` `estimateReliability`, `buildLevel1Presentation`. Inak bodový odhad.

### Výsledok na webe
- `ResultsDashboard.tsx`, `RadarChart.tsx`, `KpiReferenceTable.tsx`, `LeadForm.tsx`.
- L3: `DtoSimulator.tsx`. Obchôdzka: `Level4OnsiteCard.tsx`.
- Fáza `results`: `src/components/audit/AuditSection.tsx`.

### MetricExplainer
- `src/components/audit/MetricExplainer.tsx` — všetky L1 otázky domény (`questions.ts`).
- Jediné volanie: `ResultsDashboard.tsx` v slučke procesov.
- Metodika pri otázke: `src/components/audit/QuestionGuidance.tsx`.

### Odporúčania a štítok dopadu
- Pevná banka a top 3 podľa `gapSmeEur`; `impact` je konštanta, nie veľkosť medzery: `src/lib/audit/scoring-core.ts` `RECOMMENDATION_BANK`, `buildRecommendations`.
- Typ: `src/lib/audit/types.ts`. Zobrazenie: `ResultsDashboard.tsx`. PDF/HTML berú `recommendations` z výsledku.

### Karty odomknutia a úroveň
- Session: `src/lib/unlock/session.ts` — `sessionStorage` kľúč `aveng_unlock_session_v1`, `requestUnlock`. `hasUnlockFor` sa nikde nevolá.
- Karty: `Level2Gate.tsx` (`Level2Gate`, `Level3Gate`). Po kóde `AuditSection.startLevel` nastaví React stav `level`.
- Karty sa kreslia aj pri `phase === "results"` (`AuditSection.tsx`).
- `auditLevel` vo výsledku: argument `buildResult` v `scoring-core.ts`. Overenie kódu: `supabase/functions/verify-promo/index.ts`.

### PDF, šablóna, fonty, e-mail správy
- Funkcia: `supabase/functions/send-audit-report/index.ts` → `https://api.resend.com/emails`.
- HTML: `html.ts`. PDF: `pdf.ts` (pdf-lib, tmavé pozadie, CTA = URL). Fonty: Noto Sans z `cdn.jsdelivr.net`. Značka: `mark.ts`.
- Klient: `src/lib/sendAuditReport.ts` → `NEXT_PUBLIC_AUDIT_REPORT_API_URL`.

### Formuláre a odchádzajúce ciele
- Lead auditu: `LeadForm.tsx` → `src/lib/supabase.ts` `submitAuditLead` (`NEXT_PUBLIC_SUPABASE_URL`).
- Schôdzka / kód / obchôdzka: `MeetingRequestModal.tsx`, `Level4OnsiteCard.tsx` → `src/lib/submitContactRequest.ts` (`https://api.web3forms.com/submit`, záloha `https://formsubmit.co/ajax/…`).
- `/kontakt/`: `src/app/kontakt/page.tsx` → `src/lib/submitSiteContact.ts` → `NEXT_PUBLIC_CONTACT_API_URL` (`supabase/functions/contact/`).
- Admin: `src/components/admin/AdminUnlockPanel.tsx` → issue URL. Odomknutie: `session.ts` → verify-promo URL.
- Ďalší Resend: `supabase/functions/contact/index.ts`, `issue-unlock-code/index.ts`.
- Importy Deno (nie biznis dáta): `https://esm.sh/…` v `verify-promo`, `issue-unlock-code`, `pdf.ts`.
- Odkazy, nie `fetch`: citácie v `src/config/benchmarks.reference.json` (cez `KpiReferenceTable.tsx`). Sociálne URL v `src/config/social.ts` sú prázdne.

### Analytika, fonty, public, npm
- Analytický skript v `src/` a `supabase/functions/` nie je.
- Fonty webu: `src/app/layout.tsx` — `next/font/google` (Fraunces, Manrope), súbor vo výstupe buildu.
- `public/`: `.htaccess`, `og-image.png`, `og-image.svg`, `favicon-32.png`, `icon-192.png`, `apple-touch-icon.png`, `aveng-icon.svg`, `aveng-mark.png`, `logo.svg`.
- npm (`package.json`): `dev`, `build`, `export`, `start`, `lint`, `typecheck`, `generate:l3`, `smoke:audit`, `smoke:calc`, `audit:sanity`, `check:shared`, `check:benchmarks`.
