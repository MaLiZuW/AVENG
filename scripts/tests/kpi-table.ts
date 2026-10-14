/**
 * KPI comparison table: exact answers → four published KPIs; cards → none.
 * Run: npx tsx scripts/tests/kpi-table.ts
 */
import { LEVEL1_QUESTIONS } from "../../src/lib/audit/questions";
import { buildKpiComparisonRows } from "../../src/lib/audit/presentation";
import type { AnswerDetailsMap, VdaScore } from "../../src/lib/audit/types";

let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    failed += 1;
    console.error(`FAIL ${msg}`);
  }
}

const KPI_IDS = {
  schedule_adherence_pct: "L1-P1-Q1",
  oee_pct: "L1-P2-Q1",
  copq_pct_of_sales: "L1-P3-Q2",
  otd_pct: "L1-P4-Q1",
} as const;

function cardOnly(score: VdaScore = 6): AnswerDetailsMap {
  return Object.fromEntries(
    LEVEL1_QUESTIONS.map((q) => [
      q.id,
      {
        questionId: q.id,
        selectedCardScore: score,
        finalEvaluatedScore: score,
      },
    ]),
  );
}

function withExact(
  values: Partial<Record<keyof typeof KPI_IDS, number>>,
): AnswerDetailsMap {
  const base = cardOnly(6);
  for (const [key, qid] of Object.entries(KPI_IDS) as [
    keyof typeof KPI_IDS,
    string,
  ][]) {
    const n = values[key];
    if (n === undefined) continue;
    base[qid] = {
      questionId: qid,
      selectedCardScore: 6,
      finalEvaluatedScore: 6,
      numericOverrideValue: n,
    };
  }
  return base;
}

const cardRows = buildKpiComparisonRows(cardOnly());
assert(cardRows.length === 0, `cards → 0 rows, got ${cardRows.length}`);

const exactRows = buildKpiComparisonRows(
  withExact({
    schedule_adherence_pct: 92,
    oee_pct: 65,
    copq_pct_of_sales: 4.5,
    otd_pct: 88,
  }),
);
assert(exactRows.length === 4, `exact → 4 rows, got ${exactRows.length}`);
const keys = new Set(exactRows.map((r) => r.key));
assert(keys.has("schedule_adherence_pct"), "plan attainment mapping");
assert(keys.has("oee_pct"), "OEE mapping");
assert(keys.has("copq_pct_of_sales"), "COPQ mapping");
assert(keys.has("otd_pct"), "OTD mapping");

for (const q of LEVEL1_QUESTIONS) {
  if (!q.kpiKey) continue;
  assert(
    q.inputType === "NUMERIC_INPUT",
    `${q.id} with kpiKey must be NUMERIC_INPUT`,
  );
}

assert(
  LEVEL1_QUESTIONS.some((q) => q.kpiKey === "schedule_adherence_pct"),
  "L1 has schedule_adherence_pct",
);
assert(
  LEVEL1_QUESTIONS.some((q) => q.kpiKey === "oee_pct"),
  "L1 has oee_pct",
);
assert(
  LEVEL1_QUESTIONS.some((q) => q.kpiKey === "copq_pct_of_sales"),
  "L1 has copq_pct_of_sales",
);
assert(
  LEVEL1_QUESTIONS.some((q) => q.kpiKey === "otd_pct"),
  "L1 has otd_pct",
);

if (failed > 0) {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("kpi-table: ok");
