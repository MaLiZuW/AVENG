# DESIGN SPEC v2 (layout, components, accessibility, performance)

Scope: visual structure and components of the existing site. Content (copy) stays as in `docs/content-v2/pages/*.md` except the explicit copy changes in section 9.

## 0. What must NOT change (branding)
- Logo, dark theme, existing color tokens (background, surface, border, foreground, muted, accent blue, the gold accent used for Level 3 in the audit), fonts (Fraunces for headings, Manrope for text), button shape/radius.
- Do not add colors, fonts, icon libraries, UI libraries or dependencies. New spacing/size values come from the existing Tailwind scale; new tokens only if a needed value does not exist (explain in PR).
- Do not touch audit logic, unlock/code validation, scoring, question data.

## 1. Findings that this spec fixes (from screenshots of all pages, 11 Nov 2026)
1. Pages use different container widths and alignments (services page wide and left, project/about pages narrow, FAQ block offset on `/optimalizacia-a-ai/`).
2. Missing top padding on project pages: the eyebrow chip touches the header.
3. Heading scale inverted: section headings ("Čo dostanete") are small, "Časté otázky" is huge.
4. Two different card styles (outlined box vs top-line only); cards are not fully clickable; 5 service cards leave an empty slot in a 2-column grid.
5. Steps and rules are plain text lists ("Title — text" run-in with an em dash).
6. Contact: e-mail, phone and address run together in one line.
7. Header CTA is the audit; the main conversion ("Popíšte nám problém") is absent in the header. Nav shows no active page.
8. Footer links are saturated blue and look like default links; legal text is very small.
9. Self-audit shows two sets of level cards and two "Spustiť audit" buttons; Level 3 price label differs between them.
10. Hero H1 wraps to 4 lines with a one-word last line on desktop.
11. Body/description text appears in an inconsistent tinted color and, on some pages, very small.

## 2. Layout system
- One container for all pages: `max-width: 72rem` (1152px), horizontal padding 16px (<640), 24px (≥640), 32px (≥1024). Content left-aligned at the same x on every page.
- Reading measure: paragraphs and lists `max-width: 68ch`. Grids use the full container.
- Hero: H1 `max-width: 22ch`, `text-wrap: balance` (target ≤ 3 lines at 1280 px, no one-word last line). Lead `max-width: 60ch`.
- Vertical rhythm (8 px base): first section top padding below header 64 / 48 / 32 px (≥1024 / ≥640 / mobile); section padding-y 96 / 72 / 56 px; H2 → content gap 24 px; list item gap 12 px.
- Breakpoints: 640, 768, 1024, 1280. Test widths: 360, 390, 768, 1024, 1280, 1536. No horizontal scroll at any width.

## 3. Type scale
- H1 `clamp(2.25rem, 1.2rem + 3.6vw, 3.5rem)`, line-height 1.1, Fraunces.
- H2 `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)`, line-height 1.2. ALL section H2 use the same size (including "Časté otázky").
- H3 `1.25rem`, line-height 1.3.
- Body `1.0625rem` (17 px), line-height 1.65. Lead `1.25rem`.
- Small `0.875rem` only for captions and legal text. Nothing below 12 px (no `text-[10px]`/`text-[11px]`).
- Eyebrow chip `0.75rem`, uppercase, letter-spacing 0.08em.
- Heading order has no skipped levels (h1 → h2 → h3).

## 4. Color usage (existing tokens only)
- One muted-foreground token for secondary text with contrast ≥ 4.5:1 on its background (verify). Remove stray tinted text colors (greenish/blue descriptions).
- Accent blue only for: primary button, inline links (underlined), active nav item, focus ring, icons.
- Footer links use the muted token, hover to foreground.

## 5. Buttons and calls to action
- Primary (solid accent), secondary (outline), tertiary (text link with arrow). Min height 44 px. Focus-visible ring 2 px with 2 px offset.
- Exactly one primary button per viewport.
- Header: one primary button "Popíšte nám problém" → `/kontakt/`. "Self-Audit" remains a normal nav link. (The audit stays the secondary hero button and the lead-in on the services page.)
- Every project page: primary CTA directly under the lead and at the end of the page.

## 6. Components
### 6.1 Shell
- `<header>` with `<nav aria-label="Hlavná navigácia">`; `aria-current="page"` on the active item plus accent underline. On project pages "Služby" is active; on `/optimalizacia-a-ai/` "Optimalizácia & AI".
- Skip link "Preskočiť na obsah" as first focusable element → `#main`. One `<main id="main">`. `scroll-padding-top` equal to the header height.
- Footer in three groups: "Navigácia" (6 links), "Projekty" (the five project pages), "Kontakt a právne" (e-mail, phone, address, privacy policy). Region line stays. Legal text ≥ 12 px.

### 6.2 SectionHeader
Eyebrow chip + H2 + optional lead. Used everywhere instead of ad-hoc headings.

### 6.3 ServiceCard (home "Typy projektov", `/sluzby/`)
- Surface token, 1 px border token, existing radius, padding 24 px.
- Content: tag (Východisko, Zmeny, Dokumenty, Ľudia, AI), title (H3), description (the card text from the spec; if it contains "Výstup:", render "Výstup: …" on its own line with "Výstup:" in semibold), text link "Detail projektu →".
- Whole card clickable via ONE link (stretched-link pattern: the title link `::after` covers the card). Hover: border to accent, `translateY(-2px)` (only without reduced motion). Focus-visible ring on the card.
- First card (procesný audit) shows the extra tag "Začnite tu".
- Grid: 3 columns ≥ 1024, 2 columns ≥ 640, 1 column below. On `/sluzby/` the sixth cell is the CtaCard.

### 6.3b CtaCard
Same size as a ServiceCard, accent-tinted border. Text: "Neviete, kde začať?" / "Popíšte nám problém a povieme vám, ktorý projekt dáva zmysel." / primary button "Popíšte nám problém".

### 6.4 Steps
- ≥ 768 px: three columns with a large serif numeral (1, 2, 3) in the muted accent and a thin connector line; below 768 px vertical.
- Each step: title (semibold, own line) and text below. Split the spec text "Title — text" mechanically at the em dash. No new wording.

### 6.5 RuleGrid
For "Pravidlá spolupráce" and "Čo od vás potrebujeme": 2×2 grid (1 column on mobile) of small cards with an inline SVG check icon (accent). Text verbatim.

### 6.6 CheckList
For "Čo dostanete", "Kedy projekt pomôže", "Kedy to dáva zmysel": list items with an inline SVG check icon instead of bullets; spacing 12 px; "✗" lists (Hranice) use a cross icon in the muted danger tone already in the palette (or muted foreground if none exists).

### 6.7 ProjectAside (project pages, ≥ 1024 px)
Two-column layout: main content (68ch) and a sticky aside (top = header height + 24 px) with a "Na prvý pohľad" card:
- Úvodný rozhovor: zdarma
- Cena: podľa rozsahu
- Realizuje: váš tím
- Vedenie projektu: 1 až 2 stretnutia týždenne
- primary button "Popíšte nám problém", link "Spustiť audit zdarma"
Below 1024 px the aside becomes a normal card placed after the lead. Values are fixed text (no per-project invented facts).

### 6.8 FAQ
Keep the existing accordion. Section uses SectionHeader with the same H2 size as other sections. FAQ data feeds JSON-LD (phase 2).

### 6.9 ContactInfo
Definition list: "E-mail" (mailto link), "Telefón" (tel link), "Sídlo" (address on two lines). Each on its own line with a label in muted color.

### 6.10 Contact page layout
≥ 1024 px two columns: form (left, existing component) and "Čo sa stane po odoslaní" (right) as three steps: "Prečítame si váš popis." / "Ozveme sa s návrhom ďalšieho kroku." / "Ak to dáva zmysel, dohodneme úvodný rozhovor (30 minút, zdarma)." No response-time promise. ContactInfo below the steps.

### 6.11 Self-audit page
- Show ONE set of level cards: Level 1 (free, "Spustiť audit"), Level 2 (290 €), Level 3 (Podľa dohody). Remove the duplicated mini cards and the extra standalone "Spustiť audit" button; keep the privacy note.
- Unify the Level 3 price label everywhere to "Podľa dohody" (replace "Cenová ponuka podľa rozsahu" on the Level 3 card).
- Keep existing unlock inputs, codes and handlers untouched (layout and de-duplication only).

## 7. Illustrations (optional phase D4)
Inline SVG only, brand colors, `aria-hidden="true"` unless informative:
1. Process diagram "Problém → Varianty → Plán → Realizácia vaším tím" for `/sluzby/` and home "Ako to funguje".
2. "Ilustračná ukážka projektového plánu": a generic Gantt-style sketch with neutral bars and the label "Ilustračná ukážka". No numbers, names, dates or claims.
3. Small line icons for the five service tags.
No stock photos, no person photo, no raster images.

## 8. Accessibility (WCAG 2.2 AA) and performance
- Text contrast ≥ 4.5:1, UI components and focus ring ≥ 3:1 (verify with a contrast checker).
- Focus visible and not hidden behind the sticky header (`scroll-padding-top`). Interactive targets ≥ 44 px height (never below 24 px).
- Landmarks (`header`, `nav`, `main`, `footer`), skip link, labelled forms, `aria-current`.
- `prefers-reduced-motion`: no transforms/transitions beyond opacity.
- Images: `width` and `height` attributes (fixes the `<img>` warning in Header, prevents layout shift); `alt` text.
- Fonts: `font-display: swap`, load only the weights in use.
- Targets (check after deployment in PageSpeed Insights, owner task): LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms.

## 9. Copy changes (small, approved by merging this spec)
| Where | Old | New |
|---|---|---|
| Service card + related list + breadcrumb labels | Procesný audit a identifikácia problému | Procesný audit výroby |
| same | Riadený proces technických zmien (ECO) | Riadenie technických zmien (ECO) |
| same | Dokumentácia a schvaľovanie | Výrobná dokumentácia a schvaľovanie |
| same | Rozvoj vedúcich a koučing | Koučing majstrov a vedúcich výroby |
| same | Optimalizácia a AI | AI a automatizácia vo výrobe |
| `/sluzby/` heading | Pravidlá hry | Pravidlá spolupráce |
| Header button | Spustiť audit zdarma | Popíšte nám problém |
| New tag on first card | n/a | Začnite tu |
| Self-audit Level 3 price | Cenová ponuka podľa rozsahu | Podľa dohody |
Also update `docs/content-v2/pages/01-domov.md`, `02-sluzby.md` and `seo.json` (only if a label is used there) so the spec stays the source of truth.

## 10. Acceptance
- `npm run build`, `npm run check:content -- --phase=<N>`, `npm run check:design` all pass.
- Manual: screenshots at 390 / 768 / 1280 of `/`, `/sluzby/`, a project page, `/self-audit/`, `/kontakt/`, `/o-nas/`; no horizontal scroll; keyboard-only navigation works; the look (colors, fonts, logo) matches the pre-change site.
