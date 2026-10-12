# STEP 08 - Methodology expander, metric explainers, KPI table, disclaimer
Attach: rules, `docs/REPO_MAP.md`, `src/config/benchmarks.ts`, `docs/benchmarks/benchmarks.seed.json`.

## Tasks
1. Expander next to the headline, SK title: "Ako sme dospeli k tomuto číslu?". Plain Slovak using the user's inputs (revenue and COGS if collected, process score vs reference, dominant domain). Optional collapsible "Technický detail" with the formula in text. No LaTeX.
2. Source sentence driven by `getReferenceSourceStatus()`:
   - expert estimate, SK: "Referenčné hodnoty MSP sú interné referencie AVENG založené na expertnom odhade, nie oficiálna štatistika."
   - published, SK: "Referencie sú medzinárodné orientačné hodnoty z verejných zdrojov (napr. ASQ, IISE, Vorne/OEE.com). Pre Slovensko verejný procesný benchmark nie je k dispozícii. Hodnoty sa líšia podľa odvetvia a spôsobu merania."
   Show both when the result uses both kinds.
3. KPI comparison table (only for answers entered as EXACT numbers), SK title: "Vaše KPI voči orientačným referenciám"; columns SK: "Ukazovateľ", "Vaša hodnota", "Typický podnik", "Špička", "Zdroj" (links from the JSON). Mapping:
   - add optional `kpiKey` (`oee_pct`, `otd_pct`, `copq_pct_of_sales`, `schedule_adherence_pct`) to the question data type for exact-input questions whose unit AND definition match the benchmark definition
   - when a definition does not match, do not map; list candidates in `docs/kpi-mapping-review.md` (Slovak) for the owner
   - never show a row for `hr_skills` or for a KPI without data; never use colour alone to convey better/worse
   - do not edit question texts
4. `MetricExplainer` component fed from the question metadata ("Čo meranie odhaľuje" + "Použitá metodika"). Keep the existing per-question block SK "Kontext merania a metodika". In the result, show an explainer per process/metric, collapsed by default, without duplicating texts.
5. Disclaimer directly under the headline and in the HTML/PDF report and e-mail (same shared presentation module as step 06), SK: "Výsledky Level 1 sú rýchla orientačná diagnostika založená na vašich odpovediach. Nepredstavujú záruku úspor. Pre presné priority a overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe."
6. Banner honesty, SK: "Výsledok naznačuje významnú medzeru v {domain} – odporúčame overenie priamo vo výrobe." CTA stays SK: "Dohodnúť termín obchôdzky vo výrobe".

## Done when
All blocks render with real data; KPI table appears only with exact inputs and sources; no "priemer MSP na Slovensku" anywhere (`grep -rni "priemer" src` reviewed).

## Commit
`feat: methodology expander, KPI reference table, metric explainers, disclaimer`

## Report then STOP
