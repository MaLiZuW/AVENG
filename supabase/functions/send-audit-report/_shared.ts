import {
  disclaimerForLevel,
  pdfFooterForLevel,
  reliabilityHintForLevel,
} from "../../../src/config/audit-copy.ts";
import {
  completedLevel3Body,
  levelUpsellEyebrow,
} from "../../../src/config/levels.ts";
import { formatEuroRounded, formatPercent } from "../../../src/lib/format.ts";
import { company } from "../_shared/company.ts";
import {
  formatEurRange,
  LABEL_COST_BASE_SHARE_SK,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  LABEL_WC_CEILING_SK,
  reliabilityWording,
  type ReliabilityLevel,
  type ReportPresentationPayload,
} from "../../../shared/audit-presentation.ts";

export { disclaimerForLevel, pdfFooterForLevel };

export {
  LABEL_COST_BASE_SHARE_SK,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  LABEL_WC_CEILING_SK,
  reliabilityWording,
};
export type { ReliabilityLevel, ReportPresentationPayload };

export const SITE = company.siteUrl;
export const BRAND = company.brandName;
export const CTA_MAIL = company.email;
export const CTA_PHONE = company.phoneDisplay;
export const L2_PRICE = 290;

export type ProcessScore = {
  processId: string;
  label: string;
  shortLabel: string;
  percent: number;
  smePercent?: number;
  wcPercent?: number;
  gapSmeEur: number;
  gapWcEur?: number;
  costBaseEur?: number;
};

export type Recommendation = {
  processId: string;
  title: string;
  description: string;
  impact: string;
};

export type CriticalProcess = {
  processId: string;
  label: string;
  shortLabel: string;
  gapSmeEur: number;
  gapWcEur?: number;
  userPercent: number;
  smePercent?: number;
  wcPercent?: number;
  reason: string;
};

export type ReportResult = {
  overallPercent?: number;
  smeOverallPercent?: number;
  wcOverallPercent?: number;
  gapSmeEur?: number;
  gapWcEur?: number;
  sectorLabel?: string;
  annualRevenueEur?: number;
  cogsPercent?: number;
  auditLevel?: number;
  answeredCount?: number;
  totalQuestions?: number;
  criticalProcess?: CriticalProcess;
  processScores?: ProcessScore[];
  recommendations?: Recommendation[];
};

export type ReportBody = {
  lead_id?: string;
  full_name?: string;
  work_email?: string;
  company_name?: string;
  phone?: string;
  result?: ReportResult;
  presentation?: ReportPresentationPayload;
};

/** Display-only mirror of DOMAIN_DISPLAY_LABEL in src/config/audit-display.ts. */
export const DOMAIN: Record<string, string> = {
  P1: "D1",
  P2: "D2",
  P3: "D3",
  P4: "D4",
  P5: "D5",
};

export function domainLabel(id: string): string {
  return DOMAIN[id] ?? id;
}

export function eur(n: number): string {
  return formatEuroRounded(n);
}

export function pct(n: number, digits = 1): string {
  return formatPercent(n, digits);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function sortedByGap(scores: ProcessScore[]): ProcessScore[] {
  return [...scores].sort((a, b) => b.gapSmeEur - a.gapSmeEur);
}

export function impactTone(impact: string): string {
  const i = impact.toLowerCase();
  if (i.includes("vysok")) return "#e8a54b";
  if (i.includes("stred")) return "#5b93ff";
  return "#94a3b8";
}

export type Upsell = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: string;
  href: string;
};

export function upsellForLevel(level: number, company: string): Upsell {
  const q = encodeURIComponent(`Self-Audit follow-up — ${company}`);
  if (level <= 1) {
    return {
      eyebrow: levelUpsellEyebrow(2),
      title: `Prejdite z orientácie na rozhodnutie — ${L2_PRICE} €`,
      body: "Level 1 ukázal, kde unikajú peniaze. Level 2 rozloží straty na OEE, COPQ a tok materiálu — podklad, ktorý unesie poradu majiteľov.",
      bullets: [
        "60 otázok — jasnejšie páky a priority",
        "Rozklad podľa finančného dopadu",
        "Prístupový kód e-mailom po úhrade",
      ],
      cta: "Požiadať o Level 2",
      href: `${SITE}/self-audit/#level-2`,
    };
  }
  if (level === 2) {
    return {
      eyebrow: levelUpsellEyebrow(3),
      title: "Expertná diagnostika & DTO simulátor",
      body: "Keď potrebujete vedieť nielen kde unikajú peniaze, ale čo sa stane po konkrétnej investícii — pred podpisom rozpočtu.",
      bullets: [
        "180 otázok · 6M príčinová analýza",
        "What-If simulácia investície a ROI",
        "Strategický podklad pre COO / majiteľa",
      ],
      cta: "Požiadať o Level 3",
      href: `${SITE}/self-audit/#level-3`,
    };
  }
  return {
    eyebrow: "Ďalší krok · Gemba Walk",
    title: "Overte čísla priamo vo výrobe",
    body: completedLevel3Body(),
    bullets: [
      "30–60 min na mieste alebo online",
      "Validácia kritického procesu",
      "Konkrétny akčný plán bez záväzku",
    ],
    cta: "Dohodnúť konzultáciu",
    href: `mailto:${CTA_MAIL}?subject=${q}`,
  };
}

export function formatGapEur(
  low: number | undefined,
  high: number | undefined,
  fallback: number,
): string {
  if (
    typeof low === "number" &&
    Number.isFinite(low) &&
    typeof high === "number" &&
    Number.isFinite(high)
  ) {
    return formatEurRange(low, high);
  }
  return formatEurRange(fallback, fallback);
}

export function formatProcessGap(
  presentation: ReportPresentationPayload | undefined,
  processId: string,
  fallback: number,
): string {
  const row = presentation?.processGaps?.find((p) => p.processId === processId);
  if (!row) return formatEurRange(fallback, fallback);
  return formatEurRange(row.lowEur, row.highEur);
}

export function reliabilityBlock(
  level: ReliabilityLevel | undefined,
  auditLevel = 1,
): { lineSk: string; hintSk: string } | null {
  if (!level) return null;
  const wording = reliabilityWording(level);
  return {
    lineSk: wording.lineSk,
    hintSk: reliabilityHintForLevel(auditLevel),
  };
}
