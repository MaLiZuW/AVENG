/**
 * Supabase Edge Function: contact
 * Authoritative check for /kontakt (honeypot, rate limit, size, CORS).
 * Delivery uses the existing Resend mail path (same secrets as send-audit-report).
 *
 * Owner deploys. Do not run `supabase functions deploy` from this repo's agents.
 *
 * Secrets: RESEND_API_KEY, AUDIT_REPORT_FROM, AUDIT_REPORT_OWNER_EMAIL
 */

import { company } from "../_shared/company.ts";
import {
  handleContact,
  isEmail,
  oneLine,
  productionOrigin,
  type OutboundMail,
} from "./logic.ts";

const OWNER_EMAIL_MAX = 254;

async function sendMail(mail: OutboundMail): Promise<void> {
  const apiKey = oneLine(Deno.env.get("RESEND_API_KEY") ?? "", 200);
  const from = oneLine(
    Deno.env.get("AUDIT_REPORT_FROM") ??
      `${company.brandName} <noreply@addvalueengineering.sk>`,
    200,
  );
  const to = oneLine(
    Deno.env.get("AUDIT_REPORT_OWNER_EMAIL") ?? company.email,
    OWNER_EMAIL_MAX,
  );
  if (!apiKey) throw new Error("RESEND_API_KEY missing");
  if (!isEmail(to)) throw new Error("owner email invalid");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    }),
  });
  if (!res.ok) {
    await res.body?.cancel();
    throw new Error(`Resend ${res.status}`);
  }
  await res.body?.cancel();
}

Deno.serve((req) =>
  handleContact(req, {
    allowedOrigin: productionOrigin(),
    sendMail,
  }),
);
