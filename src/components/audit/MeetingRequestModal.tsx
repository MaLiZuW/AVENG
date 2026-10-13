"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { company } from "@/config/company";
import { retentionPeriodClaimSk } from "@/config/retention";
import {
  CONTACT_INBOX,
  submitContactRequest,
  type ContactRequestType,
} from "@/lib/submitContactRequest";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Shown in modal title and meta.source */
  sourceLabel: string;
  title?: string;
  /** Fixed request type — no type picker in UI */
  requestType?: ContactRequestType;
  intro?: string;
  messagePlaceholder?: string;
  successNote?: string;
}

export default function MeetingRequestModal({
  open,
  onClose,
  sourceLabel,
  title = "Dohodnúť osobnú schôdzku",
  requestType = "meeting",
  intro = "Vyplňte formulár — žiadosť sa odošle priamo na AVENG (bez otvárania e-mailového klienta).",
  messagePlaceholder = "Napr. preferovaný termín, lokalita závodu…",
  successNote = "Ozveme sa vám ohľadom termínu.",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setDone(false);
      setError(null);
      setConsent(false);
      setPending(false);
    }
  }, [open]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Pre odoslanie je potrebný súhlas so spracovaním údajov.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("name") ?? "").trim();
    const companyName = String(fd.get("company") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!fullName || !companyName || !phone || !email) {
      setError("Vyplňte meno, firmu, telefón a e-mail.");
      return;
    }

    setPending(true);
    const res = await submitContactRequest({
      requestType,
      fullName,
      company: companyName,
      phone,
      email,
      message,
      meta: { source: sourceLabel },
    });
    setPending(false);
    if (!res.ok) {
      setError(
        res.error ??
          "Odoslanie sa nepodarilo. Napíšte nám prosím na vladimir@addvalueengineering.sk.",
      );
      return;
    }
    setDone(true);
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-lg max-h-[min(90dvh,44rem)] overflow-y-auto rounded-lg border border-white/10 bg-ink-900 p-6 shadow-glass animate-fade-up">
        <div className="flex items-start justify-between gap-3">
          <h3
            id={titleId}
            className="font-display text-lg font-semibold text-ink-50"
          >
            {title}
          </h3>
          <button
            type="button"
            className="rounded-md border border-white/15 p-1.5 text-ink-200 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
            onClick={onClose}
            aria-label="Zavrieť"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {done ? (
          <div className="mt-4 space-y-3" role="status">
            <p className="font-display text-lg font-semibold text-signal-bright">
              Žiadosť bola odoslaná
            </p>
            <p className="text-sm text-ink-200">
              Ďakujeme. Požiadavka odišla na{" "}
              <span className="text-ink-50">{CONTACT_INBOX}</span>.{" "}
              {successNote}
            </p>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Zavrieť
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink-200">{intro}</p>

            <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
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
                  rows={3}
                  placeholder={messagePlaceholder}
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
                  Súhlasím so spracovaním údajov za účelom vybavenia žiadosti.{" "}
                  {retentionPeriodClaimSk()}{" "}
                  <Link
                    href="/ochrana-osobnych-udajov/"
                    className="text-signal-bright underline-offset-2 hover:underline"
                  >
                    Zásady
                  </Link>
                  .
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
  );
}
