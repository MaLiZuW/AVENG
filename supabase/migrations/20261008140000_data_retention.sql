-- PROPOSAL FOR APPROVAL. Do not apply automatically.
-- Idempotent: CREATE OR REPLACE + ADD COLUMN IF NOT EXISTS + unschedule-before-schedule.
-- rollback: SELECT cron.unschedule('purge-expired-audit-data'); DROP FUNCTION public.purge_expired_audit_data();

-- Follow-up consent (unused while FOLLOWUP_CONSENT_ENABLED=false).
ALTER TABLE public.audit_leads
  ADD COLUMN IF NOT EXISTS followup_consent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.audit_leads
  ADD COLUMN IF NOT EXISTS followup_consent_at TIMESTAMPTZ NULL;

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.purge_expired_audit_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- audit_results: answers and scores, RETENTION_DAYS = 28
  DELETE FROM public.audit_results
  WHERE created_at < now() - interval '28 days';

  -- audit_leads: contact without follow-up consent, RETENTION_DAYS = 28
  DELETE FROM public.audit_leads
  WHERE created_at < now() - interval '28 days'
    AND coalesce(followup_consent, false) = false;

  -- follow-up consented leads: no DELETE until FOLLOWUP_RETENTION_DAYS is set
  -- TODO(owner/legal)

  -- public.unlock_codes (recipient_email, recipient_name, company_name,
  -- created_by, note): no DELETE until UNLOCK_CODE_RETENTION_DAYS is set
  -- TODO(owner)
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_audit_data() FROM PUBLIC;

-- Legacy job purge-28day-audit-data deletes every lead after 28 days.
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname IN ('purge-28day-audit-data', 'purge-expired-audit-data');

SELECT cron.schedule(
  'purge-expired-audit-data',
  '15 3 * * *',
  $$SELECT public.purge_expired_audit_data();$$
);
