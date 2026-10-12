import type { PublishedKpiKey } from "@/config/benchmarks";

export type ProcessId = "P1" | "P2" | "P3" | "P4" | "P5";

/** Internal VDA 6.3 score — never rendered in the quiz UI. */
export type VdaScore = 0 | 4 | 6 | 8 | 10;

export type OptionKey = "A" | "B" | "C" | "D" | "E";

export type SectorId =
  | "automotive"
  | "ems"
  | "plastics"
  | "food"
  | "metal"
  | "pharma"
  | "packaging"
  | "general";

export interface ProcessPillar {
  id: ProcessId;
  label: string;
  shortLabel: string;
  description: string;
  weight: number;
  costFactor: number;
  wcMultiplier: number;
}

export interface QualitativeOption {
  key: OptionKey;
  /** Visible text only — no scores or numeric thresholds. */
  label: string;
  /** Silent internal mapping. */
  score: VdaScore;
}

/** Metodika MSP SR v1.0 — typ vstupu otázky. */
export type InputType = "NUMERIC_INPUT" | "MATURITY_SCALE";

export type QuestionSeverity = "Minor" | "Major" | "Critical (*)";

/** VDA pásma pre numerické mapovanie (interné; UI zatiaľ nezobrazuje). */
export interface NumericScoreMapping {
  score0: string;
  score4: string;
  score6: string;
  score8: string;
  score10: string;
}

export interface MaturityOptionData {
  scoreInternal: VdaScore;
  label: string;
}

/**
 * Level 1 otázka — metodika self-auditu procesnej excelentnosti · MSP SR v1.0.
 * Polia `text` / `helpText` / `options` / `processId` zostávajú pre existujúce UI.
 */
export interface AuditQuestion {
  id: string;
  processId: ProcessId;
  /** Alias processId (metodika: processCode). */
  processCode: ProcessId;
  category: string;
  /** UI / scoring. */
  text: string;
  /** Metodika: questionText (rovnaký obsah ako text). */
  questionText: string;
  /** UI helper. */
  helpText: string;
  /** Metodika: „Meranie odhaľuje…“ */
  targetExplanation: string;
  methodology: string;
  inputType: InputType;
  /** w_q ∈ {1..5} */
  weight: 1 | 2 | 3 | 4 | 5;
  severity: QuestionSeverity;
  /** Kvalitatívne A–E pre aktuálne UI (bez viditeľných skóre). */
  options: QualitativeOption[];
  numericUnit?: string;
  /**
   * Set only when this exact-input question's unit and definition match a
   * published KPI. Unmapped questions stay out of the reference table.
   */
  kpiKey?: PublishedKpiKey;
  numericMapping?: NumericScoreMapping;
  maturityOptions?: MaturityOptionData[];
  benchmarkSme: number | string;
  benchmarkWc: number | string;
}

/** Explicitný alias pre dátový modul (STEP 1). */
export type AuditQuestionData = AuditQuestion;

export interface Level2Question {
  id: string;
  parentId: string;
  processId: ProcessId;
  text: string;
  /** Kam otázka smeruje (Cieľ) */
  goal: string;
  /** Použitá metodika */
  methodology: string;
  /** Metóda overenia (Gemba) */
  verification: string;
  options: QualitativeOption[];
}

export type Dimension6M =
  | "MAN"
  | "MACHINE"
  | "MATERIAL"
  | "METHOD"
  | "MEASUREMENT"
  | "ENVIRONMENT";

export interface Level3Question {
  id: string;
  parentL2Id: string;
  parentL1Id: string;
  processId: ProcessId;
  dimension6M: Dimension6M;
  text: string;
  goal: string;
  methodology: string;
  verification: string;
  options: QualitativeOption[];
  /** Coefficient for DTO simulation (0.1–1.0) */
  costImpactFactor: number;
  /** Baseline implementation cost for ROI (€) */
  estimatedImplementationCostEuro: number;
}

export interface DtoSimulationState {
  /** Per L3 question: simulated score override (undefined = use actual answer) */
  overrides: Record<string, VdaScore>;
  plannedHoursPerYear: number;
}

export interface AuditAnswers {
  [questionId: string]: VdaScore;
}

/**
 * Hybrid assessment payload (L1): qualitative card + optional numeric override.
 * `answers[id]` always mirrors `finalEvaluatedScore` for the scoring engine.
 */
export interface AnswerState {
  questionId: string;
  selectedCardScore: VdaScore;
  numericOverrideValue?: number;
  finalEvaluatedScore: VdaScore;
  withRotation?: boolean;
}

export type AnswerDetailsMap = Record<string, AnswerState>;

export interface PreAuditInput {
  sectorId: SectorId;
  annualRevenueEur: number;
  cogsPercent: number;
}

export interface ProcessBenchmark {
  processId: ProcessId;
  smePercent: number;
  wcPercent: number;
}

export interface ProcessScore {
  processId: ProcessId;
  label: string;
  shortLabel: string;
  /** User process efficiency 0–100 (internal). */
  percent: number;
  smePercent: number;
  wcPercent: number;
  gapSmeEur: number;
  gapWcEur: number;
  costBaseEur: number;
}

export interface Recommendation {
  processId: ProcessId;
  title: string;
  description: string;
  impact: "vysoký" | "stredný" | "nízky";
}

export interface CriticalProcess {
  processId: ProcessId;
  label: string;
  shortLabel: string;
  gapWcEur: number;
  gapSmeEur: number;
  userPercent: number;
  smePercent: number;
  wcPercent: number;
  reason: string;
}

export interface AuditResult {
  overallPercent: number;
  smeOverallPercent: number;
  wcOverallPercent: number;
  processScores: ProcessScore[];
  gapSmeEur: number;
  gapWcEur: number;
  /** @deprecated use gapWcEur — kept for lead payload compatibility */
  financialGapEur: number;
  criticalProcess: CriticalProcess;
  recommendations: Recommendation[];
  answeredCount: number;
  totalQuestions: number;
  sectorId: SectorId;
  sectorLabel: string;
  annualRevenueEur: number;
  cogsPercent: number;
  auditLevel: 1 | 2 | 3;
}

export interface LeadPayload {
  full_name: string;
  work_email: string;
  company_name: string;
  phone: string;
  gdpr_consent: boolean;
  /** Set only when FOLLOWUP_CONSENT_ENABLED; column is in the unapplied migration. */
  followup_consent?: boolean;
  followup_consent_at?: string | null;
  overall_score: number;
  financial_gap_eur: number;
  gap_sme_eur: number;
  gap_wc_eur: number;
  sector_id: SectorId;
  annual_revenue_eur: number;
  cogs_percent: number;
  critical_process_id: ProcessId;
  process_scores: ProcessScore[];
  recommendations: Recommendation[];
  answers: AuditAnswers;
  audit_level: 1 | 2 | 3;
}
