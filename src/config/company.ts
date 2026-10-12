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
  /** Street unknown — locality + postal only */
  addressLocality: "Košeca",
  postalCode: "01864",
  addressCountry: "SK",
  addressCountryName: "Slovenská republika",
  addressDisplay: "Košeca 01864, Slovenská republika",
  phoneDisplay: "+421 948 007 304",
  phoneTel: "+421948007304",
  email: "vladimir@addvalueengineering.sk",
  founderName: "Vladimir",
  siteUrl: resolveSiteUrl(),
} as const;

export type CompanyConfig = typeof company;
