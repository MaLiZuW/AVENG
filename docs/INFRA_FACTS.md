# Infraštruktúrne fakty

Len to, čo je v repozitári. Chýbajúci údaj je označený „neznáme - overí vlastník“.

## Supabase

- Lokálny odkaz projektu: `supabase/.temp/linked-project.json` — názov AVENG, ref `vtploakvaavbdzynvona`. Ten istý ref je v príklade URL v `docs/ADMIN_UNLOCK_CODES.md`.
- Región projektu: neznáme - overí vlastník. V repozitári nie je `config.toml` ani pole regiónu.
- Regionálne volanie Edge Functions: neznáme - overí vlastník. Funkcie nemajú v kóde región ani prepínač regional invocation.

## Resend

- Kód posiela na `https://api.resend.com/emails` z `supabase/functions/send-audit-report/index.ts`, `supabase/functions/contact/index.ts` a `supabase/functions/issue-unlock-code/index.ts`.
- Doména odosielateľa: neznáme - overí vlastník. Adresa je secret `AUDIT_REPORT_FROM` (a obdobné vo funkciách), v kóde nie je pevná.
- Región odosielania: neznáme - overí vlastník.

## Endpointy, ktoré kód volá

| Cieľ | Odkiaľ |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase.ts` (insert leadu) |
| `NEXT_PUBLIC_CONTACT_API_URL` | `submitSiteContact.ts`, `submitContactRequest.ts` → funkcia `contact` |
| `NEXT_PUBLIC_UNLOCK_API_URL` | `src/lib/unlock/session.ts` → `verify-promo` |
| `NEXT_PUBLIC_ISSUE_UNLOCK_API_URL` | `AdminUnlockPanel.tsx` |
| `NEXT_PUBLIC_AUDIT_REPORT_API_URL` | `src/lib/sendAuditReport.ts` |
| `https://api.resend.com/emails` | tri Edge Functions vyššie |
| `SUPABASE_URL` (vstreknuté) | `verify-promo`, `issue-unlock-code` |
| `https://esm.sh/pdf-lib@1.17.1`, `https://esm.sh/@pdf-lib/fontkit@1.1.1` | `send-audit-report/pdf.ts` |
| `https://esm.sh/@supabase/supabase-js@2.45.4` | `verify-promo`, `issue-unlock-code` |
| `https://cdn.jsdelivr.net/.../NotoSans-*.ttf` | `pdf.ts` |

Web3Forms a FormSubmit: v `src/` ani `supabase/functions/` nie sú (žiadny `fetch` na ne).
Odkazy v stránke (nie `fetch`): citácie v `src/config/benchmarks.reference.json`. `NEXT_PUBLIC_BOOKING_URL` je voliteľný `href`. `src/config/social.ts` má prázdne profily.

## Analytika

Nie je. V `src/` ani v `supabase/functions/` nie je gtag, Plausible, Umami, Matomo ani iný merací skript.

## Fonty z CDN tretej strany

- Web: nie. `src/app/layout.tsx` používa `next/font/google` (Fraunces, Manrope); build vloží woff2 do výstupu.
- PDF: áno. `pdf.ts` sťahuje Noto Sans z `cdn.jsdelivr.net` pri generovaní.
