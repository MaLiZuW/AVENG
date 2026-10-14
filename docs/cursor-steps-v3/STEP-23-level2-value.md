# STEP 23 - What Level 2 actually delivers (A6, A15)
Attach: rules, `docs/REPO_MAP.md`, `src/config/benchmarks.ts`.

## What we solve
A 290 EUR result currently looks like Level 1 plus definitions. We add real, answer-based detail without inventing data.

## Tasks
1. "Rozpis po otázkach" per domain (collapsed), Level 2 and 3 only. Per question: short text, the user's answer as a qualitative band SK: "kritické" / "slabé" / "priemerné" / "dobré" / "silné" (mapped from A-E; no numeric points shown), and the exact value with its unit when the user typed a number. Weakest first. Band is conveyed by text and icon, never by colour alone.
2. OEE decomposition: only if exact inputs for availability, performance and quality exist in the question data, show OEE = A x P x Q next to the published reference from `benchmarks.ts` (typical, world-class, sources). Otherwise do not estimate; list missing inputs in `docs/l2-gap.md` (Slovak).
3. COPQ: only if the exact "COPQ % of revenue" answer exists, show the value versus the published typical range and the euro equivalent on the user's revenue, with the definition note. Otherwise skip.
4. KPI table (step 08): add a fixture test proving it renders for exact answers (OEE, OTD, COPQ, plan attainment) and is absent for card answers; make sure all four mappings work on L1-L3.
5. One templated sentence per domain, SK: "Najviac vás brzdí: {m1} a {m2}." (two weakest metrics).
6. Align the promise with the delivery: if an OEE/COPQ section cannot be shown, the Level 2 card text must not promise it. Fallback card text SK: "Rozpis po otázkach, prioritizácia podľa finančného dopadu, podklad na poradu majiteľov."

## Done when
A Level 2 run with card answers shows the per-question breakdown; a run with exact numbers also shows the KPI table and, where inputs exist, the OEE/COPQ blocks.

## Commit
`feat(audit): level 2 per-question breakdown and exact-input blocks` (body: A6 A15)

## Report then STOP
