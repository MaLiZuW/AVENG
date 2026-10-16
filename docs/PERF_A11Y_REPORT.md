# Performance & accessibility — STEP 28 (T5)

Meranie: `npx serve out -l 3456`, Lighthouse mobile (lab), axe-core CLI (WCAG 2 A/AA + 2.2 AA).  
Dátum: 16. 10. 2026. Právna poznámka: EAA cieľi najmä B2C; AVENG je B2B — ide o kvalitu, nie deklarovanú povinnosť.

## Ciele

| Metrika | Cieľ |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| SEO | ≥ 95 |
| LCP (lab) | ≤ 2,5 s |
| CLS | ≤ 0,1 |
| TBT (proxy INP) | ≤ 200 ms |
| axe serious/critical | 0 |

## Pred opravami (orientačne)

| Stránka | Perf | A11y | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---|---|---|
| `/` | 96 | 100 | 100 | 2,6 s | 0 | 70 ms |
| `/self-audit/` | **80** | 94 | 100 | 3,0 s | **0,26** | 100 ms |
| `/sluzby/fractional-…/` | 96 | 96 | 100 | 2,5 s | 0 | 90 ms |
| `/kontakt/` | 93 | 96 | 100 | 2,7 s | 0,098 | 40 ms |

Hlavný problém: `dynamic(..., { ssr: false })` na self-audite → veľký CLS pri hydratácii.

## Po opravách

| Stránka | Perf | A11y | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---|---|---|
| `/` | **97** | **100** | **100** | **2,5 s** | **0** | 30 ms |
| `/self-audit/` | **95** | **100** | **100** | 2,9 s | **0** | 30 ms |
| `/sluzby/fractional-…/` | **97** | **100** | **100** | **2,5 s** | **0** | 30 ms |
| `/kontakt/` | **93** | **100** | **100** | 2,7 s | 0,098 | 10 ms |

axe (po opravách, 4 stránky): **0 violations** (s ChromeDriver 155).

## Čo sa zmenilo

- Skip link + `id="main-content"` + `scroll-padding-top` (2.4.1 / 2.4.11)
- Code-split `AuditSection` cez `next/dynamic` **so SSR** (bez CLS)
- Audit zostáva len na `/self-audit/` (nie v home bundle)
- Fonty: `next/font` Fraunces/Manrope, `display: swap`, `preload: true` (self-host woff2)
- Min. touch target na `.btn-primary` / `.btn-secondary` (≥ 44×44 CSS px)
- Inline odkazy: vždy `underline` (1.4.1 link-in-text-block)
- Radar: textová tabuľka ako alternatíva ku grafu
- `aria-controls` na exact-input expander; heading order h1→h2 v audite
- `prefers-reduced-motion` už existoval; doplnené na active scale tlačidiel

## Čo sme neopravili / ostáva

| Položka | Stav |
|---|---|
| LCP `/self-audit/` 2,9 s | Lab nad 2,5 s; Perf score aj tak ≥ 90. Ďalšie štiepenie L2/L3 dát by pomohlo. |
| LCP `/kontakt/` 2,7 s | Tesne nad cieľom; zod formáňa veľkosť client bundle (zod). |
| Header `<img>` ESLint | Zámerne bez `next/image` (static export, `images.unoptimized`). |
| axe flaky color-contrast | Občas 1 beh zlyhal na `text-ink-300` / signal; opakovaný beh 0. Manuálny review kontrastu muted textu odporúčaný. |
| Rendered result state axe | Nebežal plný výsledkový stav (vyžaduje vyplnený audit); radar tabuľka je pripravená pre výsledky. |
| Field INP | Lab meria TBT; field INP overí Search Console / CrUX po deployi. |

## Ako zopakovať

```powershell
npm run build
npx serve out -l 3456
npx lighthouse http://127.0.0.1:3456/ --form-factor=mobile --only-categories=performance,accessibility,seo
npx browser-driver-manager install chrome   # pri mismatch Chrome/ChromeDriver
npx @axe-core/cli http://127.0.0.1:3456/ --chromedriver-path <path> --exit --tags wcag2a,wcag2aa,wcag22aa
```
