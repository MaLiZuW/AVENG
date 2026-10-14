# STEP 22 - Result page structure (A7, A8, A9, A10)
Attach: rules, `docs/REPO_MAP.md`, `src/lib/audit/presentation.ts`.

## What we solve
Metric explainers repeat three times, recommendations look templated, impact labels contradict the euro gap, and the Level 2 unlock card stays visible after unlocking.

## Tasks
1. Explainers once: render `MetricExplainer` only inside the per-domain card ("Indikatívny potenciál úspor podľa procesu"). In the critical-domain block and in each recommendation replace the explainer with a control SK: "Zobraziť metriky domény" that scrolls to and expands that domain's explainer (anchor + `aria-expanded`). Collapsed by default.
2. Recommendations from answers: `src/lib/audit/recommendations.ts` picks, per domain, the weakest questions (lowest answer band, ties by `w_q`) and prefixes the EXISTING domain text with SK: "Najslabšie hodnotená oblasť: {metricShortName}." (short name from the question data; if missing, the question text trimmed to 60 characters). Do not write new recommendation content. List questions that have no per-question text in `docs/recommendations-gap.md` (Slovak) for the owner.
3. Impact label from the share of the total gap, config `IMPACT_THRESHOLDS` (default: >= 35 % SK "dopad vysoký", 15 – 35 % "dopad stredný", below 15 % "dopad nižší"; `TODO(owner)`). Recommendations are ordered by gap descending.
4. Unlock cards: derive `unlockedLevel` from the verified token/session. When Level 2 is unlocked, show on the Level 2 result only the Level 3 card; the Level 2 card is replaced by SK: "Level 2 je odomknutý". Replace the locked-card text "Po úhrade dostanete prístupový kód e-mailom" with SK: "Prístupový kód vám zašleme e-mailom po objednaní." and make the button SK: "Objednať Level 2" link to `/kontakt/?predmet=level-2` (Level 3: "Objednať Level 3" -> `?predmet=level-3`). The payment method is an owner decision; record it in `docs/OWNER_DECISIONS.md`.
5. Tests: impact labels for the 500 000 € / 65 % COGS test profile give D3 high, D4 medium, D1 lower; ordering follows the gap.

## Done when
Each domain explainer exists exactly once in the DOM; impact labels follow the gap; the Level 2 card is hidden after unlock.

## Commit
`feat(audit): single explainers, answer-based recommendations, consistent impact, unlock states` (body: A7 A8 A9 A10)

## Report then STOP
