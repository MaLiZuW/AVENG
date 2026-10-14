# Plán STEP 23 (A6, A15)

## Scope (iba tieto súbory)
| Súbor | Akcia |
|---|---|
| `src/lib/audit/question-breakdown.ts` | Nový: pásma A–E → SK, zoradenie, veta „Najviac vás brzdí“ |
| `src/components/audit/QuestionBreakdown.tsx` | Nový: „Rozpis po otázkach“ (L2/L3, collapsed) |
| `src/components/audit/ExactInputBlocks.tsx` | Nový: OEE/COPQ len pri existujúcich exact vstupoch |
| `src/components/audit/ResultsDashboard.tsx` | Zapojenie breakdown + blokov; props otázok |
| `src/components/audit/AuditSection.tsx` | Poslať L2/L3 otázky do dashboardu |
| `src/lib/audit/questions.ts` | `kpiKey: schedule_adherence_pct` na plan attainment |
| `src/lib/audit/presentation.ts` | Bunky pre `schedule_adherence_pct` (threshold, nie invented typical) |
| `src/components/sections/AuditTeaser.tsx` | Fallback sľub bez OEE/COPQ |
| `src/components/audit/Level2Gate.tsx` | Rovnaký fallback text (ak sľubuje OEE/COPQ) |
| `docs/l2-gap.md` | Chýbajúce exact vstupy A/P/Q pre OEE |
| `scripts/tests/kpi-table.ts` | Fixture: exact → 4 KPI; karty → prázdne |
| `docs/runs/plan-23.md` | Tento plán |
| `docs/runs/RUN-STATE.md` | Záznam + oprava hash STEP 22 |

## Mimo scope
`scoring-core.ts`, `calculationEngine.ts`, `benchmarks.ts` (model) — bez zmeny math. `benchmarks.ts` config len cez existujúci `getKpiReference`.

## OEE / COPQ
L2 nemá NUMERIC_INPUT pre Availability/Performance/Quality → OEE blok sa nezobrazí; gap v `docs/l2-gap.md`. COPQ blok len ak `numericOverrideValue` na L1-P3-Q2.

## Riziká
Žiadne; bez remote Supabase.
