"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { disclaimerForLevel, resultTitle } from "@/config/audit-copy";
import {
  domainLabel,
  SHOW_WORLD_CLASS_CEILING,
} from "@/config/audit-display";
import {
  buildKpiComparisonRows,
  buildResultView,
  COL_COST_BASE_SK,
  COL_COGS_SHARE_SK,
  COL_DOMAIN_SK,
  COL_REF_SOURCE_SK,
  costBaseDisclosureRows,
  COST_BASE_SHARES_NOTE_SK,
  EXPERT_ESTIMATE_SOURCE_SK,
  formatEurRange,
  LABEL_COST_BASE_TABLE_SK,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_MATURITY_TABLE_SK,
  LABEL_MATURITY_TABLE_WC_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  NOTE_MATURITY_TABLE_SK,
  referenceSourceNotesSk,
  toReportPresentation,
  wcCeilingDisplay,
  type ResultViewRaw,
} from "@/lib/audit/presentation";
import { presentRecommendations } from "@/lib/audit/recommendations";
import { formatPercent } from "@/lib/format";
import { formatEur } from "@/lib/audit/scoring";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  AuditResult,
  PreAuditInput,
  ProcessId,
} from "@/lib/audit/types";
import type { BreakdownQuestion } from "@/lib/audit/question-breakdown";
import DtoSimulator from "./DtoSimulator";
import ExactInputBlocks from "./ExactInputBlocks";
import LeadForm from "./LeadForm";
import KpiReferenceTable from "./KpiReferenceTable";
import Level4OnsiteCard from "./Level4OnsiteCard";
import MetricExplainer, { domainExplainerId } from "./MetricExplainer";
import QuestionBreakdown from "./QuestionBreakdown";
import RadarChart from "./RadarChart";

interface Props {
  result: AuditResult;
  answers: AuditAnswers;
  preAudit: PreAuditInput;
  answerDetails?: AnswerDetailsMap;
  recalculate?: ResultViewRaw["recalculate"];
  /** L2/L3 question bank for per-question breakdown (omit on Level 1). */
  levelQuestions?: BreakdownQuestion[];
}

function useGembaTrigger(result: AuditResult) {
  return useMemo(() => {
    const totalCostBaseEur = result.processScores.reduce(
      (a, p) => a + p.costBaseEur,
      0,
    );
    const ratio =
      totalCostBaseEur > 0 ? result.gapSmeEur / totalCostBaseEur : 0;
    return {
      totalCostBaseEur,
      ratio,
      show: result.auditLevel === 1 && ratio > 0.15,
    };
  }, [result]);
}

export default function ResultsDashboard({
  result,
  answers,
  preAudit,
  answerDetails,
  recalculate,
  levelQuestions,
}: Props) {
  const cp = result.criticalProcess;
  const gemba = useGembaTrigger(result);
  const view = useMemo(
    () =>
      buildResultView(result.auditLevel, {
        result,
        details: answerDetails,
        preAudit,
        recalculate,
      }),
    [result, answerDetails, preAudit, recalculate],
  );
  const smeRange = view.headline;
  const reliability = view.reliability;
  const wc = useMemo(() => wcCeilingDisplay(result), [result]);
  const showWc = SHOW_WORLD_CLASS_CEILING && wc.visible;
  const [methodOpen, setMethodOpen] = useState(false);
  const [openExplainers, setOpenExplainers] = useState<
    Partial<Record<ProcessId, boolean>>
  >({});
  const methodPanelId = useId();
  const recommendations = useMemo(
    () => presentRecommendations(result, answers, answerDetails),
    [result, answers, answerDetails],
  );
  function showDomainMetrics(processId: ProcessId) {
    setOpenExplainers((prev) => ({ ...prev, [processId]: true }));
    const el = document.getElementById(domainExplainerId(processId));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const kpiRows = useMemo(
    () => buildKpiComparisonRows(answerDetails),
    [answerDetails],
  );
  const sourceNotes = useMemo(
    () =>
      referenceSourceNotesSk([
        "P1",
        "P2",
        "P3",
        "P4",
        "P5",
        ...kpiRows.map((row) => row.key),
      ]),
    [kpiRows],
  );
  const costBaseRows = useMemo(
    () => costBaseDisclosureRows(result),
    [result],
  );

  const processList = useMemo(() => {
    const sorted = [...result.processScores];
    if (showWc) sorted.sort((a, b) => b.gapWcEur - a.gapWcEur);
    else sorted.sort((a, b) => b.gapSmeEur - a.gapSmeEur);
    return sorted;
  }, [result.processScores, showWc]);

  return (
    <div className="space-y-8 animate-fade-up" aria-live="polite">
      <div>
        <p className="text-xs uppercase tracking-wider text-ink-200">
          Zrkadlo podniku · {result.sectorLabel} · Level {result.auditLevel}
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold text-ink-50">
          {resultTitle(result.auditLevel, result.totalQuestions)}
        </h3>
      </div>

      {gemba.show && (
        <Level4OnsiteCard
          domain={`${domainLabel(cp.processId)} · ${cp.label}`}
          gapLabelSk={smeRange.labelSk}
          totalCostBaseEur={gemba.totalCostBaseEur}
          ratio={gemba.ratio}
        />
      )}

      <div
        className={`grid gap-4 ${showWc ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
      >
        <div className="steel-panel border-ember/30 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-200">
                {LABEL_GAP_HEADLINE_SK}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-ember sm:text-3xl">
                {smeRange.labelSk}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-left text-sm font-medium text-ink-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
              aria-expanded={methodOpen}
              aria-controls={methodPanelId}
              onClick={() => setMethodOpen((v) => !v)}
            >
              Ako sme dospeli k tomuto číslu?
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-signal-bright transition motion-reduce:transition-none ${methodOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-300">
            {disclaimerForLevel(result.auditLevel)}
          </p>
          <div
            id={methodPanelId}
            className={`grid transition-[grid-template-rows] duration-300 ${
              methodOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm text-ink-200">
                <p>
                  {`${
                    [
                      Number.isFinite(preAudit.annualRevenueEur)
                        ? `Tržby ${formatEur(preAudit.annualRevenueEur)}`
                        : null,
                      Number.isFinite(preAudit.cogsPercent)
                        ? `COGS ${formatPercent(preAudit.cogsPercent, 0)}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  }${
                    Number.isFinite(preAudit.annualRevenueEur) ||
                    Number.isFinite(preAudit.cogsPercent)
                      ? ". "
                      : ""
                  }Odvetvie ${result.sectorLabel}.`}
                </p>
                <p>
                  {`Najväčšia medzera je v doméne ${domainLabel(cp.processId)} · ${cp.label}. Vaše skóre je ${formatPercent(cp.userPercent)} a referencia MSP je ${formatPercent(cp.smePercent)}.`}
                </p>
                <details className="text-xs text-ink-300">
                  <summary className="cursor-pointer text-signal-bright">
                    Technický detail
                  </summary>
                  <p className="mt-2">
                    Skóre domény je 100 krát súčet (váha otázky krát skóre)
                    deleno súčtom (váha otázky krát 10). Medzera v eurách je
                    tržby krát podiel COGS krát váha nákladov domény krát max(0,
                    (referencia mínus vaše skóre) deleno 100). Celková medzera
                    je súčtom medzier jednotlivých domén. Rozsah vzniká z pásiem
                    odpovedí A–E. Pri presne
                    zadanom čísle je dolná hranica rovnaká ako horná.
                  </p>
                  <p className="mt-3 text-ink-200">
                    {EXPERT_ESTIMATE_SOURCE_SK}
                  </p>
                  <h5 className="mt-3 font-medium text-ink-100">
                    {LABEL_COST_BASE_TABLE_SK}
                  </h5>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full min-w-[320px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-ink-200">
                          <th className="pb-1.5 pr-2 font-medium">
                            {COL_DOMAIN_SK}
                          </th>
                          <th className="pb-1.5 pr-2 font-medium">
                            {COL_COGS_SHARE_SK}
                          </th>
                          <th className="pb-1.5 pr-2 font-medium">
                            {COL_COST_BASE_SK}
                          </th>
                          <th className="pb-1.5 font-medium">
                            {COL_REF_SOURCE_SK}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {costBaseRows.map((row) => (
                          <tr
                            key={row.processId}
                            className="border-b border-white/5"
                          >
                            <td className="py-1.5 pr-2 text-ink-100">
                              {row.domainLabel}
                            </td>
                            <td className="py-1.5 pr-2">
                              {formatPercent(row.cogsShare * 100, 0)}
                            </td>
                            <td className="py-1.5 pr-2">
                              {formatEur(row.costBaseEur)}
                            </td>
                            <td className="py-1.5 text-ink-200">
                              {row.referenceSourceSk}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2">{COST_BASE_SHARES_NOTE_SK}</p>
                </details>
              </div>
            </div>
          </div>
          {reliability.visible ? (
            <p className="mt-3 text-xs text-ink-200">
              <strong className="text-ink-50">{reliability.lineSk}</strong>
              {" — "}
              {reliability.hintSk}
            </p>
          ) : null}
        </div>
        {showWc ? (
          <div className="steel-panel border-white/10 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-wider text-ink-200">
              {wc.titleSk}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
              {wc.labelSk}
            </p>
            <p className="mt-2 text-xs text-ink-300">
              Vzdialená referencia, nie realistický cieľ pre väčšinu MSP.
              {wc.capped
                ? " Zobrazenie je obmedzené na primeranú hranicu."
                : null}
            </p>
          </div>
        ) : null}
      </div>

      {sourceNotes.length > 0 ? (
        <div className="space-y-2">
          {sourceNotes.map((note) => (
            <p key={note} className="text-xs leading-relaxed text-ink-300">
              {note}
            </p>
          ))}
        </div>
      ) : null}

      <KpiReferenceTable rows={kpiRows} />

      {result.auditLevel >= 2 ? (
        <ExactInputBlocks
          answerDetails={answerDetails}
          preAudit={preAudit}
        />
      ) : null}

      {result.auditLevel >= 2 && levelQuestions && levelQuestions.length > 0 ? (
        <QuestionBreakdown
          questions={levelQuestions}
          answers={answers}
          answerDetails={answerDetails}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="steel-panel overflow-x-auto p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-ink-50">
            {showWc ? LABEL_MATURITY_TABLE_WC_SK : LABEL_MATURITY_TABLE_SK}
          </h4>
          <table className="mt-4 w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-ink-200">
                <th className="pb-2 pr-2 font-medium">Doména</th>
                <th className="pb-2 pr-2 font-medium text-signal-bright">
                  Vaša firma
                </th>
                <th className="pb-2 pr-2 font-medium text-ember">
                  {LABEL_MSP_REF_SK}
                </th>
                {showWc ? (
                  <th className="pb-2 font-medium text-green-400">
                    World-class
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {result.processScores.map((p) => (
                <tr key={p.processId} className="border-b border-white/5">
                  <td className="py-2.5 pr-2 text-ink-100">
                    {domainLabel(p.processId)} {p.shortLabel}
                  </td>
                  <td className="py-2.5 pr-2 font-semibold text-signal-bright">
                    {formatPercent(p.percent)}
                  </td>
                  <td className="py-2.5 pr-2 text-ember">
                    {formatPercent(p.smePercent)}
                  </td>
                  {showWc ? (
                    <td className="py-2.5 text-green-400">
                      {formatPercent(p.wcPercent)}
                    </td>
                  ) : null}
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="pt-3 pr-2 text-ink-50">Celkom (vážené)</td>
                <td className="pt-3 pr-2 text-signal-bright">
                  {formatPercent(result.overallPercent)}
                </td>
                <td className="pt-3 pr-2 text-ember">
                  {formatPercent(result.smeOverallPercent)}
                </td>
                {showWc ? (
                  <td className="pt-3 text-green-400">
                    {formatPercent(result.wcOverallPercent)}
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs leading-relaxed text-ink-300">
            {NOTE_MATURITY_TABLE_SK}
          </p>
        </div>

        <div className="steel-panel flex flex-col items-center justify-center p-4">
          <RadarChart scores={result.processScores} showWorldClass={showWc} />
        </div>
      </div>

      <div className="steel-panel border-l-4 border-ember p-5 sm:p-6">
        <p className="text-xs uppercase tracking-wider text-ember">
          Kritická doména k riešeniu
        </p>
        <h4 className="mt-1 font-display text-xl font-semibold text-ink-50">
          {domainLabel(cp.processId)} · {cp.label}
        </h4>
        <p className="mt-2 text-sm text-ink-200">{cp.reason}</p>
        <dl
          className={`mt-4 grid gap-3 text-sm ${showWc ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
        >
          <div>
            <dt className="text-ink-200">{LABEL_GAP_SHORT_SK}</dt>
            <dd className="font-semibold text-ink-100">{view.critical.labelSk}</dd>
          </div>
          {showWc ? (
            <div>
              <dt className="text-ink-200">{wc.titleSk}</dt>
              <dd className="font-semibold text-ember">
                {formatEurRange(cp.gapWcEur, cp.gapWcEur)}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-ink-200">
              {showWc
                ? "Vaša úroveň vs referencia / WC"
                : "Vaša úroveň vs referencia MSP"}
            </dt>
            <dd className="font-semibold text-ink-100">
              {formatPercent(cp.userPercent)} · {formatPercent(cp.smePercent)}
              {showWc ? ` · ${formatPercent(cp.wcPercent)}` : null}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-signal-bright underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
          aria-expanded={!!openExplainers[cp.processId]}
          onClick={() => showDomainMetrics(cp.processId)}
        >
          Zobraziť metriky domény
        </button>
      </div>

      <div className="steel-panel p-5 sm:p-6">
        <h4 className="font-display text-lg font-semibold text-ink-50">
          3 prioritné odporúčania pre konateľa
        </h4>
        <ol className="mt-4 space-y-4">
          {recommendations.map((r, i) => (
            <li key={r.processId} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-signal/20 font-display text-sm font-semibold text-signal-bright">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-ink-50">
                  {r.title}{" "}
                  <span className="text-xs font-normal text-ember">
                    · {domainLabel(r.processId)} · dopad {r.impact}
                  </span>
                </p>
                <p className="mt-1 text-sm text-ink-200">{r.description}</p>
                <button
                  type="button"
                  className="mt-2 text-sm font-medium text-signal-bright underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
                  aria-expanded={!!openExplainers[r.processId]}
                  onClick={() => showDomainMetrics(r.processId)}
                >
                  Zobraziť metriky domény
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="steel-panel p-5 sm:p-6">
        <h4 className="font-display text-lg font-semibold text-ink-50">
          {LABEL_PROCESS_GAPS_SK}
        </h4>
        <ul className="mt-4 space-y-3">
          {processList.map((p) => {
            const barValue = showWc ? p.gapWcEur : p.gapSmeEur;
            const barMax = showWc
              ? Math.max(result.gapWcEur, 1)
              : Math.max(result.gapSmeEur, 1);
            const processGap = view.processes.find(
              (row) => row.processId === p.processId,
            );
            return (
              <li key={p.processId}>
                <div className="mb-1 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-ink-100">
                    {domainLabel(p.processId)} · {p.shortLabel}
                  </span>
                  <span className="text-ink-200">
                    {processGap?.gap.labelSk ??
                      formatEurRange(p.gapSmeEur, p.gapSmeEur)}
                    {showWc
                      ? ` · WC ${formatEurRange(p.gapWcEur, p.gapWcEur)}`
                      : null}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-ink-800"
                  role="progressbar"
                  aria-valuenow={barValue}
                  aria-valuemin={0}
                  aria-valuemax={barMax}
                  aria-label={`Potenciál ${p.shortLabel}`}
                >
                  <div
                    className="h-full rounded-full bg-ember/80 transition-[width] duration-700"
                    style={{
                      width: `${Math.min(100, (barValue / barMax) * 100)}%`,
                    }}
                  />
                </div>
                <MetricExplainer
                  processId={p.processId}
                  open={!!openExplainers[p.processId]}
                  onOpenChange={(next) =>
                    setOpenExplainers((prev) => ({
                      ...prev,
                      [p.processId]: next,
                    }))
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>

      {result.auditLevel === 3 && (
        <DtoSimulator answers={answers} result={result} preAudit={preAudit} />
      )}

      <LeadForm
        result={result}
        answers={answers}
        preAudit={preAudit}
        presentation={toReportPresentation(view)}
      />
    </div>
  );
}
