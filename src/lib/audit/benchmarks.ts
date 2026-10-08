import type { ProcessId, ProcessPillar, SectorId } from "./types";

/**
 * Benchmark provenance for UI copy.
 * TODO(owner): upgrade to "published" + citation when sources are approved.
 */
export const BENCHMARK_SOURCE: "expert-estimate" | "published" =
  "expert-estimate";

export const BENCHMARK_CITATION: string | null = null;

export const PROCESSES: ProcessPillar[] = [
  {
    id: "P1",
    label: "Riadenie výroby a plánovanie",
    shortLabel: "Plánovanie",
    description: "MPS/MRP, pull/Kanban, lead time a stabilita plánu.",
    weight: 0.18,
    costFactor: 0.15,
    wcMultiplier: 1.4,
  },
  {
    id: "P2",
    label: "Údržba a dostupnosť zariadení",
    shortLabel: "Údržba/OEE",
    description: "OEE, TPM, preventívna údržba a redukcia prestojov.",
    weight: 0.22,
    costFactor: 0.2,
    wcMultiplier: 1.6,
  },
  {
    id: "P3",
    label: "Kvalita a riadenie nezhôd",
    shortLabel: "Kvalita/COPQ",
    description: "COPQ, DPMO, kontrolný plán a reklamácie.",
    weight: 0.25,
    costFactor: 0.25,
    wcMultiplier: 1.8,
  },
  {
    id: "P4",
    label: "Logistika a tok materiálu",
    shortLabel: "Logistika/OTD",
    description: "OTD, obrátkovosť zásob, VSM a spoľahlivosť dodávateľov.",
    weight: 0.2,
    costFactor: 0.15,
    wcMultiplier: 1.5,
  },
  {
    id: "P5",
    label: "Ľudské zdroje a kompetencie",
    shortLabel: "HR/Skills",
    description: "Kompetencie, absencia, Kaizen a viaczručnosť.",
    weight: 0.15,
    costFactor: 0.1,
    wcMultiplier: 1.4,
  },
];

export interface SectorDef {
  id: SectorId;
  label: string;
  oee: { sme: number; wc: number };
  copq: { sme: number; wc: number };
  dpmo: { sme: number; wc: number };
  otd: { sme: number; wc: number };
  turns: { sme: number; wc: number };
  absence: { sme: number; wc: number };
}

export const SECTORS: SectorDef[] = [
  {
    id: "automotive",
    label: "Automotive (Automobilový priemysel)",
    oee: { sme: 65, wc: 86 },
    copq: { sme: 5.0, wc: 0.5 },
    dpmo: { sme: 6210, wc: 233 },
    otd: { sme: 92.0, wc: 99.5 },
    turns: { sme: 6, wc: 12 },
    absence: { sme: 5.0, wc: 2.5 },
  },
  {
    id: "ems",
    label: "Elektronika / EMS (Electronics Manufacturing Services)",
    oee: { sme: 70, wc: 88 },
    copq: { sme: 4.0, wc: 0.4 },
    dpmo: { sme: 6210, wc: 233 },
    otd: { sme: 93.0, wc: 99.0 },
    turns: { sme: 8, wc: 15 },
    absence: { sme: 5.0, wc: 2.5 },
  },
  {
    id: "plastics",
    label: "Plasty a kaučuk (Plastics & Rubber)",
    oee: { sme: 63, wc: 86 },
    copq: { sme: 6.0, wc: 0.8 },
    dpmo: { sme: 10000, wc: 500 },
    otd: { sme: 90.0, wc: 98.5 },
    turns: { sme: 5, wc: 11 },
    absence: { sme: 6.0, wc: 3.0 },
  },
  {
    id: "food",
    label: "Potravinárstvo (Food & Beverage)",
    oee: { sme: 58, wc: 83 },
    copq: { sme: 7.0, wc: 1.0 },
    dpmo: { sme: 15000, wc: 700 },
    otd: { sme: 88.0, wc: 98.0 },
    turns: { sme: 10, wc: 20 },
    absence: { sme: 7.0, wc: 3.5 },
  },
  {
    id: "metal",
    label: "Kovospracovanie a strojárstvo (Metalworking & Machinery)",
    oee: { sme: 60, wc: 82 },
    copq: { sme: 7.0, wc: 1.2 },
    dpmo: { sme: 15000, wc: 1000 },
    otd: { sme: 87.0, wc: 97.0 },
    turns: { sme: 4, wc: 10 },
    absence: { sme: 6.0, wc: 3.0 },
  },
  {
    id: "pharma",
    label: "Farmácia a chémia (Pharma & Chemicals)",
    oee: { sme: 62, wc: 84 },
    copq: { sme: 5.0, wc: 0.6 },
    dpmo: { sme: 6210, wc: 100 },
    otd: { sme: 93.0, wc: 99.0 },
    turns: { sme: 4, wc: 8 },
    absence: { sme: 5.0, wc: 2.5 },
  },
  {
    id: "packaging",
    label: "Obaly a tlač (Packaging & Printing)",
    oee: { sme: 60, wc: 83 },
    copq: { sme: 6.0, wc: 1.0 },
    dpmo: { sme: 10000, wc: 700 },
    otd: { sme: 90.0, wc: 98.5 },
    turns: { sme: 7, wc: 14 },
    absence: { sme: 6.0, wc: 3.0 },
  },
  {
    id: "general",
    label: "Všeobecná priemyselná výroba (General Manufacturing)",
    oee: { sme: 62, wc: 85 },
    copq: { sme: 6.0, wc: 1.0 },
    dpmo: { sme: 10000, wc: 233 },
    otd: { sme: 88.0, wc: 98.5 },
    turns: { sme: 5, wc: 12 },
    absence: { sme: 6.0, wc: 3.0 },
  },
];

export function getSector(id: SectorId): SectorDef {
  return SECTORS.find((s) => s.id === id) ?? SECTORS[SECTORS.length - 1];
}

/**
 * Map sector KPIs → process efficiency baselines (0–100),
 * aligned with AVENG methodology (PDF §1.1–1.2).
 */
export function getProcessBenchmarks(
  sectorId: SectorId,
): Record<ProcessId, { sme: number; wc: number }> {
  const s = getSector(sectorId);
  const clamp = (n: number) => Math.max(30, Math.min(99.5, Math.round(n * 10) / 10));

  return {
    // Planning reliability proxied from OTD vs general baseline (88 / 98.5)
    P1: {
      sme: clamp(72 * (s.otd.sme / 88)),
      wc: clamp(95 * (s.otd.wc / 98.5)),
    },
    P2: {
      sme: clamp(s.oee.sme),
      wc: clamp(s.oee.wc),
    },
    // COPQ % → quality maturity (Automotive 5%/0.5% → ~82 / ~97)
    P3: {
      sme: clamp(100 - s.copq.sme * 3.6),
      wc: clamp(100 - s.copq.wc * 6),
    },
    P4: {
      sme: clamp(s.otd.sme),
      wc: clamp(s.otd.wc),
    },
    // Absence % → people maturity (5%/2.5% → ~65 / ~92)
    P5: {
      sme: clamp(100 - s.absence.sme * 7),
      wc: clamp(100 - s.absence.wc * 3.2),
    },
  };
}
