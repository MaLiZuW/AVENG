# UX and information-flow additions (phase 3)

All additions use existing components and design tokens. No new colors, fonts or libraries.

## 1. Breadcrumbs
- Visible on every page except `/`: small text line above the eyebrow/H1, e.g. `Domov › Služby › Riadenie technických zmien (ECO)`.
- Semantic markup: `<nav aria-label="Drobečková navigácia"><ol>…</ol></nav>`, last item is plain text with `aria-current="page"`.
- Labels per route: Domov; Služby; Procesný audit výroby; Riadenie technických zmien (ECO); Výrobná dokumentácia a schvaľovanie; Koučing vedúcich výroby; AI a automatizácia; Self-audit; O nás; Kontakt.
- Project pages: Domov › Služby › {project}. `/optimalizacia-a-ai/`: Domov › Služby › AI a automatizácia (the page stays at its current URL).
- Feed the same data to BreadcrumbList JSON-LD (phase 2 helper).

## 2. Related projects block
- At the end of each of the 5 project pages (`audit-problem`, `zmeny-eco`, `dokumentacia`, `lideri`, `ai`): heading "Súvisiace projekty" (H2) and a list of the other four, each as a link with the project name.
- Data comes from one shared constant (route + label), also used by `/sluzby/` and the home cards, so labels never drift.
- Replace the old "Súvisiace piliere" block.

## 3. Single link per card
- Home and `/sluzby/` cards: exactly one link per card. Remove the duplicated "Viac o pilieri" link. The visible link text is "Detail projektu →" (per spec). The whole card may be clickable if the existing card component supports it, but there must be only one `<a>` per card in the DOM.

## 4. One primary action per page
- Primary button: "Popíšte nám problém" → `/kontakt/`. Secondary: "Audit zdarma" / "Spustiť audit zdarma" → `/self-audit/#level-1`. Follow the button order and style given in each page spec. Do not add extra competing CTAs.

## 5. Trust strip and "Pre koho to nie je" (home)
- The trust strip is the four short points under the hero buttons (spec 01-domov). Render as an inline list with existing small-text style.
- "Pre koho to nie je" is a highlighted block (spec 01-domov) placed before "Z praxe".

## 6. Mobile sticky CTA
- Viewport width ≤ 700 px: a bar fixed to the bottom with the text "Popíšte nám problém" linking to `/kontakt/`, using the existing primary button color tokens.
- Padding bottom includes `env(safe-area-inset-bottom, 0px)`. Add matching bottom padding to the page so content is not covered.
- Hidden on `/kontakt/` and `/self-audit/` (the audit tool has its own controls). Must not cause layout shift or horizontal scroll.
- No JavaScript is required: CSS media query plus a path check in the layout component.

## 7. Heading structure
- Exactly one H1 per page. The first H2 must NOT repeat the H1 wording (on the home page the current H2 duplicates the H1; follow the spec).
- FAQ questions are headings (H3) or `<summary>` elements inside the FAQ component, grouped under an H2 "Časté otázky".

## 8. Accessibility checks
- Keyboard focus visible on the sticky CTA and breadcrumbs. Link text is descriptive. Contrast follows existing tokens.
