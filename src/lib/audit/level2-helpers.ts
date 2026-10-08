import type { Level2Question, OptionKey, QualitativeOption, VdaScore } from "./types";

const SCORE_BY_KEY: Record<OptionKey, VdaScore> = {
  A: 0,
  B: 4,
  C: 6,
  D: 8,
  E: 10,
};

/** Build qualitative options — scores attached silently, never shown in UI. */
export function l2opts(
  labels: [string, string, string, string, string],
): QualitativeOption[] {
  const keys: OptionKey[] = ["A", "B", "C", "D", "E"];
  return keys.map((key, i) => ({
    key,
    label: labels[i],
    score: SCORE_BY_KEY[key],
  }));
}

export function l2q(
  id: string,
  parentId: string,
  processId: Level2Question["processId"],
  text: string,
  goal: string,
  methodology: string,
  verification: string,
  labels: [string, string, string, string, string],
): Level2Question {
  return {
    id,
    parentId,
    processId,
    text,
    goal,
    methodology,
    verification,
    options: l2opts(labels),
  };
}
