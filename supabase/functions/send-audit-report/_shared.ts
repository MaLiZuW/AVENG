export const SITE = "https://www.addvalueengineering.sk";
export const BRAND = "AddValueEngineering";
export const CTA_MAIL = "vladimir@addvalueengineering.sk";
export const CTA_PHONE = "+421 948 007 304";
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
};

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
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(n: number, digits = 0): string {
  return `${n.toFixed(digits)} %`;
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
      eyebrow: "Ďalší krok · Level 2 Silver",
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
      eyebrow: "Ďalší krok · Level 3 Gold",
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
    body: "Premium audit máte hotový. Ďalší skok je obchôdzka vo výrobe — overenie predpokladov a 90-dňový akčný plán.",
    bullets: [
      "30–60 min na mieste alebo online",
      "Validácia kritického procesu",
      "Konkrétny akčný plán bez záväzku",
    ],
    cta: "Dohodnúť konzultáciu",
    href: `mailto:${CTA_MAIL}?subject=${q}`,
  };
}

export const DISCLAIMER_SK =
  "Indikatívny skríning Self-Auditu — nie je zárukou výsledku ani cenovou ponukou. Čísla vychádzajú z vašich odpovedí a referencie MSP.";
