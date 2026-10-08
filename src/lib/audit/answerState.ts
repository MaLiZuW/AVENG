import {
  hasNumericVdaMapper,
  mapNumericValueToVdaScore,
} from "./calculationEngine";
import type { AnswerState, VdaScore } from "./types";

export function resolveFinalEvaluatedScore(
  questionId: string,
  selectedCardScore: VdaScore,
  numericOverrideValue?: number,
  withRotation?: boolean,
): VdaScore {
  if (
    numericOverrideValue !== undefined &&
    Number.isFinite(numericOverrideValue) &&
    hasNumericVdaMapper(questionId)
  ) {
    return mapNumericValueToVdaScore(questionId, numericOverrideValue, {
      withRotation,
    });
  }
  return selectedCardScore;
}

export function buildAnswerState(
  questionId: string,
  selectedCardScore: VdaScore,
  numericOverrideValue?: number,
  withRotation?: boolean,
): AnswerState {
  return {
    questionId,
    selectedCardScore,
    numericOverrideValue,
    withRotation,
    finalEvaluatedScore: resolveFinalEvaluatedScore(
      questionId,
      selectedCardScore,
      numericOverrideValue,
      withRotation,
    ),
  };
}
