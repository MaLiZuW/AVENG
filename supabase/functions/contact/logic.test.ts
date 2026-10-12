/**
 * Local checks: contact Edge Function rejects bots, bad input, foreign origins.
 * Run: npx tsx supabase/functions/contact/logic.test.ts
 */
import assert from "node:assert/strict";
import { company } from "../../../src/config/company.ts";
import {
  handleContact,
  LIMITS,
  MAX_BODY_BYTES,
  RATE_LIMIT,
  type OutboundMail,
  type RateStore,
} from "./logic.ts";

const ORIGIN = company.siteUrl.replace(/\/$/, "");

function post(
  body: unknown,
  headers: Record<string, string> = {},
  raw?: string,
): Request {
  return new Request("https://example.test/contact", {
    method: "POST",
    headers: {
      origin: ORIGIN,
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
      ...headers,
    },
    body: raw ?? JSON.stringify(body),
  });
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jana Nováková",
    email: "jana@example.com",
    company: "Príklad s. r. o.",
    message: "Prosím o informáciu k procesnému auditu.",
    consent: true,
    website: "",
    ...overrides,
  };
}

async function call(
  req: Request,
  store: RateStore = new Map(),
  mails: OutboundMail[] = [],
  failMail = false,
) {
  const res = await handleContact(req, {
    allowedOrigin: ORIGIN,
    rateStore: store,
    now: () => 1_700_000_000_000,
    sendMail: async (mail) => {
      if (failMail) throw new Error("Resend 500");
      mails.push(mail);
    },
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
  };
  return { res, data, mails };
}

async function main() {
  const sent: OutboundMail[] = [];
  const ok = await call(post(validBody()), new Map(), sent);
  assert.equal(ok.res.status, 200);
  assert.equal(ok.data.ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0]?.replyTo, "jana@example.com");
  assert.equal(sent[0]?.text.includes("Prosím o informáciu"), true);
  assert.equal(sent[0]?.subject.includes("\n"), false);
  assert.equal(ok.res.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  assert.notEqual(ok.res.headers.get("Access-Control-Allow-Origin"), "*");

  const bot = await call(post(validBody({ website: "https://spam.example" })));
  assert.equal(bot.res.status, 400);
  assert.equal(bot.data.ok, false);
  assert.equal(bot.mails.length, 0);

  const noConsent = await call(post(validBody({ consent: false })));
  assert.equal(noConsent.res.status, 400);
  assert.equal(noConsent.mails.length, 0);

  const badEmail = await call(post(validBody({ email: "nie-email" })));
  assert.equal(badEmail.res.status, 400);
  assert.equal(badEmail.mails.length, 0);

  const longMessage = await call(
    post(validBody({ message: "a".repeat(LIMITS.message + 1) })),
  );
  assert.equal(longMessage.res.status, 400);
  assert.equal(longMessage.data.error, "Správa je príliš dlhá.");
  assert.equal(longMessage.mails.length, 0);

  const huge = await call(
    post(validBody(), {}, `{"message":"${"x".repeat(MAX_BODY_BYTES)}"}`),
  );
  assert.equal(huge.res.status, 413);
  assert.equal(huge.mails.length, 0);

  const foreign = await call(
    post(validBody(), { origin: "https://evil.example" }),
  );
  assert.equal(foreign.res.status, 403);
  assert.equal(foreign.mails.length, 0);
  assert.notEqual(
    foreign.res.headers.get("Access-Control-Allow-Origin"),
    "https://evil.example",
  );
  assert.notEqual(foreign.res.headers.get("Access-Control-Allow-Origin"), "*");

  const preflight = await handleContact(
    new Request("https://example.test/contact", {
      method: "OPTIONS",
      headers: { origin: ORIGIN },
    }),
    {
      allowedOrigin: ORIGIN,
      sendMail: async () => {
        throw new Error("should not send");
      },
    },
  );
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), ORIGIN);

  const store: RateStore = new Map();
  const rateMails: OutboundMail[] = [];
  for (let i = 0; i < RATE_LIMIT; i++) {
    const hit = await call(
      post(validBody(), { "x-forwarded-for": "203.0.113.44" }),
      store,
      rateMails,
    );
    assert.equal(hit.res.status, 200);
  }
  const blocked = await call(
    post(validBody(), { "x-forwarded-for": "203.0.113.44" }),
    store,
    rateMails,
  );
  assert.equal(blocked.res.status, 429);
  assert.equal(rateMails.length, RATE_LIMIT);

  const mailed = await call(post(validBody()), new Map(), [], true);
  assert.equal(mailed.res.status, 502);
  assert.equal(mailed.data.error, "Odoslanie zlyhalo.");

  const newlineName = await call(
    post(validBody({ name: "Jana\nBcc: evil@example.com" })),
  );
  assert.equal(newlineName.res.status, 200);
  assert.equal(newlineName.mails[0]?.subject.includes("\n"), false);
  assert.equal(newlineName.mails[0]?.text.includes("\nBcc:"), false);

  console.log("contact validation tests ok");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
