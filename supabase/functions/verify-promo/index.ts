/**
 * Supabase Edge Function: verify-promo
 * Deploy: supabase functions deploy verify-promo --no-verify-jwt
 *
 * Validates unlock codes from:
 *   1) public.unlock_codes (admin-issued) — preferred
 *   2) secrets AUDIT_PROMO_CODES_L2 / L3 — legacy fallback
 *
 * Secrets:
 *   UNLOCK_SIGNING_SECRET=long-random-string
 *   AUDIT_PROMO_CODES_L2=... (optional)
 *   AUDIT_PROMO_CODES_L3=... (optional)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function parseCodes(envVal: string | undefined): string[] {
  return (envVal ?? "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
}

function timingSafeEqual(a: string, b: string): boolean {
  const aa = a.toUpperCase();
  const bb = b.toUpperCase();
  if (aa.length !== bb.length) {
    let x = 0;
    for (let i = 0; i < aa.length; i++) x |= aa.charCodeAt(i);
    return false;
  }
  let out = 0;
  for (let i = 0; i < aa.length; i++) {
    out |= aa.charCodeAt(i) ^ bb.charCodeAt(i);
  }
  return out === 0;
}

function matchesAny(code: string, list: string[]): boolean {
  let ok = false;
  for (const c of list) {
    if (timingSafeEqual(code, c)) ok = true;
  }
  return ok;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function issueToken(level: number, secret: string) {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const payload = `${level}.${exp}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  const token =
    payload +
    "." +
    btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  return { token, exp, level };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = (await req.json()) as { code?: string; level?: number };
    const code = String(body.code ?? "").trim();
    const requestedLevel = body.level === 3 ? 3 : 2;

    if (!code) {
      return json(400, {
        ok: false,
        error: "Neplatný kód alebo vypršaná platnosť.",
      });
    }

    const secret = Deno.env.get("UNLOCK_SIGNING_SECRET") ?? "";
    if (!secret) {
      return json(500, { ok: false, error: "UNLOCK_SIGNING_SECRET chýba." });
    }

    let grantedLevel: number | null = null;

    // 1) DB codes (admin-issued)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (supabaseUrl && serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: rows } = await admin
        .from("unlock_codes")
        .select("id, code, level, expires_at")
        .ilike("code", code)
        .limit(5);

      const now = Date.now();
      for (const row of rows ?? []) {
        const expAt = row.expires_at
          ? new Date(row.expires_at as string).getTime()
          : Infinity;
        if (expAt < now) continue;
        const rowLevel = Number(row.level) === 3 ? 3 : 2;
        // L3 code unlocks L2+L3; L2 code only L2
        if (requestedLevel === 2 && rowLevel >= 2) {
          grantedLevel = Math.max(grantedLevel ?? 0, rowLevel);
        }
        if (requestedLevel === 3 && rowLevel >= 3) {
          grantedLevel = Math.max(grantedLevel ?? 0, rowLevel);
        }
        if (grantedLevel) {
          await admin
            .from("unlock_codes")
            .update({ redeemed_at: new Date().toISOString() })
            .eq("id", row.id)
            .is("redeemed_at", null);
          break;
        }
      }
    }

    // 2) Legacy secret lists
    if (!grantedLevel) {
      const l2 = parseCodes(Deno.env.get("AUDIT_PROMO_CODES_L2"));
      const l3 = parseCodes(Deno.env.get("AUDIT_PROMO_CODES_L3"));
      if (requestedLevel === 2 && (matchesAny(code, l2) || matchesAny(code, l3))) {
        grantedLevel = matchesAny(code, l3) ? 3 : 2;
      } else if (
        requestedLevel === 3 &&
        (matchesAny(code, l3) || matchesAny(code, l2))
      ) {
        // legacy: L2 secret also opened L3 in old code — keep L3-only for L3 request from L3 list
        grantedLevel = matchesAny(code, l3) ? 3 : matchesAny(code, l2) ? 2 : null;
        if (grantedLevel === 2) grantedLevel = null; // L2 secret cannot unlock L3 gate
      }
    }

    if (!grantedLevel) {
      return json(401, {
        ok: false,
        error: "Neplatný kód alebo vypršaná platnosť.",
      });
    }

    // Session level = max(requested, granted) so L3 code on L2 gate stores 3
    const sessionLevel = Math.max(requestedLevel, grantedLevel) as 2 | 3;
    if (requestedLevel === 3 && grantedLevel < 3) {
      return json(401, {
        ok: false,
        error: "Neplatný kód alebo vypršaná platnosť.",
      });
    }

    const issued = await issueToken(sessionLevel, secret);
    return json(200, { ok: true, ...issued });
  } catch {
    return json(400, {
      ok: false,
      error: "Neplatný kód alebo vypršaná platnosť.",
    });
  }
});
