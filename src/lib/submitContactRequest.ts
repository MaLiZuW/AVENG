/**
 * Audit contact / meeting / CP request → Supabase Edge Function `contact` (Resend).
 * Static-export friendly (no Next API route). No third-party form relays.
 */

import { company } from "@/config/company";
import { formatEurRange } from "../../shared/audit-presentation";

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
    gapLabelSk?: string;
    totalCostBaseEur?: number;
    lossRatioPercent?: number;
    source?: string;
  };
}

const CONTACT_API = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ?? "";

const SEND_FAILED_SK =
  "Odoslanie sa nepodarilo. Napíšte nám prosím na vladimir@addvalueengineering.sk.";

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
      payload.meta.gapLabelSk
        ? `Medzera voči referencii MSP: ${payload.meta.gapLabelSk}`
        : payload.meta.gapSmeEur != null
          ? `Medzera voči referencii MSP: ${formatEurRange(payload.meta.gapSmeEur, payload.meta.gapSmeEur)}`
          : "",
      payload.meta.totalCostBaseEur != null
        ? `Nákladová báza: ${payload.meta.totalCostBaseEur} €`
        : "",
      payload.meta.lossRatioPercent != null
        ? `% z modelovej nákladovej bázy procesov: ${payload.meta.lossRatioPercent} %`
        : "",
    );
  }
  return lines.filter((l) => l !== "").join("\n");
}

function backupLocally(payload: ContactRequestPayload): void {
  if (typeof window === "undefined") return;
  try {
    const key = "aveng_contact_requests";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    prev.push({
      ...payload,
      inbox: company.email,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(prev));
  } catch {
    /* ignore */
  }
}

/**
 * Send request via Edge Function `contact` (Resend). No third-party fallback.
 */
export async function submitContactRequest(
  payload: ContactRequestPayload,
): Promise<{ ok: boolean; error?: string }> {
  backupLocally(payload);

  if (!CONTACT_API) {
    return { ok: false, error: SEND_FAILED_SK };
  }

  try {
    const res = await fetch(CONTACT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.fullName,
        email: payload.email,
        company: payload.company,
        message: buildMessageBody(payload),
        consent: true,
        website: "",
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      return { ok: false, error: SEND_FAILED_SK };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: SEND_FAILED_SK };
  }
}

export const CONTACT_INBOX = company.email;
export { REQUEST_LABEL, SEND_FAILED_SK };
