# RUN-STATE — beh A (15–21) + beh B (22–25)

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
- Commit: `c22240ce014c831b61b116e34bd89e23cf183200`
- Checks: lint OK, tsc OK, build OK; presentation-ranges ok; calc files diff empty
- TODO(owner): potvrdiť RELIABILITY_THRESHOLDS 0.25 / 0.60
- Odchýlky: implementácia už v histórii (`0c9f8ce`); tento commit len verifikácia + RUN-STATE
- Status: done

## STEP 21
- Commit: `2cdd0865c8cdb05f77e20ab49482d9a71b5032ef`
- Checks: lint OK, tsc OK, build OK; odvetvov v src/supabase — 0 hits; metodika-review.md existuje
- TODO(owner): —
- Odchýlky: implementácia už v histórii (`0e78584`); tento commit len verifikácia + RUN-STATE
- Status: done

## STEP 22
- Commit: `16e1989d95608a57db12f1ca13b63e4f701bec64`
- Checks: lint OK (warning Header img), tsc OK, build OK, impact-recommendations OK
- TODO(owner): IMPACT_THRESHOLDS 35 %/15 %; spôsob úhrady L2/L3; per-question texty v recommendations-gap.md
- Odchýlky: impact/prefix v presentation (`recommendations.ts`), scoring-core nemený; plán docs/runs/plan-22.md
- Status: done

## STEP 23
- Commit: `82c34595c109a8a23fdb1745a523b3f6faf68394`
- Checks: lint OK, tsc OK, build OK, kpi-table OK, impact-recommendations OK
- TODO(owner): NUMERIC_INPUT A/P/Q na L2 pre OEE dekompozíciu (l2-gap.md)
- Odchýlky: OEE A×P×Q sa nezobrazuje (žiadne exact vstupy); COPQ blok len pri L1 exact; plán plan-23.md
- Status: done

## STEP 24
- Commit: `e53d4f4401aec40f053ad66cf07ce71bc2051656`
- Checks: lint OK, tsc OK, build OK, pdf-fixtures OK
- TODO(owner): —
- Odchýlky: Node port `scripts/lib/build-audit-pdf-node.ts` zrkadlí Deno `pdf.ts` (bez Deno na CI); devDeps pdf-parse/pdf-lib/@pdf-lib/fontkit; plán plan-24.md
- Status: done

## STEP 25
- Commit: `ade33870f60f9c5c6d75973b6eae7b3c2f1ee3d4`
- Checks: lint/tsc/build netreba (bez zmeny kódu); len docs
- TODO(owner): všetky otázky v docs/content-drafts/QUESTIONS_FOR_OWNER.md — pred STEP 26 odstrániť každý [[TODO
- Odchýlky: —
- Status: done — STOP (čaká na odpovede vlastníka)

## STEP 26
- Commit: `8a880f03cf297ba8f2f353215d374622c4551ac5`
- Checks: lint OK (warning Header img), tsc OK, build OK, check:copy OK, check:meta OK (13), check:shared OK; GLOBAL Select-String bez Morava/80€/global leader v src+public (hits „10 000“/„50 000“ len v predexistujúcich pásmach `questions.ts`)
- TODO(owner): Q5 sociálne; Q6 BCTC názov/rok/logo; Q24 Optimalizácia cenník; Q30 booking URL; tooling lab význam; zverejnenie 80 €/hod
- Odchýlky: check:copy kontroluje `[[TODO` + viditeľné TODO/`[[` v HTML (nie bare `[[` v RSC/JS); L2 priceLabel „Podľa faktúry“ namiesto 290 €; plán docs/runs/plan-26.md
- Status: done

## STEP 27
- Commit: `ac24b141ed679b0334df5a42a1131501dad337dc`
- Checks: lint OK, tsc OK, build OK, check:copy OK; out/ bez plausible/umami skriptu (provider none); llms.txt + indexnow key v out/
- TODO(owner): výber analytics providera/regiónu; Search Console / Bing / GBP / adresáre (OWNER_ACTIONS_VISIBILITY.md); spustiť `npm run indexnow` po deployi
- Odchýlky: IndexNow kľúč v `public/aveng-indexnow-key.txt` (nie UUID hostname); llms.txt voliteľný (Google nepoužíva)
- Status: done

## STEP 28
- Commit: `c2294ea063ec32a3f3446d9dd8169e3e8f2bc98e`
- Checks: lint OK, tsc OK, build OK, check:copy OK; Lighthouse mobile (po): home 97/100/100 LCP 2.5s; self-audit 95/100/100 LCP 2.9s CLS 0; pillar 97; kontakt 93; axe 0 violations na 4 stránkach
- TODO(owner): field INP/CrUX po deployi; manuálny kontrast muted textu
- Odchýlky: lab LCP self-audit/kontakt tesne nad 2,5 s; report docs/PERF_A11Y_REPORT.md; axe vyžadoval ChromeDriver 155
- Status: done
