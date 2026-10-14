# Plán STEP 24 (A5, A14)

## Scope
| Súbor | Akcia |
|---|---|
| `supabase/functions/send-audit-report/pdf.ts` | Light default + optional dark; metodika; mailto/booking; metadata; L2/L3 rozpis; bez „efektivita %“ |
| `supabase/functions/send-audit-report/index.ts` | Názov súboru `AVENG_Self-Audit_L{n}_{YYYY-MM-DD}.pdf` |
| `supabase/functions/send-audit-report/_shared.ts` | Upsell bez sľubu OEE/COPQ; booking URL helper; export filename helper |
| `scripts/lib/build-audit-pdf-node.ts` | Node port `buildPdf` pre fixture test (pdf-lib npm) |
| `scripts/tests/pdf-fixtures.ts` | Generuje L1/L2/L3 do `tmp/`, pdf-parse asserts |
| `package.json` | devDeps: `pdf-parse`, `pdf-lib`, `@pdf-lib/fontkit` (zdôvodnené: Wave2 pdf-parse; pdf-lib na generovanie bez Deno) |
| `docs/runs/plan-24.md` | Tento plán |
| `docs/runs/RUN-STATE.md` | Záznam |

## Mimo scope
Deploy Edge Function, odoslanie e-mailu, remote Supabase. Výpočtové súbory.

## Riziká
Node port musí zostať v synchro s Deno `pdf.ts` (rovnaké texty/kontroly).
