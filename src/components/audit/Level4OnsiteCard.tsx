"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { company } from "@/config/company";
import { formatEur } from "@/lib/audit/scoring";
import { CONTACT_INBOX, submitContactRequest } from "@/lib/submitContactRequest";

interface Props {
  gapSmeEur: number;
  totalCostBaseEur: number;
  ratio: number;
}

export default function Level4OnsiteCard({
  gapSmeEur,
  totalCostBaseEur,
  ratio,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const titleId = useId();
  const pct = Math.round(ratio * 1000) / 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function openModal() {
    setDone(false);
    setError(null);
    setConsent(false);
    setPending(false);
    setOpen(true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Pre odoslanie je potrebný súhlas so spracovaním údajov.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("name") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!fullName || !company || !phone || !email) {
      setError("Vyplňte meno, firmu, telefón a e-mail.");
      return;
    }

    setPending(true);
    const res = await submitContactRequest({
      requestType: "meeting",
      fullName,
      company,
      phone,
      email,
      message,
      meta: {
        source: "Level 4 On-site card (L1 dashboard)",
        gapSmeEur,
        totalCostBaseEur,
        lossRatioPercent: pct,
      },
    });
    setPending(false);

    if (!res.ok) {
      setError(res.error ?? "Odoslanie zlyhalo. Skúste znova alebo zavolajte.");
      return;
    }

    setDone(true);
  }

  return (
    <>
      <div className="steel-panel border-ember/50 bg-ember/5 p-5 sm:p-6 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-wider text-ember">
          Odporúčaný ďalší krok: obchôdzka vo výrobe (Gemba Walk)
        </p>
        <h4 className="mt-2 font-display text-xl font-semibold text-ink-50">
          Výsledok naznačuje významnú medzeru (&gt; 15 % modelovej nákladovej
          bázy procesov)
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-ink-200">
          Odporúčame overenie priamo vo výrobe (Gemba Walk) a dohodu ďalšieho
          postupu — nie automatickú záruku úspor.
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-300">Medzera voči referencii MSP</dt>
            <dd className="font-semibold text-ember">
              {formatEur(gapSmeEur)} / rok
            </dd>
          </div>
          <div>
            <dt className="text-ink-300">Nákladová báza procesov</dt>
            <dd className="font-semibold text-ink-100">
              {formatEur(totalCostBaseEur)}
            </dd>
          </div>
          <div>
            <dt className="text-ink-300">% z modelovej nákladovej bázy</dt>
            <dd className="font-semibold text-ink-100">{pct} %</dd>
          </div>
        </dl>
        <button type="button" className="btn-primary mt-5" onClick={openModal}>
          Dohodnúť termín obchôdzky vo výrobe
        </button>
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="my-auto w-full max-w-lg max-h-[min(90dvh,44rem)] overflow-y-auto rounded-lg border border-white/10 bg-ink-900 p-6 shadow-glass animate-fade-up">
              <div className="flex items-start justify-between gap-3">
                <h3
                  id={titleId}
                  className="font-display text-lg font-semibold text-ink-50"
                >
                  Žiadosť o stretnutie / CP
                </h3>
                <button
                  type="button"
                  className="rounded-md border border-white/15 px-2 py-1 text-sm text-ink-200 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                  aria-label="Zavrieť"
                >
                  ✕
                </button>
              </div>

              {done ? (
                <div className="mt-4 space-y-3" role="status">
                  <p className="font-display text-lg font-semibold text-signal-bright">
                    Žiadosť bola odoslaná
                  </p>
                  <p className="text-sm text-ink-200">
                    Ďakujeme. Požiadavka odišla na{" "}
                    <span className="text-ink-50">{CONTACT_INBOX}</span>. Ozveme
                    sa vám ohľadom termínu alebo cenovej ponuky.
                  </p>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setOpen(false)}
                  >
                    Zavrieť
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-ink-200">
                    Vyplňte formulár — žiadosť sa odošle priamo na AVENG (bez
                    otvárania e-mailového klienta).
                  </p>

                  <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm sm:col-span-1">
                        <span className="mb-1 block text-ink-200">Meno</span>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block text-ink-200">Firma</span>
                        <input
                          name="company"
                          required
                          autoComplete="organization"
                          className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block text-ink-200">Telefón</span>
                        <input
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1 block text-ink-200">E-mail</span>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                        />
                      </label>
                    </div>

                    <label className="block text-sm">
                      <span className="mb-1 block text-ink-200">
                        Správa / požiadavka
                      </span>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Napr. preferovaný termín, lokalita závodu, rozsah CP…"
                        className="w-full resize-y rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
                      />
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-200">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-signal"
                        required
                      />
                      <span>
                        Súhlasím so spracovaním údajov za účelom vybavenia
                        žiadosti. Dáta budú po 28 dňoch vymazané.
                      </span>
                    </label>

                    {error && (
                      <p className="text-sm text-red-400" role="alert">
                        {error}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={pending}
                      >
                        {pending ? "Odosielam…" : "Odoslať žiadosť"}
                      </button>
                      <a
                        href={`tel:${company.phoneTel}`}
                        className="btn-secondary !text-sm"
                      >
                        Zavolať {company.phoneDisplay}
                      </a>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
