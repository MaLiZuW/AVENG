/**
 * Formatter, range bounds and report-parity checks for the presentation layer.
 * Run: npx tsx scripts/tests/presentation-ranges.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { LEVEL1_QUESTIONS } from "../../src/lib/audit/questions";
import {
  buildLevel1Presentation,
  estimateReliability,
  formatEurRange as formatFromPresentation,
} from "../../src/lib/audit/presentation";
import { calculateAuditResult } from "../../src/lib/audit/scoring";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  PreAuditInput,
  VdaScore,
} from "../../src/lib/audit/types";
import {
  formatEurRange,
  LEVEL1_DISCLAIMER_SK,
  RELIABILITY_HINT_SK,
  reliabilityWording,
  round2sig,
  ZERO_GAP_SK,
} from "../../shared/audit-presentation";

const PRE: PreAuditInput = {
  sectorId: "general",
  annualRevenueEur: 5_000_000,
  cogsPercent: 65,
};

let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    failed += 1;
    console.error(`FAIL ${msg}`);
  }
}

function cards(score: VdaScore, exact = false): AnswerDetailsMap {
  return Object.fromEntries(
    LEVEL1_QUESTIONS.map((q) => [
      q.id,
      {
        questionId: q.id,
        selectedCardScore: score,
        finalEvaluatedScore: score,
        ...(exact ? { numericOverrideValue: 1 } : {}),
      },
    ]),
  );
}

function answers(score: VdaScore): AuditAnswers {
  return Object.fromEntries(LEVEL1_QUESTIONS.map((q) => [q.id, score]));
}

assert(round2sig(0) === 0, "round 0");
assert(round2sig(560_000) === 560_000, "round 560000");
assert(round2sig(863_000) === 860_000, "round 863000 → 860000");
assert(round2sig(1_500_000) === 1_500_000, "round 1.5 mil");
assert(round2sig(2_340_000) === 2_300_000, "round 2.34 mil → 2.3 mil");
assert(round2sig(999_999) === 1_000_000, "round just under 1 mil");

assert(
  formatEurRange(560_000, 860_000) === "približne 560 – 860 tis. € / rok",
  `range example, got ${formatEurRange(560_000, 860_000)}`,
);
assert(
  formatEurRange(860_000, 560_000) === "približne 560 – 860 tis. € / rok",
  "reversed bounds stay ordered",
);
assert(
  formatEurRange(1_500_000, 1_500_000) === "približne 1,5 mil. € / rok",
  `mil one decimal, got ${formatEurRange(1_500_000, 1_500_000)}`,
);
assert(
  formatEurRange(12_000_000, 12_000_000) === "približne 12,0 mil. € / rok",
  `mil trailing zero, got ${formatEurRange(12_000_000, 12_000_000)}`,
);
assert(
  formatEurRange(1_000_000, 1_000_000) === "približne 1,0 mil. € / rok",
  "threshold 1 000 000 is mil",
);
assert(
  formatEurRange(999_999, 999_999) === "približne 1,0 mil. € / rok",
  "rounded 999999 crosses into mil",
);
assert(
  formatEurRange(5_500, 5_500) === "približne 5,5 tis. € / rok",
  `small tis, got ${formatEurRange(5_500, 5_500)}`,
);
assert(formatEurRange(0, 0) === ZERO_GAP_SK, "zero gap phrase");
assert(!formatEurRange(0, 0).includes("0 – 0"), "never 0 – 0");
assert(
  formatEurRange(0, 50_000) === "do 50 tis. €",
  `upper-only, got ${formatEurRange(0, 50_000)}`,
);
assert(
  formatEurRange(800_000, 1_200_000) === "približne 0,8 – 1,2 mil. € / rok",
  `mixed unit, got ${formatEurRange(800_000, 1_200_000)}`,
);
assert(formatFromPresentation === formatEurRange, "UI re-exports the shared formatter");
assert(!formatEurRange(560_000, 860_000).includes("±"), "no plus-minus claim");
assert(!LEVEL1_DISCLAIMER_SK.includes("%"), "disclaimer is not an accuracy percent");

const allA = buildLevel1Presentation(
  calculateAuditResult(answers(0), PRE),
  cards(0),
  PRE,
);
assert(allA.headline.low < allA.headline.high, "card A band is a real range");
assert(allA.headline.low <= allA.headline.high, "A lower <= upper");
assert(allA.headline.labelSk.startsWith("približne "), "A uses približne");
assert(
  allA.headline.labelSk.includes("tis. €") || allA.headline.labelSk.includes("mil. €"),
  "A uses tis or mil",
);

const exact = buildLevel1Presentation(
  calculateAuditResult(answers(4), PRE),
  cards(4, true),
  PRE,
);
assert(exact.headline.low === exact.headline.high, "exact number is a point");
assert(exact.headline.low <= exact.headline.high, "exact lower <= upper");

const allE = buildLevel1Presentation(
  calculateAuditResult(answers(10), PRE),
  cards(10),
  PRE,
);
assert(allE.headline.low === 0 && allE.headline.high === 0, "score 10 gap is zero");
assert(allE.headline.labelSk === ZERO_GAP_SK, "zero gap wording");

for (const score of [0, 4, 6, 8, 10] as const) {
  const view = buildLevel1Presentation(
    calculateAuditResult(answers(score), PRE),
    cards(score),
    PRE,
  );
  assert(view.headline.low <= view.headline.high, `score ${score} lower <= upper`);
  for (const row of view.processes) {
    assert(row.gap.low <= row.gap.high, `process ${row.processId} lower <= upper`);
  }
}

const none = estimateReliability(
  calculateAuditResult(answers(6), PRE),
  cards(6),
);
assert(none.visible, "card-only answers still have a reliability label");
assert(none.level === "nizka", "no exact answers → nízka");
assert(none.lineSk === "Spoľahlivosť odhadu: nízka", none.lineSk);
assert(none.hintSk === RELIABILITY_HINT_SK, "hint is verbatim");
assert(!none.lineSk.includes("%") && !none.hintSk.includes("%"), "reliability is not a percent");

const allExact = estimateReliability(
  calculateAuditResult(answers(6), PRE),
  cards(6, true),
);
assert(allExact.level === "vyssia", "all exact → vyššia");
assert(allExact.lineSk === "Spoľahlivosť odhadu: vyššia", allExact.lineSk);
assert(allExact.hintSk === RELIABILITY_HINT_SK, "hint stays the same at vyššia");

const totalW = LEVEL1_QUESTIONS.reduce((sum, q) => sum + q.weight, 0);
let exactW = 0;
const mixed: AnswerDetailsMap = {};
for (const q of LEVEL1_QUESTIONS) {
  const take = exactW / totalW < 0.4;
  if (take) exactW += q.weight;
  mixed[q.id] = {
    questionId: q.id,
    selectedCardScore: 6,
    finalEvaluatedScore: 6,
    ...(take ? { numericOverrideValue: 1 } : {}),
  };
}
const mixedRel = estimateReliability(calculateAuditResult(answers(6), PRE), mixed);
const share = exactW / totalW;
assert(share >= 0.25 && share < 0.55, `fixture share ${share} should be stredná`);
assert(mixedRel.level === "stredna", `weighted share → stredná, got ${mixedRel.level}`);
assert(mixedRel.lineSk === "Spoľahlivosť odhadu: stredná", mixedRel.lineSk);
assert(
  reliabilityWording("stredna").lineSk === "Spoľahlivosť odhadu: stredná",
  "shared wording",
);

const BANNED = [
  "Ročná strata voči priemeru MSP na Slovensku",
  "Gap SME",
  "Finančný únik podľa procesu",
  "Celkový potenciál úspor voči world-class špičke",
  "Podiel straty",
  "> 15 % nákladov podniku",
  "SME SR",
  "LEVEL 4 · ON-SITE AUDIT",
  "±15 %",
  "±5 %",
];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "out") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

for (const file of [
  ...walk("src"),
  ...walk("shared"),
  ...walk("supabase/functions"),
]) {
  const text = readFileSync(file, "utf8");
  for (const phrase of BANNED) {
    assert(!text.includes(phrase), `${file} still contains ${phrase}`);
  }
}

const edgeShared = readFileSync(
  "supabase/functions/send-audit-report/_shared.ts",
  "utf8",
);
const html = readFileSync("supabase/functions/send-audit-report/html.ts", "utf8");
const pdf = readFileSync("supabase/functions/send-audit-report/pdf.ts", "utf8");
const index = readFileSync("supabase/functions/send-audit-report/index.ts", "utf8");
assert(
  edgeShared.includes('from "../../../shared/audit-presentation.ts"'),
  "edge imports the shared module",
);
assert(edgeShared.includes("formatEurRange"), "edge formats with formatEurRange");
assert(edgeShared.includes("LEVEL1_DISCLAIMER_SK"), "edge uses the shared disclaimer");
assert(edgeShared.includes("reliabilityWording"), "edge uses shared reliability wording");
assert(html.includes("formatGapEur") && html.includes("LABEL_GAP_HEADLINE_SK"), "html uses shared labels");
assert(html.includes("reliabilityBlock"), "html shows reliability");
assert(!html.includes("Medzera vs MSP") && !html.includes("Indikatívny potenciál vs MSP"), "html old labels gone");
assert(pdf.includes("formatGapEur") && pdf.includes("LABEL_MSP_REF_SK"), "pdf uses shared labels");
assert(!pdf.includes("Gap / rok") && !pdf.includes("INDIKATÍVNY POTENCIÁL VS MSP"), "pdf old labels gone");
assert(index.includes("formatGapEur"), "e-mail subject uses the range formatter");

if (failed > 0) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log("presentation-ranges ok");
