-- ============================================================================
-- GDPR 28-day auto-purge for audit leads & cascaded results
-- Requires pg_cron (available on Supabase Pro / self-hosted Postgres).
-- On free tier: schedule via Supabase Edge Function + cron, or Dashboard
-- Database → Extensions → enable pg_cron, then run this script.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION purge_old_audit_data()
RETURNS void AS $$
BEGIN
  -- Deletes audit_leads older than 28 days (CASCADE removes audit_results)
  DELETE FROM audit_leads
  WHERE created_at < NOW() - INTERVAL '28 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Unschedule previous job if re-running
SELECT cron.unschedule('purge-28day-audit-data')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'purge-28day-audit-data'
);

-- Daily at midnight UTC
SELECT cron.schedule(
  'purge-28day-audit-data',
  '0 0 * * *',
  'SELECT purge_old_audit_data();'
);
