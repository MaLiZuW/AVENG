"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  domainLabel,
  SHOW_WORLD_CLASS_CEILING,
} from "@/config/audit-display";
import {
  buildKpiComparisonRows,
  buildLevel1Presentation,
  formatEurRange,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  LEVEL1_DISCLAIMER_SK,
  referenceSourceNotesSk,
  toReportPresentation,
  wcCeilingDisplay,
} from "@/lib/audit/presentation";
import { formatEur } from "@/lib/audit/scoring";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  AuditResult,
  PreAuditInput,
} from "@/lib/audit/types";
import DtoSimulator from "./DtoSimulator";
import LeadForm from "./LeadForm";
import KpiReferenceTable from "./KpiReferenceTable";
import Level4OnsiteCard from "./Level4OnsiteCard";
import MetricExplainer from "./MetricExplainer";
import RadarChart from "./RadarChart";

interface Props {
  result: AuditResult;
  answers: AuditAnswers;
  preAudit: PreAuditInput;
  answerDetails?: AnswerDetailsMap;
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
}: Props) {
  const cp = result.criticalProcess;
  const gemba = useGembaTrigger(result);
  const view = useMemo(
    () => buildLevel1Presentation(result, answerDetails, preAudit),
    [result, answerDetails, preAudit],
  );
  const smeRange = view.headline;
  const reliability = view.reliability;
  const wc = useMemo(() => wcCeilingDisplay(result), [result]);
  const showWc = SHOW_WORLD_CLASS_CEILING && wc.visible;
  const [methodOpen, setMethodOpen] = useState(false);
  const methodPanelId = useId();
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
          Výsledky Level {result.auditLevel} auditu
          {result.auditLevel === 2 ? " (60 podotázok)" : ""}
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
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-left text-sm font-medium text-ink-100 hover:bg-white/5"
              aria-expanded={methodOpen}
              aria-controls={methodPanelId}
              onClick={() => setMethodOpen((v) => !v)}
            >
              Ako sme dospeli k tomuto číslu?
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-signal-bright transition ${methodOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-300">
            {LEVEL1_DISCLAIMER_SK}
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
                        ? `COGS ${preAudit.cogsPercent} %`
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
                  {`Najväčšia medzera je v doméne ${domainLabel(cp.processId)} · ${cp.label}. Vaše skóre je ${cp.userPercent.toFixed(0)} % a referencia MSP je ${cp.smePercent.toFixed(0)} %.`}
                </p>
                <details className="text-xs text-ink-300">
                  <summary className="cursor-pointer text-signal-bright">
                    Technický detail
                  </summary>
                  <p className="mt-2">
                    Skóre domény je 100 krát súčet (váha otázky krát skóre)
                    deleno súčtom (váha otázky krát 10). Medzera v eurách je
                    tržby krát podiel COGS krát váha nákladov domény krát max(0,
                    (referencia mínus vaše skóre) deleno 100). Celok je súčet
                    domén. Rozsah vzniká z pásiem odpovedí A–E. Pri presne
                    zadanom čísle je dolná hranica rovnaká ako horná.
                  </p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="steel-panel overflow-x-auto p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-ink-50">
            {showWc
              ? "3-cestné porovnanie (efektivita %)"
              : "Porovnanie voči referencii MSP (efektivita %)"}
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
                    {p.percent.toFixed(1)} %
                  </td>
                  <td className="py-2.5 pr-2 text-ember">
                    {p.smePercent.toFixed(1)} %
                  </td>
                  {showWc ? (
                    <td className="py-2.5 text-green-400">
                      {p.wcPercent.toFixed(1)} %
                    </td>
                  ) : null}
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="pt-3 pr-2 text-ink-50">Celkom (vážené)</td>
                <td className="pt-3 pr-2 text-signal-bright">
                  {result.overallPercent.toFixed(1)} %
                </td>
                <td className="pt-3 pr-2 text-ember">
                  {result.smeOverallPercent.toFixed(1)} %
                </td>
                {showWc ? (
                  <td className="pt-3 text-green-400">
                    {result.wcOverallPercent.toFixed(1)} %
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>
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
              {cp.userPercent.toFixed(0)} % · {cp.smePercent.toFixed(0)} %
              {showWc ? ` · ${cp.wcPercent.toFixed(0)} %` : null}
            </dd>
          </div>
        </dl>
      </div>

      <div className="steel-panel p-5 sm:p-6">
        <h4 className="font-display text-lg font-semibold text-ink-50">
          3 prioritné odporúčania pre konateľa
        </h4>
        <ol className="mt-4 space-y-4">
          {result.recommendations.map((r, i) => (
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
                <MetricExplainer processId={p.processId} />
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
