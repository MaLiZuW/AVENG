/**
 * Single source of truth for legal / contact identity (AVENG).
 * Next (`src/config/company.ts`) and Edge (`supabase/functions/_shared/company.ts`)
 * copies must stay identical (`npm run check:shared`). Do not duplicate these values.
 */

const DEFAULT_SITE_URL = "https://www.addvalueengineering.sk";

function resolveSiteUrl(): string {
  if (typeof process === "undefined") return DEFAULT_SITE_URL;
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_URL;
}

export const company = {
  brandName: "AddValueEngineering",
  brandShort: "AVENG",
  legalName: "AV – Agency, s. r. o.",
  legalNameAscii: "AV - Agency, s. r. o.",
  ico: "47054328",
  dic: "2023729796",
  streetAddress: "Zliechovská ulica 1117/110",
  addressLocality: "Košeca",
  postalCode: "01864",
  addressCountry: "SK",
  addressCountryName: "Slovenská republika",
  /** Human-readable seat with spaced postal code. */
  addressDisplay: "Zliechovská ulica 1117/110, 018 64 Košeca",
  /** Legal seat for policy / footer. */
  registeredSeat: "Zliechovská ulica 1117/110, 018 64 Košeca, Slovenská republika",
  phoneDisplay: "+421 948 007 304",
  phoneTel: "+421948007304",
  email: "vladimir@addvalueengineering.sk",
  founderName: "Vladimir",
  siteUrl: resolveSiteUrl(),
  /** Public service regions (SK: TN · ZA · TT). */
  regionsDisplay: "Trenčín, Žilina, Trnava",
  regionsHeroTag: "Regióny: TN · ZA · TT",
  areaServed: ["Slovensko", "Trenčín", "Žilina", "Trnava"] as const,
} as const;

export type CompanyConfig = typeof company;
