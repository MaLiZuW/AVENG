import type { NumericScoreMapping, VdaScore } from "./types";

/** Qualitative maturity labels — never expose raw VDA digits in UI. */
export const MATURITY_BAND_LABEL: Record<VdaScore, string> = {
  0: "Absencia / neakceptovateľné",
  4: "Podpriemer",
  6: "Referencia MSP",
  8: "Nadpriemer",
  10: "World-Class",
};

export function maturityBandKey(score: VdaScore): keyof NumericScoreMapping {
  return (`score${score}` as keyof NumericScoreMapping);
}

/** Live indicator text for numeric inputs (no VDA point values). */
export function describeMappedMaturity(
  score: VdaScore,
  mapping?: NumericScoreMapping,
): string {
  const label = MATURITY_BAND_LABEL[score];
  const band = mapping?.[maturityBandKey(score)];
  return band ? `${label} (${band})` : label;
}
