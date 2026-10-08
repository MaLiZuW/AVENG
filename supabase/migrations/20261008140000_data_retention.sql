-- PROPOSAL FOR APPROVAL. Do not apply automatically.
-- Rollback note: DROP FUNCTION IF EXISTS public.purge_expired_audit_data();
--   then cron.unschedule('purge-expired-audit-data') if scheduled.
-- Idempotent: CREATE OR REPLACE + ADD COLUMN IF NOT EXISTS + unschedule-before-schedule.

-- Optional follow-up consent columns (safe if unused while FOLLOWUP_CONSENT_ENABLED=false)
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
  -- Anonymous / detail rows cascade when lead is deleted.
  -- Leads without follow-up consent: RETENTION_DAYS = 28
  DELETE FROM public.audit_leads
  WHERE created_at < now() - interval '28 days'
    AND coalesce(followup_consent, false) = false;

  -- Leads with follow-up consent: FOLLOWUP_RETENTION_DAYS (placeholder 180)
  -- TODO(owner/legal): align days with FOLLOWUP_RETENTION_DAYS in src/config/retention.ts
  DELETE FROM public.audit_leads
  WHERE followup_consent = true
    AND created_at < now() - interval '180 days';
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_audit_data() FROM PUBLIC;

-- Replace legacy job name if present
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname IN ('purge-28day-audit-data', 'purge-expired-audit-data');

SELECT cron.schedule(
  'purge-expired-audit-data',
  '15 3 * * *',
  $$SELECT public.purge_expired_audit_data();$$
);
