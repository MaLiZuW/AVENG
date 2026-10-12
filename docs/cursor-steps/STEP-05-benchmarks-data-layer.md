# STEP 05 - Benchmarks data layer (no UI yet)
Attach: rules, `docs/REPO_MAP.md`, `docs/benchmarks/benchmarks.seed.json`.

## Goal
Typed, sourced reference data that later steps can read. Existing model constants stay untouched.

## Tasks
1. Copy `docs/benchmarks/benchmarks.seed.json` to `src/config/benchmarks.reference.json` (content unchanged).
2. Create `src/config/benchmarks.ts`: typed loader with
   - `getKpiReference(key)` returning value ranges, `direction`, `confidence`, `sources`, `definitionNote`
   - `getReferenceSourceStatus()` returning `"published-secondary" | "expert-estimate"` per domain: `expert-estimate` for the existing `S_SME`/`S_WC` model values; `published-secondary` only for the four KPI keys in the JSON
   - `isBenchmarkAvailable(key)` (false for `hr_skills`)
3. Write `docs/benchmark-crosscheck.md` (Slovak): table comparing existing model references (`S_SME`, `S_WC` per domain, as found in the code) with the published ranges. State per domain: "podporené publikovanou hodnotou" / "nepodporené (expertný odhad)". Note that model scores are maturity scores, not KPI values, so a direct comparison is only indicative. Do not change any model value.
4. Add a unit/script check: every KPI has at least one source with a URL, and `hr_skills.available === false`.

## Do NOT
Edit `S_SME`, `S_WC`, `k_Pi`, `M_WC`. Do not render anything in the UI.

## Commit
`feat: add sourced benchmark reference data layer`

## Report then STOP
