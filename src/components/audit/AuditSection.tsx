"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Info } from "lucide-react";
import Link from "next/link";
import { domainLabel } from "@/config/audit-display";
import { AUDIT_LEVELS, levelTitle, SELF_AUDIT_HEADER_SK } from "@/config/levels";
import { auditStartNoticeSk } from "@/config/retention";
import {
  clearAuditProgress,
  hasResumableProgress,
  loadAuditProgress,
  saveAuditProgress,
  type AuditPhase,
  type PersistedAuditState,
} from "@/lib/audit/persist";
import { LEVEL1_QUESTIONS, PROCESSES } from "@/lib/audit/questions";
import { calculateAuditResult } from "@/lib/audit/scoring";
import type {
  AnswerDetailsMap,
  AnswerState,
  AuditAnswers,
  AuditQuestion,
  AuditResult,
  Level2Question,
  Level3Question,
  PreAuditInput,
  QualitativeOption,
} from "@/lib/audit/types";
import AuditQuestionCard from "./AuditQuestionCard";
import { Level2Gate, Level3Gate } from "./Level2Gate";
import PreAuditForm from "./PreAuditForm";
import QuestionContextPanel from "./QuestionContextPanel";
import QuestionGuidance from "./QuestionGuidance";
import ResultsDashboard from "./ResultsDashboard";
import ResumeBanner from "./ResumeBanner";

type AuditLevel = 1 | 2 | 3;
type Phase = AuditPhase;

type DimLabels = Record<string, string>;

export default function AuditSection() {
  const [level, setLevel] = useState<AuditLevel>(1);
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AuditAnswers>({});
  const [answerDetails, setAnswerDetails] = useState<AnswerDetailsMap>({});
  const [preAudit, setPreAudit] = useState<PreAuditInput | null>(null);
  const [resumeOffer, setResumeOffer] = useState<PersistedAuditState | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);
  const [l2Questions, setL2Questions] = useState<Level2Question[] | null>(null);
  const [l3Questions, setL3Questions] = useState<Level3Question[] | null>(null);
  const [dimLabels, setDimLabels] = useState<DimLabels>({});
  const [levelsReady, setLevelsReady] = useState(false);
  const [calcL2, setCalcL2] = useState<
    | ((a: AuditAnswers, i: PreAuditInput) => AuditResult)
    | null
  >(null);
  const [calcL3, setCalcL3] = useState<
    | ((a: AuditAnswers, i: PreAuditInput) => AuditResult)
    | null
  >(null);

  useEffect(() => {
    const saved = loadAuditProgress();
    if (hasResumableProgress(saved)) setResumeOffer(saved);
    setHydrated(true);
  }, []);

  /** Deep-link from homepage tiles: /self-audit/#level-2 | #level-3 | #level-1 */
  useEffect(() => {
    if (!hydrated || resumeOffer) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;
    const id = hash.slice(1);
    if (id !== "level-1" && id !== "level-2" && id !== "level-3") return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [hydrated, resumeOffer, phase]);

  /** Load L2/L3 banks only after unlock (level ≥ 2). */
  useEffect(() => {
    if (level < 2) return;
    let cancelled = false;
    (async () => {
      const extended = await import("@/lib/audit/scoring-premium");
      if (cancelled) return;
      setCalcL2(() => extended.calculateLevel2AuditResult);
      setCalcL3(() => extended.calculateLevel3AuditResult);
      setL2Questions(extended.LEVEL2_QUESTIONS);
      setL3Questions(extended.LEVEL3_QUESTIONS);
      const l3mod = await import("@/lib/audit/level3-questions");
      if (cancelled) return;
      setDimLabels(l3mod.DIMENSION_6M_LABELS as DimLabels);
      setLevelsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [level]);

  useEffect(() => {
    if (!hydrated || resumeOffer) return;
    if (phase === "intro" && Object.keys(answers).length === 0 && !preAudit) {
      return;
    }
    saveAuditProgress({
      level,
      phase,
      step,
      answers,
      answerDetails,
      preAudit,
    });
  }, [
    hydrated,
    resumeOffer,
    level,
    phase,
    step,
    answers,
    answerDetails,
    preAudit,
  ]);

  const questions =
    level === 1
      ? LEVEL1_QUESTIONS
      : level === 2
        ? (l2Questions ?? [])
        : (l3Questions ?? []);

  const question = questions[step];
  const process = PROCESSES.find((p) => p.id === question?.processId);
  const progress =
    questions.length === 0
      ? 0
      : ((step + (phase === "results" ? 1 : 0)) / questions.length) * 100;

  const l1q =
    level === 1 && question ? (question as AuditQuestion) : null;
  const l2q =
    level === 2 && question ? (question as Level2Question) : null;
  const l3q =
    level === 3 && question ? (question as Level3Question) : null;

  const result = useMemo(() => {
    if (phase !== "results" || !preAudit) return null;
    if (level === 3 && calcL3) return calcL3(answers, preAudit);
    if (level === 2 && calcL2) return calcL2(answers, preAudit);
    if (level === 1) return calculateAuditResult(answers, preAudit);
    return null;
  }, [phase, answers, preAudit, level, calcL2, calcL3]);

  function applyPersisted(saved: PersistedAuditState) {
    setLevel(saved.level);
    setPhase(saved.phase);
    setStep(saved.step);
    setAnswers(saved.answers ?? {});
    setAnswerDetails(saved.answerDetails ?? {});
    setPreAudit(saved.preAudit);
    setResumeOffer(null);
  }

  function discardPersisted() {
    clearAuditProgress();
    setResumeOffer(null);
    setLevel(1);
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setAnswerDetails({});
    setPreAudit(null);
  }

  function startLevel(next: AuditLevel) {
    setLevel(next);
    setAnswers({});
    setAnswerDetails({});
    setStep(0);
    setPhase("setup");
    setResumeOffer(null);
  }

  function recordAnswer(state: AnswerState, advance: boolean) {
    setAnswerDetails((prev) => ({ ...prev, [state.questionId]: state }));
    setAnswers((prev) => ({
      ...prev,
      [state.questionId]: state.finalEvaluatedScore,
    }));
    if (!advance) return;
    if (step < questions.length - 1) setStep((s) => s + 1);
    else setPhase("results");
  }

  function selectOption(opt: QualitativeOption) {
    if (!question) return;
    recordAnswer(
      {
        questionId: question.id,
        selectedCardScore: opt.score,
        finalEvaluatedScore: opt.score,
      },
      true,
    );
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
    else setPhase("setup");
  }

  function resetAll() {
    clearAuditProgress();
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setAnswerDetails({});
    setPreAudit(null);
    setLevel(1);
    setResumeOffer(null);
  }

  const levelLabel = levelTitle(level);

  const waitingLevels =
    level >= 2 &&
    (phase === "quiz" || phase === "results" || phase === "setup") &&
    !levelsReady;

  return (
    <section
      id="audit"
      className="section-pad border-t border-white/5"
      aria-labelledby="audit-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">Self-Audit</p>
        <h1 id="audit-heading" className="heading-display max-w-2xl">
          3-úrovňový procesný audit
        </h1>
        <p className="prose-muted mt-4 max-w-2xl">
          {SELF_AUDIT_HEADER_SK}{" "}
          Hodnotenie procesov je inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE).
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            {
              lvl: "Level 1",
              tag: AUDIT_LEVELS[1].priceLabel,
              desc: `${AUDIT_LEVELS[1].name} · 20 otázok`,
              href: "#level-1",
            },
            {
              lvl: "Level 2",
              tag: AUDIT_LEVELS[2].priceLabel,
              desc: `${AUDIT_LEVELS[2].name} · 60 otázok`,
              href: "#level-2",
            },
            {
              lvl: "Level 3",
              tag: AUDIT_LEVELS[3].priceLabel,
              desc: `${AUDIT_LEVELS[3].name} · 180 otázok`,
              href: "#level-3",
            },
          ].map((l) => (
            <a
              key={l.lvl}
              href={l.href}
              className="rounded-md border border-white/10 bg-steel-dark/50 px-4 py-3 transition hover:border-signal/40 hover:bg-steel-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
            >
              <p className="text-xs text-signal-bright">{l.tag}</p>
              <p className="font-display font-semibold text-ink-50">{l.lvl}</p>
              <p className="text-xs text-ink-300">{l.desc}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 space-y-8">
          {resumeOffer && (
            <ResumeBanner
              updatedAt={resumeOffer.updatedAt}
              onContinue={() => applyPersisted(resumeOffer)}
              onRestart={discardPersisted}
            />
          )}

          {waitingLevels && (
            <p className="text-sm text-ink-200" role="status">
              Načítavam rozšírený audit…
            </p>
          )}

          {phase === "intro" && !resumeOffer && (
            <div id="level-1" className="scroll-mt-28 space-y-6 animate-fade-up">
              <p
                className="flex gap-2 rounded-md border border-white/10 bg-ink-900/40 px-3 py-2.5 text-sm text-ink-200"
                role="note"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal-bright" aria-hidden />
                <span>
                  {auditStartNoticeSk()} Podrobnosti nájdete v{" "}
                  <Link
                    href="/ochrana-osobnych-udajov/"
                    className="text-signal-bright underline-offset-2 hover:underline"
                  >
                    Zásadách ochrany osobných údajov
                  </Link>
                  .
                </span>
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => startLevel(1)}
              >
                Spustiť Level 1 skríning zdarma
              </button>
              <p className="text-xs text-ink-300">
                Odvetvie + tržby · karty A–E (presné čísla preferované) ·
                výsledok s kritickým procesom. Level 2/3 po úhrade alebo dohode.
              </p>
            </div>
          )}

          {phase === "setup" && (
            <div className="space-y-4">
              <p className="text-sm text-signal-bright">{levelLabel}</p>
              <PreAuditForm
                initial={preAudit}
                onComplete={(input) => {
                  setPreAudit(input);
                  setPhase("quiz");
                  setStep(0);
                }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPhase("intro")}
              >
                Späť
              </button>
            </div>
          )}

          {phase === "quiz" && question && !waitingLevels && (
            <div className="space-y-6 animate-fade-in">
              <div
                className="rounded-md border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-ink-100"
                role="note"
              >
                <span className="inline-flex items-center gap-1.5 font-medium text-signal-bright">
                  <Info className="h-4 w-4 shrink-0" aria-hidden />
                  Pokyn k vyplneniu:{" "}
                </span>
                Kde poznáte namerané hodnoty, zadajte ich — výsledok bude
                spoľahlivejší. Ak číslo nemáte, stačí vybrať kartu A–E.
              </div>

              <div
                className="h-1.5 overflow-hidden rounded-full bg-ink-800"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Postup auditu"
              >
                <div
                  className="h-full bg-signal transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-ink-300">
                <span>
                  Level {level} · Otázka {step + 1} / {questions.length}
                </span>
                <span className="text-signal-bright">
                  {process ? `${domainLabel(process.id)} · ${process.shortLabel}` : null}
                </span>
                {l1q && (
                  <span className="rounded border border-white/10 px-2 py-0.5 normal-case tracking-normal text-ink-200">
                    Karty A–E
                    {l1q.inputType === "NUMERIC_INPUT"
                      ? ` · číslo preferované (${l1q.numericUnit ?? ""})`
                      : ""}
                  </span>
                )}
                {l3q && (
                  <span className="rounded bg-ember/20 px-2 py-0.5 font-semibold normal-case tracking-normal text-ember">
                    6M · {dimLabels[l3q.dimension6M] ?? l3q.dimension6M}
                  </span>
                )}
                {l2q && (
                  <span className="normal-case tracking-normal text-ink-300">
                    rodič {l2q.parentId}
                  </span>
                )}
                {l3q && (
                  <span className="normal-case tracking-normal text-ink-300">
                    L2 {l3q.parentL2Id}
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-50 sm:text-2xl">
                {question.text}
              </h3>

              {l1q && (
                <QuestionContextPanel
                  targetExplanation={l1q.targetExplanation}
                  methodology={l1q.methodology}
                />
              )}

              {(l2q || l3q) && (
                <QuestionGuidance
                  goal={(l2q ?? l3q)!.goal}
                  methodology={(l2q ?? l3q)!.methodology}
                  verification={(l2q ?? l3q)!.verification}
                />
              )}

              {l1q ? (
                <AuditQuestionCard
                  key={l1q.id}
                  question={l1q}
                  answer={answerDetails[l1q.id]}
                  onAnswer={recordAnswer}
                />
              ) : (
                <div
                  className="grid gap-3"
                  role="radiogroup"
                  aria-label="Vyberte najvýstižnejší popis"
                >
                  {"options" in question &&
                    question.options.map((opt, index) => {
                      const selected = answers[question.id] === opt.score;
                      const anySelected = question.options.some(
                        (o) => answers[question.id] === o.score,
                      );
                      const onCardKeyDown = (
                        e: KeyboardEvent<HTMLButtonElement>,
                      ) => {
                        const keys = [
                          "ArrowDown",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowLeft",
                          "Home",
                          "End",
                        ];
                        if (!keys.includes(e.key)) return;
                        e.preventDefault();
                        const group = e.currentTarget.closest(
                          '[role="radiogroup"]',
                        );
                        if (!group) return;
                        const radios = Array.from(
                          group.querySelectorAll<HTMLButtonElement>(
                            '[role="radio"]',
                          ),
                        );
                        const len = question.options.length;
                        let next = index;
                        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                          next = (index + 1) % len;
                        } else if (
                          e.key === "ArrowUp" ||
                          e.key === "ArrowLeft"
                        ) {
                          next = (index - 1 + len) % len;
                        } else if (e.key === "Home") {
                          next = 0;
                        } else if (e.key === "End") {
                          next = len - 1;
                        }
                        radios[next]?.focus();
                        radios[next]?.click();
                      };
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          tabIndex={
                            selected || (!anySelected && index === 0) ? 0 : -1
                          }
                          onClick={() => selectOption(opt)}
                          onKeyDown={onCardKeyDown}
                          className={`rounded-md border px-4 py-3.5 text-left text-sm leading-relaxed transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright ${
                            selected
                              ? "border-signal bg-signal/20 text-ink-50 shadow-signal"
                              : "border-white/10 bg-ink-900/60 text-ink-100 hover:border-signal/50 hover:bg-white/5"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-secondary" onClick={goBack}>
                  Späť
                </button>
                {answers[question.id] !== undefined &&
                  step < questions.length - 1 && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep((s) => s + 1)}
                    >
                      Ďalej
                    </button>
                  )}
                {level === 3 && step > 5 && l3Questions && (
                  <button
                    type="button"
                    className="btn-secondary !text-xs text-ink-300"
                    onClick={() => {
                      const fill: AuditAnswers = { ...answers };
                      for (let i = step; i < l3Questions.length; i++) {
                        const q = l3Questions[i];
                        if (fill[q.id] === undefined) fill[q.id] = 6;
                      }
                      setAnswers(fill);
                      setPhase("results");
                    }}
                  >
                    Demo: doplniť zvyšok (úroveň C) a prejsť na DTO
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "results" && result && preAudit && (
            <div className="space-y-10">
              <ResultsDashboard
                result={result}
                answers={answers}
                preAudit={preAudit}
                answerDetails={answerDetails}
              />
              <button type="button" className="btn-secondary" onClick={resetAll}>
                Spustiť audit znova
              </button>
            </div>
          )}

          {(phase === "intro" ||
            phase === "results" ||
            (phase === "setup" && level === 1)) &&
            !resumeOffer && (
              <div className="grid gap-6 lg:grid-cols-2">
                <Level2Gate onUnlocked={() => startLevel(2)} />
                <Level3Gate onUnlocked={() => startLevel(3)} />
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
