/**
 * Level 2/3 unlock — codes never live in the client bundle.
 * Validation: POST to NEXT_PUBLIC_UNLOCK_API_URL (Supabase Edge / external).
 * Fallback: if URL unset, unlock is disabled (contact sales).
 */

export type UnlockLevel = 2 | 3;

export interface UnlockSession {
  level: UnlockLevel;
  token: string;
  exp: number;
}

const STORAGE_KEY = "aveng_unlock_session_v1";

export function getUnlockApiUrl(): string {
  return (process.env.NEXT_PUBLIC_UNLOCK_API_URL ?? "").trim();
}

export function readUnlockSession(): UnlockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as UnlockSession;
    if (!s?.token || !s.exp || s.exp < Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearUnlockSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function hasUnlockFor(level: UnlockLevel): boolean {
  const s = readUnlockSession();
  if (!s) return false;
  return s.level >= level;
}

export async function requestUnlock(
  code: string,
  level: UnlockLevel,
): Promise<{ ok: boolean; error?: string }> {
  const api = getUnlockApiUrl();
  if (!api) {
    return {
      ok: false,
      error:
        "Online odomknutie nie je nakonfigurované. Kontaktujte nás na vladimir@addvalueengineering.sk.",
    };
  }

  try {
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        code: code.trim(),
        level,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      token?: string;
      exp?: number;
      error?: string;
    };
    if (!res.ok || !data.ok || !data.token || !data.exp) {
      return {
        ok: false,
        error: data.error ?? "Neplatný kód alebo vypršaná platnosť.",
      };
    }
    const session: UnlockSession = {
      level,
      token: data.token,
      exp: data.exp,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Overenie zlyhalo. Skúste znova alebo nás kontaktujte.",
    };
  }
}
