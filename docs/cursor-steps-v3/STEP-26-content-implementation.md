# STEP 26 - Implement approved content, FAQ and structured data (W4, T1)
Attach: rules, `docs/REPO_MAP.md`, `docs/content-drafts/`.

## Precondition
Run `Select-String -Path docs/content-drafts -Pattern "\[\[TODO" -Recurse`. If anything is found, STOP and list it. Do not publish markers.

## Tasks
1. Move the approved drafts into content data files (Markdown or TS) rendered by the existing page components; keep the design system. Visible FAQ per page.
2. JSON-LD: `Service` per pillar page (with `provider`, `areaServed` from owner answers), `FAQPage` per page whose questions are visible, `BreadcrumbList`, main `ProfessionalService`. Keep FAQ markup as hygiene only: it is not expected to produce rich results, so do not describe it as an SEO lever.
3. Internal links: pillar <-> self-audit <-> contact; each pillar links to the two related pillars.
4. `sitemap` `lastmod` from the content files' last-change dates.
5. Photo and case-study slots render only when the owner supplied the data (config); otherwise nothing shows.
6. Extend `check:copy` so `[[` and "TODO" in `out/` fail the build check.

## Done when
No stub pages remain; `check:copy` and `check:meta` pass; every FAQ on a page appears in that page's JSON-LD and vice versa.

## Commit
`feat(content): approved service and about pages with FAQ and schema` (body: W4 T1)

## Report then STOP
