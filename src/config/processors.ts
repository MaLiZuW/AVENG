/**
 * Third-party processors actually used by this static site + Edge Functions.
 * Keep in sync with docs/INFRA_FACTS.md. Do not invent regions or EU-only claims.
 *
 * INFRA_FACTS: Supabase project region and Resend sending region are unknown
 * until the owner verifies them. Outside-EU processing is stated only via the
 * neutral policy sentence (section "Prenos údajov mimo EÚ"), not as EU-only.
 *
 * TODO(owner/legal): review processor list and DPAs with a lawyer
 */

import { analyticsProcessorOrNull } from "@/config/analytics";

export type Processor = {
  name: string;
  purpose: string;
  /** Neutral location note for the policy page; never claim EU-only. */
  locationNote: string;
};

/** Last policy text update shown on /ochrana-osobnych-udajov/. */
export const POLICY_UPDATED = "16. 10. 2026";

const BASE_PROCESSORS: readonly Processor[] = [
  {
    name: "WebSupport",
    purpose: "hosting statickej webovej prezentácie",
    locationNote: "poskytovateľ hostingu",
  },
  {
    name: "Supabase",
    purpose: "databáza auditných údajov a Edge Functions",
    // Region: neznáme — overí vlastník (docs/INFRA_FACTS.md)
    locationNote: "cloudová databáza a funkcie",
  },
  {
    name: "Resend",
    purpose: "doručenie e-mailov (správa z auditu, kontakt, odomykacie kódy)",
    // Sending region: neznáme — overí vlastník; account data may be outside EU
    // (stated only in policy section "Prenos údajov mimo EÚ")
    locationNote: "e-mailová doručovacia služba",
  },
];

/** Processors for the public policy page (analytics only when configured). */
export function getProcessors(): readonly Processor[] {
  const analytics = analyticsProcessorOrNull();
  return analytics ? [...BASE_PROCESSORS, analytics] : BASE_PROCESSORS;
}

/** Base list without optional analytics (tests / static references). */
export const processors: readonly Processor[] = BASE_PROCESSORS;
