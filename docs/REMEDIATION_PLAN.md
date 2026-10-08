# Plán nápravy AVENG (v3)

## Stav prieskumu

| Oblasť | Zistenie |
|---|---|
| Promo L2/L3 | Klient volá `NEXT_PUBLIC_UNLOCK_API_URL`; kódy nie sú v bundli; Edge Function `verify-promo` |
| L2/L3 obsah | Dynamic import `scoring-premium` až po unlock; gate má placeholder |
| Leady | Supabase `audit_leads` + `audit_results`; fallback `localStorage` |
| Purge | Existuje `purge-28day.sql`; **produkcia neoverená** → `RETENTION_JOB_VERIFIED=false` |
| Benchmarky | `src/lib/audit/benchmarks.ts` (expert estimate) |

## Fázy v3 (delty oproti predchádzajúcej remediácii)

1. Retencia: `RETENTION_*`, inventár, migrácia (nevykonať), pravdivé texty
2. WC skryté (`SHOW_WORLD_CLASS_CEILING=false`), pásma A–E, sanity report, notice pred auditom
3.–5. SEO/a11y/MSP už z veľkej časti hotové — overenie + finálny report

## Riziká

- OneDrive sync `.next` → EBUSY / 500
- 28-dňová retencia bez follow-up = strata obchodných kontaktov
- WC gap môže byť > 50 % nákladovej bázy (sanity) — nemeň model, len display
