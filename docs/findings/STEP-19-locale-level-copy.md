# STEP 19 - Slovak number formatting and level-aware copy (A1, A2 part, A11)
Attach: rules, `docs/REPO_MAP.md`.

## What we solve
Level 1 wording appears on Level 2 results; numbers use a decimal point and mixed precision.

## Tasks
1. `src/lib/format.ts` (pure TypeScript, no Node/React APIs, shared with Edge Functions in the same way as in step 06): `formatPercent(56.5)` -> "56,5 %" (non-breaking space); `formatEuroRounded(x)` -> 2 significant digits ("61 tis. €", "8,3 tis. €", "1,2 mil. €", "950 €" below 1 000); `formatEuroRange(lo, hi)` -> "560 – 860 tis. €" (en dash, non-breaking spaces); `formatInt`. Implement manually (do not rely on `Intl` differences between runtimes). Unit tests with edge cases (rounding up to the next unit, 999 999, zero).
2. Replace every ad-hoc formatting in web, PDF and e-mail (search for `toFixed`, `toLocaleString`, `Intl.NumberFormat`).
3. `src/config/audit-copy.ts` (shared) with per-level texts, SK verbatim:
   - disclaimer L1: "Výsledky Level 1 sú rýchla orientačná diagnostika založená na vašich odpovediach. Nepredstavujú záruku úspor. Pre presné priority a overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe."
   - disclaimer L2: "Výsledky Level 2 sú detailnejší, no stále orientačný odhad založený na vašich odpovediach. Nepredstavujú záruku úspor. Pre overenie dát a príčin odporúčame Level 3 alebo obchôdzku vo výrobe."
   - disclaimer L3: "Výsledky Level 3 sú expertná diagnostika založená na vašich odpovediach a vstupných dátach. Nepredstavujú záruku úspor. Pre overenie priamo vo výrobe odporúčame obchôdzku (Gemba Walk)."
   - reliability hint L1: "Spoľahlivosť zvýšite zadaním presných čísel alebo prechodom na Level 2."
   - reliability hint L2: "Spoľahlivosť zvýšite zadaním presných čísel pri otázkach, kde ich poznáte, alebo prechodom na Level 3."
   - reliability hint L3: "Spoľahlivosť zvýšite zadaním presných čísel a overením dát pri obchôdzke vo výrobe."
   - PDF footer L1: "Orientačný skríning — nie je zárukou výsledku"; L2: "Detailný orientačný odhad — nie je zárukou výsledku"; L3: "Expertná diagnostika — nie je zárukou výsledku"
   - result title: "Výsledky Level {n} auditu ({count} otázok)"
4. Public sector labels without English parentheses ("Plasty a kaučuk" instead of "Plasty a kaučuk (Plastics & Rubber)") via a label map; keep internal ids.
5. Replace the sentence "Celok je súčet procesov." with SK: "Celková medzera je súčtom medzier jednotlivých domén."
6. Tests: each level resolves its own texts and no Level 1 text is reachable for level 2/3.

## Done when
Web, PDF and e-mail show decimal commas and the correct level texts; `Select-String -Pattern "toFixed|toLocaleString|Intl.NumberFormat" -Path src,supabase -Recurse` finds only `format.ts`.

## Commit
`fix(audit): Slovak formatting and level-aware copy` (body: A1 A11)

## Report then STOP
