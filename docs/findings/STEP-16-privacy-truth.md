# STEP 16 - Privacy page truth and processors (W1, W2, W9)
Attach: rules, `docs/REPO_MAP.md`, `docs/INFRA_FACTS.md`, `src/config/company.ts`.

## What we solve
The live policy contains developer notes and lists two third-party form relays. We make the page publishable and reduce processors.

## Tasks
1. Policy page: remove the public draft banner and the internal sentences about configuration and deletion not being applied. Keep review notes only as code comments (`TODO(owner/legal)`).
2. Retention section is driven by `RETENTION_JOB_VERIFIED`:
   - false, SK: "Údaje uchovávame len po dobu nevyhnutnú na vyhodnotenie auditu a spracovanie dopytu."
   - true, SK: "Údaje auditu uchovávame najviac {RETENTION_DAYS} dní, potom sa automaticky mažú."
3. Remove Web3Forms and FormSubmit completely: code paths, env variables, UI fallbacks, policy mentions. Delivery only via the project's Supabase Edge Functions + Resend. On failure show SK: "Odoslanie sa nepodarilo. Napíšte nám prosím na vladimir@addvalueengineering.sk." (no silent third-party fallback).
4. Processors list from a config `src/config/processors.ts` (name, purpose, location note) used by the policy: WebSupport (hosting), Supabase (database, Edge Functions; region from `INFRA_FACTS`), Resend (e-mail delivery). Do not claim EU-only. Resend's own documentation states account data (logs, metadata) is stored in the US even with an EU sending region; reflect this only as the neutral sentence below.
5. Add section "Prenos údajov mimo EÚ", SK: "Niektorí poskytovatelia služieb môžu údaje spracúvať aj mimo Európskej únie." Do not name safeguards. Put the legal follow-ups (sign/verify DPAs, confirm the transfer mechanism, consider an EU-region e-mail provider) into `docs/OWNER_DECISIONS.md`.
6. Seat address: read from `company.ts` (`registeredSeat`). If street/number is missing leave the text unchanged and list it in `OWNER_DECISIONS.md` (verify against the commercial register).
7. Show "Posledná aktualizácia: {POLICY_UPDATED}" from config.

## Do NOT
Contact vendors or change any Supabase/Resend setting.

## Done when
`Select-String -Path src,supabase,out -Pattern "Web3Forms|FormSubmit" -Recurse` finds nothing; the policy has no internal notes; contact/audit forms still work against the Edge Functions.

## Commit
`fix(privacy): publishable policy, remove third-party form relays` (body: W1 W2 W9)

## Report then STOP
