/**
 * Calculation engine — Metodika self-auditu procesnej excelentnosti · MSP SR v1.0
 * STEP 2: weighted S_Pi + numeric → VDA 6.3 mapper.
 * UI is not modified here.
 */

import { LEVEL1_QUESTIONS } from "./questions";
import { PROCESSES } from "./benchmarks";
import type { ProcessId, VdaScore } from "./types";

export type NumericMapOptions = {
  /** L1-P5-Q4: >3 staníc so systematickou rotáciou → skóre 10 */
  withRotation?: boolean;
};

type BandFn = (value: number, opts?: NumericMapOptions) => VdaScore;

/**
 * Official numeric → VDA 6.3 bands (metodika v1.0).
 * Lower-is-better metrics are inverted in the band tables.
 */
const NUMERIC_MAPPERS: Record<string, BandFn> = {
  // Plan Attainment % — gap 96–98 → 8 (10 only if >98)
  "L1-P1-Q1": (v) => {
    if (v < 50) return 0;
    if (v <= 69) return 4;
    if (v <= 85) return 6;
    if (v <= 98) return 8; // 86–95 official; 96–98 gap → 8
    return 10; // >98
  },
  // Lead Time (days) — lower is better
  "L1-P1-Q3": (v) => {
    if (v > 25) return 0;
    if (v >= 20) return 4;
    if (v >= 10) return 6;
    if (v >= 6) return 8;
    return 10; // <=5
  },
  // Firefighting % — lower is better
  "L1-P1-Q4": (v) => {
    if (v > 35) return 0;
    if (v >= 25) return 4;
    if (v >= 15) return 6;
    if (v >= 5) return 8;
    return 10; // <5
  },
  // OEE %
  "L1-P2-Q1": (v) => {
    if (v < 40) return 0;
    if (v <= 54) return 4;
    if (v <= 69) return 6;
    if (v <= 84) return 8;
    return 10; // >=85
  },
  // PM Compliance %
  "L1-P2-Q2": (v) => {
    if (v < 40) return 0;
    if (v <= 59) return 4;
    if (v <= 79) return 6;
    if (v <= 94) return 8;
    return 10; // >=95
  },
  // Unplanned Downtime % — lower is better
  "L1-P2-Q3": (v) => {
    if (v > 20) return 0;
    if (v >= 15) return 4;
    if (v >= 8) return 6;
    if (v >= 2) return 8;
    return 10; // <2
  },
  // DPMO — lower is better
  "L1-P3-Q1": (v) => {
    if (v > 100_000) return 0;
    if (v >= 50_000) return 4;
    if (v >= 10_000) return 6;
    if (v >= 233) return 8;
    return 10; // <233
  },
  // COPQ % of revenue — lower is better
  "L1-P3-Q2": (v) => {
    if (v > 10) return 0;
    if (v >= 8) return 4;
    if (v >= 4) return 6;
    if (v >= 1) return 8;
    return 10; // <1
  },
  // Customer Claim PPM — lower is better
  "L1-P3-Q4": (v) => {
    if (v > 5_000) return 0;
    if (v >= 1_000) return 4;
    if (v >= 500) return 6;
    if (v >= 50) return 8;
    return 10; // <50
  },
  // OTD %
  "L1-P4-Q1": (v) => {
    if (v < 70) return 0;
    if (v <= 79) return 4;
    if (v <= 89) return 6;
    if (v <= 97) return 8;
    return 10; // >=98
  },
  // Inventory Turns / yr
  "L1-P4-Q2": (v) => {
    if (v < 3) return 0;
    if (v <= 4) return 4;
    if (v <= 6) return 6;
    if (v <= 11) return 8;
    return 10; // >=12
  },
  // Supplier Accuracy %
  "L1-P4-Q4": (v) => {
    if (v < 80) return 0;
    if (v <= 89) return 4;
    if (v <= 94) return 6;
    if (v <= 98) return 8;
    return 10; // >=99
  },
  // Absenteeism % — lower is better
  "L1-P5-Q2": (v) => {
    if (v > 10) return 0;
    if (v >= 8) return 4;
    if (v >= 5) return 6;
    if (v >= 3) return 8;
    return 10; // <3
  },
  // Kaizen / emp / yr — gap (2, 3) → 6
  "L1-P5-Q3": (v) => {
    if (v <= 0) return 0;
    if (v <= 0.5) return 4;
    if (v < 3) return 6; // 0.6–2.0 official; (2, 3) gap → 6
    if (v <= 11) return 8;
    return 10; // >=12
  },
  // Multi-skilling stations
  "L1-P5-Q4": (v, opts) => {
    if (v <= 1) return 0;
    if (v <= 2) return 4;
    if (v <= 3) return 6;
    if (opts?.withRotation) return 10; // >3 with rotation
    return 8; // >3 critical stations
  },
};

/**
 * Map user-entered numeric value → VDA 6.3 score {0,4,6,8,10}.
 * Throws if questionId has no numeric mapper (maturity-only questions).
 */
export function mapNumericValueToVdaScore(
  questionId: string,
  value: number,
  opts?: NumericMapOptions,
): VdaScore {
  if (!Number.isFinite(value)) {
    throw new Error(`mapNumericValueToVdaScore: invalid value for ${questionId}`);
  }
  const fn = NUMERIC_MAPPERS[questionId];
  if (!fn) {
    throw new Error(
      `mapNumericValueToVdaScore: no numeric bands for ${questionId}`,
    );
  }
  return fn(value, opts);
}

/** True if Level-1 question supports numeric → VDA mapping. */
export function hasNumericVdaMapper(questionId: string): boolean {
  return questionId in NUMERIC_MAPPERS;
}

export const NUMERIC_MAPPER_QUESTION_IDS = Object.freeze(
  Object.keys(NUMERIC_MAPPERS),
);

/**
 * S_Pi = 100 × Σ(w_q × S_q) / Σ(w_q × 10)
 * Official weighted domain score (metodika §9.1).
 */
export function computeWeightedProcessPercent(
  processId: ProcessId,
  scoreByQuestionId: (questionId: string) => number | null,
): number {
  const qs = LEVEL1_QUESTIONS.filter((q) => q.processId === processId);
  let weighted = 0;
  let denom = 0;
  for (const q of qs) {
    const s = scoreByQuestionId(q.id);
    if (s === null) continue;
    weighted += q.weight * s;
    denom += q.weight * 10;
  }
  if (!denom) return 0;
  return Math.round(((100 * weighted) / denom) * 10) / 10;
}

/**
 * E_total = Σ(W_Pi × S_Pi) with W = {0.18, 0.22, 0.25, 0.20, 0.15}
 */
export function computeTotalEfficiency(
  processPercents: Record<ProcessId, number>,
): number {
  const total = PROCESSES.reduce(
    (acc, p) => acc + p.weight * (processPercents[p.id] ?? 0),
    0,
  );
  return Math.round(total * 10) / 10;
}

/** Convert a map of numeric inputs → VDA AuditAnswers for answered numeric Qs. */
export function numericInputsToVdaAnswers(
  numericByQuestionId: Record<string, number>,
  optsByQuestionId?: Record<string, NumericMapOptions>,
): Record<string, VdaScore> {
  const out: Record<string, VdaScore> = {};
  for (const [id, value] of Object.entries(numericByQuestionId)) {
    if (!hasNumericVdaMapper(id)) continue;
    out[id] = mapNumericValueToVdaScore(id, value, optsByQuestionId?.[id]);
  }
  return out;
}

/** Self-check fixtures for CI / smoke (no UI). */
export function verifyCalculationEngine(): {
  ok: boolean;
  failures: string[];
  sample: {
    oee58: VdaScore;
    sP2Example: number;
    eTotalExample: number;
  };
} {
  const failures: string[] = [];
  const expect = (
    id: string,
    value: number,
    want: VdaScore,
    opts?: NumericMapOptions,
  ) => {
    const got = mapNumericValueToVdaScore(id, value, opts);
    if (got !== want) {
      failures.push(`${id}(${value}${opts?.withRotation ? ",rot" : ""}) → ${got}, want ${want}`);
    }
  };

  // OEE
  expect("L1-P2-Q1", 39, 0);
  expect("L1-P2-Q1", 40, 4);
  expect("L1-P2-Q1", 54, 4);
  expect("L1-P2-Q1", 55, 6);
  expect("L1-P2-Q1", 58, 6);
  expect("L1-P2-Q1", 70, 8);
  expect("L1-P2-Q1", 85, 10);

  // Plan Attainment
  expect("L1-P1-Q1", 49, 0);
  expect("L1-P1-Q1", 78, 6);
  expect("L1-P1-Q1", 96, 8);
  expect("L1-P1-Q1", 99, 10);

  // Lead time (lower better)
  expect("L1-P1-Q3", 30, 0);
  expect("L1-P1-Q3", 5, 10);
  expect("L1-P1-Q3", 12, 6);

  // Firefighting
  expect("L1-P1-Q4", 40, 0);
  expect("L1-P1-Q4", 3, 10);

  // PM
  expect("L1-P2-Q2", 95, 10);
  expect("L1-P2-Q2", 50, 4);

  // Downtime
  expect("L1-P2-Q3", 1, 10);
  expect("L1-P2-Q3", 10, 6);

  // DPMO / COPQ / PPM
  expect("L1-P3-Q1", 200, 10);
  expect("L1-P3-Q1", 12_000, 6);
  expect("L1-P3-Q2", 0.5, 10);
  expect("L1-P3-Q2", 6, 6);
  expect("L1-P3-Q4", 40, 10);
  expect("L1-P3-Q4", 750, 6);

  // OTD / turns / supplier
  expect("L1-P4-Q1", 98, 10);
  expect("L1-P4-Q2", 12, 10);
  expect("L1-P4-Q2", 2, 0);
  expect("L1-P4-Q4", 99, 10);

  // HR
  expect("L1-P5-Q2", 2, 10);
  expect("L1-P5-Q3", 0, 0);
  expect("L1-P5-Q3", 0.3, 4);
  expect("L1-P5-Q3", 12, 10);
  expect("L1-P5-Q4", 1, 0);
  expect("L1-P5-Q4", 2.5, 6);
  expect("L1-P5-Q4", 4, 8);
  expect("L1-P5-Q4", 4, 10, { withRotation: true });

  // Weighted S_Pi example: all Q in P2 at score 6 → 60%
  const sP2All6 = computeWeightedProcessPercent("P2", () => 6);
  if (sP2All6 !== 60) {
    failures.push(`S_P2 all-6 → ${sP2All6}, want 60`);
  }

  // Mixed P2: Q1=10(w5), Q2=8(w4), Q3=6(w5), Q4=4(w3)
  // num = 5*10+4*8+5*6+3*4 = 50+32+30+12 = 124
  // den = (5+4+5+3)*10 = 170
  // S = 100*124/170 = 72.941… → 72.9
  const mixed: Record<string, number> = {
    "L1-P2-Q1": 10,
    "L1-P2-Q2": 8,
    "L1-P2-Q3": 6,
    "L1-P2-Q4": 4,
  };
  const sP2Mixed = computeWeightedProcessPercent(
    "P2",
    (id) => mixed[id] ?? null,
  );
  if (sP2Mixed !== 72.9) {
    failures.push(`S_P2 mixed → ${sP2Mixed}, want 72.9`);
  }

  const eTotal = computeTotalEfficiency({
    P1: 60,
    P2: 60,
    P3: 60,
    P4: 60,
    P5: 60,
  });
  if (eTotal !== 60) {
    failures.push(`E_total flat-60 → ${eTotal}, want 60`);
  }

  // Process weights must sum to 1.00
  const wSum = PROCESSES.reduce((a, p) => a + p.weight, 0);
  if (Math.abs(wSum - 1) > 1e-9) {
    failures.push(`Σ W_Pi = ${wSum}, want 1`);
  }

  if (NUMERIC_MAPPER_QUESTION_IDS.length !== 15) {
    failures.push(
      `expected 15 numeric mappers, got ${NUMERIC_MAPPER_QUESTION_IDS.length}`,
    );
  }

  return {
    ok: failures.length === 0,
    failures,
    sample: {
      oee58: mapNumericValueToVdaScore("L1-P2-Q1", 58),
      sP2Example: sP2Mixed,
      eTotalExample: eTotal,
    },
  };
}
