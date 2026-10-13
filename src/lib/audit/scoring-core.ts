/**
 * Shared L1 scoring primitives — no Level 2/3 question imports.
 */

import { formatEuroRounded } from "../format";
import { computeWeightedProcessPercent } from "./calculationEngine";
import { getProcessBenchmarks, getSector, PROCESSES } from "./benchmarks";
import { LEVEL1_QUESTIONS } from "./questions";
import type {
  AuditAnswers,
  AuditResult,
  CriticalProcess,
  PreAuditInput,
  ProcessId,
  ProcessScore,
  Recommendation,
  VdaScore,
} from "./types";
import { mapNumericValueToVdaScore } from "./calculationEngine";

const RECOMMENDATION_BANK: Record<
  string,
  {
    title: string;
    description: string;
    impact: Recommendation["impact"];
    reason: string;
  }
> = {
  P1: {
    title: "Stabilizovať výrobné plánovanie a pull tok",
    description:
      "Zaveďte denný operatívny rytmus na úzkych miestach, znížte núdzové preplánovanie a prejdite z push/Excelu na vizuálny pull (Kanban) s meraním plan attainment.",
    impact: "vysoký",
    reason:
      "Nestabilný plán a časté hasenie spôsobujú najväčší únik kapacity a oneskorenia voči zákazníkovi.",
  },
  P2: {
    title: "Zvýšiť dostupnosť zariadení a OEE",
    description:
      "Zaveďte TPM rytmus, znížte neplánované odstávky a systematicky riešte 6 veľkých strát dostupnosti.",
    impact: "vysoký",
    reason:
      "Straty dostupnosti a neplánované odstávky vytvárajú najväčšiu medzeru voči referencii MSP.",
  },
  P3: {
    title: "Znížiť COPQ a spevniť kontrolu procesu",
    description:
      "Vyčísliť COPQ, implementovať kontrolný plán pre kritické znaky a posunúť ťažisko z výstupnej kontroly na prevenciu (Poka-Yoke / SPC).",
    impact: "vysoký",
    reason:
      "Náklady nekvality a reklamácie vytvárajú najväčšiu finančnú medzeru voči referencii MSP.",
  },
  P4: {
    title: "Zvýšiť OTD a zrýchliť tok materiálu",
    description:
      "Zmapovať VSM, nastaviť FIFO/supermarket, zvýšiť obrátkovosť zásob a riadiť spoľahlivosť kľúčových dodávateľov.",
    impact: "stredný",
    reason:
      "Oneskorené dodávky a viazaný kapitál v zásobách generujú najvyšší indikatívny potenciál úspor v logistike.",
  },
  P5: {
    title: "Budovať viaczručnosť a stabilitu tímu",
    description:
      "Aktualizovať skills matrix, zabezpečiť zastupiteľnosť na kritických staniciach a spustiť Kaizen + koučing majstrov.",
    impact: "stredný",
    reason:
      "Absencia a úzka špecializácia ľudí limitujú výkon celej výroby a zvyšujú skryté straty.",
  },
};

export function isValidVdaScore(n: number): n is VdaScore {
  return n === 0 || n === 4 || n === 6 || n === 8 || n === 10;
}

export function processPercentFromParentScores(
  processId: ProcessId,
  parentScore: (parentId: string) => number | null,
): number {
  return computeWeightedProcessPercent(processId, parentScore);
}

export function resolveL1Score(
  questionId: string,
  raw:
    | { kind: "vda"; score: VdaScore }
    | { kind: "numeric"; value: number; withRotation?: boolean },
): VdaScore {
  if (raw.kind === "vda") return raw.score;
  return mapNumericValueToVdaScore(questionId, raw.value, {
    withRotation: raw.withRotation,
  });
}

export function getTopLossProcesses(
  processScores: ProcessScore[],
  limit = 3,
): ProcessScore[] {
  return [...processScores]
    .sort((a, b) => b.gapSmeEur - a.gapSmeEur || b.gapWcEur - a.gapWcEur)
    .slice(0, limit);
}

function buildRecommendations(scores: ProcessScore[]): Recommendation[] {
  return getTopLossProcesses(scores, 3).map((s) => {
    const bank = RECOMMENDATION_BANK[s.processId];
    return {
      processId: s.processId,
      title: bank.title,
      description: bank.description,
      impact: bank.impact,
    };
  });
}

export function buildResult(
  processPercents: Record<ProcessId, number>,
  input: PreAuditInput,
  answeredCount: number,
  totalQuestions: number,
  auditLevel: 1 | 2 | 3,
): AuditResult {
  const sector = getSector(input.sectorId);
  const benches = getProcessBenchmarks(input.sectorId);
  const cogs = Math.max(0.05, Math.min(0.95, input.cogsPercent / 100));
  const revenue = Math.max(0, input.annualRevenueEur);

  const processScores: ProcessScore[] = PROCESSES.map((p) => {
    const userPct = processPercents[p.id] ?? 0;
    const smePct = benches[p.id].sme;
    const wcPct = benches[p.id].wc;
    const costBase = revenue * cogs * p.costFactor;
    const gapSme = costBase * Math.max(0, (smePct - userPct) / 100);
    const gapWc =
      costBase * Math.max(0, (wcPct - userPct) / 100) * p.wcMultiplier;

    return {
      processId: p.id,
      label: p.label,
      shortLabel: p.shortLabel,
      percent: userPct,
      smePercent: smePct,
      wcPercent: wcPct,
      gapSmeEur: Math.round(gapSme),
      gapWcEur: Math.round(gapWc),
      costBaseEur: Math.round(costBase),
      costFactor: p.costFactor,
    };
  });

  const weighted = (fn: (ps: ProcessScore) => number) =>
    Math.round(
      processScores.reduce((acc, ps) => {
        const w = PROCESSES.find((p) => p.id === ps.processId)!.weight;
        return acc + w * fn(ps);
      }, 0) * 10,
    ) / 10;

  const overallPercent = weighted((ps) => ps.percent);
  const smeOverallPercent = weighted((ps) => ps.smePercent);
  const wcOverallPercent = weighted((ps) => ps.wcPercent);
  const gapSmeEur = processScores.reduce((a, p) => a + p.gapSmeEur, 0);
  const gapWcEur = processScores.reduce((a, p) => a + p.gapWcEur, 0);

  const criticalRaw = getTopLossProcesses(processScores, 1)[0];
  const bank = RECOMMENDATION_BANK[criticalRaw.processId];

  const criticalProcess: CriticalProcess = {
    processId: criticalRaw.processId,
    label: criticalRaw.label,
    shortLabel: criticalRaw.shortLabel,
    gapWcEur: criticalRaw.gapWcEur,
    gapSmeEur: criticalRaw.gapSmeEur,
    userPercent: criticalRaw.percent,
    smePercent: criticalRaw.smePercent,
    wcPercent: criticalRaw.wcPercent,
    reason: bank.reason,
  };

  return {
    overallPercent,
    smeOverallPercent,
    wcOverallPercent,
    processScores,
    gapSmeEur,
    gapWcEur,
    financialGapEur: gapWcEur,
    criticalProcess,
    recommendations: buildRecommendations(processScores),
    answeredCount,
    totalQuestions,
    sectorId: input.sectorId,
    sectorLabel: sector.label,
    annualRevenueEur: revenue,
    cogsPercent: input.cogsPercent,
    auditLevel,
  };
}

/** Level 1 — direct answers on 20 parent questions. */
export function calculateAuditResult(
  answers: AuditAnswers,
  input: PreAuditInput,
): AuditResult {
  const processPercents = Object.fromEntries(
    PROCESSES.map((p) => [
      p.id,
      processPercentFromParentScores(p.id, (parentId) => {
        const s = answers[parentId];
        return s === undefined ? null : s;
      }),
    ]),
  ) as Record<ProcessId, number>;

  const answeredCount = LEVEL1_QUESTIONS.filter(
    (q) => answers[q.id] !== undefined,
  ).length;

  return buildResult(
    processPercents,
    input,
    answeredCount,
    LEVEL1_QUESTIONS.length,
    1,
  );
}

export function formatEur(n: number): string {
  return formatEuroRounded(n);
}

export {
  computeTotalEfficiency,
  computeWeightedProcessPercent,
  hasNumericVdaMapper,
  mapNumericValueToVdaScore,
  numericInputsToVdaAnswers,
  verifyCalculationEngine,
} from "./calculationEngine";
