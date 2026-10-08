"use client";

import { FormEvent, useState } from "react";
import { Lock } from "lucide-react";
import { company } from "@/config/company";
import { LEVEL2_PRICE_EUR } from "@/lib/audit/questions";
import { requestUnlock } from "@/lib/unlock/session";

interface UnlockGateProps {
  onUnlocked: () => void;
}

/** Harmless placeholder — real L2/L3 question content is not rendered here */
const PLACEHOLDER_L2 = [
  "Rozšírená diagnostika výrobných procesov",
  "Hlbší rozklad strát dostupnosti, výkonu a kvality",
  "Prioritizácia opatrení podľa finančného dopadu",
];

const PLACEHOLDER_L3 = [
  "Expertná príčinová analýza naprieč dimenziami procesu",
  "Simulácia investičných scenárov a návratnosti",
  "Podklady pre rozhodovanie konateľa / COO",
];

export function Level2Gate({ onUnlocked }: UnlockGateProps) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function tryUnlock(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setPending(true);
    const res = await requestUnlock(code, 2);
    setPending(false);
    if (res.ok) {
      onUnlocked();
      return;
    }
    setMsg(res.error ?? "Neplatný kód alebo vypršaná platnosť.");
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10">
      <div className="pointer-events-none select-none p-5 blur-sm" aria-hidden>
        <p className="font-display text-lg text-ink-50">
          Detailný audit — rozšírená diagnostika
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-200">
          {PLACEHOLDER_L2.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950/70 p-6 backdrop-blur-md">
        <Lock className="h-8 w-8 text-signal-bright" aria-hidden />
        <p className="mt-2 font-display text-xl font-semibold text-ink-50">
          Odomknúť za {LEVEL2_PRICE_EUR} €
        </p>
        <p className="mt-1 text-center text-sm text-ink-200">
          Po úhrade dostanete prístupový kód e-mailom
        </p>
        <form onSubmit={tryUnlock} className="mt-4 flex w-full max-w-xs gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PRÍSTUPOVÝ KÓD"
            aria-label="Prístupový kód Level 2"
            autoComplete="off"
            className="flex-1 rounded-md border border-white/15 bg-ink-900 px-3 py-2 text-sm uppercase text-ink-50 outline-none focus:border-signal"
          />
          <button
            type="submit"
            className="btn-primary !px-3 !py-2 !text-xs"
            disabled={pending}
          >
            {pending ? "…" : "Odomknúť"}
          </button>
        </form>
        {msg && (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {msg}
          </p>
        )}
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent("Level 2 audit — žiadosť o prístup")}`}
          className="mt-3 text-xs text-ink-200 underline-offset-2 hover:text-ember hover:underline"
        >
          Požiadať o prístup e-mailom
        </a>
      </div>
    </div>
  );
}

export function Level3Gate({ onUnlocked }: UnlockGateProps) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function tryUnlock(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setPending(true);
    const res = await requestUnlock(code, 3);
    setPending(false);
    if (res.ok) {
      onUnlocked();
      return;
    }
    setMsg(res.error ?? "Neplatný kód alebo vypršaná platnosť.");
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-ember/30">
      <div className="pointer-events-none select-none p-5 blur-sm" aria-hidden>
        <p className="font-display text-lg text-ink-50">
          Expertný audit — príčiny a simulácia
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-200">
          {PLACEHOLDER_L3.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950/75 p-6 backdrop-blur-md">
        <Lock className="h-8 w-8 text-ember" aria-hidden />
        <p className="mt-2 font-display text-xl font-semibold text-ink-50">
          Premium Level 3
        </p>
        <p className="mt-1 max-w-sm text-center text-sm text-ink-200">
          Expertná diagnostika a simulačný režim — prístup po dohode
        </p>
        <form onSubmit={tryUnlock} className="mt-4 flex w-full max-w-xs gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PRÍSTUPOVÝ KÓD"
            aria-label="Prístupový kód Level 3"
            autoComplete="off"
            className="flex-1 rounded-md border border-white/15 bg-ink-900 px-3 py-2 text-sm uppercase text-ink-50 outline-none focus:border-signal"
          />
          <button
            type="submit"
            className="btn-primary !bg-ember !px-3 !py-2 !text-xs hover:!bg-ember-dim"
            disabled={pending}
          >
            {pending ? "…" : "Odomknúť"}
          </button>
        </form>
        {msg && (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {msg}
          </p>
        )}
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent("Premium Audit Level 3")}`}
          className="mt-3 text-xs text-ink-200 underline-offset-2 hover:text-ember hover:underline"
        >
          Požiadať o Premium e-mailom
        </a>
      </div>
    </div>
  );
}
