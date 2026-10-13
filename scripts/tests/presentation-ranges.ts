/**
 * Formatter, range bounds and report-parity checks for the presentation layer.
 * Run: npx tsx scripts/tests/presentation-ranges.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { LEVEL1_QUESTIONS } from "../../src/lib/audit/questions";
import { LEVEL2_QUESTIONS } from "../../src/lib/audit/level2-questions";
import {
  buildLevel1Presentation,
  buildResultView,
  estimateReliability,
  formatEurRange as formatFromPresentation,
  toReportPresentation,
} from "../../src/lib/audit/presentation";
import { calculateAuditResult } from "../../src/lib/audit/scoring";
import { calculateLevel2AuditResult } from "../../src/lib/audit/scoring-premium";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  PreAuditInput,
  VdaScore,
} from "../../src/lib/audit/types";
import {
  formatEurRange,
  LABEL_MATURITY_TABLE_SK,
  LEVEL1_DISCLAIMER_SK,
  NOTE_MATURITY_TABLE_SK,
  RELIABILITY_HINT_SK,
  RELIABILITY_THRESHOLDS,
  reliabilityShowsRange,
  reliabilityWording,
  round2sig,
  ZERO_GAP_SK,
} from "../../shared/audit-presentation";

const PRE: PreAuditInput = {
  sectorId: "general",
  annualRevenueEur: 5_000_000,
  cogsPercent: 65,
};

const PRE_L2: PreAuditInput = {
  sectorId: "general",
  annualRevenueEur: 500_000,
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

function l2Cards(score: VdaScore): AnswerDetailsMap {
  return Object.fromEntries(
    LEVEL2_QUESTIONS.map((q) => [
      q.id,
      {
        questionId: q.id,
        selectedCardScore: score,
        finalEvaluatedScore: score,
      },
    ]),
  );
}

function l2Answers(score: VdaScore): AuditAnswers {
  return Object.fromEntries(LEVEL2_QUESTIONS.map((q) => [q.id, score]));
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
assert(RELIABILITY_THRESHOLDS.strednaMin === 0.25, "stredná threshold");
assert(RELIABILITY_THRESHOLDS.vyssiaMin === 0.6, "vyššia threshold 0.60");
assert(reliabilityShowsRange("nizka"), "nízka → range");
assert(reliabilityShowsRange("stredna"), "stredná → range");
assert(!reliabilityShowsRange("vyssia"), "vyššia → point");

const allA = buildResultView(1, {
  result: calculateAuditResult(answers(0), PRE),
  details: cards(0),
  preAudit: PRE,
});
assert(allA.flags.showAsRange, "low reliability shows range");
assert(allA.headline.low < allA.headline.high, "card A band is a real range");
assert(allA.headline.low <= allA.headline.high, "A lower <= upper");
assert(allA.headline.labelSk.startsWith("približne "), "A uses približne");
assert(
  allA.headline.labelSk.includes("tis. €") || allA.headline.labelSk.includes("mil. €"),
  "A uses tis or mil",
);
assert(
  Math.abs(
    allA.headline.low -
      allA.processes.reduce((s, p) => s + p.gap.low, 0),
  ) < 1e-6,
  "headline low = sum of domain lows",
);
assert(
  Math.abs(
    allA.headline.high -
      allA.processes.reduce((s, p) => s + p.gap.high, 0),
  ) < 1e-6,
  "headline high = sum of domain highs",
);

const exact = buildResultView(1, {
  result: calculateAuditResult(answers(4), PRE),
  details: cards(4, true),
  preAudit: PRE,
});
assert(!exact.flags.showAsRange, "high reliability → point mode");
assert(exact.headline.low === exact.headline.high, "exact number is a point");
assert(exact.headline.low <= exact.headline.high, "exact lower <= upper");
assert(
  exact.headline.labelSk.startsWith("približne ") ||
    exact.headline.labelSk === ZERO_GAP_SK,
  "vyššia uses približne point wording",
);
assert(
  !exact.headline.labelSk.includes(" – ") || exact.headline.labelSk === ZERO_GAP_SK,
  "vyššia is not a dash range",
);

const allE = buildResultView(1, {
  result: calculateAuditResult(answers(10), PRE),
  details: cards(10),
  preAudit: PRE,
});
assert(allE.headline.low === 0 && allE.headline.high === 0, "score 10 gap is zero");
assert(allE.headline.labelSk === ZERO_GAP_SK, "zero gap wording");
assert(allE.flags.zeroGap, "zero gap flag");

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
  if (view.flags.showAsRange) {
    const sumLo = view.processes.reduce((s, p) => s + p.gap.low, 0);
    const sumHi = view.processes.reduce((s, p) => s + p.gap.high, 0);
    assert(
      Math.abs(view.headline.low - sumLo) < 1e-6,
      `score ${score} headline low = domain sum`,
    );
    assert(
      Math.abs(view.headline.high - sumHi) < 1e-6,
      `score ${score} headline high = domain sum`,
    );
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
assert(
  share >= RELIABILITY_THRESHOLDS.strednaMin &&
    share < RELIABILITY_THRESHOLDS.vyssiaMin,
  `fixture share ${share} should be stredná`,
);
assert(mixedRel.level === "stredna", `weighted share → stredná, got ${mixedRel.level}`);
assert(mixedRel.lineSk === "Spoľahlivosť odhadu: stredná", mixedRel.lineSk);
assert(
  reliabilityWording("stredna").lineSk === "Spoľahlivosť odhadu: stredná",
  "shared wording",
);
const mixedView = buildResultView(1, {
  result: calculateAuditResult(answers(6), PRE),
  details: mixed,
  preAudit: PRE,
});
assert(mixedView.flags.showAsRange, "stredná still shows ranges");

// Level 2 test profile: 500 000 €, COGS 65 %, all card answers → ranges everywhere
const l2Result = calculateLevel2AuditResult(l2Answers(4), PRE_L2);
const l2View = buildResultView(2, {
  result: l2Result,
  details: l2Cards(4),
  preAudit: PRE_L2,
  recalculate: calculateLevel2AuditResult,
});
assert(l2View.reliability.level === "nizka", "L2 all cards → nízka");
assert(l2View.flags.showAsRange, "L2 low reliability → range");
assert(l2View.headline.low < l2View.headline.high, "L2 headline is a real range");
assert(
  !/^\d[\d\s]*€/.test(l2View.headline.labelSk),
  "L2 headline is not euro-precise",
);
assert(
  l2View.headline.labelSk.includes("tis. €") ||
    l2View.headline.labelSk.includes("mil. €") ||
    l2View.headline.labelSk === ZERO_GAP_SK ||
    l2View.headline.labelSk.startsWith("do "),
  `L2 uses rounded units, got ${l2View.headline.labelSk}`,
);
for (const row of l2View.processes) {
  assert(row.gap.low <= row.gap.high, `L2 ${row.processId} lower <= upper`);
  assert(
    row.gap.low < row.gap.high || row.gap.labelSk === ZERO_GAP_SK,
    `L2 ${row.processId} shows range (or zero gap)`,
  );
  assert(
    !row.gap.labelSk.match(/^\d{1,3}( \d{3})* €/),
    `L2 ${row.processId} not euro-precise: ${row.gap.labelSk}`,
  );
}
assert(
  Math.abs(
    l2View.headline.low - l2View.processes.reduce((s, p) => s + p.gap.low, 0),
  ) < 1e-6,
  "L2 headline low = domain sum",
);
assert(
  Math.abs(
    l2View.headline.high - l2View.processes.reduce((s, p) => s + p.gap.high, 0),
  ) < 1e-6,
  "L2 headline high = domain sum",
);

// Web / PDF / e-mail share the same formatter (rounding parity)
const report = toReportPresentation(l2View);
assert(
  formatEurRange(report.gapSmeLowEur, report.gapSmeHighEur) ===
    l2View.headline.labelSk,
  "report payload rounds like web headline",
);
for (const row of report.processGaps) {
  const web = l2View.processes.find((p) => p.processId === row.processId);
  assert(!!web, `report process ${row.processId}`);
  assert(
    formatEurRange(row.lowEur, row.highEur) === web!.gap.labelSk,
    `report process ${row.processId} matches web`,
  );
}

assert(
  LABEL_MATURITY_TABLE_SK ===
    "Porovnanie voči referencii MSP (úroveň zrelosti, %)",
  "maturity table heading",
);
assert(
  NOTE_MATURITY_TABLE_SK ===
    "Úroveň zrelosti je skóre z vašich odpovedí, nie meraná hodnota ukazovateľa (napr. OTD alebo OEE).",
  "maturity table note",
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
const dashboard = readFileSync("src/components/audit/ResultsDashboard.tsx", "utf8");
assert(
  edgeShared.includes('from "../../../shared/audit-presentation.ts"'),
  "edge imports the shared module",
);
assert(edgeShared.includes("formatEurRange"), "edge formats with formatEurRange");
assert(
  edgeShared.includes('from "../../../src/config/audit-copy.ts"'),
  "edge imports level-aware copy",
);
assert(edgeShared.includes("disclaimerForLevel"), "edge resolves disclaimer by level");
assert(
  !edgeShared.includes("LEVEL1_DISCLAIMER_SK"),
  "edge does not pin the Level 1 disclaimer",
);
assert(edgeShared.includes("reliabilityWording"), "edge uses shared reliability wording");
assert(html.includes("formatGapEur") && html.includes("LABEL_GAP_HEADLINE_SK"), "html uses shared labels");
assert(html.includes("reliabilityBlock"), "html shows reliability");
assert(html.includes("LABEL_MATURITY_TABLE_SK"), "html maturity table heading");
assert(html.includes("NOTE_MATURITY_TABLE_SK"), "html maturity table note");
assert(!html.includes("Medzera vs MSP") && !html.includes("Indikatívny potenciál vs MSP"), "html old labels gone");
assert(pdf.includes("formatGapEur") && pdf.includes("LABEL_MSP_REF_SK"), "pdf uses shared labels");
assert(pdf.includes("LABEL_MATURITY_TABLE_SK"), "pdf maturity table heading");
assert(pdf.includes("NOTE_MATURITY_TABLE_SK"), "pdf maturity table note");
assert(!pdf.includes("Gap / rok") && !pdf.includes("INDIKATÍVNY POTENCIÁL VS MSP"), "pdf old labels gone");
assert(index.includes("formatGapEur"), "e-mail subject uses the range formatter");
assert(dashboard.includes("LABEL_MATURITY_TABLE_SK"), "web maturity table heading");
assert(dashboard.includes("NOTE_MATURITY_TABLE_SK"), "web maturity table note");
assert(dashboard.includes("buildResultView"), "web uses buildResultView");

if (failed > 0) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log("presentation-ranges ok");
