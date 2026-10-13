/**
 * /kontakt → Supabase Edge Function `contact`.
 * The function is the authoritative check; this client only posts JSON.
 * Delivery is Resend only — no third-party form relays.
 */

const CONTACT_API = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ?? "";

const SEND_FAILED_SK =
  "Odoslanie sa nepodarilo. Napíšte nám prosím na vladimir@addvalueengineering.sk.";

export type SiteContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
  consent: true;
  website?: string;
};

export function isSiteContactApiConfigured(): boolean {
  return Boolean(CONTACT_API);
}

export async function submitSiteContact(
  payload: SiteContactPayload,
): Promise<{ ok: boolean; error?: string }> {
  if (!CONTACT_API) {
    return { ok: false, error: SEND_FAILED_SK };
  }

  try {
    const res = await fetch(CONTACT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
