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

export type Processor = {
  name: string;
  purpose: string;
  /** Neutral location note for the policy page; never claim EU-only. */
  locationNote: string;
};

/** Last policy text update shown on /ochrana-osobnych-udajov/. */
export const POLICY_UPDATED = "13. 10. 2026";

export const processors: readonly Processor[] = [
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
] as const;
