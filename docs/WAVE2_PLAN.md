# Plán Wave 2

Zdroj ID: `docs/findings/FINDINGS-2026-10-13.md`. Kroky: `docs/cursor-steps-v3/STEP-NN-*.md`.

| ID | Súbory | Krok |
|---|---|---|
| W1 | `src/app/ochrana-osobnych-udajov/page.tsx`; `src/config/retention.ts` | 16 |
| W2 | politika; `src/config/processors.ts`; `submitContactRequest.ts`; `submitSiteContact.ts`; `supabase/functions/contact/` | 16 |
| W3 | `src/lib/seo.ts`; stránky s `buildMetadata`; `scripts/check-meta.ts` | 17 |
| W4 | `o-nas/`, `optimalizacia-a-ai/`, `sluzby/[slug]/`; `pillars.ts`; `About.tsx`, `Optimization.tsx` | 25–26 |
| W5 | `levels.ts`; `AuditSection.tsx`, `AuditTeaser.tsx`, `Level2Gate.tsx`; texty „referencia MSP“ | 18 |
| W6 | `FaqSection.tsx`; politika (žiadne vývojárske vety) | 18 |
| W7 | `Footer.tsx` (`variant`); `kontakt/page.tsx` | 18 |
| W8 | `AuditSection.tsx` + `retention.ts` (jedno oznámenie; `GdprBanner` odstránený) | 18 |
| W9 | `company.ts`, `_shared/company.ts` | vlastník (bez zmeny textu) |
| W10 | `keywords` (odstránené); `check-meta.ts` | 17 |
| W11 | `FaqSection.tsx` + `retentionPeriodClaimSk` | 18 |
| W12 | `Level2Gate.tsx`, `AuditTeaser.tsx`, `MeetingRequestModal.tsx`; `kontakt/?predmet=` | 18 |
| W13 | mimo repozitára | vlastník, bez kódu |
| A1 | `src/config/audit-copy.ts`; `presentation.ts`; `pdf.ts` / `html.ts` | 19 |
| A2 | `src/lib/format.ts`; rozsahy v `presentation.ts` | 19 (formát), 20 (rozsahy) |
| A3 | `buildResultView` — nízka/stredná → rozsah na každej úrovni | 20 |
| A4 | `costFactor` v `benchmarks.ts`; disclosure v `ResultsDashboard.tsx` / copy | 21 |
| A5 | `pdf.ts`, `html.ts`, `audit-copy` / benchmarks source sentence | 21 |
| A6 | `ResultsDashboard.tsx`; `MetricExplainer.tsx` | 22–23 |
| A7 | `MetricExplainer.tsx`; `ResultsDashboard.tsx` | 22 |
| A8 | `RECOMMENDATION_BANK`, `buildRecommendations` v `scoring-core.ts` | 22–23 |
| A9 | pole `impact` v banke; text v `ResultsDashboard.tsx` | 22–23 |
| A10 | `Level2Gate.tsx`; `AuditSection.tsx`; `unlock/session.ts` | 22–23 |
| A11 | `format.ts`; labely sektorov; veta o súčte medzier | 19 |
| A12 | nadpis/poznámka tabuľky zrelosti v `presentation` / dashboard | 20 |
| A13 | `questions.ts` (tagy); `docs/metodika-review.md` | 21 |
| A14 | `send-audit-report/pdf.ts`, `html.ts` | 24 |
| A15 | `KpiReferenceTable.tsx`, `buildKpiComparisonRows` | 22+ |
| T1 | FAQ per page; content kroky | 25–26 |
| T2 | `company.ts`, `jsonld.ts`, politika | vlastník, bez kódu |
| T3 | analytika v kóde nie je | 27 |
| T4 | Search Console / Bing / IndexNow v kóde nie sú | vlastník (časť); 27 |
| T5 | CWV / WCAG | 28 |
| T6 | `public/llms.txt` nie je | 27 |

Bez úpravy kódu (akcia vlastníka): W9, W13, T2, T4 (časť).
