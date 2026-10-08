# AddValueEngineering (AVENG)

Next.js **static export** for WebSupport `/web`: multi-route B2B site + 3-level process audit, Supabase leads, GDPR 28-day purge.

## Stack

- Next.js 14 (`output: "export"`) + Tailwind CSS
- `@supabase/supabase-js`, `lucide-react`, `zod`
- Unlock L2/L3 via Supabase Edge Function (`verify-promo`) — codes never in the client bundle

## Quick start

```bash
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
# optional: NEXT_PUBLIC_UNLOCK_API_URL, NEXT_PUBLIC_BOOKING_URL

npm install
npm run dev
```

## Supabase

1. Run `supabase/schema.sql`.
2. Run `supabase/purge-28day.sql` (requires `pg_cron`).
3. Deploy `supabase/functions/verify-promo` and set secrets `AUDIT_PROMO_CODES`, `UNLOCK_TOKEN_SECRET`.

Without env vars the lead form falls back to `localStorage` (demo). Without unlock URL, L2/L3 codes cannot be validated in the browser.

## Build

```bash
npm run build
```

Upload `out/` to hosting `/web` (include `.htaccess`).

## Docs

- `docs/REMEDIATION_PLAN.md` — plán nápravy
- `docs/REMEDIATION_REPORT.md` — finálny report
- `docs/OWNER_DECISIONS.md` — rozhodnutia pre vlastníka
- `docs/audit-question-review.md` — revízia otázok (návrh)
