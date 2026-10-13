# Plán Wave 2

Zdroj ID: `findings/FINDINGS-2026-10-13.md`. Kroky 16–21 sú zadané v `findings/STEP-*.md`. Ostatné ID krok zatiaľ nemajú.

| ID | Súbory | Krok |
|---|---|---|
| W1 | `src/app/ochrana-osobnych-udajov/page.tsx` | 16 |
| W2 | tá istá stránka; `src/lib/submitContactRequest.ts`; `supabase/functions/contact/`, `send-audit-report/`, `issue-unlock-code/` | 16 |
| W3 | `src/lib/seo.ts`; `src/app/layout.tsx`; stránky s `pageMetadata` | 17 |
| W4 | `src/app/o-nas/page.tsx`, `optimalizacia-a-ai/page.tsx`, `sluzby/[slug]/page.tsx`; `src/config/pillars.ts`; `src/components/sections/About.tsx`, `Optimization.tsx` | nezadaný |
| W5 | `AuditSection.tsx`, `AuditTeaser.tsx`, `Level2Gate.tsx`, `scoring-core.ts` (dôvod P3), `benchmarks.ts` | 18 |
| W6 | `src/components/sections/FaqSection.tsx`; veta o Web3Forms na stránke ochrany údajov | 18 |
| W7 | `src/components/sections/Footer.tsx` (aj `src/app/kontakt/page.tsx`) | 18 |
| W8 | `GdprBanner.tsx`, `AuditSection.tsx`, `src/config/retention.ts` | 18 |
| W9 | `src/config/company.ts`, `supabase/functions/_shared/company.ts` | vlastník, bez zmeny textu (krok 16 len zapíše do `OWNER_DECISIONS.md`, ak chýba ulica) |
| W10 | `keywords` v `src/app/layout.tsx` | 17 |
| W11 | `FaqSection.tsx` + `retentionPeriodClaimSk` v `src/config/retention.ts` | 18 |
| W12 | `Level2Gate.tsx`, `AuditTeaser.tsx`, `MeetingRequestModal.tsx`; `NEXT_PUBLIC_BOOKING_URL` v `Hero.tsx`, `Footer.tsx`, `kontakt/page.tsx` | 18 |
| W13 | v repozitári nie je | vlastník, bez kódu |
| A1 | `shared/audit-presentation.ts`; `presentation.ts`; `pdf.ts`; `ResultsDashboard.tsx` | 19 |
| A2 | `formatEur` / `toFixed` / `eur`+`pct` (web, `_shared.ts`); rozsahy v `presentation.ts` | 19 (formát) a 20 (rozsahy) |
| A3 | `buildLevel1Presentation` — mimo L1 len bod | 20 |
| A4 | `costFactor` v `src/lib/audit/benchmarks.ts`; použitie v `scoring-core.ts` | 21 |
| A5 | `pdf.ts`, `html.ts`, dôvod P3 v `scoring-core.ts`; zdrojová veta je vo FAQ, nie v PDF | 21 |
| A6 | `ResultsDashboard.tsx` (jedna tabuľka); `MetricExplainer.tsx` číta len L1 | nezadaný |
| A7 | `MetricExplainer.tsx`; volanie v `ResultsDashboard.tsx` | nezadaný |
| A8 | `RECOMMENDATION_BANK`, `buildRecommendations` v `scoring-core.ts` | nezadaný |
| A9 | pole `impact` v tej istej banke; text v `ResultsDashboard.tsx` | nezadaný |
| A10 | `Level2Gate.tsx`; vykreslenie kariet vo výsledku v `AuditSection.tsx`; session `src/lib/unlock/session.ts` | nezadaný |
| A11 | `toFixed` v `ResultsDashboard.tsx`; `label` v `benchmarks.ts`; veta „Celok je súčet procesov.“ | 19 |
| A12 | stĺpec percent v `ResultsDashboard.tsx` | 20 |
| A13 | `methodology` v `src/lib/audit/questions.ts` (OTD stále „Lean – lead time“); L2 `src/lib/audit/level2/p1.ts`…`p5.ts`; L3 `level3-questions.generated.ts`. Reťazce ISO 9001 / ISO 45001 v `src/` už nie sú (`docs/audit-question-review.md`) | 21 |
| A14 | farby a CTA URL v `supabase/functions/send-audit-report/pdf.ts`; štýly `html.ts` | nezadaný |
| A15 | `KpiReferenceTable.tsx`, `buildKpiComparisonRows` v `presentation.ts` | nezadaný |
| T1 | FAQ len `FaqSection.tsx` na `/` | nezadaný |
| T2 | `company.ts`, `src/lib/jsonld.ts`, stránka ochrany údajov | vlastník, bez kódu |
| T3 | analytický skript v repozitári nie je | nezadaný |
| T4 | Search Console, Bing, IndexNow v kóde nie sú | vlastník (časť), bez kódu; prípadný súbor nie je zadaný |
| T5 | rozpočet CWV ani skript WCAG v `package.json` nie je | nezadaný |
| T6 | `public/llms.txt` nie je | nezadaný |

Bez úpravy kódu (akcia vlastníka): W9, W13, T2, T4 (časť).
