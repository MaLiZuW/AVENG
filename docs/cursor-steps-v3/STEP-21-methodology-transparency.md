# STEP 21 - Methodology transparency (A4, A5, A13)
Attach: rules, `docs/REPO_MAP.md`, `src/config/benchmarks.ts`, `docs/benchmark-crosscheck.md`.

## What we solve
The most influential assumption (cost base as shares of COGS) is hidden; the PDF lacks the source statement; some methodology tags look wrong.

## Tasks
1. "Technický detail" in the expander gets a table "Nákladová báza procesov": per domain the share of COGS read PROGRAMMATICALLY from the existing `k_Pi` constants (never copy numbers by hand) and the amount for the user's revenue and COGS. Column titles SK: "Doména", "Podiel z COGS", "Nákladová báza". Sentence below, SK: "Podiely sú expertný odhad AVENG, nie meraná hodnota vašej firmy."
2. Column "Zdroj referencie" with SK values driven by `docs/benchmark-crosscheck.md` / `benchmarks.ts`: "expertný odhad" or "orientačne zodpovedá verejným zdrojom" (only for domains the crosscheck marks as supported).
3. The source sentence (SK: "Referenčné hodnoty MSP sú interné referencie AVENG založené na expertnom odhade, nie oficiálna štatistika.") and the coefficient table go into the shared copy module so the web, the PDF and the e-mail show them.
4. Replace generated texts that say "voči odvetvovému štandardu" with SK: "voči referencii MSP" (domain descriptions, PDF, e-mail).
5. `docs/metodika-review.md` (Slovak): every question's "Metodika" tag with a verdict (OK / overiť / nepresné). Apply ONLY these neutral replacements: OTD tag "Lean – lead time" -> SK: "Lean – spoľahlivosť dodávok"; control plan tag "ISO 9001 – riadenie nezhôd a nápravné opatrenia" -> SK: "Riadenie kvality – kontrolný plán"; absence tag "WCM – People pillar; ISO 45001" -> SK: "WCM – People pillar". Do not change question texts.

## Done when
The expander shows the coefficient table with the user's amounts; no "odvetvov" in generated texts (`Select-String -Pattern "odvetvov" -Path src,supabase -Recurse`); the review document exists.

## Commit
`feat(audit): disclose cost-base coefficients and sources, fix tags` (body: A4 A5 A13)

## Report then STOP
