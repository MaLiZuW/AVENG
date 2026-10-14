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
- Helper: `src/lib/seo.ts` — `buildMetadata` / `HOME_TITLE` (title, description, canonical, OG, Twitter).
- Koreň: `src/app/layout.tsx` — `metadataBase`, ikony, robots; bez `keywords`.
- `buildMetadata`: `page.tsx`, `o-nas/`, `self-audit/`, `sluzby/`, `sluzby/[slug]/` (`generateMetadata`), `optimalizacia-a-ai/`, `ochrana-osobnych-udajov/`, `kontakt/layout.tsx`, `admin/page.tsx`.
- `robots` / `sitemap`: `src/app/robots.ts`, `src/app/sitemap.ts`. Skript: `scripts/check-meta.ts` (`npm run check:meta`).

### Päta
- `src/components/sections/Footer.tsx` — `variant`: `"full"` len na `/` (`page.tsx`); inde `"compact"` (nav + právny riadok).

### Texty auditu (disclaimer, hint, titulky, päty)
- Per-level: `src/config/audit-copy.ts` (`disclaimerForLevel`, `reliabilityHintForLevel`, `pdfFooterForLevel`, `resultTitleForLevel`).
- Legacy L1 konštanty ešte v `shared/audit-presentation.ts`; view: `src/lib/audit/presentation.ts` `buildResultView`.
- PDF/HTML: `supabase/functions/send-audit-report/` (`pdf.ts`, `html.ts`, `_shared.ts`) cez audit-copy.
- Názvy úrovní: `src/config/levels.ts` (`USE_TIER_NAMES`, default false). Hlavička: `AuditSection.tsx`. Teaser/gate: `AuditTeaser.tsx`, `Level2Gate.tsx`.
- Sektorové labely: `src/lib/audit/benchmarks.ts`. FAQ: `FaqSection.tsx`.
- Jedno oznámenie `/self-audit/`: `auditStartNoticeSk()` v `AuditSection.tsx` + `src/config/retention.ts`.
- Sídlo: `src/config/company.ts` (`registeredSeat`); kópia `supabase/functions/_shared/company.ts`.
- Politika: `src/app/ochrana-osobnych-udajov/page.tsx` + `src/config/processors.ts`.

### Formát čísel a zaokrúhlenie
- Kanón: `src/lib/format.ts` (`formatPercent`, `formatEuroRounded`, `formatEuroRange`, `formatInt`, `round2sig`); zrkadlo v Edge cez shared sync.
- `shared/audit-presentation.ts` stále má `round2sig` / `formatEurRange` (legacy). `formatEur` v `scoring-core.ts` pre UI sumy.
- Zaokrúhlenie skóre (nemeniť): `calculationEngine.ts`, `Math.round` v `scoring-core.ts`.

### Rozsah a spoľahlivosť
- Prahy: `shared/audit-presentation.ts` `RELIABILITY_THRESHOLDS` (0,25 / 0,60).
- View: `presentation.ts` `buildResultView` (nízka/stredná → rozsah; vyššia → bod + „približne“); headline = súčet medzí domén.
- Tabuľka zrelosti: `LABEL_MATURITY_TABLE_SK` + `NOTE_MATURITY_TABLE_SK`.

### Výsledok / MetricExplainer / odporúčania
- Web: `ResultsDashboard.tsx`, `RadarChart.tsx`, `KpiReferenceTable.tsx`, `LeadForm.tsx`, `DtoSimulator.tsx`, `Level4OnsiteCard.tsx`; fáza `AuditSection.tsx`.
- `MetricExplainer.tsx` — volanie v `ResultsDashboard.tsx`; metodika pri otázke: `QuestionGuidance.tsx`.
- Odporúčania / `impact`: `scoring-core.ts` `RECOMMENDATION_BANK`, `buildRecommendations`; typ `types.ts`.

### Odomknutie, PDF, formuláre, sieť
- Session: `src/lib/unlock/session.ts`; karty `Level2Gate.tsx` / `Level3Gate`; stav `level` v `AuditSection.tsx`; verify `supabase/functions/verify-promo/`.
- PDF/e-mail: `send-audit-report/` → Resend; fonty Noto Sans z `cdn.jsdelivr.net`; klient `sendAuditReport.ts`.
- Lead: `supabase.ts` → `NEXT_PUBLIC_SUPABASE_URL`. Kontakt/schôdzka: `submitContactRequest.ts` + `submitSiteContact.ts` → `NEXT_PUBLIC_CONTACT_API_URL` (`contact/`). Bez Web3Forms/FormSubmit.
- Admin issue URL; Resend aj v `contact/`, `issue-unlock-code/`; Deno `esm.sh` v verify/issue/pdf.

### Analytika, fonty, public, npm
- Analytika: nie. Fonty webu: `next/font/google` (Fraunces, Manrope) v `layout.tsx`.
- `public/`: `.htaccess`, `og-image.png`/`.svg`, favicon/icon/apple, `aveng-icon.svg`, `aveng-mark.png`, `aveng-mark-white.png`, `logo.svg`.
- npm: `dev`, `build`, `export`, `start`, `lint`, `typecheck`, `generate:l3`, `smoke:audit`, `smoke:calc`, `audit:sanity`, `check:shared`, `check:benchmarks`, `check:meta`, `check:copy`.
