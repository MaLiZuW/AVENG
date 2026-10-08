"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, AlertTriangle, Zap } from "lucide-react";
import { domainLabel } from "@/config/audit-display";
import { formatEur, getTopLossProcesses } from "@/lib/audit/scoring";
import type {
  AuditAnswers,
  AuditResult,
  Dimension6M,
  Level3Question,
  PreAuditInput,
  ProcessId,
  VdaScore,
} from "@/lib/audit/types";
import type { DtoSimulationResult } from "@/lib/audit/scoring-premium";

interface Props {
  answers: AuditAnswers;
  result: AuditResult;
  preAudit: PreAuditInput;
}

const RANK_META = [
  {
    rank: 1,
    Icon: Flame,
    label: "Najvyšší potenciál",
    activeClass: "border-ember bg-ember/15 text-ember ring-1 ring-ember/40",
  },
  {
    rank: 2,
    Icon: AlertTriangle,
    label: "Druhý najvyšší",
    activeClass:
      "border-signal bg-signal/15 text-signal-bright ring-1 ring-signal/40",
  },
  {
    rank: 3,
    Icon: Zap,
    label: "Tretí najvyšší",
    activeClass:
      "border-green-500/50 bg-green-500/10 text-green-400 ring-1 ring-green-500/30",
  },
] as const;

export default function DtoSimulator({ answers, result, preAudit }: Props) {
  const top3 = useMemo(
    () => getTopLossProcesses(result.processScores, 3),
    [result.processScores],
  );

  const [selectedProcessId, setSelectedProcessId] = useState<ProcessId>(
    () => top3[0]?.processId ?? result.criticalProcess.processId,
  );
  const [plannedHours, setPlannedHours] = useState(4000);
  const [selected, setSelected] = useState<Record<string, VdaScore>>({});
  const [l3Questions, setL3Questions] = useState<Level3Question[] | null>(null);
  const [dimLabels, setDimLabels] = useState<Record<string, string>>({});
  const [simulateDto, setSimulateDto] = useState<
    | ((
        a: AuditAnswers,
        o: Record<string, VdaScore>,
        i: PreAuditInput,
        h: number,
        f?: ProcessId,
      ) => DtoSimulationResult)
    | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [premium, l3] = await Promise.all([
        import("@/lib/audit/scoring-premium"),
        import("@/lib/audit/level3-questions"),
      ]);
      if (cancelled) return;
      setSimulateDto(() => premium.simulateDto);
      setL3Questions(premium.LEVEL3_QUESTIONS);
      setDimLabels(l3.DIMENSION_6M_LABELS as Record<string, string>);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeProcess =
    top3.find((p) => p.processId === selectedProcessId) ?? top3[0];

  function switchProcess(processId: ProcessId) {
    setSelectedProcessId(processId);
    setSelected({});
  }

  const opportunityIds = useMemo(() => {
    if (!l3Questions) return [];
    return l3Questions
      .filter((q) => q.processId === selectedProcessId)
      .map((q) => {
        const score = answers[q.id] ?? 0;
        return { q, score, gap: 10 - score };
      })
      .filter((x) => x.gap > 0)
      .sort(
        (a, b) =>
          b.gap * b.q.costImpactFactor - a.gap * a.q.costImpactFactor,
      )
      .slice(0, 8);
  }, [answers, selectedProcessId, l3Questions]);

  const dimBoost = useMemo(() => {
    if (!l3Questions) return [];
    const dims: Dimension6M[] = [
      "MAN",
      "MACHINE",
      "MATERIAL",
      "METHOD",
      "MEASUREMENT",
      "ENVIRONMENT",
    ];
    return dims.map((d) => {
      const qs = l3Questions.filter(
        (q) => q.processId === selectedProcessId && q.dimension6M === d,
      );
      const avg =
        qs.length === 0
          ? 0
          : qs.reduce((a, q) => a + (answers[q.id] ?? 0), 0) / qs.length;
      return { dim: d, avg, count: qs.length };
    });
  }, [answers, selectedProcessId, l3Questions]);

  const sim = useMemo(() => {
    if (!simulateDto) return null;
    return simulateDto(
      answers,
      selected,
      preAudit,
      plannedHours,
      selectedProcessId,
    );
  }, [
    answers,
    selected,
    preAudit,
    plannedHours,
    selectedProcessId,
    simulateDto,
  ]);

  function setItem(id: string, target: VdaScore | "clear") {
    setSelected((prev) => {
      const next = { ...prev };
      if (target === "clear") delete next[id];
      else next[id] = target;
      return next;
    });
  }

  function boostDimension(dim: Dimension6M, target: VdaScore) {
    if (!l3Questions) return;
    const qs = l3Questions.filter(
      (q) => q.processId === selectedProcessId && q.dimension6M === dim,
    );
    setSelected((prev) => {
      const next = { ...prev };
      for (const q of qs) {
        const cur = answers[q.id] ?? 0;
        if (target > cur) next[q.id] = target;
      }
      return next;
    });
  }

  if (!l3Questions || !sim) {
    return (
      <p className="text-sm text-ink-200" role="status">
        Načítavam simulátor…
      </p>
    );
  }

  return (
    <div className="steel-panel space-y-6 border-signal/30 p-5 sm:p-6 animate-fade-up">
      <div>
        <p className="text-xs uppercase tracking-wider text-signal-bright">
          Digital Twin of Organization (DTO)
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink-50">
          What-If simulátor — Level 3
        </h3>
        <p className="mt-2 text-sm text-ink-300">
          Predvolený je proces s najvyšším indikatívnym potenciálom úspor voči
          referencii MSP. Prepínajte medzi TOP 3 a simulujte úspory, kapacitu a
          ROI.
        </p>
      </div>

      <div role="tablist" aria-label="TOP 3 procesy podľa indikatívneho potenciálu">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-300">
          Prepínač TOP 3 (€/rok voči referencii MSP)
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {top3.map((proc, i) => {
            const meta = RANK_META[i] ?? RANK_META[2];
            const isActive = proc.processId === selectedProcessId;
            const Icon = meta.Icon;
            return (
              <button
                key={proc.processId}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => switchProcess(proc.processId)}
                className={`rounded-md border px-3 py-3 text-left transition ${
                  isActive
                    ? meta.activeClass
                    : "border-white/10 bg-ink-900/40 text-ink-200 hover:border-white/25"
                }`}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  #{meta.rank} {meta.label}
                </span>
                <span className="mt-1 block text-sm font-semibold text-ink-50">
                  {domainLabel(proc.processId)} · {proc.shortLabel}
                </span>
                <span
                  className={`mt-0.5 block text-xs tabular-nums ${
                    isActive ? "opacity-90" : "text-ember"
                  }`}
                >
                  −{formatEur(proc.gapSmeEur)} / rok
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeProcess && (
        <p className="rounded-md border border-white/10 bg-ink-900/50 px-3 py-2 text-sm text-ink-200">
          Aktívna simulácia:{" "}
          <strong className="text-ink-50">
            {domainLabel(activeProcess.processId)} · {activeProcess.shortLabel}
          </strong>
          <span className="text-ink-200">
            {" "}
            · baseline {formatEur(activeProcess.gapSmeEur)} / rok
          </span>
        </p>
      )}

      <label className="block text-sm">
        <span className="mb-1 flex justify-between text-ink-200">
          <span>Plánované výrobné hodiny / rok (pre Δ kapacitu)</span>
          <span className="text-signal-bright">
            {plannedHours.toLocaleString("sk-SK")} h
          </span>
        </span>
        <input
          type="range"
          min={1000}
          max={12000}
          step={100}
          value={plannedHours}
          onChange={(e) => setPlannedHours(Number(e.target.value))}
          className="w-full accent-signal"
        />
      </label>

      <div>
        <h4 className="text-sm font-semibold text-ink-50">
          Rýchly boost podľa 6M — {activeProcess?.shortLabel}
        </h4>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {dimBoost.map(({ dim, avg }) => (
            <div
              key={dim}
              className="rounded-md border border-white/10 bg-ink-900/50 p-3"
            >
              <p className="text-xs font-medium text-ink-100">
                {dimLabels[dim] ?? dim}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-200">
                Aktuálna zrelosť (interná): {avg.toFixed(1)} / 10
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  className="rounded border border-white/15 px-2 py-1 text-[10px] text-ink-200 hover:border-signal"
                  onClick={() => boostDimension(dim, 6)}
                >
                  → stred
                </button>
                <button
                  type="button"
                  className="rounded border border-white/15 px-2 py-1 text-[10px] text-ink-200 hover:border-signal"
                  onClick={() => boostDimension(dim, 8)}
                >
                  → vysoká
                </button>
                <button
                  type="button"
                  className="rounded border border-white/15 px-2 py-1 text-[10px] text-ink-200 hover:border-signal"
                  onClick={() => boostDimension(dim, 10)}
                >
                  → špička
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink-50">
          Top príležitosti na vybranom procese
        </h4>
        <ul className="mt-3 space-y-3">
          {opportunityIds.map(({ q }) => (
            <li
              key={q.id}
              className="rounded-md border border-white/10 bg-ink-900/40 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[10px] font-semibold text-signal-bright">
                  {q.dimension6M}
                </span>
                <span className="text-[10px] text-ink-300">{q.id}</span>
              </div>
              <p className="mt-1 text-sm text-ink-100">{q.text}</p>
              <select
                className="mt-2 w-full rounded-md border border-white/15 bg-ink-950 px-2 py-1.5 text-xs text-ink-50 outline-none focus:border-signal"
                value={selected[q.id] ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) setItem(q.id, "clear");
                  else setItem(q.id, Number(v) as VdaScore);
                }}
                aria-label={`Simulácia pre ${q.id}`}
              >
                <option value="">Bez zmeny v simulácii</option>
                <option value={6}>Zlepšiť na strednú úroveň</option>
                <option value={8}>Zlepšiť na vysokú úroveň</option>
                <option value={10}>Zlepšiť na špičku</option>
              </select>
            </li>
          ))}
          {opportunityIds.length === 0 && (
            <li className="text-sm text-ink-200">
              Na tomto procese nie sú otvorené príležitosti na zlepšenie.
            </li>
          )}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-ember/30 bg-ember/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-ink-300">
            Δ Úspory / rok
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-ember">
            {formatEur(sim.savingsEurPerYear)}
          </p>
        </div>
        <div className="rounded-md border border-signal/30 bg-signal/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-ink-300">
            Extra kapacita (h/rok)
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-signal-bright">
            {sim.extraMachineHours.toLocaleString("sk-SK")}
          </p>
          <p className="text-[11px] text-ink-200">
            Δ efektivita +{sim.deltaOeePercent} p.b.
          </p>
        </div>
        <div className="rounded-md border border-white/10 p-4">
          <p className="text-[11px] uppercase tracking-wider text-ink-300">
            Odhad investície
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink-50">
            {formatEur(sim.implementationCostEur)}
          </p>
        </div>
        <div className="rounded-md border border-green-500/30 bg-green-500/5 p-4">
          <p className="text-[11px] uppercase tracking-wider text-ink-300">
            ROI (mesiace)
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-green-400">
            {sim.roiMonths === null ? "—" : `${sim.roiMonths}`}
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-ink-200">
        Medzera voči referencii MSP (focus) {formatEur(sim.focusedGapSmeEur)} ·
        teoretický strop WC {formatEur(sim.baselineGapWcEur)} → simulácia{" "}
        {formatEur(sim.simulatedGapWcEur)} · efektivita simulácie{" "}
        {sim.simulatedOverallPercent.toFixed(1)} %.
      </p>

      {Object.keys(selected).length > 0 && (
        <button
          type="button"
          className="btn-secondary !text-xs"
          onClick={() => setSelected({})}
        >
          Resetovať simuláciu
        </button>
      )}
    </div>
  );
}
