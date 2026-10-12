# STEP 02 - Company config, identity, MSP terminology
Attach: rules, `docs/REPO_MAP.md`.

## Tasks
1. Create `src/config/company.ts` as the single source for: name "AV – Agency, s. r. o.", IČO 47054328, DIČ 2023729796, seat Košeca 01864, phone, e-mail vladimir@addvalueengineering.sk. Use it in footer, privacy page (later), schema (later). Remove duplicated literals.
2. Remove `IČO: [Placeholder]` from all public HTML.
3. Identity: replace "Ing. Vladimir" with "Vladimir" everywhere (UI, footer, schema, meta author, e-mail templates, exports).
4. Keep only `vladimir@addvalueengineering.sk`. Remove every `aveng.sk` occurrence (footer, schema, `mailto`, copy). The "request Premium by e-mail" button uses the same address.
5. Replace "SME" with "MSP" in all visible text, question data, FAQ, meta, keywords, export file names. Hero badge -> SK: "SENIORNÉ TECHNICKÉ VEDENIE PRE MSP". Keep internal identifiers/variable names unchanged (e.g. `S_SME`); list them in the report.
6. Remove the "256-bit SSL" badge; replace with SK: "Prenos údajov je šifrovaný (HTTPS)" or omit it.
7. Create `src/config/social.ts` (all values empty, `TODO(owner)`). Render social icons only for non-empty values; remove links that point to generic platform homepages.

8. Apply items 3-6 also to Supabase Edge Functions and to all e-mail/report templates (HTML/PDF report, e-mails) under `supabase/functions/`. If those functions need company data, keep `supabase/functions/_shared/company.ts` identical to `src/config/company.ts` and add `scripts/check-shared-sync.ts` that fails when they differ (npm script `check:shared`).

## Verify
`grep -rni "aveng.sk" src public` (no results); `grep -rn "Ing\." src public` (none next to the name); `grep -rniE "\bSME\b" src public` (only internal identifiers).

## Commit
`chore: centralize company data, set identity, MSP terminology`

## Report then STOP (list remaining "SME" identifiers kept on purpose)
