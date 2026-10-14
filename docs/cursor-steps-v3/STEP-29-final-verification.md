# STEP 29 - Final verification and deployment checklist
Attach: rules, `docs/REPO_MAP.md`, `docs/WAVE2_PLAN.md`.

## Tasks
1. Run and record: `npm run check:meta`, `npm run check:copy`, `npm run audit:invariants`, `npm run check:shared`, `npm run lint`, `npx tsc --noEmit`, `npm run build`. Generate the three fixture PDFs (L1, L2, L3) and run their checks.
2. Grep checks in `src`, `supabase`, `out`: no "Web3Forms", "FormSubmit", "aveng.sk", "Ing.", "Silver", "Gold", "Premium" (unless `USE_TIER_NAMES`), "odvetvov", "toFixed(" outside `format.ts`.
3. Write `docs/WAVE2_REPORT.md` (Slovak): table finding ID -> status (OK / NIE / owner action) -> evidence. Owner decisions: level names, reliability and impact thresholds, `MAX_DISPLAYED_POTENTIAL_SHARE`, retention and `RETENTION_JOB_VERIFIED`, DPAs and transfer mechanism, e-mail provider region, payment method for Level 2/3, booking URL, analytics provider, content approvals, seat address, photo and references.
4. Deployment checklist (Slovak), in order: (a) migrations to apply (list files), (b) Edge Functions to deploy (list names), (c) secrets to set (names only), (d) `npm run build`, (e) FTP upload of the whole `out/` including `.htaccess`, (f) post-deploy: HTTPS redirect, 404 page, sitemap/robots, a Level 1, Level 2 and Level 3 run with test codes, generated PDFs and e-mails, social preview check of `/`, `/self-audit/`, `/o-nas/` (LinkedIn Post Inspector), Search Console reindex.

## Commit
`docs: wave 2 report and deployment checklist`

## Report then STOP
