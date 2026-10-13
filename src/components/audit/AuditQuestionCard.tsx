"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  hasNumericVdaMapper,
  mapNumericValueToVdaScore,
} from "@/lib/audit/calculationEngine";
import { describeMappedMaturity } from "@/lib/audit/maturityLabels";
import type {
  AnswerState,
  AuditQuestion,
  QualitativeOption,
  VdaScore,
} from "@/lib/audit/types";

/** WAI-ARIA radiogroup: arrow/Home/End move focus and select. */
function onAnswerCardKeyDown(
  e: KeyboardEvent<HTMLButtonElement>,
  index: number,
  length: number,
) {
  const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
  if (!keys.includes(e.key)) return;
  e.preventDefault();
  const group = e.currentTarget.closest('[role="radiogroup"]');
  if (!group) return;
  const radios = Array.from(
    group.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
  );
  let next = index;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    next = (index + 1) % length;
  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    next = (index - 1 + length) % length;
  } else if (e.key === "Home") {
    next = 0;
  } else if (e.key === "End") {
    next = length - 1;
  }
  radios[next]?.focus();
  radios[next]?.click();
}

interface Props {
  question: AuditQuestion;
  answer?: AnswerState;
  onAnswer: (state: AnswerState, advance: boolean) => void;
}

export default function AuditQuestionCard({
  question,
  answer,
  onAnswer,
}: Props) {
  const supportsNumeric = hasNumericVdaMapper(question.id);
  /** Collapsed by default; expands when user already saved a numeric override */
  const [overrideOpen, setOverrideOpen] = useState(
    answer?.numericOverrideValue !== undefined,
  );
  const [draft, setDraft] = useState(
    answer?.numericOverrideValue !== undefined
      ? String(answer.numericOverrideValue)
      : "",
  );
  const [localRotation, setLocalRotation] = useState(
    Boolean(answer?.withRotation),
  );

  const parsed = useMemo(() => {
    const trimmed = String(draft).trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }, [draft]);

  const mappedOverride = useMemo(() => {
    if (parsed === undefined || !supportsNumeric) return null;
    try {
      return mapNumericValueToVdaScore(question.id, parsed, {
        withRotation: localRotation,
      });
    } catch {
      return null;
    }
  }, [parsed, question.id, localRotation, supportsNumeric]);

  const indicator =
    mappedOverride !== null
      ? describeMappedMaturity(mappedOverride, question.numericMapping)
      : null;

  function emit(
    cardScore: VdaScore,
    advance: boolean,
    numeric?: number,
  ) {
    const numericOverrideValue =
      numeric !== undefined && Number.isFinite(numeric) ? numeric : undefined;
    const finalEvaluatedScore =
      numericOverrideValue !== undefined && mappedOverride !== null
        ? mappedOverride
        : numericOverrideValue !== undefined && supportsNumeric
          ? mapNumericValueToVdaScore(question.id, numericOverrideValue, {
              withRotation: localRotation,
            })
          : cardScore;

    onAnswer(
      {
        questionId: question.id,
        selectedCardScore: cardScore,
        numericOverrideValue,
        finalEvaluatedScore,
        withRotation:
          question.id === "L1-P5-Q4" ? localRotation : undefined,
      },
      advance,
    );
  }

  function onSelectCard(opt: QualitativeOption) {
    // Card path ignores leftover draft — user explicitly chose estimate
    emit(opt.score, true, undefined);
  }

  function applyNumericOverride() {
    if (parsed === undefined || mappedOverride === null) return;
    const cardBaseline = answer?.selectedCardScore ?? mappedOverride;
    emit(cardBaseline, true, parsed);
  }

  const anyCardSelected = question.options.some(
    (opt) => answer?.selectedCardScore === opt.score,
  );

  const cardsBlock = (
    <div
      className="grid gap-3"
      role="radiogroup"
      aria-label="Vyberte najvýstižnejší popis"
    >
      {question.options.map((opt, index) => {
        const selected =
          answer?.selectedCardScore === opt.score &&
          answer?.numericOverrideValue === undefined;
        const selectedViaOverride =
          answer?.selectedCardScore === opt.score &&
          answer?.numericOverrideValue !== undefined;
        const checked = selected || selectedViaOverride;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked || (!anyCardSelected && index === 0) ? 0 : -1}
            onClick={() => onSelectCard(opt)}
            onKeyDown={(e) =>
              onAnswerCardKeyDown(e, index, question.options.length)
            }
            className={`rounded-md border px-4 py-3.5 text-left text-sm leading-relaxed transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright ${
              checked
                ? "border-signal bg-signal/20 text-ink-50 shadow-signal"
                : "border-white/10 bg-ink-900/60 text-ink-100 hover:border-signal/50 hover:bg-white/5"
            }`}
          >
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-ink-300">
              Možnosť {opt.key}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  if (!supportsNumeric) {
    return <div className="space-y-4">{cardsBlock}</div>;
  }

  return (
    <div className="space-y-3">
      {/* 1) Preferred: exact numeric value first */}
      <div
        className={`rounded-md border border-signal/40 bg-signal/[0.08] shadow-[inset_3px_0_0_0_rgba(91,147,255,0.65)] transition ${
          overrideOpen
            ? "border-signal/55 bg-signal/[0.12]"
            : "hover:border-signal/55 hover:bg-signal/[0.11]"
        }`}
      >
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
          aria-expanded={overrideOpen}
          onClick={() => setOverrideOpen((v) => !v)}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-signal/20 text-sm text-signal-bright ring-1 ring-signal/30"
            aria-hidden
          >
            #
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink-50">
                Poznáte presné číslo?
              </span>
              <span className="rounded border border-signal/45 bg-signal/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-signal-bright">
                Preferované
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-ink-200">
              {question.numericUnit
                ? `Presné ${question.numericUnit} zvýšia spoľahlivosť výsledku.`
                : "Presná hodnota zvýši spoľahlivosť výsledku."}
            </span>
          </span>
          {overrideOpen ? (
            <ChevronDown
              className="h-4 w-4 shrink-0 text-signal-bright"
              aria-hidden
            />
          ) : (
            <ChevronRight
              className="h-4 w-4 shrink-0 text-signal-bright"
              aria-hidden
            />
          )}
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            overrideOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 border-t border-signal/20 px-4 py-3">
              <p className="text-xs leading-relaxed text-ink-200">
                Preferujeme namerané hodnoty — výpočet je potom presnejší.
              </p>

              <label className="block">
                <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-medium text-ink-100">
                  <span>Presná hodnota</span>
                  {question.numericUnit && (
                    <span className="rounded border border-signal/45 bg-signal/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-signal-bright">
                      {question.numericUnit}
                    </span>
                  )}
                </span>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyNumericOverride();
                      }
                    }}
                    className="w-full rounded-md border border-signal/30 bg-ink-950 px-3 py-2.5 pr-14 text-base font-semibold tabular-nums text-ink-50 outline-none transition focus:border-signal focus:ring-1 focus:ring-signal/40"
                    aria-label={`Preferované presné číslo (${question.numericUnit ?? ""})`}
                    placeholder="—"
                  />
                  {question.numericUnit && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-signal-bright/80">
                      {question.numericUnit}
                    </span>
                  )}
                </div>
              </label>

              <div
                className="min-h-[2.75rem] rounded-md border border-white/10 bg-ink-950/70 px-3 py-2"
                aria-live="polite"
              >
                {indicator ? (
                  <p className="text-sm text-ink-100">
                    <span className="text-xs text-ink-300">Mapované na: </span>
                    <span className="font-medium text-signal-bright">
                      {indicator}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-ink-300">
                    Po zadaní čísla sa zobrazí pásmo zrelosti (bez bodov).
                  </p>
                )}
              </div>

              {question.id === "L1-P5-Q4" &&
                parsed !== undefined &&
                parsed > 3 && (
                  <label className="flex items-start gap-2 text-xs text-ink-200">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-signal"
                      checked={localRotation}
                      onChange={(e) => setLocalRotation(e.target.checked)}
                    />
                    <span>
                      Zahŕňa systematickú rotáciu na všetkých staniciach
                    </span>
                  </label>
                )}

              <button
                type="button"
                className="btn-primary !text-xs"
                disabled={mappedOverride === null}
                onClick={applyNumericOverride}
              >
                Použiť číslo a pokračovať
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2) Fallback note (tight under numeric) + A–E cards */}
      <div className="space-y-3">
        <p className="-mt-0.5 px-0.5 text-sm leading-snug text-ink-200">
          Ak nepoznáte presné číslo, zvoľte jednu z nasledujúcich možností:
        </p>
        <div className="pt-2">{cardsBlock}</div>
      </div>
    </div>
  );
}
