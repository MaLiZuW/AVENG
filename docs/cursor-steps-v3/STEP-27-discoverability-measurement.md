# STEP 27 - Discoverability and measurement (T2, T3, T4, T6)
Attach: rules, `docs/REPO_MAP.md`, `docs/INFRA_FACTS.md`.

## What we solve
No way to see where visitors drop off, and no checklist for the off-site signals that drive visibility in classic and AI search.

## Tasks
1. Cookieless analytics wrapper `src/lib/analytics.ts`: `NEXT_PUBLIC_ANALYTICS_PROVIDER` = `none` (default) | `plausible` | `umami` plus the script URL/domain variables; the script loads only when configured. Events (no personal data, no answers in properties): `audit_start`, `audit_level_complete` (level), `report_requested`, `unlock_attempt`, `unlock_success`, `contact_submit`, `booking_click`. When a provider is configured the policy lists it as a processor (config-driven). The provider choice and hosting region are owner decisions.
2. `public/llms.txt` (short index of key pages with one-line descriptions). It is optional: record in the report that Google states it does not use such files and that measured citation gains are unproven. `robots.txt` allows all crawlers and links the sitemap; do not add AI-crawler blocks.
3. `scripts/indexnow.ts`: reads the sitemap and sends the URLs to the IndexNow endpoint when run manually after deployment; key file in `public/`. Google does not use IndexNow; it helps Bing-based engines.
4. `docs/OWNER_ACTIONS_VISIBILITY.md` (Slovak) with a checklist: Google Search Console (domain property, sitemap, reindex requests, old URLs return 404/410); Bing Webmaster Tools (import from Search Console); Google Business Profile with the exact same name/address/phone as the site; LinkedIn company page and regular posts; directory listings (Finstat, Firmy.sk, Zoznam, Europages); 2-3 external mentions (guest article, trade portal, podcast); one consistent entity description (same one-sentence text everywhere). Add a monthly manual AI-visibility check template: 10 buyer questions asked in ChatGPT, Perplexity, Gemini and Google AI Mode, with a table for "named / cited / competitor named".

## Done when
With no analytics variables set the build ships no tracking script; with the variables set the events fire (verify in the browser console).

## Commit
`feat: optional cookieless analytics, IndexNow, visibility checklist` (body: T2 T3 T4 T6)

## Report then STOP
