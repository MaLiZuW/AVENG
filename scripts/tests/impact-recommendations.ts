/**
 * Impact labels and recommendation ordering from euro gap share.
 * Run: npx tsx scripts/tests/impact-recommendations.ts
 */
import { impactFromGapShare } from "../../src/config/impact";
import { LEVEL1_QUESTIONS } from "../../src/lib/audit/questions";
import {
  impactLabelForProcess,
  presentRecommendations,
} from "../../src/lib/audit/recommendations";
import { calculateAuditResult } from "../../src/lib/audit/scoring";
import type {
  AuditAnswers,
  PreAuditInput,
  ProcessId,
  VdaScore,
} from "../../src/lib/audit/types";

const PRE: PreAuditInput = {
  sectorId: "general",
  annualRevenueEur: 500_000,
  cogsPercent: 65,
};

/** Profile: D3 high, D4 medium, D1 lower share of total gap. */
const PROFILE: Record<ProcessId, VdaScore> = {
  P1: 6,
  P2: 8,
  P3: 0,
  P4: 4,
  P5: 10,
};

let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    failed += 1;
    console.error(`FAIL ${msg}`);
  }
}

function fillByProcess(map: Record<ProcessId, VdaScore>): AuditAnswers {
  return Object.fromEntries(
    LEVEL1_QUESTIONS.map((q) => [q.id, map[q.processId] ?? 6]),
  );
}

assert(impactFromGapShare(0.35) === "vysoký", "35 % → vysoký");
assert(impactFromGapShare(0.34) === "stredný", "34 % → stredný");
assert(impactFromGapShare(0.15) === "stredný", "15 % → stredný");
assert(impactFromGapShare(0.149) === "nižší", "14.9 % → nižší");

const answers = fillByProcess(PROFILE);
const result = calculateAuditResult(answers, PRE);

assert(impactLabelForProcess("P3", result) === "vysoký", "D3/P3 vysoký");
assert(impactLabelForProcess("P4", result) === "stredný", "D4/P4 stredný");
assert(impactLabelForProcess("P1", result) === "nižší", "D1/P1 nižší");

const presented = presentRecommendations(result, answers);
assert(presented.length === 3, `3 recommendations, got ${presented.length}`);
assert(presented[0].processId === "P3", `1st P3, got ${presented[0].processId}`);
assert(presented[1].processId === "P4", `2nd P4, got ${presented[1].processId}`);
assert(presented[2].processId === "P1", `3rd P1, got ${presented[2].processId}`);
assert(presented[0].impact === "vysoký", "rec1 impact vysoký");
assert(presented[1].impact === "stredný", "rec2 impact stredný");
assert(presented[2].impact === "nižší", "rec3 impact nižší");

const gaps = presented.map(
  (r) =>
    result.processScores.find((p) => p.processId === r.processId)?.gapSmeEur ??
    0,
);
assert(
  gaps[0] >= gaps[1] && gaps[1] >= gaps[2],
  `ordering by gap desc: ${gaps.join(", ")}`,
);
assert(
  presented.every((r) =>
    r.description.startsWith("Najslabšie hodnotená oblasť: "),
  ),
  "prefix on every recommendation",
);

if (failed > 0) {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("impact-recommendations: ok");
