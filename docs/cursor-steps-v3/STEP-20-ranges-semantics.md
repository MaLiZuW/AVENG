# STEP 20 - Ranges for every level and clearer semantics (A2, A3, A12)
Attach: rules, `docs/REPO_MAP.md`, `src/lib/audit/presentation.ts`.

## What we solve
A single number is shown next to "reliability: low"; per-domain amounts are shown to the euro; the maturity score reads like a measured KPI.

## Tasks
1. View model `buildResultView(level, raw)` in the presentation layer returning: headline range, per-domain ranges, reliability, flags. Calculation files must show an empty `git diff`.
2. Reliability levels from the share of exactly-entered answers weighted by `w_q`: config `RELIABILITY_THRESHOLDS` (default: below 0.25 "nízka", below 0.60 "stredná", otherwise "vyššia"; `TODO(owner)`, heuristic not statistics).
3. Display rule: reliability "nízka" or "stredná" -> range; "vyššia" -> rounded point with "približne". Applies to the headline AND every per-domain amount (web, PDF, e-mail). The headline range is the sum of the per-domain lower and upper bounds, then rounded. Do not narrow ranges by level or by fixed percentages; uncertainty comes only from the A-E bands and exact inputs.
4. Zero-gap rule from step 06 stays ("bez výraznej medzery voči referencii").
5. Table heading SK: "Porovnanie voči referencii MSP (úroveň zrelosti, %)". Under the table, SK: "Úroveň zrelosti je skóre z vašich odpovedí, nie meraná hodnota ukazovateľa (napr. OTD alebo OEE)." Keep domain names (for example "D4 Logistika/OTD").
6. Tests: low reliability -> range; high -> point; lower <= upper; headline equals the sum of domain bounds; zero gap; consistent rounding between web and PDF.

## Done when
The Level 2 test profile (revenue 500 000 €, COGS 65 %, all card answers) shows ranges everywhere, no euro-precise values, and the new table note.

## Commit
`feat(audit): ranges for all levels, clearer maturity wording` (body: A2 A3 A12)

## Report then STOP
