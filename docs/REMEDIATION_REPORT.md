# REMEDIATION REPORT — AVENG

Dátum overenia: 2026-10-13 (STEP 14). Vetva: `remediation`.

## 1. Zmeny podľa krokov

| Krok | Commit | Zhrnutie |
|---|---|---|
| 00 | `0100ea3` | `docs/REPO_MAP.md`, `docs/REMEDIATION_PLAN.md` |
| 01–02 | `1e204c1` (+ predchádzajúci unlock/report) | Identita, MSP, company config; unlock cez EF (existujúci stav) |
| 03 | `605b1f8` | Zásady GDPR, kontakt cez Edge Function `contact` |
| 04 | `a5e5e5e` | Návrh retencie, flagy, `DATA_INVENTORY` |
| 05 | `f22979a` | Referenčná vrstva benchmarkov |
| 06 | `3cef519` | Indikatívne rozsahy, spoľahlivosť, relabeling |
| 07 | (čiastkové v `3cef519` / predchádzajúce) | WC flagy; **chýba** `audit:invariants` a `PLAUSIBILITY_WARN_SHARE_OF_SALES` |
| 08 | `419c7b6` | Metodika, KPI tabuľka, explainery, disclaimer |
| 09 | `d66d0ec` | D1–D5, neutrálne VDA wording, `audit-question-review.md` |
| 10 | `72a780b` | Notice pred štartom auditu |
| 11 | `a182e7d` | Trasy, `.htaccess`, legacy redirecty |
| 12 | `4c60d7c` | SEO, OG, JSON-LD, FAQ, sitemap/robots |
| 13 | `1fdd8ac` | A11y kontrast, ikony, CTA hierarchia |
| 14 | tento commit | Finálne overenie + tento report |

## 2. Kontrolný zoznam (STEP 14)

| Kritérium | Stav |
|---|---|
| Žiadny `AVENG2026` v zdroji (mimo docs krokov) | OK |
| Žiadny `AVENG2026` v `out/` po builde | OK |
| Žiadny `[Placeholder]`, `aveng.sk`, „Ing.“ pri mene | OK |
| Žiadne viditeľné „SME“ v `src/` UI | OK (interné `S_SME` / ID ostávajú) |
| Žiadne emoji v `src/` | OK |
| Report/e-mail bez emoji | OK (použité len `✓` ako textový znak v HTML/PDF) |
| Žiadne ± tvrdenia o presnosti, „priemer MSP na Slovensku“, „VDA 6.3 – P“ | OK |
| `git diff` od STEP 00 na calculation súboroch prázdny | OK (`calculationEngine.ts`, `scoring-core.ts`, `scoring.ts`, `benchmarks.ts`) |
| Static export: `index.html` trás, `404.html`, `.htaccess`, `sitemap.xml`, `robots.txt` | OK |
| Žiadne `route.ts` / Server Actions / `middleware` | OK |
| Uzamknuté L2/L3 reťazce **absujú** z `out/` | **NIE** — nájdené v `out/_next/static/chunks/17.*.js` a `45.*.js` (napr. SMED/Changeover L2, „Ako systematicky riadite…“ L3). Dynamic import stále exportuje chunky do `out/`. |
| Žiadny service-role kľúč / token secret v `out/` ani v klientskom kóde | OK |
| `npm run check:shared` | OK |
| `npm run audit:invariants` | **NIE** — skript chýba (`Missing script: "audit:invariants"`); neexistuje `scripts/audit-invariants.ts` (požiadavka STEP 07). |
| `npm run lint` | OK (1 warning `@next/next/no-img-element` v `Header.tsx`) |
| `npx tsc --noEmit` | OK |
| `npm run build` | OK |
| Lighthouse mobile (A11y / SEO / BP ≥ 95) | Nespustené — CLI cez npx je dostupný (13.5.0), ale audit nebol spustený (chýba lokálny serve + cieľové skóre; overenie zastavené po NIE vyššie). |

**Triviálne opravy v tomto kroku:** žiadne.

**Dôvod STOP:** dve NIE (L2/L3 v `out/`, chýbajúci `audit:invariants`). Bez implementácie nových funkcií — len záznam.

## 3. TODO(owner) — rozhodnutia a kde žijú

| Položka | Kde | Stav |
|---|---|---|
| Zdroje / citácie modelových referencií (`S_SME` / `S_WC`, expert estimate) | `src/config/benchmarks.ts`, `src/lib/audit/benchmarks.ts` | TODO(owner) |
| Pásma kariet A–E | `src/config/audit-bands.ts` | TODO(owner): confirm bands |
| `MAX_DISPLAYED_POTENTIAL_SHARE` (0.35), `SHOW_WORLD_CLASS_CEILING` (false) podľa `docs/audit-sanity-report.md` | `src/config/audit-display.ts` | TODO(owner) — sanity často > 50 % WC podielu; model nemeníme |
| `PLAUSIBILITY_WARN_SHARE_OF_SALES` | **chýba v kóde** (plánované STEP 07, default 0.20) | TODO(owner) + doplniť implementáciu mimo tohto kroku |
| Schválenie mazacej migrácie | `supabase/migrations/20261008140000_data_retention.sql` | Nenasadená |
| `RETENTION_JOB_VERIFIED` | `src/config/retention.ts` → `false` | Zapnúť až po overení cronu |
| Lehota retencie leadov | `RETENTION_DAYS = 28` v `src/config/retention.ts` | Potvrdiť |
| `UNLOCK_CODE_RETENTION_DAYS` | `src/config/retention.ts` → `null` | TODO(owner) |
| Samostatný follow-up súhlas | `FOLLOWUP_CONSENT_ENABLED` / `FOLLOWUP_RETENTION_DAYS` v `retention.ts` | Vypnuté |
| Text zásad (právnik) | `src/app/ochrana-osobnych-udajov/page.tsx` | Návrh; backup expiry TODO |
| Schválenie FAQ | `src/components/sections/FaqSection.tsx` | TODO(owner) |
| `NEXT_PUBLIC_BOOKING_URL` | `.env.example` / build env | Voliteľné, často prázdne |
| Sociálne profily | `src/config/social.ts` (prázdne) | TODO(owner) |
| KPI mapovanie | `docs/kpi-mapping-review.md` | TODO(owner) potvrdiť 3 kľúče |
| Revízia otázok (zmiešané konštrukty) | `docs/audit-question-review.md` | Report only — texty v kóde nemené |
| Identifikujúce údaje v copy (napr. „až 35 inžinierov“, regióny) | `src/components/sections/About.tsx` (+ hero/meta) | Potvrdiť faktickosť |
| Case studies | `src/components/CaseStudies.tsx`, `src/data/case-studies.ts` | Prázdne, nerenderované |
| `.htaccess` na hostingu | `public/.htaccess` | TODO(owner): verify hosting |

Detaily aj v `docs/OWNER_DECISIONS.md`.

## 4. Checklist nasadenia (poradie)

**(a) Migrácie v Supabase (súbory, nespúšťať z CI agenta):**
1. `supabase/migrations/20261008170000_unlock_codes.sql`
2. `supabase/migrations/20261008140000_data_retention.sql` — až po schválení vlastníkom

**(b) Edge Functions na deploy (názvy):**
- `verify-promo`
- `issue-unlock-code`
- `send-audit-report`
- `contact`

**(c) Secrets v Supabase (iba názvy):**
- `UNLOCK_TOKEN_SECRET`, `UNLOCK_SIGNING_SECRET`
- `AUDIT_PROMO_CODES`, `AUDIT_PROMO_CODES_L2`, `AUDIT_PROMO_CODES_L3`
- `ADMIN_EMAILS`
- `RESEND_API_KEY`, `AUDIT_REPORT_FROM`, `AUDIT_REPORT_OWNER_EMAIL`
- (service-role kľúč pre EF runtime — nikdy do klienta)

Verejné URL do buildu (nie secrets): `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_UNLOCK_API_URL`, `NEXT_PUBLIC_ISSUE_UNLOCK_API_URL`, `NEXT_PUBLIC_AUDIT_REPORT_API_URL`, `NEXT_PUBLIC_CONTACT_API_URL`, voliteľne `NEXT_PUBLIC_BOOKING_URL`.

**(d)** `npm run build`

**(e)** Nahrať celý `out/` vrátane `.htaccess` cez FTP na WebSupport.

**(f) Po nasadení skontrolovať:**
- HTTPS redirect a kanonický host
- stránka 404
- `sitemap.xml` / `robots.txt`
- unlock flow s testovacím kódom
- testovací audit + e-mail reportu

**(g) Riziká:**
- DNS/mail redirect z `aveng.sk`
- 301 zo starého WordPress
- vyčistiť obsah kompromitovanej domény pred uploadom
- L2/L3 chunky sú stále verejné v `out/_next/` — pred produkčným lockom treba obsah vytiahnuť za Edge Function (STEP 01 gap)
- retencia: tvrdenia o automatickom mazaní až po `RETENTION_JOB_VERIFIED=true`

## 5. Závislosti

Bez nových balíkov v tomto kroku. Existujúce: `lucide-react`, `zod`, `tsx` (dev).
