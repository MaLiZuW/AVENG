/**
 * Public social profiles for footer icons and JSON-LD `sameAs`.
 * Leave empty until the owner provides a real profile URL.
 * TODO(owner): doplniť LinkedIn / Facebook (plná URL profilu, nie homepage platformy).
 */

export const socialProfiles = {
  linkedin: "",
  facebook: "",
} as const;

export type SocialKey = keyof typeof socialProfiles;

/** Reject empty values and links that only open a platform homepage. */
export function isOwnProfileUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  const path = url.pathname.replace(/\/+$/, "");
  return path.length > 0;
}

export function getPublicSocialLinks(): { key: SocialKey; url: string }[] {
  return (Object.entries(socialProfiles) as [SocialKey, string][])
    .filter(([, url]) => isOwnProfileUrl(url))
    .map(([key, url]) => ({ key, url: url.trim() }));
}

/** Non-empty profile URLs only (JSON-LD `sameAs`). */
export function getSameAsUrls(): string[] {
  return getPublicSocialLinks().map((item) => item.url);
}
