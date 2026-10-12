# STEP 10 - Notice before the audit starts
Attach: rules, `docs/REPO_MAP.md`, retention config from step 04.

## Tasks
Directly above the Level 1 start button add a short neutral notice (lucide icon, no emoji):
- When `RETENTION_JOB_VERIFIED` is true, SK: "Odpovede používame na vyhodnotenie auditu. Údaje uchovávame najviac {RETENTION_DAYS} dní. Podrobnosti nájdete v Zásadách ochrany osobných údajov."
- Otherwise, SK: "Odpovede používame na vyhodnotenie auditu. Údaje uchovávame len po dobu nevyhnutnú na vyhodnotenie auditu a spracovanie dopytu. Podrobnosti nájdete v Zásadách ochrany osobných údajov."
The link points to `/ochrana-osobnych-udajov`. No absolute promises.

## Commit
`feat: pre-start data notice`

## Report then STOP
