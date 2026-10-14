/**
 * Level 2/3 per-question presentation (no scoring math).
 */

import { optionKeyFromScore } from "@/config/audit-bands";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  OptionKey,
  ProcessId,
  VdaScore,
} from "./types";

export const BAND_LABEL_SK: Record<
  OptionKey,
  "kritické" | "slabé" | "priemerné" | "dobré" | "silné"
> = {
  A: "kritické",
  B: "slabé",
  C: "priemerné",
  D: "dobré",
  E: "silné",
};

export type BandLabelSk = (typeof BAND_LABEL_SK)[OptionKey];

export interface BreakdownQuestion {
  id: string;
  processId: ProcessId;
  text: string;
  /** Optional short label for brake sentence; falls back to trimmed text. */
  shortName?: string;
}

export interface BreakdownRow {
  questionId: string;
  processId: ProcessId;
  text: string;
  shortName: string;
  band: OptionKey;
  bandLabelSk: BandLabelSk;
  score: VdaScore;
  exactValue?: number;
  exactUnit?: string;
}

function shortFromText(text: string, shortName?: string): string {
  if (shortName?.trim()) return shortName.trim();
  const t = text.trim();
  return t.length <= 48 ? t : `${t.slice(0, 48).trimEnd()}…`;
}

function scoreOf(
  questionId: string,
  answers: AuditAnswers,
  details?: AnswerDetailsMap,
): VdaScore | null {
  const d = details?.[questionId]?.finalEvaluatedScore;
  if (d !== undefined) return d;
  const a = answers[questionId];
  return a !== undefined ? a : null;
}

export function buildDomainBreakdown(
  processId: ProcessId,
  questions: BreakdownQuestion[],
  answers: AuditAnswers,
  details?: AnswerDetailsMap,
  exactMeta?: Record<string, { unit?: string }>,
): BreakdownRow[] {
  const rows: BreakdownRow[] = [];
  for (const q of questions.filter((x) => x.processId === processId)) {
    const score = scoreOf(q.id, answers, details);
    if (score === null) continue;
    const band = optionKeyFromScore(score);
    const exact = details?.[q.id]?.numericOverrideValue;
    rows.push({
      questionId: q.id,
      processId: q.processId,
      text: q.text,
      shortName: shortFromText(q.text, q.shortName),
      band,
      bandLabelSk: BAND_LABEL_SK[band],
      score,
      exactValue:
        exact !== undefined && Number.isFinite(exact) ? exact : undefined,
      exactUnit: exactMeta?.[q.id]?.unit,
    });
  }
  rows.sort((a, b) => a.score - b.score || a.questionId.localeCompare(b.questionId));
  return rows;
}

/** SK: "Najviac vás brzdí: {m1} a {m2}." — needs at least two answered rows. */
export function domainBrakeSentenceSk(rows: BreakdownRow[]): string | null {
  if (rows.length < 2) return null;
  const m1 = rows[0].shortName;
  const m2 = rows[1].shortName;
  return `Najviac vás brzdí: ${m1} a ${m2}.`;
}
