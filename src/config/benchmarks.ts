/**
 * Benchmark source metadata for UI copy, plus the sourced KPI reference loader.
 * Model scores (S_SME / S_WC) stay in `src/lib/audit/benchmarks.ts` and are not edited here.
 * TODO(owner): confirm source classification / citations when published.
 */

import referenceJson from "./benchmarks.reference.json";

export type BenchmarkSource =
  | { kind: "expert-estimate" }
  | { kind: "published"; citation: string };

export const BENCHMARK_SOURCE: BenchmarkSource = {
  kind: "expert-estimate",
};

export const EXPERT_ESTIMATE_SOURCE_SK =
  "Referenčné hodnoty MSP sú interné referencie AVENG založené na expertnom odhade, nie oficiálna štatistika.";

export const PUBLISHED_REFERENCE_SOURCE_SK =
  "Referencie sú medzinárodné orientačné hodnoty z verejných zdrojov (napr. ASQ, IISE, Vorne/OEE.com). Pre Slovensko verejný procesný benchmark nie je k dispozícii. Hodnoty sa líšia podľa odvetvia a spôsobu merania.";

export function benchmarkSourceNoteSk(): string {
  if (BENCHMARK_SOURCE.kind === "published") {
    return `Zdroj referencie: ${BENCHMARK_SOURCE.citation}.`;
  }
  return EXPERT_ESTIMATE_SOURCE_SK;
}

export const PUBLISHED_KPI_KEYS = [
  "oee_pct",
  "copq_pct_of_sales",
  "otd_pct",
  "schedule_adherence_pct",
] as const;

export type PublishedKpiKey = (typeof PUBLISHED_KPI_KEYS)[number];

/** Process domains whose S_SME / S_WC come from the existing model. */
export type ModelReferenceDomain = "P1" | "P2" | "P3" | "P4" | "P5";

export type ReferenceStatusKey = ModelReferenceDomain | PublishedKpiKey;

export type ReferenceSourceStatus = "published-secondary" | "expert-estimate";

export interface BenchmarkCitation {
  name: string;
  url: string;
  type: string;
}

export type BenchmarkDirection = "higher-better" | "lower-better";

export type BenchmarkConfidence = "medium" | "medium-low" | "low";

interface KpiReferenceBase {
  labelSk: string;
  unit: string;
  direction: BenchmarkDirection;
  confidence: BenchmarkConfidence;
  definitionNote: string;
  sources: BenchmarkCitation[];
}

export interface OeeKpiReference extends KpiReferenceBase {
  key: "oee_pct";
  ranges: {
    typical: number;
    discreteAverageRange: readonly [number, number];
    topQuartile: number;
    worldClass: number;
    worldClassBySectorRange: readonly [number, number];
  };
}

export interface CopqKpiReference extends KpiReferenceBase {
  key: "copq_pct_of_sales";
  ranges: {
    typical: number;
    range: readonly [number, number];
    asqQualityRelatedCostsRange: readonly [number, number];
    worldClassBelow: number;
  };
}

export interface OtdKpiReference extends KpiReferenceBase {
  key: "otd_pct";
  ranges: {
    averageRange: readonly [number, number];
    worldClassRange: readonly [number, number];
    automotiveOemScorecardRange: readonly [number, number];
  };
}

export interface ScheduleAdherenceKpiReference extends KpiReferenceBase {
  key: "schedule_adherence_pct";
  kind: string;
  ranges: {
    goodThresholdRange: readonly [number, number];
  };
}

export type KpiReference =
  | OeeKpiReference
  | CopqKpiReference
  | OtdKpiReference
  | ScheduleAdherenceKpiReference;

function isPublishedKpiKey(key: string): key is PublishedKpiKey {
  return (PUBLISHED_KPI_KEYS as readonly string[]).includes(key);
}

function asPair(
  value: readonly number[],
  id: string,
): readonly [number, number] {
  if (
    value.length !== 2 ||
    !Number.isFinite(value[0]) ||
    !Number.isFinite(value[1])
  ) {
    throw new Error(`Invalid benchmark range: ${id}`);
  }
  return [value[0], value[1]];
}

function asDirection(value: string, key: string): BenchmarkDirection {
  if (value === "higher-better" || value === "lower-better") return value;
  throw new Error(`Invalid benchmark direction for ${key}`);
}

function asConfidence(value: string, key: string): BenchmarkConfidence {
  if (value === "medium" || value === "medium-low" || value === "low") {
    return value;
  }
  throw new Error(`Invalid benchmark confidence for ${key}`);
}

function citations(
  sources: readonly { name: string; url: string; type: string }[],
): BenchmarkCitation[] {
  return sources.map((source) => ({
    name: source.name,
    url: source.url,
    type: source.type,
  }));
}

/** False for `hr_skills` and for any key that is not one of the four published KPIs. */
export function isBenchmarkAvailable(key: string): boolean {
  if (key === "hr_skills") return false;
  return isPublishedKpiKey(key);
}

/** Value ranges for a published KPI. `hr_skills` and unknown keys return null. */
export function getKpiReference(key: string): KpiReference | null {
  if (!isPublishedKpiKey(key)) return null;

  const kpis = referenceJson.kpis;

  switch (key) {
    case "oee_pct": {
      const kpi = kpis.oee_pct;
      return {
        key,
        labelSk: kpi.label_sk,
        unit: kpi.unit,
        direction: asDirection(kpi.direction, key),
        confidence: asConfidence(kpi.confidence, key),
        definitionNote: kpi.definitionNote,
        sources: citations(kpi.sources),
        ranges: {
          typical: kpi.typical,
          discreteAverageRange: asPair(
            kpi.discreteAverageRange,
            "discreteAverageRange",
          ),
          topQuartile: kpi.topQuartile,
          worldClass: kpi.worldClass,
          worldClassBySectorRange: asPair(
            kpi.worldClassBySectorRange,
            "worldClassBySectorRange",
          ),
        },
      };
    }
    case "copq_pct_of_sales": {
      const kpi = kpis.copq_pct_of_sales;
      return {
        key,
        labelSk: kpi.label_sk,
        unit: kpi.unit,
        direction: asDirection(kpi.direction, key),
        confidence: asConfidence(kpi.confidence, key),
        definitionNote: kpi.definitionNote,
        sources: citations(kpi.sources),
        ranges: {
          typical: kpi.typical,
          range: asPair(kpi.range, "range"),
          asqQualityRelatedCostsRange: asPair(
            kpi.asqQualityRelatedCostsRange,
            "asqQualityRelatedCostsRange",
          ),
          worldClassBelow: kpi.worldClassBelow,
        },
      };
    }
    case "otd_pct": {
      const kpi = kpis.otd_pct;
      return {
        key,
        labelSk: kpi.label_sk,
        unit: kpi.unit,
        direction: asDirection(kpi.direction, key),
        confidence: asConfidence(kpi.confidence, key),
        definitionNote: kpi.definitionNote,
        sources: citations(kpi.sources),
        ranges: {
          averageRange: asPair(kpi.averageRange, "averageRange"),
          worldClassRange: asPair(kpi.worldClassRange, "worldClassRange"),
          automotiveOemScorecardRange: asPair(
            kpi.automotiveOemScorecardRange,
            "automotiveOemScorecardRange",
          ),
        },
      };
    }
    case "schedule_adherence_pct": {
      const kpi = kpis.schedule_adherence_pct;
      return {
        key,
        labelSk: kpi.label_sk,
        unit: kpi.unit,
        direction: asDirection(kpi.direction, key),
        confidence: asConfidence(kpi.confidence, key),
        definitionNote: kpi.definitionNote,
        sources: citations(kpi.sources),
        kind: kpi.kind,
        ranges: {
          goodThresholdRange: asPair(
            kpi.goodThresholdRange,
            "goodThresholdRange",
          ),
        },
      };
    }
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

/**
 * Model domains (S_SME / S_WC) stay `expert-estimate`.
 * `published-secondary` is only the four KPI keys in the reference JSON.
 */
export function getReferenceSourceStatus(): Record<
  ReferenceStatusKey,
  ReferenceSourceStatus
> {
  return {
    P1: "expert-estimate",
    P2: "expert-estimate",
    P3: "expert-estimate",
    P4: "expert-estimate",
    P5: "expert-estimate",
    oee_pct: "published-secondary",
    copq_pct_of_sales: "published-secondary",
    otd_pct: "published-secondary",
    schedule_adherence_pct: "published-secondary",
  };
}

/** One sentence per source kind actually used. Both, when the result uses both. */
export function referenceSourceNotesSk(
  keys: readonly ReferenceStatusKey[],
): string[] {
  const status = getReferenceSourceStatus();
  let expert = false;
  let published = false;
  for (const key of keys) {
    if (status[key] === "expert-estimate") expert = true;
    if (status[key] === "published-secondary") published = true;
  }
  const notes: string[] = [];
  if (expert) notes.push(EXPERT_ESTIMATE_SOURCE_SK);
  if (published) notes.push(PUBLISHED_REFERENCE_SOURCE_SK);
  return notes;
}
