# Redirects and crawl files (static export on Apache)

The site is a static export uploaded by FTP, so redirects must live in `public/.htaccess` (it is copied into `out/.htaccess`). Next.js `redirects()` does not work with `output: "export"`.

## Legacy URLs → new URLs (HTTP 301, no chains)
| Old path | New path |
|---|---|
| `/sluzby/fractional-technical-leadership/` | `/sluzby/` |
| `/sluzby/zavadzanie-procesov-plm-pdm/` | `/sluzby/sprava-dokumentacie-a-schvalovanie/` |
| `/sluzby/riadenie-zmien-eco/` | `/sluzby/projekt-zmeny-eco/` |

## Rules block (merge into the EXISTING `public/.htaccess`; keep all existing HTTPS, www, security-header and caching rules)
Place this block BEFORE any generic rewrite rules:

```apache
# AddValueEngineering: legacy service URLs (301)
RedirectMatch 301 ^/sluzby/fractional-technical-leadership/?$ /sluzby/
RedirectMatch 301 ^/sluzby/zavadzanie-procesov-plm-pdm/?$ /sluzby/sprava-dokumentacie-a-schvalovanie/
RedirectMatch 301 ^/sluzby/riadenie-zmien-eco/?$ /sluzby/projekt-zmeny-eco/
```

Notes:
- Use `RedirectMatch` with `/?$` so that both with and without trailing slash work and no `//` is produced.
- If the repo already contains HTML redirect stubs (meta refresh) for these paths, keep them only as a fallback for local `npx serve out`. The 301 rules are the primary mechanism. Stubs must contain `<meta name="robots" content="noindex">` and a canonical to the new URL.
- Do not delete or reorder existing rules unrelated to these paths.

## sitemap.xml and robots.txt
- Generate `sitemap.xml` at build time (App Router `app/sitemap.ts` with `export const dynamic = "force-static"`), absolute URLs with trailing slash, `lastModified` = build date.
- Include exactly the routes in `docs/content-v2/seo.json` that exist in the current phase, plus `/ochrana-osobnych-udajov/`. Exclude legacy URLs, `/404`, `/admin`, and any unlock/result pages.
- Generate `robots.txt` (`app/robots.ts`, `force-static`): `User-agent: *`, `Allow: /`, `Disallow: /admin/`, `Sitemap: https://www.addvalueengineering.sk/sitemap.xml`.
- The existing IndexNow key file in `public/` stays untouched.

## Verification
`npm run check:content` verifies: sitemap contains all phase routes and no legacy routes, robots references the sitemap, and `out/.htaccess` contains the three redirect rules.
