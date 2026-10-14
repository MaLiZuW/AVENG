"use client";

import { getKpiReference } from "@/config/benchmarks";
import { formatEuroRounded, formatPercent } from "@/lib/format";
import type { AnswerDetailsMap, PreAuditInput } from "@/lib/audit/types";

/** L1 ids — only place exact COPQ % and OEE total live today. */
const COPQ_QID = "L1-P3-Q2";
const OEE_AVAIL_QID = "L2-P2-Q1a";
const OEE_PERF_QID = "L2-P2-Q1b";
const OEE_QUAL_QID = "L2-P2-Q1c";

function exactNumber(
  details: AnswerDetailsMap | undefined,
  questionId: string,
): number | null {
  const v = details?.[questionId]?.numericOverrideValue;
  if (v === undefined || !Number.isFinite(v)) return null;
  return v;
}

interface Props {
  answerDetails?: AnswerDetailsMap;
  preAudit: PreAuditInput;
}

/**
 * OEE A×P×Q and COPQ blocks — only when exact numeric inputs exist.
 * Never estimates missing factors.
 */
export default function ExactInputBlocks({ answerDetails, preAudit }: Props) {
  const a = exactNumber(answerDetails, OEE_AVAIL_QID);
  const p = exactNumber(answerDetails, OEE_PERF_QID);
  const q = exactNumber(answerDetails, OEE_QUAL_QID);
  const showOee = a !== null && p !== null && q !== null;

  const copqPct = exactNumber(answerDetails, COPQ_QID);
  const copqRef = getKpiReference("copq_pct_of_sales");
  const showCopq = copqPct !== null && copqRef?.key === "copq_pct_of_sales";

  if (!showOee && !showCopq) return null;

  const oeeRef = getKpiReference("oee_pct");
  const oeeProduct =
    showOee && a !== null && p !== null && q !== null
      ? (a / 100) * (p / 100) * (q / 100) * 100
      : null;

  return (
    <div className="space-y-4">
      {showOee && oeeProduct !== null && oeeRef?.key === "oee_pct" ? (
        <div className="steel-panel p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-ink-50">
            OEE = Dostupnosť × Výkon × Kvalita
          </h4>
          <p className="mt-2 text-sm text-ink-200">
            {formatPercent(a!)} × {formatPercent(p!)} × {formatPercent(q!)} ={" "}
            <strong className="text-ink-50">{formatPercent(oeeProduct)}</strong>
          </p>
          <p className="mt-2 text-sm text-ink-200">
            Orientačná referencia: typicky{" "}
            {formatPercent(oeeRef.ranges.typical)}, world-class{" "}
            {formatPercent(oeeRef.ranges.worldClass)}.
          </p>
          <ul className="mt-2 list-inside list-disc text-xs text-ink-300">
            {oeeRef.sources.map((s) => (
              <li key={s.url}>
                {s.url.startsWith("https://") ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/30 underline-offset-2 hover:text-ink-50"
                  >
                    {s.name}
                  </a>
                ) : (
                  s.name
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-300">{oeeRef.definitionNote}</p>
        </div>
      ) : null}

      {showCopq && copqRef?.key === "copq_pct_of_sales" ? (
        <div className="steel-panel p-5 sm:p-6">
          <h4 className="font-display text-lg font-semibold text-ink-50">
            COPQ voči referencii
          </h4>
          <p className="mt-2 text-sm text-ink-200">
            Vaša hodnota:{" "}
            <strong className="text-ink-50">{formatPercent(copqPct!)}</strong>{" "}
            tržieb. Typický rozsah:{" "}
            {formatPercent(copqRef.ranges.range[0])} –{" "}
            {formatPercent(copqRef.ranges.range[1])} (orientačne{" "}
            {formatPercent(copqRef.ranges.typical)}).
          </p>
          <p className="mt-2 text-sm text-ink-200">
            Euro ekvivalent pri vašich tržbách:{" "}
            <strong className="text-ink-50">
              {formatEuroRounded(
                (preAudit.annualRevenueEur * copqPct!) / 100,
              )}
            </strong>
            .
          </p>
          <p className="mt-2 text-xs text-ink-300">{copqRef.definitionNote}</p>
        </div>
      ) : null}
    </div>
  );
}
