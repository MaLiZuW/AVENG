# Admin: generovanie prístupových kódov L2 / L3

URL: `https://www.addvalueengineering.sk/admin/`

## Jednorazové nastavenie

### 1. SQL
V Supabase → SQL Editor spusti:
`supabase/migrations/20261008170000_unlock_codes.sql`

### 2. Admin účet
Authentication → Users → **Add user**  
E-mail: `vladimir@addvalueengineering.sk` (+ heslo, ktoré si zvolíš)

### 3. Edge Secrets
| Secret | Hodnota |
|---|---|
| `ADMIN_EMAILS` | `vladimir@addvalueengineering.sk` |
| `UNLOCK_SIGNING_SECRET` | dlhý náhodný reťazec |
| `RESEND_API_KEY` | (už máš) |
| `AUDIT_REPORT_FROM` | `AddValueEngineering <noreply@addvalueengineering.sk>` |
| `AUDIT_REPORT_OWNER_EMAIL` | `vladimir@addvalueengineering.sk` |

### 4. Deploy funkcie
```bash
npx supabase functions deploy verify-promo --no-verify-jwt --project-ref vtploakvaavbdzynvona
npx supabase functions deploy issue-unlock-code --no-verify-jwt --project-ref vtploakvaavbdzynvona
```

### 5. `.env.local` + rebuild
```env
NEXT_PUBLIC_UNLOCK_API_URL=https://vtploakvaavbdzynvona.supabase.co/functions/v1/verify-promo
NEXT_PUBLIC_ISSUE_UNLOCK_API_URL=https://vtploakvaavbdzynvona.supabase.co/functions/v1/issue-unlock-code
```

## Bežné použitie
1. Otvor `/admin/` → prihlás sa.
2. Zvoľ Level 2 alebo 3, vypl e-mail klienta (meno/firma voliteľné).
3. **Vygenerovať a odoslať** — kód ide do Supabase + e-mail klientovi (BCC tebe).
4. Klient kód zadá na Self-Audite → Odomknúť.

Kódy platia **90 dní**. Tabuľka `unlock_codes` v Table Editori ukazuje históriu.
