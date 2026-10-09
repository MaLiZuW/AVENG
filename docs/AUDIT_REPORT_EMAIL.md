# Self-Audit PDF e-mail (owner + klient)

Po odoslaní lead formulára sa uloží lead do Supabase a Edge Function `send-audit-report` vygeneruje **marketingový HTML report + 3-stranové PDF** (logo, KPI, grafy procesov, 3 odporúčania, CTA) a odošle ho:

1. na **pracovný e-mail klienta** z formulára  
2. na **tvoju adresu** (`AUDIT_REPORT_OWNER_EMAIL`, default `vladimir@addvalueengineering.sk`)

## 1. Resend

1. Vytvor účet na [resend.com](https://resend.com).
2. API Keys → Create → skopíruj `re_...`.
3. Na testovanie môžeš použiť `from`: `AddValueEngineering <onboarding@resend.dev>` (Resend sandbox).
4. Pre ostrú prevádzku over doménu `addvalueengineering.sk` a nastav napr.  
   `AUDIT_REPORT_FROM=AddValueEngineering <noreply@addvalueengineering.sk>`.

**Poznámka:** Bez overenej domény Resend často doručí len na e-maily, ktoré máš vo svojom Resend účte overené.

## 2. Deploy Edge Function

V projekte (s nainštalovaným [Supabase CLI](https://supabase.com/docs/guides/cli)):

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set AUDIT_REPORT_FROM="AddValueEngineering <onboarding@resend.dev>"
supabase secrets set AUDIT_REPORT_OWNER_EMAIL=vladimir@addvalueengineering.sk
supabase functions deploy send-audit-report --no-verify-jwt
```

Alebo v Dashboard: Edge Functions → Create → vlož kód z `supabase/functions/send-audit-report/index.ts` → Secrets.

## 3. `.env.local` + rebuild

```env
NEXT_PUBLIC_AUDIT_REPORT_API_URL=https://YOUR_PROJECT.supabase.co/functions/v1/send-audit-report
```

Potom `npm run build` a nahraj `out/` na WebSupport.

## 4. Overenie

1. Spusti self-audit → odošli lead.  
2. Skontroluj inbox klienta aj `vladimir@...` (PDF príloha).  
3. Supabase → Edge Functions → Logs pri chybe.
