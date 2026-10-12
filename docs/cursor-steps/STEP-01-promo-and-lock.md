# STEP 01 - Unlock/promo validation and locked content (security)
Attach: rules, `docs/REPO_MAP.md`.

## Context
Static export + Supabase Edge Functions. Existing: `public.unlock_codes` (RLS on, service role only, `level` 2/3, `expires_at`, `redeemed_at`, unique `code`, index on `upper(code)`) and an unlock/report Edge Function. Review and extend what exists; do not rewrite it from scratch.

## Tasks
1. Remove the string `AVENG2026` everywhere (source, FAQ text, JSON-LD, tests, docs). Verify with `grep -ri AVENG2026 .` and after a build also in `out/`.
2. Validation only in the Edge Function, against `unlock_codes`: case-insensitive match, `expires_at > now()`, not yet redeemed (or the policy the existing code already defines), correct `level`. Redeem atomically with a single `UPDATE ... WHERE ... RETURNING` (no read-then-write race). Generic error text that does not reveal whether a code exists, expired or was used.
3. Rate limit inside the Edge Function (hashed IP + time window). If it needs a table, create a migration file `..._unlock_attempts.sql` (RLS on, service role only). Do NOT apply it.
4. Token: on success the function returns a short-lived signed token (HMAC; secret from Supabase secrets; payload = level + expiry). The client keeps it in memory/`sessionStorage`. Real Level 2/3 content is fetched from an Edge Function that verifies the token on every call. CORS limited to the production origin(s) from config.
5. Static export check: nothing that is truly locked may exist in the JS bundle or `out/`. Pick 3 distinctive strings from Level 2/3 questions and `grep -r` them in `out/` after build. If found, move the content to Supabase (table + service-role read) or to the Edge Function and leave neutral placeholders in the client.
6. FAQ (visible + schema): Level 2 costs 290 EUR; no promo code mentioned.
7. List required secrets/env vars (names only) in `.env.example` and `docs/SECRETS_NEEDED.md` (Slovak), e.g. the token-signing secret. The service-role key never appears in client code.

## Do NOT
Deploy functions, run `supabase` commands that change the remote project, or change scoring logic and pricing.

## Done when
No promo string in source or `out/`; unlocking works only through the Edge Function; locked content absent from `out/`; secrets documented.

## Commit
`fix(security): server-side unlock validation via Edge Function and gated Level 2/3`

## Report then STOP (tell the owner which functions/migrations they must deploy manually)
