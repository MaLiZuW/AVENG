/**
 * /kontakt → Supabase Edge Function `contact`.
 * The function is the authoritative check; this client only posts JSON.
 */

const CONTACT_API = process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ?? "";

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
    return { ok: false, error: "Odoslanie nie je nakonfigurované." };
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
      return { ok: false, error: data.error ?? "Odoslanie zlyhalo." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Odoslanie zlyhalo (sieť)." };
  }
}
