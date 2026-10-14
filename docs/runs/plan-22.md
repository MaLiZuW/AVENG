# Plán STEP 22 (A7, A8, A9, A10)

## Scope (iba tieto súbory)
| Súbor | Akcia |
|---|---|
| `src/config/impact.ts` | Nový: `IMPACT_THRESHOLDS` (0,35 / 0,15) + `TODO(owner)` |
| `src/lib/audit/recommendations.ts` | Nový: najslabšia otázka, prefix, impact zo share medzery, zoradenie |
| `src/lib/audit/types.ts` | Impact union: `nižší` namiesto `nízky` |
| `src/components/audit/MetricExplainer.tsx` | Kotva `id`, riadené `open` / `onOpenChange` |
| `src/components/audit/ResultsDashboard.tsx` | Explainer 1×; ovládač „Zobraziť metriky domény“; enrich odporúčaní |
| `src/components/audit/Level2Gate.tsx` | Text/CTA objednávky; stav „Level 2 je odomknutý“ |
| `src/components/audit/AuditSection.tsx` | `unlockedLevel` zo session; L2 karta vs. L3 |
| `docs/recommendations-gap.md` | Zoznam otázok bez per-question textu |
| `docs/OWNER_DECISIONS.md` | Otvorené: spôsob úhrady Level 2/3 |
| `scripts/tests/impact-recommendations.ts` | Test: 500 k€ / 65 % → D3 vysoký, D4 stredný, D1 nižší |
| `docs/runs/plan-22.md` | Tento plán |
| `docs/runs/RUN-STATE.md` | Záznam behu |

## Mimo scope (nemením)
`scoring-core.ts`, `calculationEngine.ts`, `benchmarks.ts` — výpočtová matematika ostáva. Impact/prefix sú presentation vrstva nad `AuditResult`.

## Riziká
Žiadne; bez remote Supabase.
