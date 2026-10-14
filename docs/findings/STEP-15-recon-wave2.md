# STEP 15 - Wave 2 recon (docs only)
Attach: rules, `docs/REPO_MAP.md`, `docs/findings/FINDINGS-2026-10-13.md`.

## What we solve
Locate where every finding lives so the next steps stay small and precise.

## Tasks
1. Append a "Wave 2" section (<= 80 lines) to `docs/REPO_MAP.md` with exact paths for: public metadata generation per route; footer component; audit copy strings (disclaimers, hints, titles, footers); number formatting and rounding code; range/reliability logic; result view components (web); `MetricExplainer` usage points; recommendation generation; impact-label logic; unlock cards and how the unlocked level is known; the PDF generator (Edge Function path, template, fonts) and the report e-mail; the contact and audit lead forms and every outgoing network target in `src/` and `supabase/functions/`; analytics scripts; font loading (self-hosted or third-party CDN); `public/` files (og-image, `.htaccess`); npm scripts.
2. Write `docs/WAVE2_PLAN.md` (Slovak, <= 70 lines): table finding ID -> files -> step number. Mark findings that need no code (owner actions): W9, W13, T2, T4 (part).
3. Write `docs/INFRA_FACTS.md` (Slovak): Supabase project region and whether Edge Functions use regional invocation; Resend domain/sending region; every third-party endpoint the code can call (Web3Forms, FormSubmit, others); analytics present or not; fonts from third-party CDN yes/no. Where a fact cannot be derived from the repo write "neznáme - overí vlastník". Do not guess.

## Do NOT
Change code or run any `supabase` command.

## Done when
The three docs exist with real paths and every item above is answered or marked unknown.

## Commit
`docs: wave 2 repo map, plan and infra facts`

## Report then STOP
