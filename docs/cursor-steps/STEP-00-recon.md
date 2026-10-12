# STEP 00 - Recon and repo map (no code changes)
Mode: Agent, new chat. Attach: `.cursor/rules/aveng-core.mdc`.

## Goal
Create a compact map of the repo so every later step can skip exploration.

## Tasks
1. Read `package.json`, Next config, Tailwind config, `src/` tree, `supabase/` (migrations AND `supabase/functions/`), env example files, any FTP/deploy notes.
2. Write `docs/REPO_MAP.md` (English, <= 120 lines) with exact paths for:
   - Next config: confirm `output: 'export'`, `trailingSlash`, `images.unoptimized`; list any feature that is incompatible with static export
   - calculation engine (scoring, `C_Pi`, `k_Pi`, `S_SME`, `S_WC`, `M_WC`) and where benchmarks/constants live
   - presentation of results (result components, radar chart, banners, lead form)
   - question data files and the question card component (incl. the "Poznáte presné číslo?" exact-input mode)
   - unlock/promo flow: client code, Edge Function(s), the `unlock_codes` table (migration `20261008170000_unlock_codes.sql`) and who calls what
   - the post-audit report/e-mail generator (HTML/PDF/e-mail templates, Edge Function, payload shape)
   - lead/result storage (tables, Edge Functions), e-mail sending
   - global layout, metadata, JSON-LD, footer, header/nav, Tailwind color tokens
   - existing test runner (if any) and npm scripts; how the owner builds and uploads (`out/` via FTP)
3. In `docs/REMEDIATION_PLAN.md` (Slovak, <= 60 lines) answer, with file references:
   - Is `AVENG2026` (or any promo code) present in client code, `out/`, HTML or JSON-LD?
   - Does the existing unlock flow already use `unlock_codes` through an Edge Function? Which gaps remain (rate limit, atomic redeem, token, CORS)?
   - Is Level 2/3 content in the bundle/`out/` before unlock, or only CSS-blurred?
   - Which tables/fields hold personal data or results? Does any deletion job exist?
   - Where do `S_SME`/`S_WC` values come from (any source noted)?
   - Is the world-class cap applied to the world-class value only, or also elsewhere?
   - Does the report/e-mail generator duplicate formatting logic that lives in the Next app?
   - Which questions accept an exact number (list id, text, unit)?

## Do NOT
Modify any source code, run `supabase` commands, or start/deploy anything. Only create the two docs.

## Done when
Both docs exist, contain real paths (verified by opening files), and every question is answered or marked "not found".

## Commit
`docs: add repo map and remediation plan`

## Report then STOP
