# Prompts for GitHub Copilot coding agent: design pass

Where: GitHub → Agents → repository AVENG, branch `remediation`, new session per prompt. One prompt = one PR. Merge it, run the local check, `git pull`, then the next prompt.

Order: **S1 → 2 (JSON-LD, from content-v2/PROMPTS.md) → D1 → D2 → D3 → 3 (UX additions, content-v2/PROMPTS.md) → D4 optional → 5 (final QA)**.

The cloud agent cannot run `npm run build` (Google Fonts are not reachable). Every prompt tells it to run lint and typecheck only. You run build and checks locally.

---

## PROMPT S1: maintenance (security and image warning)

```
ROLE
Senior Next.js engineer. Small maintenance task on branch `remediation`. No design or copy changes.

TASKS
1. Upgrade `next` (and `eslint-config-next` if present) to the latest patched 14.2.x release inside the same major/minor line (npm reported a security advisory for 14.2.15). Do NOT move to Next 15. Update package.json and package-lock.json only for these packages.
2. In src/components/Header.tsx the <img> element triggers @next/next/no-img-element. Keep <img> (static export) but add explicit width and height attributes matching the rendered size so there is no layout shift, and keep alt text.
3. Do not run `npm audit fix --force`. Do not upgrade anything else.

VERIFY
npm ci; npm run lint; npm run typecheck. Do NOT run npm run build (cloud cannot fetch Google Fonts). In the PR description list the exact version change and note that the owner will run build, check:content and check:design locally.

DELIVERY
PR into `remediation`. Stop after the PR.
```

---

## PROMPT D1: foundation (layout, type, buttons, header, footer, accessibility base)

```
ROLE
Senior Next.js/Tailwind engineer and accessibility specialist. Implement the design foundation on branch `remediation`. Branding (logo, colors, fonts Fraunces/Manrope, dark theme) must not change.

READ FIRST
.github/copilot-instructions.md, docs/design-v2/DESIGN-SPEC.md (sections 0 to 5, 6.1, 8), docs/content-v2/GLOBAL-RULES.md. Check existing layout, Header, Footer, globals.css and tailwind.config before editing.

TASKS
1. Layout system (spec section 2): one shared container component/utility used by ALL pages (max-width 72rem, side padding 16/24/32, left-aligned), reading measure 68ch for prose, consistent vertical rhythm and first-section top padding (fixes the eyebrow chip touching the header on project pages). Remove ad-hoc narrow/centered wrappers so every page aligns to the same left edge (including the FAQ block on /optimalizacia-a-ai/).
2. Type scale (section 3): implement the scale; make every section H2 the same size (the "Časté otázky" H2 must not be larger than other section H2s); hero H1 max-width 22ch with text-wrap: balance; body 17px; no font sizes below 12px anywhere (replace text-[10px]/text-[11px]).
3. Color usage (section 4): use one muted-foreground token for secondary text; remove stray tinted text colors; inline links underlined; footer links muted with hover to foreground.
4. Buttons (section 5): primary/secondary/tertiary variants, min-height 44px, visible focus ring. Header: replace the "Spustiť audit zdarma" button with the primary button "Popíšte nám problém" → /kontakt/ ("Self-Audit" stays a normal nav link).
5. Shell (section 6.1): skip link, <main id="main">, nav aria-label, aria-current="page" + accent underline on the active item (Služby active on project pages; "Optimalizácia & AI" active on /optimalizacia-a-ai/), scroll-padding-top equal to header height, footer in three groups (Navigácia, Projekty, Kontakt a právne) with the five project links using the NEW labels from DESIGN-SPEC section 9.
6. Motion/accessibility: wrap hover transforms/transitions in prefers-reduced-motion handling; add :focus-visible styles globally.

CONSTRAINTS
No new dependencies, colors, fonts. Do not touch audit logic or content text (except the header button label and footer labels above). Copy stays verbatim from docs/content-v2.

VERIFY
npm ci; npm run lint; npm run typecheck. Do NOT run npm run build. Add npm script "check:design": "node scripts/check-design.mjs" if missing (script file exists, do not edit its logic).

DELIVERY
Small commits (layout, type/color, buttons/header, footer/a11y). PR into `remediation` with changed files and a list of anything you could not do from the spec. Stop after the PR.
```

---

## PROMPT D2: components and pages

```
ROLE
Senior Next.js/Tailwind engineer. D1 is merged. Implement the components and page layouts on branch `remediation`. Branding unchanged.

READ FIRST
.github/copilot-instructions.md, docs/design-v2/DESIGN-SPEC.md (sections 6.2 to 6.10, 9), docs/content-v2/pages/01-domov.md, 02-sluzby.md, 03 to 07 (project pages), 09-o-nas.md, 10-kontakt.md.

TASKS
1. Shared constant of the five projects: route + NEW label (DESIGN-SPEC section 9). Use it for home cards, /sluzby/ cards, footer "Projekty" group and (later) breadcrumbs/related lists.
2. Components: SectionHeader, ServiceCard (one link per card, whole card clickable, hover/focus states, tag, "Výstup:" on its own line), CtaCard, Steps (3 columns ≥768px, split spec text at the em dash), RuleGrid (2x2), CheckList (inline SVG check/cross icons), ProjectAside (sticky ≥1024px, fixed generic facts from the spec), ContactInfo (definition list), Contact "Čo sa stane po odoslaní" steps.
3. Pages:
   - Home: ServiceCard grid (3 columns ≥1024), Steps for "Ako to funguje", RuleGrid for "Čo od vás potrebujeme", keep trust strip and "Pre koho to nie je".
   - /sluzby/: 5 ServiceCards + CtaCard (3x2 grid), Steps, RuleGrid titled "Pravidlá spolupráce", bottom CTA row.
   - Five project pages: two-column layout with ProjectAside, CheckList for the lists, Steps for "Ako prebieha", FAQ as the same-size H2 section, CTA right under the lead and at the end.
   - /o-nas/: same container, CheckList, FAQ.
   - /kontakt/: two-column layout, ContactInfo, "Čo sa stane po odoslaní". Keep the form component and submission logic unchanged.
4. Update docs/content-v2/pages/01-domov.md and 02-sluzby.md (labels, "Pravidlá spolupráce", the CtaCard text, the "Začnite tu" tag) so the spec matches the site.

CONSTRAINTS
Copy verbatim from docs/content-v2 plus DESIGN-SPEC section 9 only. No new dependencies, colors, fonts, images. Inline SVG icons only. Do not touch audit logic, form submission, Supabase.

VERIFY
npm ci; npm run lint; npm run typecheck. Do NOT run npm run build.

DELIVERY
Small commits per component group. PR into `remediation` with a screenshot-free description: changed files, component list, open questions. Stop after the PR.
```

---

## PROMPT D3: self-audit page consolidation

```
ROLE
Senior Next.js engineer. D1 and D2 are merged. Consolidate the self-audit page layout on branch `remediation`.

READ FIRST
.github/copilot-instructions.md, docs/design-v2/DESIGN-SPEC.md (section 6.11), docs/content-v2/pages/08-self-audit.md. Read src/components/audit/AuditSection.tsx and the self-audit page before editing.

TASKS
1. Show ONE set of level cards: Level 1 (free, "Spustiť audit"), Level 2 (290 €), Level 3 (Podľa dohody). Remove the duplicated mini level cards and the extra standalone "Spustiť audit" button. Keep the privacy note.
2. Level 3 price label "Podľa dohody" everywhere on the page.
3. Apply the shared container, type scale and FAQ section style from D1/D2.
4. Do NOT change: unlock code inputs and handlers, scoring, questions, results, e-mail/payment text other than the Level 3 label.

VERIFY
npm ci; npm run lint; npm run typecheck. Do NOT run npm run build. In the PR list exactly which JSX blocks were removed and confirm the unlock and start-audit handlers are still referenced.

DELIVERY
PR into `remediation`. Stop after the PR.
```

---

## PROMPT D4 (optional): illustrations

```
ROLE
Senior front-end engineer with SVG skills. D1 to D3 merged. Add the optional illustrations on branch `remediation`.

READ FIRST
docs/design-v2/DESIGN-SPEC.md section 7, .github/copilot-instructions.md.

TASKS
1. Inline SVG components (no raster files, no dependencies) using existing brand colors: (a) process diagram "Problém → Varianty → Plán → Realizácia vaším tímom" for /sluzby/ and home "Ako to funguje"; (b) "Ilustračná ukážka projektového plánu" generic Gantt-style sketch on /sluzby/procesny-audit-identifikacia-problemu/ with the visible label "Ilustračná ukážka" and NO numbers, dates, names or claims; (c) five small line icons for the project tags.
2. Decorative SVGs get aria-hidden="true"; informative ones get a <title> and role="img".
3. Must not increase layout shift: set width/height or aspect-ratio.

VERIFY
npm ci; npm run lint; npm run typecheck. Do NOT run npm run build.

DELIVERY
PR into `remediation`. Stop after the PR.
```
