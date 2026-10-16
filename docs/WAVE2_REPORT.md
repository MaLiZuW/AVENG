# Wave 2 — záverečná správa (STEP 29)

Dátum: 16. 10. 2026. Zdroj findings: `docs/findings/FINDINGS-2026-10-13.md`.  
Beh: `docs/runs/RUN-STATE.md` (kroky 15–28).

## Overenia (STEP 29)

| Kontrola | Výsledok |
|---|---|
| `npm run check:meta` | OK (13 pages) |
| `npm run check:copy` | OK (64 files) |
| `npm run check:shared` | OK |
| `npm run lint` | OK (warning Header `<img>`) |
| `npx tsc --noEmit` | OK |
| `npm run build` | OK |
| `npx tsx scripts/tests/pdf-fixtures.ts` | OK (L1/L2/L3 PDF) |
| `npx tsx scripts/tests/presentation-ranges.ts` | OK |
| `npx tsx scripts/tests/format-and-copy.ts` | OK |
| `npm run audit:invariants` | **NIE** — skript chýba (`Missing script`) |

### Grep (src / supabase / out)

| Vzor | Výsledok |
|---|---|
| Web3Forms, FormSubmit, aveng.sk | 0 |
| `Ing.` (case-sensitive) | 0 |
| odvetvov* | 0 |
| Silver / Gold / Premium vo `out/` | 0 (`USE_TIER_NAMES=false`) |
| `toFixed(` mimo `src/lib/format.ts` | 0 v src/supabase |

---

## Findings → stav

| ID | Stav | Dôkaz |
|---|---|---|
| W1 | OK | Politika bez draft banneru; retenčné claimy cez `retention.ts` |
| W2 | OK / owner | Processors bez Web3Forms/FormSubmit; contact → Edge `contact`; regióny Supabase/Resend stále **neznáme** (`INFRA_FACTS`) |
| W3 | OK | `buildMetadata` + `check:meta` |
| W4 | OK | Schválený content STEP 26 (`src/content/*`) |
| W5 | OK | Názvy L1/L2/L3 z `levels.ts`; bez „odvetvový benchmark“ |
| W6 | OK | `check:copy` + odstránené vývojárske frázy |
| W7 | OK | Footer `variant`: full len na `/` |
| W8 | OK | Jedno GDPR oznámenie na self-audite |
| W9 | OK | Sídlo: Zliechovská ulica 1117/110, 018 64 Košeca (`company.ts`) |
| W10 | OK | Bez `keywords`; `check:meta` |
| W11 | OK | Neutrálna retencia FAQ (`RETENTION_JOB_VERIFIED=false`) |
| W12 | OK | Odkazy `/kontakt/?predmet=…`; booking URL nenastavená |
| W13 | **Owner** | Reindex / cache GSC — mimo kódu |
| A1 | OK | `audit-copy.ts` per level |
| A2–A3 | OK | `format.ts` + ranges v `presentation.ts` |
| A4 | OK | Disclosure costFactor / metodika |
| A5 | OK | PDF light + expert-estimate veta |
| A6–A9 | OK | L2 breakdown, explainers, impact, recommendations |
| A10 | OK | Unlock karty + verbatim platobný text (bez „po úhrade“) |
| A11 | OK | SK formát čísel |
| A12 | OK | Maturity table wording |
| A13 | OK | `metodika-review.md` |
| A14 | OK | Light PDF + mailto/booking CTA |
| A15 | OK / owner | KPI tabuľka; OEE A×P×Q čaká na L2 NUMERIC_INPUT (owner) |
| T1 | OK | FAQ + JSON-LD per page |
| T2 | **Owner** | GBP, adresáre, LinkedIn — `OWNER_ACTIONS_VISIBILITY.md` |
| T3 | OK / owner | Cookieless wrapper; default `none`; provider = owner |
| T4 | OK / owner | IndexNow skript + kľúč; GSC/Bing = owner |
| T5 | OK | `PERF_A11Y_REPORT.md` (lab LCP self-audit 2,9 s nad 2,5 s) |
| T6 | OK | `public/llms.txt` (voliteľné; Google nepoužíva) |

---

## Rozhodnutia vlastníka (otvorené / potvrdené)

| Téma | Stav |
|---|---|
| Názvy úrovní (bez Silver/Gold) | Potvrdené v kóde (`USE_TIER_NAMES=false`) |
| `RELIABILITY_THRESHOLDS` 0,25 / 0,60 | V kóde; owner potvrdenie odporúčané |
| Impact prahy 35 % / 15 % | V kóde; owner potvrdenie odporúčané |
| `MAX_DISPLAYED_POTENTIAL_SHARE` | V `audit-display.ts`; owner potvrdenie |
| `RETENTION_JOB_VERIFIED` | **false** — zapnúť až po deployi purge jobu |
| DPA / prenose mimo EÚ | Neutrálna veta v politike; právna revízia owner |
| Región e-mailu (Resend) / Supabase | **Neznáme** — `INFRA_FACTS` |
| Platba L2/L3 | Bankový prevod + kód e-mailom (verbatim); bez Stripe |
| Booking URL | Nenastavená; CTA → kontakt |
| Analytics provider | Default none; zapnúť podľa `OWNER_ACTIONS_VISIBILITY.md` |
| Content / FAQ | Schválené odpovede STEP 25–26 |
| Sídlo | Nastavené (Košeca + ulica) |
| Foto / referencie | Žiadne (sloty prázdne) |
| Q5 sociálne, Q6 BCTC detail, Q24 AI cenník, 80 €/hod, tooling lab | **Otvorené** |

---

## Checklist nasadenia (poradie)

**Cursor / CI nespúšťa** migrácie ani `supabase` remote príkazy — robí ich vlastník.

### (a) Migrácie (súbory)

1. `supabase/migrations/20261008140000_data_retention.sql`
2. `supabase/migrations/20261008170000_unlock_codes.sql`

### (b) Edge Functions (nasadiť)

1. `contact`
2. `verify-promo`
3. `issue-unlock-code`
4. `send-audit-report`

### (c) Secrets (iba názvy)

- `RESEND_API_KEY`
- `AUDIT_REPORT_FROM`
- `AUDIT_REPORT_OWNER_EMAIL`
- `UNLOCK_TOKEN_SECRET`
- `UNLOCK_SIGNING_SECRET`
- `ADMIN_EMAILS`
- voliteľne: `AUDIT_PROMO_CODES`, `AUDIT_PROMO_CODES_L2`, `AUDIT_PROMO_CODES_L3`

Build env (nie secrets, ale potrebné): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CONTACT_API_URL`, `NEXT_PUBLIC_UNLOCK_API_URL`, `NEXT_PUBLIC_ISSUE_UNLOCK_API_URL`, `NEXT_PUBLIC_AUDIT_REPORT_API_URL`.

### (d) Build

```powershell
npm run build
npm run check:meta
npm run check:copy
```

### (e) FTP

Nahrať **celý** `out/` vrátane `out/.htaccess` (z `public/.htaccess`).

### (f) Po deployi

1. HTTPS redirect, vlastná 404
2. `sitemap.xml` + `robots.txt` dosiahnuteľné
3. Test L1 zdarma; L2 a L3 s testovacími kódmi
4. PDF + e-mail z `send-audit-report`
5. Social preview: `/`, `/self-audit/`, `/o-nas/` (LinkedIn Post Inspector)
6. Search Console — sitemap + reindex
7. Voliteľne: `npm run indexnow` (Bing)
8. Checklist v `docs/OWNER_ACTIONS_VISIBILITY.md`

---

## Odchýlky Wave 2

1. **`audit:invariants` chýba** — STEP 07 nebol dodaný; čiastočná náhrada: `presentation-ranges` + `format-and-copy`.
2. Lab LCP `/self-audit/` ≈ 2,9 s (ciel 2,5 s) — Perf score aj tak ≥ 90.
3. `LEVEL2_PRICE_EUR=290` ostáva v kóde, nie vo verejnom UI (GLOBAL_CHANGES: bez sumy).
