/**
 * Expert A–E card score bounds for display-layer uncertainty.
 * Expert estimates pending owner confirmation.
 * Used only to recompute gap at lower/upper bounds — not scoring math.
 * TODO(owner): confirm these bands.
 */

import type { OptionKey, VdaScore } from "@/lib/audit/types";

/**
 * Continuous score interval implied by each qualitative card.
 * Midpoints align with internal scores 0/4/6/8/10.
 */
export const CARD_SCORE_BOUNDS: Record<
  OptionKey,
  { low: number; high: number }
> = {
  A: { low: 0, high: 2 },
  B: { low: 2, high: 5 },
  C: { low: 5, high: 7 },
  D: { low: 7, high: 9 },
  E: { low: 9, high: 10 },
};

const SCORE_TO_KEY: Record<VdaScore, OptionKey> = {
  0: "A",
  4: "B",
  6: "C",
  8: "D",
  10: "E",
};

export function optionKeyFromScore(score: VdaScore): OptionKey {
  return SCORE_TO_KEY[score] ?? "C";
}
