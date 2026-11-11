# GLOBAL RULES (apply to every page)

## 1. Branding
Branding stays exactly as on the live site: logo, colors, fonts, buttons, cards, spacing. This update changes text, page structure, metadata and linking only.

## 2. Routes
| Key | Route | Spec |
|---|---|---|
| domov | `/` | pages/01-domov.md |
| sluzby | `/sluzby/` | pages/02-sluzby.md |
| audit-problem | `/sluzby/procesny-audit-identifikacia-problemu/` | pages/03-audit-problem.md |
| zmeny-eco | `/sluzby/projekt-zmeny-eco/` | pages/04-zmeny-eco.md |
| dokumentacia | `/sluzby/sprava-dokumentacie-a-schvalovanie/` | pages/05-dokumentacia.md |
| lideri | `/sluzby/rozvoj-liderov-koucing/` | pages/06-lideri.md |
| ai | `/optimalizacia-a-ai/` | pages/07-ai.md |
| self-audit | `/self-audit/` | pages/08-self-audit.md |
| o-nas | `/o-nas/` | pages/09-o-nas.md |
| kontakt | `/kontakt/` | pages/10-kontakt.md |
| znalosti (phase 4) | `/znalosti/` | pages/11-znalosti.md |
| clanok-eco (phase 4) | `/znalosti/co-je-eco/` | pages/12-clanok-eco.md |
| ochrana | `/ochrana-osobnych-udajov/` | PRIVACY-ADDITIONS.md |

Existing route paths stay unchanged. Do not rename existing folders.

## 3. Page template (what each spec file means)
- Front matter gives `title`, `meta_description`, `primary_keyword`.
- `# H1:` is the single H1. `##` are H2 sections in the given order. `###` are H3.
- `Lead` is the paragraph directly under the H1.
- `Tlačidlá` are buttons. "primárne" uses the existing primary button style, "sekundárne" the existing outline/secondary style.
- `Karty` are cards in the existing card component. A card has ONE link only (do not link both the heading and a "more" link).
- `Zvýraznený blok` uses the existing highlighted-section style (or the closest existing one).
- FAQ items are rendered with the existing FAQ component (or `<details>/<summary>`). Same data feeds the FAQPage JSON-LD.
- Eyebrow text above the H1 on project pages is the single word "Projekt" (replace "Pilier 01…04").

## 4. Header, navigation, footer
- Navigation order: Domov, O nás, Služby, Optimalizácia & AI, Self-Audit, Kontakt. (Phase 4 adds "Znalosti" before "Kontakt".)
- Header button stays "Spustiť audit zdarma" → `/self-audit/#level-1`.
- Remove the "HTTPS | GDPR" badge from the header if present.
- Footer: add the line `Pôsobíme najmä v Trenčianskom, Žilinskom a Trnavskom kraji.` above the legal line. Legal line unchanged: `AV – Agency, s. r. o. · IČO 47054328 · Zliechovská ulica 1117/110, 018 64 Košeca, Slovenská republika`.

## 5. Terminology
- "Pilier / piliere / Viac o pilieri / Súvisiace piliere" → "Projekt / typy projektov / Detail projektu / Súvisiace projekty".
- Never write "AVENG" in user-facing titles or headings. The full brand is "AddValueEngineering".

## 6. Metadata (every page)
- `<title>` and `<meta name="description">` exactly from `seo.json`.
- `<link rel="canonical">` absolute: `https://www.addvalueengineering.sk<route>`.
- `og:title`, `og:description`, `og:url`, `og:type`, `og:locale=sk_SK`, `og:site_name`, `og:image` (keep the existing file `/og-image.png`), `og:image:alt` = `AddValueEngineering – projektové riešenie problémov vo výrobe` on every page. `twitter:*` mirrors OG. Do not repeat the same long description in three different hand-written places: derive OG/Twitter from the page metadata object.
- Remove the redundant `<meta name="googlebot">` (keep `robots: index, follow`).
- `<html lang="sk">`.
- Do not use meta keywords.

## 7. Content rules
- Never show: "fractional", "Head of Engineering", "Powered by", "Gemba Walk", "Morava", hourly rates, "pilier".
- Only price shown: "290 €" for Level 2 (cards, FAQ, home price card). Everything else: "cenová ponuka podľa rozsahu" / "Podľa dohody" as written in the spec.
- Target audience everywhere: výrobné firmy, 20 až 250 zamestnancov, sektory automotive, EMS, strojárstvo, plasty, kovovýroba.
- No photo, surname, social links, client names, testimonials, invented numbers.
- Experience claims are only those in the spec ("15+ rokov", "až 35 inžinierov", four experience bullets without numbers, "certifikovaný business kouč (BCTC)").

## 8. Internal linking
- Every project page ends with: conditions → price → FAQ → primary CTA, then a "Súvisiace projekty" list (see UX-ADDITIONS.md, phase 3).
- Link text is descriptive (project name), never "kliknite sem".
- All internal links use the final routes with trailing slash.

## 9. Decisions still open (do NOT implement)
- Price band for the project sprint (stays "podľa rozsahu").
- Promise "odpovieme do 2 pracovných dní" (not on the site).
- Lead magnet / e-mail capture (Phase 4 mentions it only as an owner note; do not build).
- LinkedIn / Google Business Profile / social links.
- New `og-image.png` artwork (owner supplies the file; keep the existing one).
