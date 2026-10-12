# STEP 14 - Final verification and owner report
Attach: rules, `docs/REPO_MAP.md`.

## Tasks
1. Run and record the checks:
   - `grep -ri "AVENG2026" .` and in `out/` after build -> nothing
   - no `[Placeholder]`, no `aveng.sk`, no "Ing." next to the name, no visible "SME", no emoji in `src/`, no emoji in report/e-mail templates
   - no "±" accuracy claims, no "priemer MSP na Slovensku", no "VDA 6.3 – P" style references (also in `supabase/functions/`)
   - `git diff` since step 00 on calculation files is empty
   - static export sanity: `out/` has `index.html` per route, `404.html`, `.htaccess`, `sitemap.xml`, `robots.txt`; no server-only features (grep for `route.ts`, server actions, middleware)
   - locked Level 2/3 strings absent from `out/`; no service-role key or token secret in `out/` or client code
   - `npm run audit:invariants`, `npm run check:shared`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
   - Lighthouse mobile if available (Accessibility, SEO, Best Practices >= 95); otherwise list as not run
2. Write `docs/REMEDIATION_REPORT.md` (Slovak): changes by step; checklist results (OK / NIE + reason); owner decisions (`TODO(owner)`) with where each lives:
   - sources and bands for model references and card bands
   - `MAX_DISPLAYED_POTENTIAL_SHARE`, `SHOW_WORLD_CLASS_CEILING` (based on `audit-sanity-report.md`), `PLAUSIBILITY_WARN_SHARE_OF_SALES`
   - approval of the deletion migration, `RETENTION_JOB_VERIFIED`, lead retention period, `UNLOCK_CODE_RETENTION_DAYS`, separate follow-up consent
   - privacy page text (lawyer), FAQ approval, `NEXT_PUBLIC_BOOKING_URL`, social profiles, KPI mapping review, question review, identifying details in copy (e.g. "až 35 inžinierov", years of experience, regions)
3. Add a deployment checklist (Slovak) to the report, in this order: (a) migrations to apply in Supabase (list files), (b) Edge Functions to deploy (list names), (c) secrets to set in Supabase (names only), (d) `npm run build`, (e) upload the whole `out/` including `.htaccess` via FTP, (f) post-deploy checks (HTTPS redirect, 404 page, `sitemap.xml`, unlock flow with a test code, test audit and report e-mail), (g) risks: DNS/mail redirect from `aveng.sk`, 301 redirects from the old WordPress site, cleaning the compromised domain content before the upload.

## Commit
`docs: final remediation report and deployment checklist`

## Report then STOP
