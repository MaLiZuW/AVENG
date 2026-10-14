/**
 * Presentation helpers for recommendations (scoring math untouched).
 * Prefixes existing domain bank text with the weakest answered area.
 */

import { impactFromGapShare, type ImpactLabel } from "@/config/impact";
import { LEVEL1_QUESTIONS } from "./questions";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  AuditResult,
  ProcessId,
  Recommendation,
  VdaScore,
} from "./types";

const WEAK_PREFIX = "Najslabšie hodnotená oblasť: ";

function shortNameForQuestion(questionText: string, metricShortName?: string): string {
  if (metricShortName?.trim()) return metricShortName.trim();
  const t = questionText.trim();
  return t.length <= 60 ? t : `${t.slice(0, 60).trimEnd()}…`;
}

function scoreForQuestion(
  questionId: string,
  answers: AuditAnswers,
  details?: AnswerDetailsMap,
): VdaScore | null {
  const fromDetails = details?.[questionId]?.finalEvaluatedScore;
  if (fromDetails !== undefined) return fromDetails;
  const fromAnswers = answers[questionId];
  return fromAnswers !== undefined ? fromAnswers : null;
}

/** Lowest answer band in the domain; ties broken by higher w_q. */
export function weakestQuestionInDomain(
  processId: ProcessId,
  answers: AuditAnswers,
  details?: AnswerDetailsMap,
): { questionId: string; shortName: string } | null {
  const qs = LEVEL1_QUESTIONS.filter((q) => q.processId === processId);
  let best: {
    id: string;
    score: VdaScore;
    weight: number;
    text: string;
  } | null = null;

  for (const q of qs) {
    const score = scoreForQuestion(q.id, answers, details);
    if (score === null) continue;
    if (
      !best ||
      score < best.score ||
      (score === best.score && q.weight > best.weight)
    ) {
      best = {
        id: q.id,
        score,
        weight: q.weight,
        text: q.questionText,
      };
    }
  }

  if (!best) return null;
  return {
    questionId: best.id,
    shortName: shortNameForQuestion(best.text),
  };
}

export function impactLabelForProcess(
  processId: ProcessId,
  result: AuditResult,
): ImpactLabel {
  const row = result.processScores.find((p) => p.processId === processId);
  const gap = row?.gapSmeEur ?? 0;
  const total = result.gapSmeEur;
  const share = total > 0 ? gap / total : 0;
  return impactFromGapShare(share);
}

/**
 * Reorders by gap descending, sets impact from gap share, prefixes description
 * with the weakest answered area. Keeps existing title/description from the bank.
 */
export function presentRecommendations(
  result: AuditResult,
  answers: AuditAnswers,
  details?: AnswerDetailsMap,
): Recommendation[] {
  const byGap = [...result.recommendations].sort((a, b) => {
    const ga =
      result.processScores.find((p) => p.processId === a.processId)?.gapSmeEur ??
      0;
    const gb =
      result.processScores.find((p) => p.processId === b.processId)?.gapSmeEur ??
      0;
    return gb - ga;
  });

  return byGap.map((r) => {
    const weak = weakestQuestionInDomain(r.processId, answers, details);
    const prefix = weak
      ? `${WEAK_PREFIX}${weak.shortName}. `
      : "";
    const description = r.description.startsWith(WEAK_PREFIX)
      ? r.description
      : `${prefix}${r.description}`;
    return {
      ...r,
      description,
      impact: impactLabelForProcess(r.processId, result),
    };
  });
}

/** L1 questions with no dedicated per-question recommendation body (domain bank only). */
export function questionsWithoutPerQuestionRecText(): {
  id: string;
  processId: ProcessId;
  questionText: string;
}[] {
  return LEVEL1_QUESTIONS.map((q) => ({
    id: q.id,
    processId: q.processId,
    questionText: q.questionText,
  }));
}
