# Rozhodnutia pre vlastníka (TODO)

## Retencia a GDPR

| Položka | Stav | Otázka |
|---|---|---|
| Migrácia `supabase/migrations/20261008140000_data_retention.sql` | Pripravená, **nenasadená** | Schváliť a spustiť v Supabase? |
| `RETENTION_JOB_VERIFIED` | `false` | Zapnúť až po overení cron jobu |
| `FOLLOWUP_CONSENT_ENABLED` / `FOLLOWUP_RETENTION_DAYS` | `false` / 180 | Chcete dlhšie uchovanie kontaktov so samostatným súhlasom? |
| Text zásad GDPR | Návrh | Schválenie právnikom |
| Expirácia DB backupov | Neznáma | Doplniť do zásad |

**Upozornenie:** pri 28 dňoch bez follow-up súhlasu **stratíte kontakt** po uplynutí lehoty.

## World-class zobrazenie (z `audit-sanity-report.md`)

Pri tržbách 5 M€ / COGS 65 % majú realistické profily (average_C, weak_B, mixed…) podiel WC medzery voči nákladovej báze často **> 50 %** (až > 100 % pri all_A).  
**Model (`costFactor`, `wcMultiplier`, benchmarky) sme nemenili.**

| Flag | Predvolené | Otázka |
|---|---|---|
| `SHOW_WORLD_CLASS_CEILING` | `false` | Zapnúť zobrazenie teoretického stropu? |
| `MAX_DISPLAYED_POTENTIAL_SHARE` | `0.35` | Potvrdiť display cap? |

Zdroje `k_Pi` / `S_SME` / `S_WC` / `M_WC`: interné hodnoty v `benchmarks.ts` / `PROCESSES` — TODO(owner) doložiť alebo ponechať ako expert estimate.

## Obsah / SEO

| Položka | Otázka |
|---|---|
| FAQ | Schváliť finálne znenie |
| `NEXT_PUBLIC_BOOKING_URL` | Nastaviť? |
| Sociálne profily | LinkedIn / FB URL |
| Identifikujúce údaje (regióny, sektory, 20–250 zam.) | Potvrdiť |
| BCTC coaching | Potvrdiť názov |
| Case studies | Doplniť overené referencie |
| Pásma kariet A–E | Potvrdiť `audit-bands.ts` |
| Revízia otázok | `docs/audit-question-review.md` |
