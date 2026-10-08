# REMEDIATION REPORT — AVENG (v3)

Dátum: 2026-10-08

## 1. Zmeny podľa fáz

### Fáza 0
- Aktualizovaný `docs/REMEDIATION_PLAN.md`

### Fáza 1 — Bezpečnosť / retencia
- `src/config/retention.ts` — `RETENTION_DAYS`, `RETENTION_JOB_VERIFIED=false`, follow-up flagy
- Pravdivé texty (bez automatického mazania, kým job nie je overený)
- `docs/DATA_INVENTORY.md`
- Návrh migrácie `supabase/migrations/20261008140000_data_retention.sql` (**nevykonaná**)
- Promo stále mimo klienta; unlock cez Edge Function

### Fáza 2 — Dôveryhodnosť výsledku
- `SHOW_WORLD_CLASS_CEILING=false`, `MAX_DISPLAYED_POTENTIAL_SHARE=0.35`
- Rozsahy z pásiem A–E (`audit-bands.ts` + recompute), bez ±% výstupu; „0 – 0 €“ → „bez výraznej medzery…“
- `scripts/audit-sanity.ts` → `docs/audit-sanity-report.md`
- Notice pred štartom auditu + odkaz na zásady
- MetricExplainer, D1–D5, Gemba banner (bez „Level 4“ ako úrovne)

### Fáza 3–5
- Multi-route SEO, OG PNG, JSON-LD, MSP terminológia, lucide ikony (z predchádzajúcej remediácie + v3 úpravy textov)

## 2. Kontrolný zoznam

| Kritérium | Stav |
|---|---|
| Žiadny `AVENG2026` v src | ✓ |
| GDPR link = trasa | ✓ |
| Retenčné tvrdenia zodpovedajú `RETENTION_JOB_VERIFIED` | ✓ (neutrálne) |
| Migrácia pripravená, nevykonaná | ✓ |
| DATA_INVENTORY | ✓ |
| Purge `SET search_path` + REVOKE PUBLIC | ✓ (v návrhu) |
| Notice bez emoji / absolútnych sľubov | ✓ |
| Bez 256-bit SSL / emoji ikon | ✓ |
| Bez `aveng.sk` / Ing. | ✓ |
| Verejný text bez SME | ✓ (interné ID výnimka) |
| Headline = rozsah + spoľahlivosť + disclaimer | ✓ |
| WC skryté default | ✓ |
| audit-sanity-report | ✓ |
| Math nezmenená | ✓ |
| Bez „0 – 0 €“ / fixného ±% | ✓ |
| MetricExplainer | ✓ |
| L2/L3 dynamic import | ✓ |
| sitemap / robots / OG PNG | ✓ |
| lint / tsc / build | ✓ (overené po v3) |

## 3. TODO(owner)

Pozri `docs/OWNER_DECISIONS.md`. Kľúčové: schválenie migrácie, follow-up súhlas, zapnutie WC ceiling podľa sanity, právnik, FAQ, booking, sociálne siete.

## 4. Premenné prostredia

| Názov | Účel |
|---|---|
| `NEXT_PUBLIC_SUPABASE_*` | Leady |
| `NEXT_PUBLIC_SITE_URL` | Canonical |
| `NEXT_PUBLIC_CONTACT_INBOX` / Web3Forms | Kontakt |
| `NEXT_PUBLIC_BOOKING_URL` | CTA konzultácia |
| `NEXT_PUBLIC_UNLOCK_API_URL` | L2/L3 unlock |
| `NEXT_PUBLIC_SOCIAL_*` | JSON-LD sameAs |
| Edge: `AUDIT_PROMO_CODES`, `UNLOCK_TOKEN_SECRET` | Unlock |

## 5. Závislosti

- `lucide-react`, `zod` (už zavedené) — ikony / validácia kontaktu

## 6. Riziká

1. OneDrive + `.next` → EBUSY / 500 (vylúčiť `.next` zo syncu)
2. Nasadiť migráciu až po schválení; nastaviť `RETENTION_JOB_VERIFIED`
3. WC podiely > 50 % v sanity — nemeň model bez rozhodnutia vlastníka
4. DNS/mail `aveng.sk`, 301 zo starého WP, čistenie kompromitovanej domény
