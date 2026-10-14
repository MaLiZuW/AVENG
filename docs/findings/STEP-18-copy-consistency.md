# STEP 18 - Copy consistency and cleanup (W5, W6, W7, W8, W11, W12)
Attach: rules, `docs/REPO_MAP.md`.

## What we solve
Contradicting claims, developer phrasing, repeated blocks and dead-looking buttons.

## Tasks
1. `src/config/levels.ts` as the single source of level names. Defaults: Level 1 "Skríning" (Zdarma), Level 2 "Detail" (290 €), Level 3 "Expert & DTO" (Po dohode). Remove "Silver", "Gold" and "Premium" from all public text and the PDF unless a flag `USE_TIER_NAMES` is true (default false).
2. Replace "odvetvový benchmark", "odvetvový štandard", "odvetvovému štandardu" with "referencia MSP" (adjust grammar: "voči referencii MSP"). Self-audit header SK: "L1 (20) → L2 (60) → L3 (180 / 6M + DTO) — hodnotenie bez viditeľných bodov, porovnanie s referenciou MSP a indikatívny potenciál úspor."
3. FAQ and copy fixes (verbatim SK):
   - consultation answer: "Napíšte cez kontaktný formulár alebo na vladimir@addvalueengineering.sk. Ozveme sa s návrhom termínu." plus, only when `NEXT_PUBLIC_BOOKING_URL` is set: " Termín si môžete vybrať aj priamo cez rezerváciu."
   - data processing answer: replace "Spracúvajú ich služby, ktoré web skutočne používa (hosting, databáza, e-mailové doručenie)." with "Údaje spracúvajú naši poskytovatelia hostingu, databázy a e-mailového doručenia."
   - retention answer: when `RETENTION_JOB_VERIFIED` is true use "Údaje auditu uchovávame najviac {RETENTION_DAYS} dní."; otherwise keep the neutral sentence.
4. Footer component with `variant`: "full" only on `/`; "compact" elsewhere (navigation, one legal line with name, IČO, seat, privacy link). `/kontakt/` keeps its details in the page body, not in a second block.
5. `/self-audit/`: keep a single notice paragraph (the pre-start notice from step 10); remove the extra heading "Ochrana dát & Transparentnosť pre majiteľov firiem", the duplicated paragraphs and the second link.
6. Buttons "Dohodnúť osobnú schôdzku" and "Požiadať o prístupový kód" become real `<a>` links: booking URL if set, otherwise `/kontakt/?predmet=schodzka` and `/kontakt/?predmet=level-2` or `level-3`. The contact form reads `predmet` client-side (static export) and prefills the subject/message.
7. `scripts/check-public-copy.ts` scans `out/` for the forbidden strings listed in `aveng-wave2.mdc`; npm script `check:copy`.

## Done when
`npm run check:copy` passes; no "Silver/Gold/Premium"; the self-audit page shows one privacy notice.

## Commit
`fix(copy): consistent levels and claims, no dev phrasing, compact footer` (body: W5 W6 W7 W8 W11 W12)

## Report then STOP
