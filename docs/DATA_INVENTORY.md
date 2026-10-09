# Inventár osobných a auditných údajov (AVENG)

Zdroj: `supabase/schema.sql`, klientský kód (`src/lib/supabase.ts`, `submitContactRequest.ts`, `persist.ts`, `unlock/session.ts`).  
**Bez dohadov** — len to, čo kód / schéma skutočne používa.

## 1. Supabase (produkčný úmysel)

### Tabuľka `public.audit_leads`

| Stĺpec | Typ osobných / identifikujúcich údajov |
|---|---|
| `id` | Interný identifikátor |
| `created_at` | Časové pečiatka (retenčná logika) |
| `full_name` | Meno |
| `work_email` | E-mail |
| `company_name` | Firma |
| `phone` | Telefón |
| `gdpr_consent` | Súhlas |
| `audit_level`, `overall_score`, `financial_gap_eur`, `gap_sme_eur`, `gap_wc_eur` | Výsledky auditu |
| `sector_id`, `annual_revenue_eur`, `cogs_percent`, `critical_process_id` | Predaudit / výsledok |

### Tabuľka `public.audit_results`

| Stĺpec | Obsah |
|---|---|
| `id`, `created_at`, `lead_id` | Väzba na lead (CASCADE) |
| `process_scores` (JSONB) | Skóre procesov |
| `recommendations` (JSONB) | Odporúčania |
| `answers` (JSONB) | Odpovede auditu |

### Plánované stĺpce (migrácia — ešte nenasadené)

- `audit_leads.followup_consent` (boolean)
- `audit_leads.followup_consent_at` (timestamptz)

### Existujúci skript (história)

- `supabase/purge-28day.sql` — funkcia `purge_old_audit_data()` + cron `purge-28day-audit-data`  
- **Stav overenia v produkcii:** neznámy → `RETENTION_JOB_VERIFIED = false` v kóde

## 2. Klient / browser (bez serverovej DB)

| Úložisko | Kľúč / miesto | Obsah | Mazanie |
|---|---|---|---|
| `localStorage` | `aveng_audit_leads` | Fallback leady pri nekonfigurovanom Supabase | Manuálne / browser |
| `localStorage` | audit progress (`persist.ts`) | Rozpracovaný audit (odpovede, preAudit) | Clear / reset |
| `localStorage` | kontaktné požiadavky (`submitContactRequest`) | Fallback správy | Browser |
| `sessionStorage` | `aveng_unlock_session_v1` | Token odomknutia L2/L3 | Expirácia / clear |

## 3. E-mailové / kontaktné kanály (podľa konfigurácie)

| Kanál | Kedy | Údaje |
|---|---|---|
| Web3Forms | Ak `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Kontaktný formulár / Gemba žiadosť |
| FormSubmit | Fallback na `NEXT_PUBLIC_CONTACT_INBOX` | Rovnaké |
| Resend via Edge `send-audit-report` | Po uložení self-audit leadu | PDF → klient + owner e-mail |
| `mailto:` | Level 2/3 „požiadať e-mailom“ | Len otvorenie klienta |

## 4. Čo inventár **neobsahuje**

- Analytické skripty tretích strán (nenájdené v kóde)
- Samostatné súborové exporty na serveri
- Logovacie tabuľky v Supabase (nie v schéme)

## 5. Retenčné triedy (návrh)

| Trieda | Obdobie | Poznámka |
|---|---|---|
| Anonymné / auditné odpovede viazané na lead | `RETENTION_DAYS` (28) | Po nasadení migrácie |
| Kontaktné leady bez follow-up súhlasu | `RETENTION_DAYS` (28) | Rovnaké obdobie ako súhlas vo formulári |
| Leady s follow-up súhlasom | `FOLLOWUP_RETENTION_DAYS` | Len ak `FOLLOWUP_CONSENT_ENABLED` |

**Obchodný dopad:** pri 28 dňoch a bez follow-up súhlasu vlastník **stratí kontakt** po uplynutí lehoty.
