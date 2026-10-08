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
import { benchmarkSourceNoteSk } from "@/config/benchmarks";
import { LEVEL1_QUESTIONS } from "./questions";
import { calculateAuditResult } from "./scoring";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  AuditResult,
  PreAuditInput,
  VdaScore,
} from "./types";

export type ReliabilityLevel = "nizka" | "stredna" | "vyssia";

export interface DisplayMoneyRange {
  low: number;
  high: number;
  labelSk: string;
}

/** Round to 2 significant figures for display ranges */
export function round2sig(n: number): number {
  if (!Number.isFinite(n) || n === 0) return 0;
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const exp = Math.floor(Math.log10(abs));
  const scale = 10 ** (exp - 1);
  return sign * Math.round(abs / scale) * scale;
}

function formatCompactEur(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    const t = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
    return `${t.toLocaleString("sk-SK")} mil. €`;
  }
  if (abs >= 10_000) {
    const k = Math.round(abs / 1000);
    return `${k.toLocaleString("sk-SK")} tis. €`;
  }
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatEurRange(low: number, high: number): string {
  const a = round2sig(Math.min(low, high));
  const b = round2sig(Math.max(low, high));
  if (a <= 0 && b <= 0) {
    return "bez výraznej medzery voči referencii";
  }
  if (a <= 0) {
    return `do ${formatCompactEur(b)} / rok`;
  }
  if (a === b) {
    return `približne ${formatCompactEur(a)} / rok`;
  }
  return `približne ${formatCompactEur(a)} – ${formatCompactEur(b)} / rok`;
}

function weightForQuestion(questionId: string): number {
  const q = LEVEL1_QUESTIONS.find((x) => x.id === questionId);
  return q?.weight ?? 1;
}

/**
 * Build low/high answer maps from card bands (or exact numeric).
 * Higher maturity score → lower financial gap (monotonic).
 */
function boundAnswerMaps(
  details: AnswerDetailsMap | undefined,
): { lowAnswers: AuditAnswers; highAnswers: AuditAnswers } {
  const lowAnswers: AuditAnswers = {};
  const highAnswers: AuditAnswers = {};

  for (const q of LEVEL1_QUESTIONS) {
    const d = details?.[q.id];
    if (!d) continue;
    if (d.numericOverrideValue !== undefined) {
      const s = d.finalEvaluatedScore;
      lowAnswers[q.id] = s;
      highAnswers[q.id] = s;
    } else {
      const key = optionKeyFromScore(d.selectedCardScore);
      const band = CARD_SCORE_BOUNDS[key];
      lowAnswers[q.id] = nearestVda(band.low);
      highAnswers[q.id] = nearestVda(band.high);
    }
  }

  return { lowAnswers, highAnswers };
}

function nearestVda(n: number): VdaScore {
  const bands: VdaScore[] = [0, 4, 6, 8, 10];
  return bands.reduce((best, b) =>
    Math.abs(b - n) < Math.abs(best - n) ? b : best,
  );
}

/**
 * Gap vs MSP reference as a range from A–E uncertainty (recomputed at bounds).
 */
export function gapSmeDisplayRange(
  result: AuditResult,
  details: AnswerDetailsMap | undefined,
  preAudit?: PreAuditInput,
): DisplayMoneyRange {
  const mid = result.gapSmeEur;

  if (!preAudit || result.auditLevel !== 1 || !details) {
    // Without bound inputs, do not invent ±% — show compact mid as single estimate
    if (mid <= 0) {
      return { low: 0, high: 0, labelSk: "bez výraznej medzery voči referencii" };
    }
    const r = round2sig(mid);
    return {
      low: r,
      high: r,
      labelSk: formatEurRange(r, r),
    };
  }

  const { lowAnswers, highAnswers } = boundAnswerMaps(details);
  if (Object.keys(lowAnswers).length === 0) {
    const r = round2sig(mid);
    return { low: r, high: r, labelSk: formatEurRange(r, r) };
  }

  // Low card scores → higher gap; high card scores → lower gap
  const pessimistic = calculateAuditResult(lowAnswers, preAudit);
  const optimistic = calculateAuditResult(highAnswers, preAudit);
  const low = Math.max(0, Math.min(optimistic.gapSmeEur, pessimistic.gapSmeEur));
  const high = Math.max(optimistic.gapSmeEur, pessimistic.gapSmeEur);

  return {
    low,
    high,
    labelSk: formatEurRange(low, high),
  };
}

export function wcCeilingDisplay(
  result: AuditResult,
): {
  raw: number;
  displayed: number;
  capped: boolean;
  labelSk: string;
  visible: boolean;
} {
  if (!SHOW_WORLD_CLASS_CEILING) {
    return {
      raw: result.gapWcEur,
      displayed: 0,
      capped: false,
      labelSk: "",
      visible: false,
    };
  }

  const raw = result.gapWcEur;
  const base = result.processScores.reduce((a, p) => a + p.costBaseEur, 0);
  const share = base > 0 ? raw / base : 0;
  if (share > 0.5 && process.env.NODE_ENV === "development") {
    console.warn(
      `[AVENG] WC potential share ${(share * 100).toFixed(0)}% exceeds 50% of cost base`,
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
    labelSk: formatEurRange(displayed, displayed),
  };
}

export function estimateReliability(
  result: AuditResult,
  details?: AnswerDetailsMap,
): {
  level: ReliabilityLevel;
  numericShare: number;
  labelSk: string;
  hintSk: string;
} {
  let wNum = 0;
  let wAll = 0;
  if (details && result.auditLevel === 1) {
    for (const [qid, d] of Object.entries(details)) {
      const w = weightForQuestion(qid);
      wAll += w;
      if (d.numericOverrideValue !== undefined) wNum += w;
    }
  }
  const share = wAll > 0 ? wNum / wAll : 0;
  let level: ReliabilityLevel = "nizka";
  if (share >= 0.55) level = "vyssia";
  else if (share >= 0.25) level = "stredna";

  const labelSk =
    level === "vyssia"
      ? "vyššia"
      : level === "stredna"
        ? "stredná"
        : "nízka";

  const hintSk =
    level === "vyssia"
      ? "Veľká časť odpovedí má namerané hodnoty."
      : "Spoľahlivosť zvýšite zadaním presných čísel alebo prechodom na Level 2.";

  return { level, numericShare: share, labelSk, hintSk };
}

export const LEVEL1_DISCLAIMER_SK =
  "Výsledky Level 1 sú rýchla orientačná diagnostika založená na vašich odpovediach. Nepredstavujú záruku úspor. Pre presné priority a overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe.";

export const BENCHMARK_SOURCE_NOTE_SK = benchmarkSourceNoteSk();

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
