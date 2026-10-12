# STEP 07 - Consistency fix for the world-class block, plausibility, sanity report
Attach: rules, `docs/REPO_MAP.md`, `src/lib/audit/presentation.ts`.

## Known defect
The "Teoretický strop (world-class)" can be lower than the MSP gap range shown above it (observed: ceiling about 1.0-1.2 mil. EUR vs MSP gap 0.98-1.5 mil. EUR). A ceiling below the headline is logically impossible. The cap is applied to one value only.

## Tasks
1. Flags (config): `SHOW_WORLD_CLASS_CEILING` (default false), `MAX_DISPLAYED_POTENTIAL_SHARE` (default 0.35, unvalidated placeholder, `TODO(owner)`), `PLAUSIBILITY_WARN_SHARE_OF_SALES` (default 0.20, `TODO(owner)`).
2. World-class display logic in the presentation layer:
   a. if `rawWC < rawSME` (model inconsistency) -> hide the block and log an error;
   b. else `cappedWC = min(rawWC, MAX_DISPLAYED_POTENTIAL_SHARE x processCostBase)`;
   c. if `cappedWC` is lower than the upper bound of the displayed MSP range -> hide the block (never show a ceiling below the headline);
   d. otherwise show it in a secondary block, SK: "Teoretický strop (nie cieľ)", with the cap note SK: "obmedzené na primeranú hranicu" only when capped.
   Block only rendered when `SHOW_WORLD_CLASS_CEILING` is true. When false it appears nowhere (result, HTML/PDF report, e-mail). The report/e-mail generator in the Edge Function must use the same decision logic (shared module from step 06).
3. Plausibility notice: if revenue is collected and `rawSME / revenue` exceeds `PLAUSIBILITY_WARN_SHARE_OF_SALES`, show under the headline, SK: "Vypočítaná medzera patrí k vyšším hodnotám. Odporúčame overiť vstupy (Level 2/3 alebo obchôdzka vo výrobe)."
4. `scripts/audit-invariants.ts` (run with `npx tsx`): over the 8 synthetic profiles below plus 200 random answer sets, assert: per-domain and total `WC gap >= SME gap`; displayed ranges have `low <= high`; displayed WC is never lower than the displayed MSP upper bound (otherwise block hidden). Exit non-zero on failure. Add npm script `audit:invariants`.
5. `scripts/audit-sanity.ts` -> `docs/audit-sanity-report.md` (Slovak). Profiles: all A, all E, average, good, weak, one very bad domain, mixed, borderline. Columns: domain scores, MSP gap, WC gap, share of cost base, share of revenue, share of gross margin (revenue x (1 - COGS)), and for D3/quality the MSP gap as % of revenue next to the published COPQ range from `src/config/benchmarks.ts` (informational only). Read-only: no data or config changes.
6. If the report shows realistic profiles with a world-class share above 0.5, DO NOT touch the model: record it in `docs/OWNER_DECISIONS.md` with the values of `k_Pi`, `S_SME`, `S_WC`, `M_WC` and their sources.

## Do NOT
Change formulas or coefficients. Enable `SHOW_WORLD_CLASS_CEILING` by default.

## Done when
`npm run audit:invariants` passes; the screenshot defect cannot occur; both docs exist.

## Commit
`fix: world-class ceiling consistency, plausibility notice, sanity tooling`

## Report then STOP (include the sanity table summary)
