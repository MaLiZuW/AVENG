# STEP 03 - Privacy page, consent, contact form
Attach: rules, `docs/REPO_MAP.md`, `src/config/company.ts`.

## Tasks
1. Create the static route `/ochrana-osobnych-udajov` (Slovak): controller (from `company.ts`), purpose (handling the inquiry and sending the audit report), legal basis, data categories, retention (use `RETENTION_DAYS`, see step 04), recipients/processors ONLY those the code really uses (derive from code and config: hosting WebSupport, Supabase, e-mail provider), data-subject rights, contact. Mark `TODO(owner/legal): review with a lawyer`. Never invent processors.
2. "Zásady spracovania osobných údajov" becomes a real `<Link>` to this page (footer and consent checkbox; it is currently a `<button>` with no action). The consent text links to the same page.
3. Contact form on `/kontakt`: fields name, e-mail, company, message, consent. Client validation with `zod`; the authoritative validation is in a Supabase Edge Function (`supabase/functions/contact` or the existing mechanism): honeypot, rate limit, input size limits, CORS limited to the production origin, delivery via the existing e-mail mechanism. Write the function code; do not deploy it. List required secrets in `docs/SECRETS_NEEDED.md`.
4. Booking button: if `NEXT_PUBLIC_BOOKING_URL` is set at build time show SK: "Dohodnúť 30-minútovú konzultáciu"; otherwise render nothing.
5. If `/kontakt` does not exist yet, create a minimal static route now (full route split in step 11).

## Done when
Privacy page renders and is linked from footer and consent; form validates client-side and the Edge Function code rejects bot/invalid input (tested locally or via unit tests).

## Commit
`feat: privacy policy page, real consent link, contact form via Edge Function`

## Report then STOP
