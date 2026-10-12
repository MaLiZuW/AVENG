# Inventár osobných a auditných údajov (AVENG)

Zdroj: `supabase/schema.sql`, `supabase/migrations/20261008170000_unlock_codes.sql`, `supabase/migrations/20261008140000_data_retention.sql` (návrh, nenasadený), `supabase/purge-28day.sql`, klient (`src/lib/supabase.ts`, `src/lib/audit/persist.ts`, `src/lib/submitContactRequest.ts`, `src/lib/submitSiteContact.ts`, `src/lib/unlock/session.ts`, `src/lib/sendAuditReport.ts`) a Edge Functions (`send-audit-report`, `issue-unlock-code`, `verify-promo`, `contact`).

Len názvy, ktoré sú v schéme alebo v kóde. Samostatná tabuľka e-mailovej fronty, exportov ani analytiky v repe nie je.

## 1. Supabase — tabuľky

### `public.audit_leads` (`supabase/schema.sql`)

| Stĺpec | Obsah |
|---|---|
| `id` | UUID |
| `created_at` | čas vloženia |
| `full_name` | meno |
| `work_email` | e-mail |
| `company_name` | firma |
| `phone` | telefón |
| `gdpr_consent` | súhlas so spracovaním |
| `audit_level` | úroveň auditu |
| `overall_score`, `financial_gap_eur`, `gap_sme_eur`, `gap_wc_eur` | súhrnné výsledky |
| `sector_id`, `annual_revenue_eur`, `cogs_percent`, `critical_process_id` | pred-audit a kritický proces |

Zápis: `submitAuditLead` v `src/lib/supabase.ts`.

Návrh migrácie (ešte nenasadený) pridáva `followup_consent` (boolean, default false) a `followup_consent_at` (timestamptz). Klient ich posiela len keď je `FOLLOWUP_CONSENT_ENABLED`.

### `public.audit_results` (`supabase/schema.sql`)

| Stĺpec | Obsah |
|---|---|
| `id`, `created_at` | identifikátor a čas |
| `lead_id` | väzba na `audit_leads`, `ON DELETE CASCADE` |
| `process_scores` (JSONB) | skóre procesov |
| `recommendations` (JSONB) | odporúčania |
| `answers` (JSONB) | odpovede auditu |

Samostatná anonymná tabuľka odpovedí v schéme nie je. Odpovede sú vždy na `lead_id`.

### `public.unlock_codes` (`supabase/migrations/20261008170000_unlock_codes.sql`)

| Stĺpec | Obsah |
|---|---|
| `id`, `created_at` | identifikátor a čas |
| `code` | prístupový kód |
| `level` | 2 alebo 3 |
| `recipient_email` | e-mail príjemcu |
| `recipient_name` | meno príjemcu |
| `company_name` | firma |
| `created_by` | e-mail admina, ktorý kód vydal |
| `sent_at` | čas odoslania e-mailu (`issue-unlock-code`) |
| `redeemed_at` | čas uplatnenia (`verify-promo`) |
| `expires_at` | platnosť, predvolene 90 dní od vydania |
| `note` | poznámka |

Zápis a úprava: Edge Functions `issue-unlock-code` a `verify-promo` (service role). Prehliadač tabuľku nečíta.

Mazanie redeemed/expired kódov nie je v návrhu, kým vlastník nenastaví `UNLOCK_CODE_RETENTION_DAYS` (`TODO(owner)`).

## 2. E-mail — čo sa odosiela, nie ukladá do tabuľky

Žiadna z týchto funkcií nevkladá správu do databázy. Príjemca je Resend (`https://api.resend.com/emails`) alebo Web3Forms / FormSubmit.

| Kanál | Kód | Údaje v správe |
|---|---|---|
| Správa z auditu | `supabase/functions/send-audit-report` (`ReportBody` v `_shared.ts`, skladá `leadPayloadToReportMail`) | `lead_id`, `full_name`, `work_email`, `company_name`, `phone`, `result` (percentá, medzery v EUR, `sectorLabel`, `annualRevenueEur`, `cogsPercent`, `auditLevel`, `criticalProcess`, `processScores`, `recommendations`, počty otázok). HTML + PDF príloha. Dva e-maily: na `work_email` a na `AUDIT_REPORT_OWNER_EMAIL`. Pole `answers` v payload-e nie je. |
| Odomykací kód | `issue-unlock-code` | e-mail na `recipient_email` (BCC vlastník): meno, firma, level, samotný `code`. Riadok ostáva v `unlock_codes`. |
| `/kontakt` | `supabase/functions/contact` (`mailFrom` v `logic.ts`) | text vlastníkovi: meno, e-mail (`reply_to`), firma, správa, veta že súhlas bol udelený. |
| Auditné žiadosti (schôdzka, kód, CP) | `src/lib/submitContactRequest.ts` | Web3Forms, inak FormSubmit. Polia: `fullName`, `company`, `phone`, `email`, `message`, voliteľné `meta` (`gapSmeEur`, `totalCostBaseEur`, `lossRatioPercent`, `source`). |

## 3. Prehliadač

| Úložisko | Kľúč | Súbor | Obsah |
|---|---|---|---|
| `localStorage` | `aveng_audit_leads` | `src/lib/supabase.ts` | fallback celého lead payloadu, len keď Supabase nie je nakonfigurovaný |
| `localStorage` | `aveng_audit_progress` | `src/lib/audit/persist.ts` (`AUDIT_STORAGE_KEY`) | rozpracovaný audit: `answers`, `answerDetails`, `preAudit` (`sectorId`, `annualRevenueEur`, `cogsPercent`), fáza a krok |
| `localStorage` | `aveng_contact_requests` | `src/lib/submitContactRequest.ts` | kópia kontaktnej žiadosti pred odoslaním |
| `sessionStorage` | `aveng_unlock_session_v1` | `src/lib/unlock/session.ts` | `level`, HMAC `token`, `exp` — nie meno ani e-mail |

`src/lib/submitSiteContact.ts` do prehliadača nič nezapisuje; POST ide na Edge Function `contact`.

## 4. Logy, fronty, analytika, súbory

- Logovacia tabuľka v schéme nie je.
- Fronta e-mailov v databáze nie je. PDF správy vzniká v pamäti funkcie `send-audit-report` a ide len ako príloha.
- `contact/logic.ts`: rate limit je `Map` v pamäti izolátu (kľúč je IP z `x-forwarded-for` alebo `x-real-ip`). Po reštarte izolátu zmizne.
- Analytické skripty (gtag, plausible a podobne) v `src/` nie sú.
- Súborový export na serveri v repe nie je.

## 5. Existujúci purge skript

`supabase/purge-28day.sql`: funkcia `purge_old_audit_data()`, cron `purge-28day-audit-data`, maže všetky `audit_leads` staršie ako 28 dní (výsledky cez CASCADE). Či beží v produkcii, nie je overené → `RETENTION_JOB_VERIFIED = false`.

Návrh `20261008140000_data_retention.sql` tento job nahrádza a súhlasené kontakty nemaže po 28 dňoch.

## 6. Retenčné triedy (návrh, nenasadené)

| Trieda | Obdobie | Mazanie v návrhu |
|---|---|---|
| Odpovede a výsledky (`audit_results`) | `RETENTION_DAYS` (28) | `DELETE` podľa `created_at` |
| Kontakt leadu bez follow-up súhlasu | `RETENTION_DAYS` (28) | `DELETE` z `audit_leads` |
| Kontakt leadu s follow-up súhlasom | `FOLLOWUP_RETENTION_DAYS` = `TODO(owner/legal)` | žiadny `DELETE`, kým vlastník neurčí dni |
| `unlock_codes` | `UNLOCK_CODE_RETENTION_DAYS` = `TODO(owner)` | žiadny `DELETE` |

**Obchodný dopad:** po nasadení a overení jobu vlastník stratí kontakt z leadu po 28 dňoch, pokiaľ nie je zapnutý follow-up súhlas (`FOLLOWUP_CONSENT_ENABLED`, predvolene false) a návštevník ho nezaškrtne.
