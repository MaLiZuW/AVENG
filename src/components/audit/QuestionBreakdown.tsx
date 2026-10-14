"use client";

import { useId, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  CircleDot,
  Minus,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { domainLabel } from "@/config/audit-display";
import { formatDecimalTrim } from "@/lib/format";
import {
  buildDomainBreakdown,
  domainBrakeSentenceSk,
  type BreakdownQuestion,
} from "@/lib/audit/question-breakdown";
import type {
  AnswerDetailsMap,
  AuditAnswers,
  ProcessId,
} from "@/lib/audit/types";

const PROCESS_ORDER: ProcessId[] = ["P1", "P2", "P3", "P4", "P5"];

const BAND_ICON = {
  kritické: AlertTriangle,
  slabé: Minus,
  priemerné: CircleDot,
  dobré: ThumbsUp,
  silné: Trophy,
} as const;

interface Props {
  questions: BreakdownQuestion[];
  answers: AuditAnswers;
  answerDetails?: AnswerDetailsMap;
  exactUnits?: Record<string, { unit?: string }>;
}

export default function QuestionBreakdown({
  questions,
  answers,
  answerDetails,
  exactUnits,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const domains = PROCESS_ORDER.map((processId) => {
    const rows = buildDomainBreakdown(
      processId,
      questions,
      answers,
      answerDetails,
      exactUnits,
    );
    return {
      processId,
      rows,
      brake: domainBrakeSentenceSk(rows),
    };
  }).filter((d) => d.rows.length > 0);

  if (domains.length === 0) return null;

  return (
    <div className="steel-panel p-5 sm:p-6">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <h4 className="font-display text-lg font-semibold text-ink-50">
          Rozpis po otázkach
        </h4>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-signal-bright transition motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 space-y-6 border-t border-white/10 pt-4">
            {domains.map(({ processId, rows, brake }) => (
              <section key={processId}>
                <h5 className="font-display text-base font-semibold text-ink-50">
                  {domainLabel(processId)}
                </h5>
                {brake ? (
                  <p className="mt-1 text-sm text-ink-200">{brake}</p>
                ) : null}
                <ul className="mt-3 space-y-3">
                  {rows.map((row) => {
                    const Icon = BAND_ICON[row.bandLabelSk];
                    return (
                      <li
                        key={row.questionId}
                        className="rounded-md border border-white/10 bg-ink-950/40 px-3 py-2.5"
                      >
                        <p className="text-sm text-ink-100">{row.text}</p>
                        <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-ink-200">
                          <Icon
                            className="h-3.5 w-3.5 shrink-0 text-signal-bright"
                            aria-hidden
                          />
                          <span>
                            Vaša odpoveď:{" "}
                            <strong className="font-medium text-ink-50">
                              {row.bandLabelSk}
                            </strong>
                          </span>
                          {row.exactValue !== undefined ? (
                            <span className="text-ink-300">
                              · Presná hodnota{" "}
                              {formatDecimalTrim(row.exactValue, 2)}
                              {row.exactUnit ? `\u00a0${row.exactUnit}` : ""}
                            </span>
                          ) : null}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
