# RUN-STATE — beh A (kroky 15–21)

## STEP 15
- Commit: `dc1024c09f3539d91b583fcbdecf2473f8b9cfda`
- Checks: lint OK (existujúci warning Header img), tsc OK, build OK
- TODO(owner): región Supabase; regional Edge Functions; Resend doména/región (v INFRA_FACTS)
- Odchýlky: Wave 2 sekcia aktualizovaná podľa aktuálneho kódu (neskôršie commity 16–21 už boli v histórii); STEP 00 riadok o Web3Forms v REPO_MAP ešte nie je upravený (mimo scope append Wave 2)
- Status: done

## STEP 16
- Commit: `fe6cc1e5660da72d9136fc6528ed799374795b46`
- Checks: lint OK, tsc OK, build OK; Web3Forms/FormSubmit v src/supabase/out — 0 hits
- TODO(owner): DPA/prenosy mimo EÚ; sídlo ulica/číslo; právnická revízia zásad (OWNER_DECISIONS)
- Odchýlky: väčšina W1/W2 už bola v histórii; doplnená len veta „potom sa automaticky mažú“ pri RETENTION_JOB_VERIFIED=true; plán v docs/runs/plan-16.md
- Status: done

## STEP 17
- Commit: `b253c303b79595ca2c0e02b5e4025298adcca43f`
- Checks: lint OK, tsc OK, build OK, check:meta OK (13 pages)
- TODO(owner): —
- Odchýlky: implementácia už v histórii (`862fe5b`); tento commit len verifikácia + RUN-STATE; žiadna zmena kódu
- Status: done

## STEP 18
- Commit: `c103deb0cd920b6483e7d8f302e0cad72bc73ef6`
- Checks: lint OK, tsc OK, build OK, check:copy OK
- TODO(owner): —
- Odchýlky: väčšina W5–W12 už v histórii; doplnené `retentionFaqClaimSk` (FAQ bez auto-delete vety zo STEP 16)
- Status: done

## STEP 19
- Commit: `18f42c431d0de186986f5cb20d8dad4f83110025`
- Checks: lint OK, tsc OK, build OK; format-and-copy ok; toFixed len v `src/lib/format.ts` (src/supabase)
- TODO(owner): —
- Odchýlky: implementácia už v histórii (`b01e30f`); tento commit len verifikácia + RUN-STATE; `shared/audit-presentation.ts` má legacy toFixed mimo Done-when cesty
- Status: done

## STEP 20
- Commit: `d9975dc657f02e7ca192eda63967078e1dd1f234`
- Checks: lint OK, tsc OK, build OK; presentation-ranges ok; calc files diff empty
- TODO(owner): potvrdiť RELIABILITY_THRESHOLDS 0.25 / 0.60
- Odchýlky: implementácia už v histórii (`0c9f8ce`); tento commit len verifikácia + RUN-STATE
- Status: done
