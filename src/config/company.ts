/**
 * Single source of truth for legal / contact identity (AVENG).
 * Do not duplicate these values in UI components.
 */

import { RETENTION_DAYS, RETENTION_JOB_VERIFIED } from "./retention";

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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.addvalueengineering.sk",
  /** Prefer `RETENTION_DAYS` / `RETENTION_JOB_VERIFIED` from retention.ts */
  dataRetentionDays: RETENTION_DAYS,
  dataRetentionPurgeDocumented: RETENTION_JOB_VERIFIED,
} as const;

export type CompanyConfig = typeof company;
