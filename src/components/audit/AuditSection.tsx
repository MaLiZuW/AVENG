"use client";

import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import Link from "next/link";
import { domainLabel } from "@/config/audit-display";
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
import GdprBanner from "./GdprBanner";
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
  const [premiumReady, setPremiumReady] = useState(false);
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

  /** Load L2/L3 banks only after unlock (level ≥ 2). */
  useEffect(() => {
    if (level < 2) return;
    let cancelled = false;
    (async () => {
      const premium = await import("@/lib/audit/scoring-premium");
      if (cancelled) return;
      setCalcL2(() => premium.calculateLevel2AuditResult);
      setCalcL3(() => premium.calculateLevel3AuditResult);
      setL2Questions(premium.LEVEL2_QUESTIONS);
      setL3Questions(premium.LEVEL3_QUESTIONS);
      const l3mod = await import("@/lib/audit/level3-questions");
      if (cancelled) return;
      setDimLabels(l3mod.DIMENSION_6M_LABELS as DimLabels);
      setPremiumReady(true);
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

  const levelLabel =
    level === 1
      ? "Level 1 — Skríning"
      : level === 2
        ? "Level 2 — Detailný audit (60 otázok)"
        : "Level 3 — Premium 6M & DTO (180 otázok)";

  const waitingPremium =
    level >= 2 &&
    (phase === "quiz" || phase === "results" || phase === "setup") &&
    !premiumReady;

  return (
    <section
      id="audit"
      className="section-pad border-t border-white/5"
      aria-labelledby="audit-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">Self-Audit</p>
        <h2 id="audit-heading" className="heading-display max-w-2xl">
          3-úrovňový procesný audit
        </h2>
        <p className="prose-muted mt-4 max-w-2xl">
          L1 (20) → L2 (60) → L3 (180 / 6M + DTO) — objektívne hodnotenie bez
          viditeľných bodov, odvetvový benchmark a indikatívny potenciál úspor.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { lvl: "Level 1", tag: "Zdarma", desc: "Skríning · 20 otázok" },
            { lvl: "Level 2", tag: "290 €", desc: "Detail · 60 otázok" },
            { lvl: "Level 3", tag: "Premium", desc: "6M + DTO · 180 otázok" },
          ].map((l) => (
            <div
              key={l.lvl}
              className="rounded-md border border-white/10 bg-steel-dark/50 px-4 py-3"
            >
              <p className="text-xs text-signal-bright">{l.tag}</p>
              <p className="font-display font-semibold text-ink-50">{l.lvl}</p>
              <p className="text-xs text-ink-300">{l.desc}</p>
            </div>
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

          {waitingPremium && (
            <p className="text-sm text-ink-200" role="status">
              Načítavam rozšírený audit…
            </p>
          )}

          {phase === "intro" && !resumeOffer && (
            <div className="space-y-6 animate-fade-up">
              <GdprBanner />
              <p
                className="flex gap-2 rounded-md border border-white/10 bg-ink-900/40 px-3 py-2.5 text-sm text-ink-200"
                role="note"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal-bright" aria-hidden />
                <span>
                  {auditStartNoticeSk()}{" "}
                  <Link
                    href="/ochrana-osobnych-udajov/"
                    className="text-signal-bright underline-offset-2 hover:underline"
                  >
                    Zásady ochrany osobných údajov
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
              <GdprBanner />
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

          {phase === "quiz" && question && !waitingPremium && (
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
                    question.options.map((opt) => {
                      const selected = answers[question.id] === opt.score;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => selectOption(opt)}
                          className={`rounded-md border px-4 py-3.5 text-left text-sm leading-relaxed transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
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
                <div>
                  <h3 className="mb-3 font-display text-lg font-semibold text-ink-50">
                    Level 2 — Detailný audit
                  </h3>
                  <Level2Gate onUnlocked={() => startLevel(2)} />
                </div>
                <div>
                  <h3 className="mb-3 font-display text-lg font-semibold text-ink-50">
                    Level 3 — Expert &amp; DTO
                  </h3>
                  <Level3Gate onUnlocked={() => startLevel(3)} />
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
