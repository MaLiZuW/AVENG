"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LEVEL1_QUESTIONS } from "@/lib/audit/questions";
import type { ProcessId } from "@/lib/audit/types";
import { domainLabel } from "@/config/audit-display";

interface Props {
  processId: ProcessId;
}

export default function MetricExplainer({ processId }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const metrics = LEVEL1_QUESTIONS.filter((q) => q.processId === processId);

  return (
    <div className="mt-3 rounded-md border border-white/10 bg-ink-950/40">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-ink-200 hover:text-ink-50"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          Vysvetlenie metrík · {domainLabel(processId)}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-signal-bright transition ${open ? "rotate-180" : ""}`}
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
          <ul className="space-y-3 border-t border-white/10 px-3 py-3">
            {metrics.map((q) => (
              <li key={q.id} className="text-xs leading-relaxed text-ink-200">
                <p className="font-medium text-ink-100">{q.questionText}</p>
                <p className="mt-1">
                  <span className="text-signal-bright">Čo meranie odhaľuje: </span>
                  {q.targetExplanation}
                </p>
                <p className="mt-0.5">
                  <span className="text-ember">Metodika: </span>
                  {q.methodology}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
