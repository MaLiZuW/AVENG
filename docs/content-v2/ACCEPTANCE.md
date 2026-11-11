# Acceptance checklist (for the owner, after each PR)

Automated: `npm run build` then `npm run check:content -- --phase=N`. Must end with "All checks passed."

## Manual review (about 10 minutes per phase)
Phase 1
- [ ] Home H1 reads "Jeden problém vo vašej výrobe vás stojí najviac. Nájdeme ho a dáme ho do plánu."
- [ ] "290 €" is visible for Level 2 (home price card, /self-audit/ card and FAQ). No other price.
- [ ] No "fractional", "pilier", hourly rate, "Morava" anywhere.
- [ ] Titles in the browser tab end with "| AddValueEngineering".
- [ ] The look (colors, fonts, logo) is unchanged.
- [ ] /optimalizacia-a-ai/ shows the new text, not the old one.
- [ ] Old URLs redirect (test after deployment): /sluzby/fractional-technical-leadership/, /sluzby/zavadzanie-procesov-plm-pdm/, /sluzby/riadenie-zmien-eco/.
- [ ] Contact form still sends. Level 1 audit still runs to the result.
- [ ] Privacy policy contains the new sections; PR flags for retention, Resend transfer and IČ DPH were reviewed by you.

Phase 2
- [ ] Google Rich Results Test (search.google.com/test/rich-results) on the home page and one project page: no errors in FAQ and breadcrumbs.

Phase 3
- [ ] On a phone: sticky "Popíšte nám problém" bar visible, not covering text, hidden on /kontakt/ and /self-audit/.
- [ ] Breadcrumbs and "Súvisiace projekty" present on project pages.

After deployment (you)
- [ ] Google Search Console and Bing Webmaster Tools: add the domain, submit https://www.addvalueengineering.sk/sitemap.xml, request indexing of "/" and the five project pages.
- [ ] Submit the changed URLs through the IndexNow key already on the server.
- [ ] Re-check after 4 to 8 weeks which search queries bring impressions (Search Console) and adjust titles accordingly.
