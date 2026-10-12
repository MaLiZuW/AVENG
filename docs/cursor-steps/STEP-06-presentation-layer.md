# STEP 06 - Presentation layer: labels, ranges, reliability
Attach: rules, `docs/REPO_MAP.md`.

## Goal
The result shows indicative ranges instead of pseudo-precise numbers. Calculation unchanged.

## Tasks
1. Create `src/lib/audit/presentation.ts` between calculation and UI (calculation files must show an empty `git diff`).
2. Relabel everywhere (UI, export, e-mail), SK verbatim:
   | old | new |
   |---|---|
   | Ročná strata voči priemeru MSP na Slovensku | Indikatívny potenciál úspor voči referencii MSP |
   | Gap SME | Medzera voči referencii MSP |
   | Finančný únik podľa procesu | Indikatívny potenciál úspor podľa procesu |
   | Celkový potenciál úspor voči world-class špičke | Teoretický strop (world-class, nie cieľ) |
   | Podiel straty (and any "> 15 % nákladov podniku") | % z modelovej nákladovej bázy procesov |
   | SME SR (column, radar, legend) | Referencia MSP |
   | LEVEL 4 · ON-SITE AUDIT (banner kicker) | Odporúčaný ďalší krok: obchôdzka vo výrobe (Gemba Walk) |
   "Level 4" is no longer a level name; online levels are 1-3.
3. Ranges: headline = range rounded to 2 significant digits, formatted SK like "približne 560 – 860 tis. € / rok" (below 1 000 000: "tis. €"; from 1 000 000: "mil. €", one decimal, comma). Derive the range from input uncertainty only: card answers A-E map to bands (lower/upper) in `src/config/audit-bands.ts` (comment: expert estimates pending owner confirmation); an exact number gives lower = upper. Recompute score and gap at both bounds (monotonic).
4. Reliability: share of exactly-entered answers weighted by `w_q`, shown qualitatively, SK: "Spoľahlivosť odhadu: nízka" / "stredná" / "vyššia" plus hint SK: "Spoľahlivosť zvýšite zadaním presných čísel alebo prechodom na Level 2." Never as a percentage probability.
5. Zero/small gap: if the lower bound is 0 never show "0 – 0 €"; show SK: "bez výraznej medzery voči referencii" (or "do X tis. €" when the upper bound is non-zero).
6. No fixed ±% of the output as uncertainty. No accuracy claims ("±15 %", "±5 %").
7. Tests: formatter and range logic (rounding, thresholds tis./mil., zero gap, lower <= upper). Use the existing runner or `scripts/tests/*.ts` via `npx tsx`.

8. Report parity: the post-audit HTML/PDF report and the e-mail (built in a Supabase Edge Function) must show the same labels, ranges, reliability wording and disclaimer. Find where the report payload is built (see REPO_MAP). Put the pure formatting/range logic in a dependency-free TS module (no React/Node APIs) shared with the Edge Function (e.g. `shared/audit-presentation.ts`, imported by both), or keep a mirrored copy with a parity test. Do not change what data the report contains beyond relabeling and ranges.

## Done when
Level 1 result shows ranges and the reliability label; relabeling is complete (grep for old strings returns nothing); tests pass.

## Commit
`feat: indicative ranges, reliability label and relabeling`

## Report then STOP
