# Tajomstvá (iba názvy)

Hodnoty patria do Supabase Secrets. Do repozitára, do `out/` ani do klientského balíka nepatria.

## Edge Function `contact`

Funkcia `supabase/functions/contact` používa existujúci Resend mechanizmus. Nové názvy tajomstiev nepridáva.

| Názov | Účel |
|---|---|
| `RESEND_API_KEY` | Volanie Resend API |
| `AUDIT_REPORT_FROM` | Adresa odosielateľa |
| `AUDIT_REPORT_OWNER_EMAIL` | Schránka, kam príde dopyt z `/kontakt` (ak chýba, funkcia použije e-mail z `company.ts`) |

Verejná adresa funkcie (nie je tajomstvo, dáva sa do buildu):

- `NEXT_PUBLIC_CONTACT_API_URL`

CORS povoľuje len produkčný pôvod z `company.siteUrl` (predvolene `https://www.addvalueengineering.sk`).

## Ostatné serverové názvy (už v `.env.example`)

- `UNLOCK_TOKEN_SECRET`
- `UNLOCK_SIGNING_SECRET`
- `AUDIT_PROMO_CODES`
- `AUDIT_PROMO_CODES_L2`
- `AUDIT_PROMO_CODES_L3`
- `ADMIN_EMAILS`

`RESEND_API_KEY`, `AUDIT_REPORT_FROM` a `AUDIT_REPORT_OWNER_EMAIL` používajú aj `send-audit-report` a `issue-unlock-code`.
