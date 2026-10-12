# STEP 13 - Contrast, icons, CTAs, accessibility
Attach: rules, `docs/REPO_MAP.md`, Tailwind config.

## Tasks
1. Contrast: check all colour tokens (small grey-blue text, badges, footer, subtitles, pillar numbers 01-04) against WCAG AA (4.5:1; large text 3:1). Fix tokens centrally in the Tailwind config. The 01-04 numbering must be clearly readable.
2. Emoji -> `lucide-react` SVG icons everywhere. Find them with the regex `\p{Extended_Pictographic}` in `src/` and in question data. Include the hints/banners and level cards.
3. CTAs: hero primary SK: "Spustiť bezplatný self-audit"; secondary SK: "Dohodnúť 30-min konzultáciu" when `NEXT_PUBLIC_BOOKING_URL` is set, otherwise SK: "Preskúmať 4 piliere". Header keeps one button SK: "Spustiť audit zdarma". Never three identical CTAs on one screen.
4. Accessibility: visible focus states, `aria-expanded` on expanders, keyboard operation of the A-E answer cards, `prefers-reduced-motion`.
5. Check layouts at 360, 390 and 768 px (list findings; fix only layout breakage).

## Done when
Contrast report in the step report (before/after for changed tokens); no emoji in `src/`; keyboard flow works through one full Level 1 question.

## Commit
`fix(a11y): contrast tokens, icon set, CTA hierarchy`

## Report then STOP
