# STEP 24 - PDF report v2 (A5, A14)
Attach: rules, `docs/REPO_MAP.md`, the PDF generator files from REPO_MAP.

## What we solve
The report is dark-themed, lacks the methodology and sources, and ends with a plain URL.

## Tasks
1. Theme: default `light` (white background, dark text, same blue/amber accents), optional `dark` via a parameter. A4, sensible margins and page breaks, no full-bleed dark pages in `light`.
2. Parity with the web result, all texts from the shared copy modules (steps 19-23): summary (range, reliability, level disclaimer), domain table (maturity score vs reference MSP, ranges), radar, critical domain, three recommendations, per-question breakdown for L2/L3, and a methodology page: inputs, formula, the coefficient table, the source sentence, reference status per domain.
3. Closing block: contact e-mail as a real `mailto:` hyperlink and, if `NEXT_PUBLIC_BOOKING_URL` is set, a booking hyperlink. No bare "www..." URL as the only call to action.
4. Document metadata: title, author "AddValueEngineering", language `sk`. Fonts must render Slovak diacritics (ľ ť ď ĺ ŕ ô ä).
5. File name `AVENG_Self-Audit_L{level}_{YYYY-MM-DD}.pdf`.
6. Test script (uses `pdf-parse`, no e-mail is sent, no remote call): generate fixture PDFs for L1, L2, L3 into `tmp/` and assert the extracted text contains the level's disclaimer and the source sentence, and contains none of "odvetvov", "Level 1" (in L2/L3) or "efektivita %".

## Do NOT
Deploy the function or send any e-mail.

## Done when
Three fixture PDFs pass the checks and open correctly with Slovak characters.

## Commit
`feat(report): light printable PDF with methodology and parity` (body: A5 A14)

## Report then STOP
