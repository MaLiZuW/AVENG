/**
 * Client-side contact / meeting / CP request → always delivered to AVENG inbox.
 * Static-export friendly (no Next API route).
 */

export type ContactRequestType =
  | "meeting"
  | "access_code"
  | "quote"
  | "both";

export interface ContactRequestPayload {
  requestType: ContactRequestType;
  fullName: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  /** Audit context (optional) */
  meta?: {
    gapSmeEur?: number;
    totalCostBaseEur?: number;
    lossRatioPercent?: number;
    source?: string;
  };
}

const INBOX =
  process.env.NEXT_PUBLIC_CONTACT_INBOX ??
  "vladimir@addvalueengineering.sk";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

const REQUEST_LABEL: Record<ContactRequestType, string> = {
  meeting: "Žiadosť o osobnú schôdzku",
  access_code: "Žiadosť o prístupový kód",
  quote: "Žiadosť o cenovú ponuku (CP)",
  both: "Žiadosť o schôdzku + cenovú ponuku (CP)",
};

function buildMessageBody(payload: ContactRequestPayload): string {
  const lines = [
    REQUEST_LABEL[payload.requestType],
    "",
    `Meno: ${payload.fullName}`,
    `Firma: ${payload.company}`,
    `Telefón: ${payload.phone}`,
    `E-mail: ${payload.email}`,
    "",
    "Správa / požiadavka:",
    payload.message || "(bez doplňujúceho textu)",
  ];
  if (payload.meta) {
    lines.push(
      "",
      "— Kontext auditu —",
      payload.meta.source ? `Zdroj: ${payload.meta.source}` : "",
      payload.meta.gapSmeEur != null
        ? `Medzera voči referencii MSP: ${payload.meta.gapSmeEur} €/rok`
        : "",
      payload.meta.totalCostBaseEur != null
        ? `Nákladová báza: ${payload.meta.totalCostBaseEur} €`
        : "",
      payload.meta.lossRatioPercent != null
        ? `Podiel straty: ${payload.meta.lossRatioPercent} %`
        : "",
    );
  }
  return lines.filter((l) => l !== "").join("\n");
}

async function sendViaWeb3Forms(
  payload: ContactRequestPayload,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `[AVENG] ${REQUEST_LABEL[payload.requestType]}`,
      from_name: payload.fullName,
      email: payload.email,
      to: INBOX,
      message: buildMessageBody(payload),
      company: payload.company,
      phone: payload.phone,
      request_type: payload.requestType,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };
  if (!res.ok || data.success === false) {
    return { ok: false, error: data.message ?? "Web3Forms odoslanie zlyhalo." };
  }
  return { ok: true };
}

async function sendViaFormSubmit(
  payload: ContactRequestPayload,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `[AVENG] ${REQUEST_LABEL[payload.requestType]}`,
      _template: "table",
      _captcha: "false",
      name: payload.fullName,
      email: payload.email,
      company: payload.company,
      phone: payload.phone,
      request_type: REQUEST_LABEL[payload.requestType],
      message: buildMessageBody(payload),
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };
  const ok =
    res.ok &&
    (data.success === true ||
      data.success === "true" ||
      String(data.message ?? "")
        .toLowerCase()
        .includes("success"));
  if (!ok) {
    return {
      ok: false,
      error:
        data.message ??
        "Odoslanie e-mailu zlyhalo. Skúste neskôr alebo zavolajte.",
    };
  }
  return { ok: true };
}

function backupLocally(payload: ContactRequestPayload): void {
  if (typeof window === "undefined") return;
  try {
    const key = "aveng_contact_requests";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    prev.push({
      ...payload,
      inbox: INBOX,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(prev));
  } catch {
    /* ignore */
  }
}

/**
 * Send request to AVENG inbox (always vladimir@addvalueengineering.sk by default).
 */
export async function submitContactRequest(
  payload: ContactRequestPayload,
): Promise<{ ok: boolean; error?: string }> {
  backupLocally(payload);

  if (WEB3FORMS_KEY) {
    const w3 = await sendViaWeb3Forms(payload);
    if (w3.ok) return w3;
  }

  return sendViaFormSubmit(payload);
}

export { INBOX as CONTACT_INBOX, REQUEST_LABEL };
