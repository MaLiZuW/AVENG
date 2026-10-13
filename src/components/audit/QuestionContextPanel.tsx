"use client";

import { useId, useState } from "react";
import { ChevronDown, Target, BookOpen } from "lucide-react";

interface Props {
  targetExplanation: string;
  methodology: string;
}

export default function QuestionContextPanel({
  targetExplanation,
  methodology,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="rounded-md border border-white/10 bg-ink-900/40">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs font-medium text-ink-200 transition hover:text-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Kontext merania a metodika</span>
        <ChevronDown
          className={`h-4 w-4 text-signal-bright transition motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-white/10 px-4 py-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-signal-bright">
                <Target className="h-3.5 w-3.5" aria-hidden />
                Čo meranie odhaľuje
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-200">
                {targetExplanation}
              </p>
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ember">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                Použitá metodika
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-200">
                {methodology}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
