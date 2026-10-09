/**
 * Supabase Edge Function: send-audit-report
 * Full marketing HTML + 4-page PDF (matches ResultsDashboard).
 *
 * Deploy: supabase functions deploy send-audit-report --no-verify-jwt
 * Secrets: RESEND_API_KEY, AUDIT_REPORT_FROM, AUDIT_REPORT_OWNER_EMAIL
 */

import { buildHtml } from "./html.ts";
import { buildPdf } from "./pdf.ts";
import { eur, isEmail, type ReportBody } from "./_shared.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function sendResend(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  pdfBytes: Uint8Array;
  filename: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      attachments: [
        {
          filename: opts.filename,
          content: bytesToBase64(opts.pdfBytes),
        },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data === "object" && data && "message" in data
        ? String((data as { message: string }).message)
        : `Resend ${res.status}`;
    throw new Error(msg);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY") ?? "";
  const from =
    Deno.env.get("AUDIT_REPORT_FROM") ??
    "AddValueEngineering <noreply@addvalueengineering.sk>";
  const owner =
    Deno.env.get("AUDIT_REPORT_OWNER_EMAIL") ??
    "vladimir@addvalueengineering.sk";

  if (!apiKey) {
    return json(500, { ok: false, error: "RESEND_API_KEY chýba." });
  }

  try {
    const body = (await req.json()) as ReportBody;
    const email = String(body.work_email ?? "").trim().toLowerCase();
    const name = String(body.full_name ?? "").trim();
    const company = String(body.company_name ?? "").trim();

    if (!name || !company || !isEmail(email) || !body.result) {
      return json(400, { ok: false, error: "Neplatné údaje správy." });
    }
    if (!isEmail(owner)) {
      return json(500, { ok: false, error: "Neplatný OWNER e-mail." });
    }

    const pdfBytes = await buildPdf(body);
    const safeCompany = company.replace(/[^\w\-]+/g, "_").slice(0, 40);
    const filename = `AVENG_SelfAudit_L${body.result.auditLevel ?? 1}_${safeCompany}.pdf`;
    const gap = eur(body.result.gapSmeEur ?? 0);
    const errors: string[] = [];

    try {
      await sendResend({
        apiKey,
        from,
        to: email,
        subject: `${company}: Self-Audit report — potenciál ${gap}/rok`,
        html: buildHtml(body, false),
        pdfBytes,
        filename,
      });
    } catch (e) {
      errors.push(`klient: ${e instanceof Error ? e.message : "fail"}`);
    }

    try {
      await sendResend({
        apiKey,
        from,
        to: owner,
        subject: `Nový lead · L${body.result.auditLevel ?? 1} · ${company} · ${gap}/rok`,
        html: buildHtml(body, true),
        pdfBytes,
        filename,
      });
    } catch (e) {
      errors.push(`owner: ${e instanceof Error ? e.message : "fail"}`);
    }

    if (errors.length === 2) {
      return json(502, { ok: false, error: errors.join("; ") });
    }
    if (errors.length === 1) {
      return json(200, { ok: true, warning: errors[0] });
    }
    return json(200, { ok: true });
  } catch (e) {
    return json(500, {
      ok: false,
      error: e instanceof Error ? e.message : "Chyba odoslania.",
    });
  }
});
