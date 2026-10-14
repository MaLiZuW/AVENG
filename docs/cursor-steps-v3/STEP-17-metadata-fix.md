# STEP 17 - Per-route metadata and automated check (W3, W10)
Attach: rules, `docs/REPO_MAP.md`.

## What we solve
Sharing `/self-audit/` or `/o-nas/` shows the homepage title and URL. The `<title>` repeats the brand. We fix the generator and add a check that fails on any regression.

## Tasks
1. One `buildMetadata({ path, title, description })` helper used by every route. It guarantees: `<title>` is "{Page} | AVENG" (homepage keeps "AVENG | Procesný audit a technické vedenie pre MSP", never a doubled brand); `og:title` = title; `og:description` = meta description; `og:url` = canonical = absolute URL with trailing slash; Twitter tags mirror OG.
2. Remove the `keywords` meta tag.
3. Page texts (verbatim, owner may adjust later):
   - `/self-audit/` title SK: "Self-audit výrobných procesov | AVENG"; description SK: "Bezplatný Level 1 self-audit pre výrobné MSP: indikatívny potenciál úspor, kritická doména a tri prioritné odporúčania."
   - `/o-nas/` title SK: "O nás | AVENG"; description SK: "Vladimir, Fractional Engineering Manager s koučingom: technické vedenie a procesný audit pre výrobné MSP na Slovensku a Morave."
4. `scripts/check-meta.ts` (uses `cheerio`, run with `npx tsx`) scans `out/**/index.html` and fails when: a page lacks exactly one `<title>`; title > 65 chars; canonical is not absolute with trailing slash; `og:url` != canonical; `og:title` != title; `og:description` != meta description; Twitter tags differ from OG; titles or descriptions are not unique across pages; the og:image file is missing in `out/`; the pattern `AVENG | AVENG` appears. npm script `check:meta`.

## Done when
After `npm run build`, `npm run check:meta` passes for all routes.

## Commit
`fix(seo): per-route metadata helper and meta check` (body: W3 W10)

## Report then STOP
