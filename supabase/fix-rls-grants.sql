-- Run once in Supabase → SQL Editor (fixes missing GRANT for anon inserts).
-- Safe to re-run.

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.audit_leads TO anon, authenticated;
GRANT INSERT ON TABLE public.audit_results TO anon, authenticated;

-- Ensure INSERT policies exist (same as schema.sql)
ALTER TABLE public.audit_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_audit_leads" ON public.audit_leads;
CREATE POLICY "anon_insert_audit_leads"
  ON public.audit_leads FOR INSERT
  TO anon
  WITH CHECK (
    gdpr_consent = TRUE
    AND length(trim(full_name)) > 1
    AND length(trim(work_email)) > 3
    AND length(trim(company_name)) > 1
  );

DROP POLICY IF EXISTS "anon_insert_audit_results" ON public.audit_results;
CREATE POLICY "anon_insert_audit_results"
  ON public.audit_results FOR INSERT
  TO anon
  WITH CHECK (lead_id IS NOT NULL);
