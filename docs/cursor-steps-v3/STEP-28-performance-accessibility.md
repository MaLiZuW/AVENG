# STEP 28 - Performance and accessibility (T5)
Attach: rules, `docs/REPO_MAP.md`, `docs/INFRA_FACTS.md`.

## What we solve
Keep the site fast and usable. Targets are Google's published "good" Core Web Vitals values at the 75th percentile (LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1) and WCAG 2.2 AA as good practice. (Legal note for the owner: the European Accessibility Act mainly targets consumer-facing services and exempts microenterprises; AVENG is B2B, so this is quality work, not a published obligation.)

## Tasks
1. Serve `out/` locally (`npx serve out`) and run Lighthouse (mobile) via `npx lighthouse` on `/`, `/self-audit/`, one pillar page and `/kontakt/`. Targets: Performance >= 90, Accessibility >= 95, SEO >= 95, LCP <= 2.5 s, CLS <= 0.1, TBT <= 200 ms as the lab proxy for INP.
2. Performance fixes: code-split the audit app and chart library so they load only on `/self-audit/`; images with explicit width/height and modern formats; fonts self-hosted as `woff2` with `font-display: swap` and a preload for the primary font (if `INFRA_FACTS` shows third-party font CDNs, self-host them); remove unused JS/CSS.
3. Accessibility (run `npx @axe-core/cli` on the same pages and on a rendered result state): visible focus not hidden by sticky headers (2.4.11), touch targets >= 24x24 px (2.5.8), `aria-expanded`/`aria-controls` on every expander, form labels and clear error messages (3.3.1, 3.3.2), a skip link, landmarks, charts understandable without colour (labels/patterns and a text alternative or table), `prefers-reduced-motion`.
4. Write `docs/PERF_A11Y_REPORT.md` (Slovak) with before/after numbers and the issues you did not fix.

## Done when
The Lighthouse and axe results are recorded; no serious or critical axe violations remain on the tested pages.

## Commit
`perf(a11y): performance budget, code splitting, WCAG 2.2 AA fixes` (body: T5)

## Report then STOP
