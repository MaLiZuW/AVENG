/**
 * Pure validation + HTTP handling for the contact Edge Function.
 * No Deno globals, so Node can unit-test rejection of bots and invalid input.
 *
 * Rate limit is in-memory per isolate (not a global counter).
 */

import { company } from "../_shared/company.ts";

export const LIMITS = {
  name: 120,
  email: 254,
  company: 200,
  message: 4000,
  messageMin: 10,
  nameMin: 2,
  companyMin: 2,
} as const;

/** Reject bodies larger than this before JSON parse (bytes). */
export const MAX_BODY_BYTES = 16_384;

export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

export type RateStore = Map<string, number[]>;

export type ContactValue = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type OutboundMail = {
  replyTo: string;
  subject: string;
  text: string;
};

export type ContactDeps = {
  allowedOrigin?: string;
  sendMail: (mail: OutboundMail) => Promise<void>;
  rateStore?: RateStore;
  now?: () => number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return value.length <= LIMITS.email && EMAIL_RE.test(value);
}

export function oneLine(value: string, max = 200): string {
  return value
    .replace(/[\u0000\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, "");
}

export function productionOrigin(): string {
  return normalizeOrigin(company.siteUrl);
}

export function allowRate(
  store: RateStore,
  key: string,
  now: number,
  limit = RATE_LIMIT,
  windowMs = RATE_WINDOW_MS,
): boolean {
  if (store.size > 2000) store.clear();
  const recent = (store.get(key) ?? []).filter((ts) => now - ts < windowMs);
  if (recent.length >= limit) {
    store.set(key, recent);
    return false;
  }
  recent.push(now);
  store.set(key, recent);
  return true;
}

export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim() ?? "";
    if (first) return first.slice(0, 80);
  }
  const real = req.headers.get("x-real-ip")?.trim() ?? "";
  if (real) return real.slice(0, 80);
  return "unknown";
}

type FieldResult =
  | { ok: true; value: ContactValue }
  | { ok: false; error: string };

export function validateContactFields(body: unknown): FieldResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Neplatná požiadavka." };
  }
  const record = body as Record<string, unknown>;

  if (
    "website" in record &&
    record.website != null &&
    String(record.website).trim() !== ""
  ) {
    return { ok: false, error: "Neplatná požiadavka." };
  }

  if (record.consent !== true) {
    return { ok: false, error: "Je potrebný súhlas so spracovaním údajov." };
  }

  const name = lineField(record.name, LIMITS.nameMin, LIMITS.name);
  const companyName = lineField(
    record.company,
    LIMITS.companyMin,
    LIMITS.company,
  );
  const email =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const message =
    typeof record.message === "string"
      ? record.message.replace(/\u0000/g, "").trim()
      : "";

  if (!name.ok) {
    return {
      ok: false,
      error: name.reason === "long" ? "Meno je príliš dlhé." : "Zadajte meno.",
    };
  }
  if (!isEmail(email)) {
    return { ok: false, error: "Zadajte platný e-mail." };
  }
  if (!companyName.ok) {
    return {
      ok: false,
      error:
        companyName.reason === "long"
          ? "Názov firmy je príliš dlhý."
          : "Zadajte firmu.",
    };
  }
  if (message.length < LIMITS.messageMin) {
    return { ok: false, error: "Správa je príliš krátka." };
  }
  if (message.length > LIMITS.message) {
    return { ok: false, error: "Správa je príliš dlhá." };
  }

  return {
    ok: true,
    value: {
      name: name.value,
      email,
      company: companyName.value,
      message,
    },
  };
}

function lineField(
  value: unknown,
  min: number,
  max: number,
): { ok: true; value: string } | { ok: false; reason: "empty" | "long" } {
  if (typeof value !== "string") return { ok: false, reason: "empty" };
  const trimmed = value.trim();
  if (trimmed.length < min) return { ok: false, reason: "empty" };
  if (trimmed.length > max) return { ok: false, reason: "long" };
  return { ok: true, value: oneLine(trimmed, max) };
}

function corsHeaders(allowedOrigin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(
  status: number,
  body: Record<string, unknown>,
  extraHeaders: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function originAllowed(req: Request, allowedOrigin: string): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  return normalizeOrigin(origin) === allowedOrigin;
}

async function readLimitedBody(
  req: Request,
): Promise<{ ok: true; raw: string } | { ok: false; status: number; error: string }> {
  const reader = req.body?.getReader();
  if (!reader) {
    return { ok: false, status: 400, error: "Neplatná požiadavka." };
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return { ok: false, status: 413, error: "Správa je príliš veľká." };
    }
    chunks.push(value);
  }
  if (total === 0) {
    return { ok: false, status: 400, error: "Neplatná požiadavka." };
  }
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buf.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, raw: new TextDecoder().decode(buf) };
}

function mailFrom(value: ContactValue): OutboundMail {
  return {
    replyTo: value.email,
    subject: `[AVENG] Kontaktný formulár — ${oneLine(value.company, 80)}`,
    text: [
      "Kontaktný formulár (/kontakt)",
      "",
      `Meno: ${value.name}`,
      `E-mail: ${value.email}`,
      `Firma: ${value.company}`,
      "",
      "Správa:",
      value.message,
      "",
      "Súhlas so spracovaním: áno",
    ].join("\n"),
  };
}

export async function handleContact(
  req: Request,
  deps: ContactDeps,
): Promise<Response> {
  const allowedOrigin = normalizeOrigin(
    deps.allowedOrigin ?? productionOrigin(),
  );
  const cors = corsHeaders(allowedOrigin);

  if (req.method === "OPTIONS") {
    if (!originAllowed(req, allowedOrigin)) {
      return json(403, { ok: false, error: "Pôvod požiadavky nie je povolený." }, {
        Vary: "Origin",
      });
    }
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" }, cors);
  }

  if (!originAllowed(req, allowedOrigin)) {
    return json(403, { ok: false, error: "Pôvod požiadavky nie je povolený." }, {
      Vary: "Origin",
    });
  }

  const store = deps.rateStore ?? defaultStore;
  const now = deps.now?.() ?? Date.now();
  if (!allowRate(store, clientKey(req), now)) {
    return json(429, { ok: false, error: "Príliš veľa pokusov. Skúste to neskôr." }, cors);
  }

  const bodyRead = await readLimitedBody(req);
  if (!bodyRead.ok) {
    return json(bodyRead.status, { ok: false, error: bodyRead.error }, cors);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyRead.raw);
  } catch {
    return json(400, { ok: false, error: "Neplatná požiadavka." }, cors);
  }

  const fields = validateContactFields(parsed);
  if (!fields.ok) {
    return json(400, { ok: false, error: fields.error }, cors);
  }

  try {
    await deps.sendMail(mailFrom(fields.value));
  } catch (err) {
    console.error(
      "contact mail failed",
      err instanceof Error ? err.message : "fail",
    );
    return json(502, { ok: false, error: "Odoslanie zlyhalo." }, cors);
  }

  return json(200, { ok: true }, cors);
}

const defaultStore: RateStore = new Map();
