/**
 * Public scoring API for Level 1 (and shared helpers).
 * Level 2/3 + DTO live in `./scoring-premium` — dynamic-import after unlock.
 */

export {
  buildResult,
  calculateAuditResult,
  formatEur,
  getTopLossProcesses,
  isValidVdaScore,
  processPercentFromParentScores,
  resolveL1Score,
  computeTotalEfficiency,
  computeWeightedProcessPercent,
  hasNumericVdaMapper,
  mapNumericValueToVdaScore,
  numericInputsToVdaAnswers,
  verifyCalculationEngine,
} from "./scoring-core";
