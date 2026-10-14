/**
 * Share of total euro gap → impact label on recommendations.
 * TODO(owner): potvrdiť prahy 35 % / 15 %.
 */
export const IMPACT_THRESHOLDS = {
  /** Share >= this → „dopad vysoký“. */
  high: 0.35,
  /** Share >= this (and < high) → „dopad stredný“; below → „dopad nižší“. */
  medium: 0.15,
} as const;

export type ImpactLabel = "vysoký" | "stredný" | "nižší";

export function impactFromGapShare(share: number): ImpactLabel {
  if (share >= IMPACT_THRESHOLDS.high) return "vysoký";
  if (share >= IMPACT_THRESHOLDS.medium) return "stredný";
  return "nižší";
}
