"use client";

import { FormEvent, useState } from "react";
import { SECTORS } from "@/lib/audit/benchmarks";
import type { PreAuditInput, SectorId } from "@/lib/audit/types";

interface Props {
  onComplete: (input: PreAuditInput) => void;
  initial?: PreAuditInput | null;
}

export default function PreAuditForm({ onComplete, initial }: Props) {
  const [sectorId, setSectorId] = useState<SectorId | "">(
    initial?.sectorId ?? "",
  );
  const [revenue, setRevenue] = useState(
    initial?.annualRevenueEur
      ? String(initial.annualRevenueEur)
      : "5000000",
  );
  const [cogs, setCogs] = useState(initial?.cogsPercent ?? 65);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!sectorId) {
      setError("Vyberte priemyselné odvetvie MSP.");
      return;
    }

    const annualRevenueEur = Number(String(revenue).replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(annualRevenueEur) || annualRevenueEur < 100_000) {
      setError("Zadajte odhadované hrubé ročné tržby (min. 100 000 €).");
      return;
    }

    if (cogs < 20 || cogs > 90) {
      setError("Podiel COGS / priamych nákladov nastavte medzi 20 % a 90 %.");
      return;
    }

    onComplete({
      sectorId,
      annualRevenueEur,
      cogsPercent: cogs,
    });
  }

  return (
    <form onSubmit={onSubmit} className="steel-panel space-y-5 p-5 sm:p-6 animate-fade-up">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-50">
          Pred štartom auditu — základné údaje firmy
        </h3>
        <p className="mt-1 text-sm text-ink-300">
          Odvetvie a tržby umožnia porovnať vás s referenciou MSP a world-class
          stropom vo vašom sektore a vyčísliť indikatívny potenciál v €/rok.
        </p>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink-100">
          Priemyselné odvetvie MSP
        </span>
        <select
          value={sectorId}
          onChange={(e) => setSectorId(e.target.value as SectorId | "")}
          required
          className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2.5 text-ink-50 outline-none focus:border-signal"
        >
          <option value="" disabled>
            — Vyberte odvetvie —
          </option>
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink-100">
          Odhadované hrubé ročné tržby (€ / rok)
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          placeholder="napr. 5000000"
          required
          className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2.5 text-ink-50 outline-none focus:border-signal"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 flex items-center justify-between font-medium text-ink-100">
          <span>Podiel COGS / priamych nákladov</span>
          <span className="text-signal-bright">{cogs} %</span>
        </span>
        <input
          type="range"
          min={20}
          max={90}
          step={1}
          value={cogs}
          onChange={(e) => setCogs(Number(e.target.value))}
          className="mt-2 w-full accent-signal"
          aria-valuemin={20}
          aria-valuemax={90}
          aria-valuenow={cogs}
        />
        <span className="mt-1 block text-xs text-ink-400">
          Predvolené 65 % — typické pre výrobné MSP. Upravte podľa vašej reality.
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary">
        Pokračovať na otázky auditu
      </button>
    </form>
  );
}
