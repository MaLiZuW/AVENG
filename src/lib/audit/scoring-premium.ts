/**
 * Level 2/3 scoring + DTO — imported only after unlock (dynamic import).
 * Keeps L2/L3 question banks out of the Level 1 client chunk.
 */

import { LEVEL2_QUESTIONS } from "./level2-questions";
import { LEVEL3_QUESTIONS } from "./level3-questions";
import { LEVEL1_QUESTIONS } from "./questions";
import {
  buildResult,
  getTopLossProcesses,
  processPercentFromParentScores,
} from "./scoring-core";
import { PROCESSES } from "./benchmarks";
import type {
  AuditAnswers,
  AuditResult,
  PreAuditInput,
  ProcessId,
  VdaScore,
} from "./types";

function l3ToL2Score(
  l2Id: string,
  l3Answers: AuditAnswers,
): number | null {
  const subs = LEVEL3_QUESTIONS.filter((q) => q.parentL2Id === l2Id);
  const vals = subs
    .map((q) => l3Answers[q.id])
    .filter((v): v is VdaScore => v !== undefined);
  if (vals.length === 0) return null;
  return vals.reduce<number>((a, b) => a + b, 0) / vals.length;
}

function l2ParentScore(
  parentId: string,
  l2Answers: AuditAnswers,
): number | null {
  const subs = LEVEL2_QUESTIONS.filter((q) => q.parentId === parentId);
  const vals = subs
    .map((q) => l2Answers[q.id])
    .filter((v): v is VdaScore => v !== undefined);
  if (vals.length === 0) return null;
  return vals.reduce<number>((a, b) => a + b, 0) / vals.length;
}

function l3ParentScore(
  parentId: string,
  l3Answers: AuditAnswers,
): number | null {
  const l2s = LEVEL2_QUESTIONS.filter((q) => q.parentId === parentId);
  const vals = l2s
    .map((l2) => l3ToL2Score(l2.id, l3Answers))
    .filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** S_L1_Qj = (S_a + S_b + S_c) / 3 — snapped to nearest band for storage. */
export function aggregateL2ToL1Scores(l2Answers: AuditAnswers): AuditAnswers {
  const l1: AuditAnswers = {};
  const bands: VdaScore[] = [0, 4, 6, 8, 10];
  for (const parent of LEVEL1_QUESTIONS) {
    const avg = l2ParentScore(parent.id, l2Answers);
    if (avg === null) continue;
    l1[parent.id] = bands.reduce((best, b) =>
      Math.abs(b - avg) < Math.abs(best - avg) ? b : best,
    );
  }
  return l1;
}

export function calculateLevel2AuditResult(
  l2Answers: AuditAnswers,
  input: PreAuditInput,
): AuditResult {
  const processPercents = Object.fromEntries(
    PROCESSES.map((p) => [
      p.id,
      processPercentFromParentScores(p.id, (parentId) =>
        l2ParentScore(parentId, l2Answers),
      ),
    ]),
  ) as Record<ProcessId, number>;

  const answeredCount = LEVEL2_QUESTIONS.filter(
    (q) => l2Answers[q.id] !== undefined,
  ).length;

  return buildResult(
    processPercents,
    input,
    answeredCount,
    LEVEL2_QUESTIONS.length,
    2,
  );
}

export function calculateLevel3AuditResult(
  l3Answers: AuditAnswers,
  input: PreAuditInput,
): AuditResult {
  const processPercents = Object.fromEntries(
    PROCESSES.map((p) => [
      p.id,
      processPercentFromParentScores(p.id, (parentId) =>
        l3ParentScore(parentId, l3Answers),
      ),
    ]),
  ) as Record<ProcessId, number>;

  const answeredCount = LEVEL3_QUESTIONS.filter(
    (q) => l3Answers[q.id] !== undefined,
  ).length;

  return buildResult(
    processPercents,
    input,
    answeredCount,
    LEVEL3_QUESTIONS.length,
    3,
  );
}

export interface DtoSimulationResult {
  baselineGapWcEur: number;
  simulatedGapWcEur: number;
  focusedGapSmeEur: number;
  savingsEurPerYear: number;
  deltaOeePercent: number;
  extraMachineHours: number;
  implementationCostEur: number;
  roiMonths: number | null;
  simulatedOverallPercent: number;
}

export function simulateDto(
  l3Answers: AuditAnswers,
  overrides: Record<string, VdaScore>,
  input: PreAuditInput,
  plannedHoursPerYear = 4_000,
  focusProcessId?: ProcessId,
): DtoSimulationResult {
  const baseline = calculateLevel3AuditResult(l3Answers, input);
  const merged: AuditAnswers = { ...l3Answers, ...overrides };
  const simulated = calculateLevel3AuditResult(merged, input);

  const focusId =
    focusProcessId ??
    getTopLossProcesses(baseline.processScores, 1)[0]?.processId;

  const baseFocus = baseline.processScores.find((p) => p.processId === focusId);
  const simFocus = simulated.processScores.find((p) => p.processId === focusId);

  const savingsSme = Math.max(
    0,
    (baseFocus?.gapSmeEur ?? 0) - (simFocus?.gapSmeEur ?? 0),
  );
  const savingsWc = Math.max(
    0,
    (baseFocus?.gapWcEur ?? 0) - (simFocus?.gapWcEur ?? 0),
  );
  const savingsEurPerYear = savingsSme > 0 ? savingsSme : savingsWc;

  const pctBase = baseFocus?.percent ?? 0;
  const pctSim = simFocus?.percent ?? 0;
  const deltaOeePercent = Math.max(0, pctSim - pctBase);
  const extraMachineHours = Math.round(
    plannedHoursPerYear * (deltaOeePercent / 100),
  );

  let implementationCostEur = 0;
  for (const [qid, score] of Object.entries(overrides)) {
    const q = LEVEL3_QUESTIONS.find((x) => x.id === qid);
    if (!q) continue;
    if (focusId && q.processId !== focusId) continue;
    const current = l3Answers[qid] ?? 0;
    if (score > current) {
      const lift = (score - current) / 10;
      implementationCostEur +=
        q.estimatedImplementationCostEuro * q.costImpactFactor * lift;
    }
  }
  implementationCostEur = Math.round(implementationCostEur);

  const roiMonths =
    savingsEurPerYear > 0
      ? Math.round((implementationCostEur / savingsEurPerYear) * 12 * 10) / 10
      : null;

  return {
    baselineGapWcEur: baseline.gapWcEur,
    simulatedGapWcEur: simulated.gapWcEur,
    focusedGapSmeEur: baseFocus?.gapSmeEur ?? 0,
    savingsEurPerYear,
    deltaOeePercent: Math.round(deltaOeePercent * 10) / 10,
    extraMachineHours,
    implementationCostEur,
    roiMonths,
    simulatedOverallPercent: simulated.overallPercent,
  };
}

export { LEVEL2_QUESTIONS, LEVEL3_QUESTIONS };
