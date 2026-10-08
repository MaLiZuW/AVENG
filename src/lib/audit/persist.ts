import type {
  AnswerDetailsMap,
  AuditAnswers,
  PreAuditInput,
} from "./types";

export const AUDIT_STORAGE_KEY = "aveng_audit_progress";

export type AuditPhase = "intro" | "setup" | "quiz" | "results";

export interface PersistedAuditState {
  version: 2;
  level: 1 | 2 | 3;
  phase: AuditPhase;
  step: number;
  /** Final scores for scoring engine */
  answers: AuditAnswers;
  /** Hybrid card + optional numeric detail (L1) */
  answerDetails: AnswerDetailsMap;
  /** @deprecated kept for v1 migration */
  numericRaw?: Record<string, number>;
  multiSkillRotation?: boolean;
  preAudit: PreAuditInput | null;
  updatedAt: string;
}

function migrateV1(raw: Record<string, unknown>): PersistedAuditState | null {
  const answers = (raw.answers ?? {}) as AuditAnswers;
  const numericRaw = (raw.numericRaw ?? {}) as Record<string, number>;
  const details: AnswerDetailsMap = {};
  for (const [id, score] of Object.entries(answers)) {
    details[id] = {
      questionId: id,
      selectedCardScore: score,
      numericOverrideValue: numericRaw[id],
      finalEvaluatedScore: score,
      withRotation:
        id === "L1-P5-Q4" ? Boolean(raw.multiSkillRotation) : undefined,
    };
  }
  return {
    version: 2,
    level: (raw.level as 1 | 2 | 3) ?? 1,
    phase: raw.phase as AuditPhase,
    step: Number(raw.step) || 0,
    answers,
    answerDetails: details,
    preAudit: (raw.preAudit as PreAuditInput | null) ?? null,
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  };
}

export function loadAuditProgress(): PersistedAuditState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedAuditState & { version?: number };
    if (!data?.phase || data.phase === "intro") return null;

    let state: PersistedAuditState;
    if (data.version === 2) {
      state = data;
    } else if (data.version === 1 || !data.version) {
      const migrated = migrateV1(data as unknown as Record<string, unknown>);
      if (!migrated) return null;
      state = migrated;
    } else {
      return null;
    }

    const hasWork =
      Object.keys(state.answers ?? {}).length > 0 ||
      state.preAudit != null ||
      state.phase === "setup" ||
      state.phase === "quiz" ||
      state.phase === "results";
    return hasWork ? state : null;
  } catch {
    return null;
  }
}

export function saveAuditProgress(
  state: Omit<PersistedAuditState, "version" | "updatedAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedAuditState = {
      ...state,
      version: 2,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function clearAuditProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasResumableProgress(
  state: PersistedAuditState | null,
): boolean {
  if (!state) return false;
  return (
    state.phase === "quiz" ||
    state.phase === "results" ||
    state.phase === "setup" ||
    Object.keys(state.answers).length > 0
  );
}
