# Plán nápravy — prieskum (STEP 00)

## Promo kódy
- Reťazec `AVENG2026`: **nenájdený** v `src/`, JSON-LD (`JsonLd.tsx`), FAQ. Spomína sa len v `docs/cursor-steps/` a ako ✓ v `docs/REMEDIATION_REPORT.md`.
- Adresár `out/`: **neexistuje** (build nebol spustený v tomto kroku) — overenie v exportе: not found.
- Hardcoded promo v klientovi: **nie**. Validácia cez `src/lib/unlock/session.ts` → Edge Function. Legacy kódy len v secrets EF (`AUDIT_PROMO_CODES_L2/L3` v `verify-promo/index.ts`), nie v bundli.

## Unlock flow vs `unlock_codes`
- Áno: `verify-promo` číta `unlock_codes` (service role), potom legacy env; klient volá `NEXT_PUBLIC_UNLOCK_API_URL`. Vydávanie: `issue-unlock-code` + migrácia `20261008170000_unlock_codes.sql`.
- Medzery: **CORS `*`** (nie origin z config); **žiadny rate limit**; redeem = SELECT + UPDATE `.is("redeemed_at", null)` (nie atomický `UPDATE…RETURNING`); môže znova overiť už redeemed riadok (filter `redeemed_at` chýba pri SELECT); token HMAC áno (`UNLOCK_SIGNING_SECRET`).

## Level 2/3 v bundli
- Nie iba CSS blur. Gate (`Level2Gate.tsx`) ukazuje placeholder + formulár kódu.
- Otázky L2/L3 idú cez **dynamic import** `scoring-premium` / `level3-questions` až po unlock (`AuditSection.tsx`) — oddelený chunk, ale po `next build` chunky stále končia v `out/_next/…` (verejné). Overenie absencie stringov v `out/`: not found (žiadny `out/`).

## Osobné údaje / mazanie
- Tabuľky: `audit_leads` (meno, e-mail, telefón, firma, skóre…), `audit_results` (answers JSONB), `unlock_codes` (recipient_*, created_by, note) — `schema.sql`, migrácia unlock, `docs/DATA_INVENTORY.md`.
- Klient: `localStorage` leady/progress, `sessionStorage` unlock token.
- Mazanie: skript `purge-28day.sql`; návrh `20261008140000_data_retention.sql`. Produkcia **neoverená** → `RETENTION_JOB_VERIFIED=false` (`src/config/retention.ts`).

## Zdroj `S_SME` / `S_WC`
- V kóde ako `sme`/`wc` z `getProcessBenchmarks()` + sektorové KPI v `src/lib/audit/benchmarks.ts`. Provenancia: `BENCHMARK_SOURCE = "expert-estimate"`; UI poznámka `src/config/benchmarks.ts`. Identifikátor `k_Pi`: not found.

## World-class cap
- Len **prezentácia** WC: `wcCeilingDisplay()` + `MAX_DISPLAYED_POTENTIAL_SHARE` / `SHOW_WORLD_CLASS_CEILING` (`presentation.ts`, `audit-display.ts`). Matematika `gapWcEur` v `scoring-core.ts` **nie je** capovaná. Predvolene WC strop skrytý (`SHOW_WORLD_CLASS_CEILING=false`).

## Report / e-mail vs Next UI
- Áno, **duplicitné formátovanie**: EF `send-audit-report/html.ts` + `pdf.ts` + `_shared.ts` paralelne k `ResultsDashboard.tsx` / `formatEur` — nie zdieľaný modul s Next app.

## Otázky s presným číslom (L1, `numericUnit`)
| id | text (skrátene) | unit |
|---|---|---|
| L1-P1-Q1 | Presnosť plnenia výrobného plánu | % |
| L1-P1-Q3 | Priemerný výrobný lead time | dni |
| L1-P1-Q4 | Podiel núdzového preplánovania | % |
| L1-P2-Q1 | OEE na kritických zariadeniach | % |
| L1-P2-Q2 | Plnenie plánu preventívnej údržby | % |
| L1-P2-Q3 | Podiel neplánovaných prestojov | % |
| L1-P3-Q1 | DPMO | DPMO |
| L1-P3-Q2 | COPQ ako % tržieb | % |
| L1-P3-Q4 | Reklamácie zákazníkov | PPM |
| L1-P4-Q1 | OTD | % |
| L1-P4-Q2 | Obrátkovosť zásob | obraty/rok |
| L1-P4-Q4 | Presnosť dodávok od dodávateľov | % |
| L1-P5-Q2 | Miera absencie | % |
| L1-P5-Q3 | Zlepšovacie návrhy / zamestnanec / rok | návrhy/rok |
| L1-P5-Q4 | Viaczručnosť / multi-skilling | stanice |

Zdroj: `src/lib/audit/questions.ts` + UI `AuditQuestionCard.tsx`.
