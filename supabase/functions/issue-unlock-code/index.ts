/**
 * Admin-only: generate unlock code, store in unlock_codes, email recipient via Resend.
 *
 * Deploy: supabase functions deploy issue-unlock-code --no-verify-jwt
 * (JWT checked manually against Supabase Auth + ADMIN_EMAILS allowlist)
 *
 * Secrets:
 *   ADMIN_EMAILS=vladimir@addvalueengineering.sk
 *   RESEND_API_KEY=re_...
 *   AUDIT_REPORT_FROM=AddValueEngineering <noreply@addvalueengineering.sk>
 *   (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + SUPABASE_ANON_KEY are auto-injected)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { company } from "../_shared/company.ts";

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

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function parseAdmins(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function randomCode(level: 2 | 3): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let suffix = "";
  for (const b of bytes) suffix += alphabet[b % alphabet.length];
  return `AVENG-L${level}-${suffix}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const admins = parseAdmins(Deno.env.get("ADMIN_EMAILS"));
  const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
  const from =
    Deno.env.get("AUDIT_REPORT_FROM") ??
    `${company.brandName} <noreply@addvalueengineering.sk>`;
  const ownerBcc = Deno.env.get("AUDIT_REPORT_OWNER_EMAIL") ?? company.email;

  if (!supabaseUrl || !serviceKey || !anonKey) {
    return json(500, { ok: false, error: "Supabase env chýba." });
  }
  if (!admins.length) {
    return json(500, { ok: false, error: "ADMIN_EMAILS nie je nastavené." });
  }
  if (!resendKey) {
    return json(500, { ok: false, error: "RESEND_API_KEY chýba." });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return json(401, { ok: false, error: "Chýba prihlásenie." });
  }

  try {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user?.email) {
      return json(401, { ok: false, error: "Neplatná session." });
    }
    const adminEmail = userData.user.email.toLowerCase();
    if (!admins.includes(adminEmail)) {
      return json(403, { ok: false, error: "Účet nie je admin." });
    }

    const body = (await req.json()) as {
      level?: number;
      recipient_email?: string;
      recipient_name?: string;
      company_name?: string;
      note?: string;
      send_email?: boolean;
    };

    const level = body.level === 3 ? 3 : 2;
    const recipientEmail = String(body.recipient_email ?? "")
      .trim()
      .toLowerCase();
    const recipientName = String(body.recipient_name ?? "").trim();
    const companyName = String(body.company_name ?? "").trim();
    const note = String(body.note ?? "").trim();
    const sendEmail = body.send_email !== false;

    if (!isEmail(recipientEmail)) {
      return json(400, { ok: false, error: "Neplatný e-mail príjemcu." });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let code = "";
    let inserted = false;
    for (let i = 0; i < 5; i++) {
      code = randomCode(level);
      const { error } = await admin.from("unlock_codes").insert({
        code,
        level,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        company_name: companyName,
        created_by: adminEmail,
        note,
        sent_at: null,
        expires_at: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
      if (!error) {
        inserted = true;
        break;
      }
      if (!String(error.message ?? "").toLowerCase().includes("unique")) {
        return json(500, { ok: false, error: error.message });
      }
    }
    if (!inserted || !code) {
      return json(500, { ok: false, error: "Nepodarilo sa vygenerovať unikátny kód." });
    }

    const site = company.siteUrl;
    const unlockUrl = `${site}/self-audit/`;
    let emailed = false;

    if (sendEmail) {
      const hi = recipientName
        ? `Dobrý deň, ${escapeHtml(recipientName)},`
        : "Dobrý deň,";
      const html = `<!DOCTYPE html><html><body style="font-family:Segoe UI,Arial,sans-serif;background:#070b12;color:#e8edf5;padding:24px">
        <div style="max-width:560px;margin:0 auto;background:#0f172a;border-radius:12px;padding:28px;border:1px solid rgba(148,163,184,.15)">
          <div style="font-size:18px;font-weight:700;color:#5b93ff">${company.brandName}</div>
          <p style="margin:20px 0 8px;font-size:15px">${hi}</p>
          <p style="color:#94a3b8;line-height:1.5;font-size:14px">
            Posielame prístupový kód pre <strong style="color:#e8edf5">Self-Audit Level ${level}</strong>${
              companyName
                ? ` · ${escapeHtml(companyName)}`
                : ""
            }.
          </p>
          <div style="margin:24px 0;padding:18px;background:#121a2b;border-radius:10px;text-align:center;border:1px solid rgba(91,147,255,.3)">
            <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#64748b">Prístupový kód</div>
            <div style="font-size:28px;font-weight:800;letter-spacing:.08em;color:#e8a54b;margin-top:8px">${escapeHtml(code)}</div>
          </div>
          <p style="color:#94a3b8;font-size:14px;line-height:1.5">
            Otvorte <a href="${unlockUrl}" style="color:#5b93ff">self-audit</a>, zadajte kód a kliknite <strong>Odomknúť</strong>.
            Kód platí 90 dní.
          </p>
          <p style="color:#64748b;font-size:12px;margin-top:28px">
            Ak ste o kód nežiadali, tento e-mail ignorujte.<br/>
            ${escapeHtml(ownerBcc)}
          </p>
        </div>
      </body></html>`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [recipientEmail],
          bcc: isEmail(ownerBcc) && ownerBcc !== recipientEmail ? [ownerBcc] : undefined,
          subject: `Prístupový kód Level ${level} — ${company.brandName}`,
          html,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" && data && "message" in data
            ? String((data as { message: string }).message)
            : `Resend ${res.status}`;
        return json(200, {
          ok: true,
          code,
          emailed: false,
          warning: `Kód je uložený, ale e-mail zlyhal: ${msg}`,
        });
      }
      emailed = true;
      await admin
        .from("unlock_codes")
        .update({ sent_at: new Date().toISOString() })
        .eq("code", code);
    }

    return json(200, { ok: true, code, level, emailed, recipient_email: recipientEmail });
  } catch (e) {
    return json(500, {
      ok: false,
      error: e instanceof Error ? e.message : "Chyba.",
    });
  }
});
