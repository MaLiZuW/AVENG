-- ============================================================================
-- AddValueEngineering (AVENG) — Audit Leads Schema
-- Run in Supabase SQL Editor. Static site uses anon key + RLS insert policies.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- audit_leads: contact + summary scores (auto-purged after 28 days)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  audit_level SMALLINT NOT NULL DEFAULT 1 CHECK (audit_level BETWEEN 1 AND 3),
  overall_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
  financial_gap_eur NUMERIC(14, 0) NOT NULL DEFAULT 0,
  gap_sme_eur NUMERIC(14, 0) NOT NULL DEFAULT 0,
  gap_wc_eur NUMERIC(14, 0) NOT NULL DEFAULT 0,
  sector_id TEXT NOT NULL DEFAULT 'general',
  annual_revenue_eur NUMERIC(14, 0) NOT NULL DEFAULT 0,
  cogs_percent NUMERIC(5, 1) NOT NULL DEFAULT 65,
  critical_process_id TEXT NOT NULL DEFAULT 'P1'
);

-- Safe migrations for existing deployments
ALTER TABLE audit_leads ADD COLUMN IF NOT EXISTS gap_sme_eur NUMERIC(14, 0) NOT NULL DEFAULT 0;
ALTER TABLE audit_leads ADD COLUMN IF NOT EXISTS gap_wc_eur NUMERIC(14, 0) NOT NULL DEFAULT 0;
ALTER TABLE audit_leads ADD COLUMN IF NOT EXISTS sector_id TEXT NOT NULL DEFAULT 'general';
ALTER TABLE audit_leads ADD COLUMN IF NOT EXISTS annual_revenue_eur NUMERIC(14, 0) NOT NULL DEFAULT 0;
ALTER TABLE audit_leads ADD COLUMN IF NOT EXISTS cogs_percent NUMERIC(5, 1) NOT NULL DEFAULT 65;
ALTER TABLE audit_leads ADD COLUMN IF NOT EXISTS critical_process_id TEXT NOT NULL DEFAULT 'P1';

CREATE INDEX IF NOT EXISTS audit_leads_created_at_idx ON audit_leads (created_at);

-- ---------------------------------------------------------------------------
-- audit_results: detailed answers & recommendations (cascade on lead delete)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id UUID NOT NULL REFERENCES audit_leads (id) ON DELETE CASCADE,
  process_scores JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS audit_results_lead_id_idx ON audit_results (lead_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — anon may INSERT only; no public SELECT/UPDATE/DELETE
-- ---------------------------------------------------------------------------
ALTER TABLE audit_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_audit_leads" ON audit_leads;
CREATE POLICY "anon_insert_audit_leads"
  ON audit_leads FOR INSERT
  TO anon
  WITH CHECK (
    gdpr_consent = TRUE
    AND length(trim(full_name)) > 1
    AND length(trim(work_email)) > 3
    AND length(trim(company_name)) > 1
  );

DROP POLICY IF EXISTS "anon_insert_audit_results" ON audit_results;
CREATE POLICY "anon_insert_audit_results"
  ON audit_results FOR INSERT
  TO anon
  WITH CHECK (lead_id IS NOT NULL);

-- Privileges for PostgREST (anon key from the browser)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.audit_leads TO anon, authenticated;
GRANT INSERT ON TABLE public.audit_results TO anon, authenticated;

-- Service role / dashboard retains full access via bypassing RLS.
