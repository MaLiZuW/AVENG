/**
 * Presentation layer — display ranges & reliability (scoring math untouched).
 * Uncertainty comes only from A–E card bands and exact numeric answers — never ±% of output.
 */

import {
  CARD_SCORE_BOUNDS,
  optionKeyFromScore,
} from "@/config/audit-bands";
import {
  MAX_DISPLAYED_POTENTIAL_SHARE,
  SHOW_WORLD_CLASS_CEILING,
} from "@/config/audit-display";
import { disclaimerForLevel, reliabilityHintForLevel } from "@/config/audit-copy";
import {
  getKpiReference,
  isBenchmarkAvailable,
  referenceSourceNotesSk,
  type KpiReference,
  type PublishedKpiKey,
} from "@/config/benchmarks";
import { formatDecimalTrim, formatInt } from "@/lib/format";
import {
  formatEurRange,
  LABEL_WC_CEILING_SK,
  reliabilityLevelFromShare,
  reliabilityShowsRange,
  reliabilityWording,
  ZERO_GAP_SK,
  type ReliabilityLevel,
  type ReportPresentationPayload,
} from "../../../shared/audit-presentation";
import { LEVEL1_QUESTIONS } from "./questions";
import { calculateAuditResult } from "./scoring";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  AuditResult,
  PreAuditInput,
  VdaScore,
} from "./types";

export {
  formatEurRange,
  round2sig,
  LABEL_COST_BASE_SHARE_SK,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_GEMBA_KICKER_SK,
  LABEL_MATURITY_TABLE_SK,
  LABEL_MATURITY_TABLE_WC_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  LABEL_WC_CEILING_SK,
  LEVEL1_DISCLAIMER_SK,
  NOTE_MATURITY_TABLE_SK,
  RELIABILITY_HINT_SK,
  RELIABILITY_THRESHOLDS,
  ZERO_GAP_SK,
  reliabilityShowsRange,
  reliabilityWording,
} from "../../../shared/audit-presentation";

export { referenceSourceNotesSk };

export type { ReliabilityLevel, ReportPresentationPayload };

export interface DisplayMoneyRange {
  low: number;
  high: number;
  labelSk: string;
}

export interface ResultViewFlags {
  /** True when reliability is nízka or stredná (show ranges). */
  showAsRange: boolean;
  /** True when the headline renders the zero-gap phrase. */
  zeroGap: boolean;
}

export interface ResultView {
  headline: DisplayMoneyRange;
  processes: { processId: string; gap: DisplayMoneyRange }[];
  critical: DisplayMoneyRange;
  reliability: {
    visible: boolean;
    level: ReliabilityLevel;
    lineSk: string;
    hintSk: string;
    /** Internal weight share. Never render as a probability. */
    exactWeightShare: number;
  };
  disclaimerSk: string;
  flags: ResultViewFlags;
}

/** @deprecated Prefer ResultView — kept for existing call sites. */
export type Level1Presentation = ResultView;

/** Raw inputs for the presentation view model (scoring math untouched). */
export interface ResultViewRaw {
  result: AuditResult;
  details?: AnswerDetailsMap;
  preAudit?: PreAuditInput;
  /**
   * Level 2/3 calculator supplied by the unlocked chunk so premium
   * question banks stay out of the Level 1 client bundle.
   */
  recalculate?: (
    answers: AuditAnswers,
    preAudit: PreAuditInput,
  ) => AuditResult;
}

function weightForQuestion(questionId: string): number {
  const q = LEVEL1_QUESTIONS.find((x) => x.id === questionId);
  return q?.weight ?? 1;
}

/**
 * Band endpoints stay continuous. The engine reads them as numbers;
 * snapping to the VDA midpoint would collapse the range.
 */
function scoreAtBound(n: number): VdaScore {
  return n as VdaScore;
}

/**
 * Low map = lower maturity (higher gap). High map = higher maturity (lower gap).
 * Any answered question id (L1/L2/L3) with card/exact detail participates.
 */
function boundAnswerMaps(details: AnswerDetailsMap | undefined): {
  lowAnswers: AuditAnswers;
  highAnswers: AuditAnswers;
} {
  const lowAnswers: AuditAnswers = {};
  const highAnswers: AuditAnswers = {};

  if (!details) return { lowAnswers, highAnswers };

  for (const [qid, d] of Object.entries(details)) {
    if (!d) continue;
    if (d.numericOverrideValue !== undefined) {
      lowAnswers[qid] = d.finalEvaluatedScore;
      highAnswers[qid] = d.finalEvaluatedScore;
    } else {
      const key = optionKeyFromScore(d.selectedCardScore);
      const band = CARD_SCORE_BOUNDS[key];
      lowAnswers[qid] = scoreAtBound(band.low);
      highAnswers[qid] = scoreAtBound(band.high);
    }
  }

  return { lowAnswers, highAnswers };
}

function spanGap(a: number, b: number): DisplayMoneyRange {
  const low = Math.max(0, Math.min(a, b));
  const high = Math.max(0, a, b);
  return { low, high, labelSk: formatEurRange(low, high) };
}

function pointGap(n: number): DisplayMoneyRange {
  return spanGap(n, n);
}

function viewFlags(
  headline: DisplayMoneyRange,
  showAsRange: boolean,
): ResultViewFlags {
  return {
    showAsRange,
    zeroGap: headline.labelSk === ZERO_GAP_SK,
  };
}

export function estimateReliability(
  result: AuditResult,
  details?: AnswerDetailsMap,
): ResultView["reliability"] {
  let wNum = 0;
  let wAll = 0;
  if (details) {
    for (const [qid, d] of Object.entries(details)) {
      const w = weightForQuestion(qid);
      wAll += w;
      if (d.numericOverrideValue !== undefined) wNum += w;
    }
  }
  const share = wAll > 0 ? wNum / wAll : 0;
  const level = reliabilityLevelFromShare(share);
  const wording = reliabilityWording(level);
  return {
    visible: wAll > 0,
    level,
    lineSk: wording.lineSk,
    hintSk: reliabilityHintForLevel(result.auditLevel),
    exactWeightShare: share,
  };
}

/**
 * Gap vs MSP reference as a range from A–E uncertainty (recomputed at bounds).
 */
export function gapSmeDisplayRange(
  result: AuditResult,
  details: AnswerDetailsMap | undefined,
  preAudit?: PreAuditInput,
  recalculate?: ResultViewRaw["recalculate"],
): DisplayMoneyRange {
  return buildResultView(result.auditLevel, {
    result,
    details,
    preAudit,
    recalculate,
  }).headline;
}

/**
 * Presentation view model for every audit level.
 * Uncertainty comes only from A–E bands and exact inputs — never ±% or level narrowing.
 */
export function buildResultView(
  level: number,
  raw: ResultViewRaw,
): ResultView {
  const { result, details, preAudit, recalculate } = raw;
  const reliability = estimateReliability(result, details);
  const showAsRange = reliabilityShowsRange(reliability.level);
  const disclaimerSk = disclaimerForLevel(level);

  const pointProcesses = result.processScores.map((p) => ({
    processId: p.processId,
    gap: pointGap(p.gapSmeEur),
  }));

  const withPoints = (processes: ResultView["processes"]): ResultView => {
    const headline = showAsRange
      ? (() => {
          const sumLow = processes.reduce((a, p) => a + p.gap.low, 0);
          const sumHigh = processes.reduce((a, p) => a + p.gap.high, 0);
          return spanGap(sumLow, sumHigh);
        })()
      : pointGap(result.gapSmeEur);
    const criticalId = result.criticalProcess.processId;
    const critical =
      processes.find((p) => p.processId === criticalId)?.gap ??
      pointGap(result.criticalProcess.gapSmeEur);
    return {
      headline,
      processes,
      critical,
      reliability,
      disclaimerSk,
      flags: viewFlags(headline, showAsRange),
    };
  };

  const pointView = withPoints(pointProcesses);

  if (!preAudit || !details) return pointView;

  const { lowAnswers, highAnswers } = boundAnswerMaps(details);
  if (Object.keys(lowAnswers).length === 0) return pointView;

  const calc: ResultViewRaw["recalculate"] =
    recalculate ??
    (level <= 1
      ? (answers, input) => calculateAuditResult(answers, input)
      : undefined);
  if (!calc) return pointView;

  const pessimistic = calc(lowAnswers, preAudit);
  const optimistic = calc(highAnswers, preAudit);

  const rangedProcesses = result.processScores.map((p) => {
    const hi =
      pessimistic.processScores.find((s) => s.processId === p.processId)
        ?.gapSmeEur ?? p.gapSmeEur;
    const lo =
      optimistic.processScores.find((s) => s.processId === p.processId)
        ?.gapSmeEur ?? p.gapSmeEur;
    return { processId: p.processId, gap: spanGap(lo, hi) };
  });

  if (!showAsRange) {
    return withPoints(pointProcesses);
  }

  return withPoints(rangedProcesses);
}

export function buildLevel1Presentation(
  result: AuditResult,
  details: AnswerDetailsMap | undefined,
  preAudit?: PreAuditInput,
  recalculate?: ResultViewRaw["recalculate"],
): ResultView {
  return buildResultView(result.auditLevel, {
    result,
    details,
    preAudit,
    recalculate,
  });
}

export function toReportPresentation(
  view: ResultView,
): ReportPresentationPayload {
  return {
    gapSmeLowEur: view.headline.low,
    gapSmeHighEur: view.headline.high,
    ...(view.reliability.visible
      ? { reliabilityLevel: view.reliability.level }
      : {}),
    processGaps: view.processes.map((p) => ({
      processId: p.processId,
      lowEur: p.gap.low,
      highEur: p.gap.high,
    })),
    criticalLowEur: view.critical.low,
    criticalHighEur: view.critical.high,
  };
}

export function wcCeilingDisplay(result: AuditResult): {
  raw: number;
  displayed: number;
  capped: boolean;
  labelSk: string;
  titleSk: string;
  visible: boolean;
} {
  if (!SHOW_WORLD_CLASS_CEILING) {
    return {
      raw: result.gapWcEur,
      displayed: 0,
      capped: false,
      labelSk: "",
      titleSk: LABEL_WC_CEILING_SK,
      visible: false,
    };
  }

  const raw = result.gapWcEur;
  const base = result.processScores.reduce((a, p) => a + p.costBaseEur, 0);
  const share = base > 0 ? raw / base : 0;
  if (share > 0.5 && process.env.NODE_ENV === "development") {
    console.warn(
      `[AVENG] WC potential share ${formatInt(Math.round(share * 100))}% exceeds 50% of cost base`,
    );
  }
  const cap = base * MAX_DISPLAYED_POTENTIAL_SHARE;
  const capped = base > 0 && raw > cap;
  const displayed = capped ? cap : raw;
  return {
    raw,
    displayed,
    capped,
    visible: true,
    titleSk: LABEL_WC_CEILING_SK,
    labelSk: formatEurRange(displayed, displayed),
  };
}

export function scoreToBandLabel(score: VdaScore): string {
  const map: Record<VdaScore, string> = {
    0: "Absencia",
    4: "Podpriemer",
    6: "Referencia MSP",
    8: "Nadpriemer",
    10: "World-class referencia",
  };
  return map[score];
}

export interface KpiComparisonSource {
  name: string;
  url: string;
}

export interface KpiComparisonRow {
  key: PublishedKpiKey;
  labelSk: string;
  userValueSk: string;
  typicalSk: string;
  topSk: string;
  sources: KpiComparisonSource[];
}

function skNumber(n: number): string {
  return formatDecimalTrim(n, 2);
}

function pct(n: number): string {
  return `${skNumber(n)} %`;
}

function pctRange(pair: readonly [number, number]): string {
  return `${skNumber(pair[0])}–${skNumber(pair[1])} %`;
}

/**
 * Column text from the reference JSON only.
 * `schedule_adherence_pct` has a vendor threshold, not a measured typical value,
 * so it does not become a "Typický podnik" cell.
 */
function benchmarkCells(
  ref: KpiReference,
): { typicalSk: string; topSk: string } | null {
  switch (ref.key) {
    case "oee_pct":
      return {
        typicalSk: `${pct(ref.ranges.typical)}; diskrétna výroba ${pctRange(ref.ranges.discreteAverageRange)}; horný kvartil ${pct(ref.ranges.topQuartile)}`,
        topSk: `${pct(ref.ranges.worldClass)}; podľa odvetvia ${pctRange(ref.ranges.worldClassBySectorRange)}`,
      };
    case "copq_pct_of_sales":
      return {
        typicalSk: `${pct(ref.ranges.typical)} (rozsah ${pctRange(ref.ranges.range)})`,
        topSk: `pod ${pct(ref.ranges.worldClassBelow)}`,
      };
    case "otd_pct":
      return {
        typicalSk: pctRange(ref.ranges.averageRange),
        topSk: pctRange(ref.ranges.worldClassRange),
      };
    case "schedule_adherence_pct":
      return null;
    default: {
      const _exhaustive: never = ref;
      return _exhaustive;
    }
  }
}

function formatUserKpi(value: number, unit: string): string {
  if (unit === "%" || unit === "% of sales") return pct(value);
  return `${skNumber(value)} ${unit}`;
}

/** Rows only for exact numeric answers whose question is mapped to a published KPI. */
export function buildKpiComparisonRows(
  details: AnswerDetailsMap | undefined,
): KpiComparisonRow[] {
  if (!details) return [];
  const rows: KpiComparisonRow[] = [];
  for (const q of LEVEL1_QUESTIONS) {
    if (q.inputType !== "NUMERIC_INPUT" || !q.kpiKey) continue;
    if (!isBenchmarkAvailable(q.kpiKey)) continue;
    const value = details[q.id]?.numericOverrideValue;
    if (value === undefined || !Number.isFinite(value)) continue;
    const ref = getKpiReference(q.kpiKey);
    if (!ref) continue;
    const cells = benchmarkCells(ref);
    if (!cells) continue;
    rows.push({
      key: q.kpiKey,
      labelSk: ref.labelSk,
      userValueSk: formatUserKpi(value, ref.unit),
      typicalSk: cells.typicalSk,
      topSk: cells.topSk,
      sources: ref.sources.map((source) => ({
        name: source.name,
        url: source.url,
      })),
    });
  }
  return rows;
}
