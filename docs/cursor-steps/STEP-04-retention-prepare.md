# STEP 04 - Data retention (PREPARE ONLY, never execute)
Attach: rules, `docs/REPO_MAP.md`, `docs/REMEDIATION_PLAN.md`.

## Goal
Make deletion claims true and avoid needless loss of contacts.

## Tasks
1. Write `docs/DATA_INVENTORY.md` (Slovak): every table, column, log and file holding personal data or audit results (leads, sessions, answers, logs, exports, e-mail queues, analytics, report payloads), taken from the REAL schema/code. Include `public.unlock_codes` (recipient_email, recipient_name, company_name, created_by, note) and anything the report e-mail stores. Never guess names.
2. Config: `RETENTION_DAYS` (default 28), `RETENTION_JOB_VERIFIED` (default false), `FOLLOWUP_CONSENT_ENABLED` (default false), `FOLLOWUP_RETENTION_DAYS` (`TODO(owner/legal)`).
3. Add config `UNLOCK_CODE_RETENTION_DAYS` (`TODO(owner)`) for redeemed/expired unlock codes (they contain recipient data); no default deletion until the owner decides.
3b. Data classes:
   - anonymous results/answers: deleted after `RETENTION_DAYS`
   - lead contact data: same period as the consent text; longer only with a separate UNCHECKED consent, SK: "Súhlasím s kontaktovaním ohľadom služieb AVENG v nasledujúcich {FOLLOWUP_RETENTION_DAYS} dňoch", behind `FOLLOWUP_CONSENT_ENABLED`; store consent with timestamp
4. Create `supabase/migrations/<timestamp>_data_retention.sql` from the template below; fill table/column names ONLY from the inventory. Do not apply it.

```sql
-- PROPOSAL FOR APPROVAL. Do not apply automatically.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE OR REPLACE FUNCTION public.purge_expired_audit_data()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- TODO: one statement per table in docs/DATA_INVENTORY.md, e.g.
  -- DELETE FROM public.<results_table> WHERE created_at < now() - interval '28 days';
  -- DELETE FROM public.<leads_table> WHERE created_at < now() - interval '28 days'
  --   AND coalesce(followup_consent, false) = false;
  NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.purge_expired_audit_data() FROM PUBLIC;
SELECT cron.schedule('purge-expired-audit-data', '15 3 * * *',
                     $$SELECT public.purge_expired_audit_data();$$);
-- rollback: SELECT cron.unschedule('purge-expired-audit-data'); DROP FUNCTION public.purge_expired_audit_data();
```
5. Truthful copy: while `RETENTION_JOB_VERIFIED=false`, public copy must NOT promise automatic deletion. Use SK: "Údaje uchovávame len po dobu nevyhnutnú na vyhodnotenie auditu a spracovanie dopytu". When true, use SK: "Údaje uchovávame najviac {RETENTION_DAYS} dní." Update the privacy page and the consent text through one helper.

## Do NOT
Run SQL, apply migrations, or touch production.

## Done when
Inventory and migration file exist; `SET search_path` present; function not callable by PUBLIC; copy switches on the flag.

## Commit
`feat: prepare data retention migration and flag-driven copy`

## Report then STOP (state: owner loses lead contact after 28 days unless the follow-up consent is enabled)
