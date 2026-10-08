/**
 * Public social profiles for JSON-LD `sameAs`.
 * Leave empty until owner provides real URLs — empty values must not appear in schema.
 * TODO(owner): doplniť LinkedIn / ďalšie profily
 */

export const socialProfiles = {
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
} as const;

/** Non-empty profile URLs only */
export function getSameAsUrls(): string[] {
  return Object.values(socialProfiles).filter((u) => Boolean(u && u.trim()));
}
