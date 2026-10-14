# Plán STEP 16 (W1, W2, W9)

## Stav
Väčšina úloh je už v kóde (commit `426b2d8` a nasledovníci). Plán len doplní chýbajúce a overí Done when.

## Súbory v scope (iba tieto)
| Súbor | Akcia |
|---|---|
| `src/config/retention.ts` | Doplniť do vetvy `RETENTION_JOB_VERIFIED=true` vetu „, potom sa automaticky mažú.“ podľa SK zo stepu |
| `src/app/ochrana-osobnych-udajov/page.tsx` | Overiť: bez draft banneru, processors, Prenos mimo EÚ, POLICY_UPDATED, registeredSeat — bez zmeny ak OK |
| `src/config/processors.ts` | Overiť WebSupport / Supabase / Resend — bez zmeny ak OK |
| `src/lib/submitContactRequest.ts` | Overiť: len Edge Function, chybová SK veta — bez zmeny ak OK |
| `src/lib/submitSiteContact.ts` | To isté |
| `.env.example` | Overiť absenciu Web3Forms/FormSubmit env |
| `docs/OWNER_DECISIONS.md` | Overiť DPA / sídlo / prenosy — bez zmeny ak OK |
| `docs/runs/plan-16.md` | Tento plán |
| `docs/runs/RUN-STATE.md` | Záznam behu |

## Mimo scope (nemením)
`docs/REPO_MAP.md` (STEP 00 riadok o Web3Forms), `docs/DATA_INVENTORY.md`, findings, Edge Functions deploy.

## Riziká
Žiadne; žiadny zásah do remote Supabase.
