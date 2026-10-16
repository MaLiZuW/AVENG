"use client";

import { FormEvent, useState } from "react";
import { Calendar, Crown, Lock, Shield } from "lucide-react";
import {
  accessCodeHref,
  AUDIT_LEVELS,
  LEVEL_ACCESS_CODE_HINT_SK,
  levelBadge,
  personalMeetingHref,
} from "@/config/levels";
import TrackBookingLink from "@/components/TrackBookingLink";
import { track } from "@/lib/analytics";
import { requestUnlock } from "@/lib/unlock/session";

interface UnlockGateProps {
  onUnlocked: () => void;
}

function UnlockCodeForm({
  level,
  accent,
  pending,
  code,
  msg,
  onCodeChange,
  onSubmit,
}: {
  level: 2 | 3;
  accent: "silver" | "gold";
  pending: boolean;
  code: string;
  msg: string | null;
  onCodeChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const focus =
    accent === "gold"
      ? "focus:border-[#d4af37]"
      : "focus:border-[#c0c7d4]";
  const btn =
    accent === "gold"
      ? "bg-gradient-to-b from-[#e8c547] to-[#b8860b] text-ink-950 hover:from-[#f0d060] hover:to-[#c9971a]"
      : "bg-gradient-to-b from-[#e8edf5] to-[#9aa8bc] text-ink-950 hover:from-white hover:to-[#b6c2d4]";

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="PRÍSTUPOVÝ KÓD"
          aria-label={`Prístupový kód Level ${level}`}
          autoComplete="off"
          className={`min-w-0 flex-1 rounded-md border border-white/15 bg-ink-950/80 px-3 py-2.5 text-sm uppercase tracking-wide text-ink-50 outline-none ${focus}`}
        />
        <button
          type="submit"
          className={`shrink-0 rounded-md px-4 py-2.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-60 ${btn}`}
          disabled={pending}
        >
          {pending ? "…" : "Odomknúť"}
        </button>
      </div>
      {msg && (
        <p className="text-xs text-red-400" role="alert">
          {msg}
        </p>
      )}
    </form>
  );
}

/** Shown on Level 2 results when Level 2 is already unlocked. */
export function Level2UnlockedNotice() {
  return (
    <article
      id="level-2"
      className="relative scroll-mt-28 rounded-xl border border-[#c0c7d4]/40 bg-ink-900/80 p-5 sm:p-6"
    >
      <p className="inline-flex items-center gap-1.5 rounded-md border border-[#c0c7d4]/40 bg-[#c0c7d4]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e8edf5]">
        <Shield className="h-3.5 w-3.5" aria-hidden />
        {levelBadge(2)}
      </p>
      <p className="mt-3 font-display text-lg font-semibold text-ink-50">
        Level 2 je odomknutý
      </p>
    </article>
  );
}

export function Level2Gate({ onUnlocked }: UnlockGateProps) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const meeting = personalMeetingHref();

  async function tryUnlock(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setPending(true);
    track("unlock_attempt", { level: 2 });
    const res = await requestUnlock(code, 2);
    setPending(false);
    if (res.ok) {
      track("unlock_success", { level: 2 });
      onUnlocked();
      return;
    }
    setMsg(res.error ?? "Neplatný kód alebo vypršaná platnosť.");
  }

  return (
    <>
      <article
        id="level-2"
        className="relative scroll-mt-28 overflow-hidden rounded-xl border-2 border-[#c0c7d4]/70 bg-gradient-to-br from-[#1a2030] via-ink-900 to-ink-950 p-5 shadow-[0_0_0_1px_rgba(192,199,212,0.25),0_12px_40px_rgba(0,0,0,0.35)] sm:p-6"
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#c0c7d4]/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-md border border-[#c0c7d4]/40 bg-[#c0c7d4]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e8edf5]">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              {levelBadge(2)}
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink-50 sm:text-2xl">
              Detailný audit pre rozhodnutia majiteľa
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">
              Rozpis po otázkach, prioritizácia podľa finančného dopadu, podklad
              na poradu majiteľov.
            </p>
          </div>
          <Lock className="h-7 w-7 shrink-0 text-[#c0c7d4]" aria-hidden />
        </div>

        <div className="relative mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-[#c0c7d4]/25 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-ink-300">
              Investícia
            </p>
            <p className="font-display text-3xl font-semibold text-[#e8edf5]">
              {AUDIT_LEVELS[2].priceLabel}
            </p>
          </div>
          <p className="max-w-[16rem] text-right text-xs text-ink-300">
            {LEVEL_ACCESS_CODE_HINT_SK}
          </p>
        </div>

        <UnlockCodeForm
          level={2}
          accent="silver"
          pending={pending}
          code={code}
          msg={msg}
          onCodeChange={setCode}
          onSubmit={tryUnlock}
        />

        <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href={accessCodeHref(2)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#c0c7d4]/50 bg-[#c0c7d4]/10 px-4 py-2.5 text-sm font-semibold text-ink-50 transition hover:bg-[#c0c7d4]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0c7d4]"
          >
            Objednať Level 2
          </a>
          {meeting.external ? (
            <TrackBookingLink
              href={meeting.href}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Dohodnúť osobnú schôdzku
            </TrackBookingLink>
          ) : (
            <a
              href={meeting.href}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Dohodnúť osobnú schôdzku
            </a>
          )}
        </div>
      </article>
    </>
  );
}

export function Level3Gate({ onUnlocked }: UnlockGateProps) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const meeting = personalMeetingHref();

  async function tryUnlock(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setPending(true);
    track("unlock_attempt", { level: 3 });
    const res = await requestUnlock(code, 3);
    setPending(false);
    if (res.ok) {
      track("unlock_success", { level: 3 });
      onUnlocked();
      return;
    }
    setMsg(res.error ?? "Neplatný kód alebo vypršaná platnosť.");
  }

  return (
    <>
      <article
        id="level-3"
        className="relative scroll-mt-28 overflow-hidden rounded-xl border-2 border-[#d4af37]/75 bg-gradient-to-br from-[#2a2210] via-ink-900 to-ink-950 p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.3),0_12px_40px_rgba(0,0,0,0.4)] sm:p-6"
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#d4af37]/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-md border border-[#d4af37]/45 bg-[#d4af37]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f0d78c]">
              <Crown className="h-3.5 w-3.5" aria-hidden />
              {levelBadge(3)}
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink-50 sm:text-2xl">
              Expertná diagnostika &amp; DTO simulátor
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">
              Keď potrebujete vedieť nielen kde unikajú peniaze, ale čo sa stane
              po konkrétnej investícii — pred podpisom rozpočtu.
            </p>
          </div>
          <Lock className="h-7 w-7 shrink-0 text-[#d4af37]" aria-hidden />
        </div>

        <div className="relative mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-[#d4af37]/30 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-ink-300">
              Prístup
            </p>
            <p className="font-display text-2xl font-semibold text-[#f0d78c]">
              {AUDIT_LEVELS[3].priceLabel}
            </p>
          </div>
          <p className="max-w-[16rem] text-right text-xs text-ink-300">
            {LEVEL_ACCESS_CODE_HINT_SK}
          </p>
        </div>

        <UnlockCodeForm
          level={3}
          accent="gold"
          pending={pending}
          code={code}
          msg={msg}
          onCodeChange={setCode}
          onSubmit={tryUnlock}
        />

        <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href={accessCodeHref(3)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#d4af37]/55 bg-[#d4af37]/15 px-4 py-2.5 text-sm font-semibold text-[#f5e6b8] transition hover:bg-[#d4af37]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
          >
            Objednať Level 3
          </a>
          {meeting.external ? (
            <TrackBookingLink
              href={meeting.href}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Dohodnúť osobnú schôdzku
            </TrackBookingLink>
          ) : (
            <a
              href={meeting.href}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Dohodnúť osobnú schôdzku
            </a>
          )}
        </div>
      </article>
    </>
  );
}
