/**
 * Single source of public audit-level names and prices.
 * Silver / Gold / Premium stay out of public copy unless USE_TIER_NAMES is true.
 * Default false. A literal keeps those words out of the static export.
 */

const TIER_NAMES_ENABLED = false;

export const USE_TIER_NAMES = TIER_NAMES_ENABLED;

export type AuditLevelId = 1 | 2 | 3;

export type AuditLevelCopy = {
  id: AuditLevelId;
  name: string;
  priceLabel: string;
};

export const AUDIT_LEVELS: Record<AuditLevelId, AuditLevelCopy> = {
  1: { id: 1, name: "Skríning", priceLabel: "Zdarma" },
  2: { id: 2, name: "Detail", priceLabel: "290 €" },
  3: { id: 3, name: "Expert & DTO", priceLabel: "Po dohode" },
};

export const SELF_AUDIT_HEADER_SK =
  "L1 (20) → L2 (60) → L3 (180 / 6M + DTO) — hodnotenie bez viditeľných bodov, porovnanie s referenciou MSP a indikatívny potenciál úspor.";

/** Appended only when TIER_NAMES_ENABLED is true. Dead branch is stripped from the client build. */
export function tierSuffix(id: AuditLevelId): string {
  if (TIER_NAMES_ENABLED) {
    if (id === 2) return " · Silver";
    if (id === 3) return " · Gold · Premium";
  }
  return "";
}

export function levelBadge(id: AuditLevelId): string {
  const level = AUDIT_LEVELS[id];
  return `Level ${id} · ${level.name}${tierSuffix(id)}`;
}

export function levelTitle(id: AuditLevelId): string {
  const level = AUDIT_LEVELS[id];
  return `Level ${id} — ${level.name}${tierSuffix(id)}`;
}

export function levelUpsellEyebrow(id: 2 | 3): string {
  return `Ďalší krok · ${levelBadge(id)}`;
}

export function completedLevel3Body(): string {
  if (TIER_NAMES_ENABLED) {
    return "Premium audit máte hotový. Ďalší skok je obchôdzka vo výrobe — overenie predpokladov a 90-dňový akčný plán.";
  }
  return "Level 3 máte hotový. Ďalší skok je obchôdzka vo výrobe — overenie predpokladov a 90-dňový akčný plán.";
}

export function personalMeetingHref(): { href: string; external: boolean } {
  const booking = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  if (booking) return { href: booking, external: true };
  return { href: "/kontakt/?predmet=schodzka", external: false };
}

export function accessCodeHref(level: 2 | 3): string {
  return `/kontakt/?predmet=level-${level}`;
}

export function contactIntentPrefill(predmet: string | null): {
  subject: string;
  message: string;
} | null {
  if (predmet === "schodzka") {
    return {
      subject: "Osobná schôdzka",
      message: "Dobrý deň, prosím o návrh termínu osobnej schôdzky.",
    };
  }
  if (predmet === "level-2") {
    return {
      subject: "Prístupový kód Level 2",
      message: `Dobrý deň, prosím o prístupový kód pre Level 2 (${AUDIT_LEVELS[2].name}).`,
    };
  }
  if (predmet === "level-3") {
    return {
      subject: "Prístupový kód Level 3",
      message: `Dobrý deň, prosím o prístupový kód pre Level 3 (${AUDIT_LEVELS[3].name}).`,
    };
  }
  return null;
}
