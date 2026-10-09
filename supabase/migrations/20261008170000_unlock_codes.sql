-- One-time / admin-issued unlock codes for Level 2 & 3.
-- Access only via Edge Functions (service role). No anon policies.

CREATE TABLE IF NOT EXISTS public.unlock_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  code TEXT NOT NULL,
  level SMALLINT NOT NULL CHECK (level IN (2, 3)),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT '',
  sent_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
  note TEXT NOT NULL DEFAULT '',
  CONSTRAINT unlock_codes_code_unique UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS unlock_codes_code_idx
  ON public.unlock_codes (upper(code));

CREATE INDEX IF NOT EXISTS unlock_codes_created_at_idx
  ON public.unlock_codes (created_at DESC);

ALTER TABLE public.unlock_codes ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated — browser never reads this table directly.
REVOKE ALL ON TABLE public.unlock_codes FROM anon, authenticated;
GRANT ALL ON TABLE public.unlock_codes TO service_role;
