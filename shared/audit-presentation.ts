/**
 * Dependency-free presentation formatting for the Next app and the
 * send-audit-report Edge Function. No React, no Node, no scoring math.
 * Uncertainty is never a fixed ±% of the output.
 */

export type ReliabilityLevel = "nizka" | "stredna" | "vyssia";

/**
 * Cutoffs on the w_q-weighted share of exactly entered answers.
 * Qualitative heuristic — not statistics / not a probability.
 * TODO(owner): confirm 0.25 / 0.60.
 */
export const RELIABILITY_THRESHOLDS = {
  strednaMin: 0.25,
  vyssiaMin: 0.6,
} as const;

export const RELIABILITY_STREDNA_MIN = RELIABILITY_THRESHOLDS.strednaMin;
export const RELIABILITY_VYSSIA_MIN = RELIABILITY_THRESHOLDS.vyssiaMin;

export const LABEL_GAP_HEADLINE_SK =
  "Indikatívny potenciál úspor voči referencii MSP";
export const LABEL_GAP_SHORT_SK = "Medzera voči referencii MSP";
export const LABEL_PROCESS_GAPS_SK =
  "Indikatívny potenciál úspor podľa procesu";
export const LABEL_WC_CEILING_SK =
  "Teoretický strop (world-class, nie cieľ)";
export const LABEL_COST_BASE_SHARE_SK =
  "% z modelovej nákladovej bázy procesov";
export const LABEL_MSP_REF_SK = "Referencia MSP";
export const LABEL_GEMBA_KICKER_SK =
  "Odporúčaný ďalší krok: obchôdzka vo výrobe (Gemba Walk)";
export const LABEL_MATURITY_TABLE_SK =
  "Porovnanie voči referencii MSP (úroveň zrelosti, %)";
export const LABEL_MATURITY_TABLE_WC_SK =
  "3-cestné porovnanie (úroveň zrelosti, %)";
export const NOTE_MATURITY_TABLE_SK =
  "Úroveň zrelosti je skóre z vašich odpovedí, nie meraná hodnota ukazovateľa (napr. OTD alebo OEE).";
export const ZERO_GAP_SK = "bez výraznej medzery voči referencii";
export const RELIABILITY_HINT_SK =
  "Spoľahlivosť zvýšite zadaním presných čísel alebo prechodom na Level 2.";
export const LEVEL1_DISCLAIMER_SK =
  "Výsledky Level 1 sú rýchla orientačná diagnostika založená na vašich odpovediach. Nepredstavujú záruku úspor. Pre presné priority a overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe.";

/** MSP reference provenance — web, PDF and e-mail must show the same sentence. */
export const EXPERT_ESTIMATE_SOURCE_SK =
  "Referenčné hodnoty MSP sú interné referencie AVENG založené na expertnom odhade, nie oficiálna štatistika.";

export const LABEL_COST_BASE_TABLE_SK = "Nákladová báza procesov";
export const COL_DOMAIN_SK = "Doména";
export const COL_COGS_SHARE_SK = "Podiel z COGS";
export const COL_COST_BASE_SK = "Nákladová báza";
export const COL_REF_SOURCE_SK = "Zdroj referencie";
export const COST_BASE_SHARES_NOTE_SK =
  "Podiely sú expertný odhad AVENG, nie meraná hodnota vašej firmy.";
export const REF_SOURCE_EXPERT_SK = "expertný odhad";
export const REF_SOURCE_PUBLIC_ALIGNED_SK =
  "orientačne zodpovedá verejným zdrojom";

/**
 * Domains whose model S_SME/S_WC align with published KPI ranges
 * (`docs/benchmark-crosscheck.md`: P2 OEE, P4 OTD).
 */
export const CROSSCHECK_SUPPORTED_PROCESS_IDS = ["P2", "P4"] as const;

export function domainReferenceSourceLabelSk(processId: string): string {
  return (CROSSCHECK_SUPPORTED_PROCESS_IDS as readonly string[]).includes(
    processId,
  )
    ? REF_SOURCE_PUBLIC_ALIGNED_SK
    : REF_SOURCE_EXPERT_SK;
}

export interface CostBaseTableRow {
  processId: string;
  domainLabel: string;
  /** k_Pi share of COGS (0–1), supplied by caller from PROCESSES.costFactor. */
  cogsShare: number;
  costBaseEur: number;
  referenceSourceSk: string;
}

/**
 * Build cost-base disclosure rows. Shares must come from existing k_Pi
 * (`PROCESSES.costFactor`) — never hardcode coefficients here.
 */
export function buildCostBaseTableRows(
  processes: readonly {
    processId: string;
    domainLabel: string;
    costFactor: number;
    costBaseEur: number;
    referenceSourceSk: string;
  }[],
): CostBaseTableRow[] {
  return processes.map((p) => ({
    processId: p.processId,
    domainLabel: p.domainLabel,
    cogsShare: p.costFactor,
    costBaseEur: p.costBaseEur,
    referenceSourceSk: p.referenceSourceSk,
  }));
}

export interface ReportProcessGap {
  processId: string;
  lowEur: number;
  highEur: number;
}

/** Numbers and the reliability band. Wording is formatted from this module. */
export interface ReportPresentationPayload {
  gapSmeLowEur: number;
  gapSmeHighEur: number;
  reliabilityLevel?: ReliabilityLevel;
  processGaps: ReportProcessGap[];
  criticalLowEur: number;
  criticalHighEur: number;
}

/** Round to 2 significant figures. */
export function round2sig(n: number): number {
  if (!Number.isFinite(n) || n === 0) return 0;
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const exp = Math.floor(Math.log10(abs));
  const scale = 10 ** (exp - 1);
  return sign * Math.round(abs / scale) * scale;
}

function groupInt(intRaw: string): string {
  return intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatMil(n: number): string {
  const m = Math.abs(n) / 1_000_000;
  const rounded = Math.round(m * 10) / 10;
  const [i, f] = rounded.toFixed(1).split(".");
  return `${groupInt(i!)},${f}`;
}

function formatTis(n: number): string {
  const k = Math.abs(n) / 1000;
  if (k >= 10) return groupInt(String(Math.round(k)));
  if (k >= 1) {
    const t = Math.round(k * 10) / 10;
    if (Math.abs(t - Math.round(t)) < 1e-9) return groupInt(String(Math.round(t)));
    const [i, f] = t.toFixed(1).split(".");
    return `${i},${f}`;
  }
  const digits = k >= 0.1 ? 1 : 2;
  const factor = 10 ** digits;
  const t = Math.round(k * factor) / factor;
  const [i, f] = t.toFixed(digits).split(".");
  return `${i},${f}`;
}

type MoneyUnit = "tis" | "mil";

function unitFor(n: number): MoneyUnit {
  return Math.abs(n) >= 1_000_000 ? "mil" : "tis";
}

function formatInUnit(n: number, unit: MoneyUnit): string {
  return unit === "mil" ? formatMil(n) : formatTis(n);
}

function unitLabel(unit: MoneyUnit): string {
  return unit === "mil" ? "mil. €" : "tis. €";
}

/**
 * SK money range. Below 1 000 000 → "tis. €"; from 1 000 000 → "mil. €"
 * with one decimal and a comma. Unit is written once.
 */
export function formatEurRange(low: number, high: number): string {
  const a = round2sig(Math.min(low, high));
  const b = round2sig(Math.max(low, high));
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (lo <= 0 && hi <= 0) return ZERO_GAP_SK;
  if (lo <= 0) {
    const unit = unitFor(hi);
    return `do ${formatInUnit(hi, unit)} ${unitLabel(unit)}`;
  }
  const unit = unitFor(hi);
  const left = formatInUnit(lo, unit);
  const right = formatInUnit(hi, unit);
  if (left === right) return `približne ${left} ${unitLabel(unit)} / rok`;
  return `približne ${left} – ${right} ${unitLabel(unit)} / rok`;
}

export function reliabilityLevelFromShare(share: number): ReliabilityLevel {
  if (share >= RELIABILITY_THRESHOLDS.vyssiaMin) return "vyssia";
  if (share >= RELIABILITY_THRESHOLDS.strednaMin) return "stredna";
  return "nizka";
}

/** nízka / stredná → range; vyššia → rounded point with "približne". */
export function reliabilityShowsRange(level: ReliabilityLevel): boolean {
  return level === "nizka" || level === "stredna";
}

export function reliabilityWording(level: ReliabilityLevel): {
  adjectiveSk: "nízka" | "stredná" | "vyššia";
  lineSk: string;
  hintSk: string;
} {
  const adjectiveSk =
    level === "vyssia" ? "vyššia" : level === "stredna" ? "stredná" : "nízka";
  return {
    adjectiveSk,
    lineSk: `Spoľahlivosť odhadu: ${adjectiveSk}`,
    hintSk: RELIABILITY_HINT_SK,
  };
}
