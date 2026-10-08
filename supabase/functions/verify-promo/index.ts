/**
 * Supabase Edge Function: verify-promo
 * Deploy: supabase functions deploy verify-promo --no-verify-jwt
 *
 * Secrets:
 *   AUDIT_PROMO_CODES_L2=comma,separated,codes
 *   AUDIT_PROMO_CODES_L3=comma,separated,codes
 *   UNLOCK_SIGNING_SECRET=long-random-string
 *
 * Client: NEXT_PUBLIC_UNLOCK_API_URL=https://<project>.supabase.co/functions/v1/verify-promo
 */

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

/** Constant-time string compare */
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as { code?: string; level?: number };
    const code = String(body.code ?? "").trim();
    const level = body.level === 3 ? 3 : 2;

    if (!code) {
      return new Response(
        JSON.stringify({ ok: false, error: "Neplatný kód alebo vypršaná platnosť." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const l2 = parseCodes(Deno.env.get("AUDIT_PROMO_CODES_L2"));
    const l3 = parseCodes(Deno.env.get("AUDIT_PROMO_CODES_L3"));
    const secret = Deno.env.get("UNLOCK_SIGNING_SECRET") ?? "";

    let valid = false;
    if (level === 2) valid = matchesAny(code, l2) || matchesAny(code, l3);
    else valid = matchesAny(code, l3) || matchesAny(code, l2);

    if (!valid || !secret) {
      return new Response(
        JSON.stringify({ ok: false, error: "Neplatný kód alebo vypršaná platnosť." }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const exp = Date.now() + 12 * 60 * 60 * 1000; // 12h
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

    return new Response(JSON.stringify({ ok: true, token, exp, level }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Neplatný kód alebo vypršaná platnosť." }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
