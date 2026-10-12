"use client";

import { useEffect, useState } from "react";
import { company } from "@/config/company";

export default function GdprModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#gdpr") setOpen(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    if (window.location.hash === "#gdpr") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  return (
    <>
      <button
        type="button"
        className="text-ink-200 underline-offset-2 hover:text-signal-bright hover:underline"
        onClick={() => setOpen(true)}
      >
        Zásady spracovania osobných údajov (GDPR)
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gdpr-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-ink-900 p-6 shadow-glass animate-fade-up">
            <div className="flex items-start justify-between gap-4">
              <h2 id="gdpr-title" className="font-display text-xl font-semibold text-ink-50">
                Zásady ochrany osobných údajov
              </h2>
              <button
                type="button"
                className="rounded-md border border-white/15 px-2 py-1 text-sm text-ink-200 hover:bg-white/5"
                onClick={close}
                aria-label="Zavrieť"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-200">
              <p>
                Prevádzkovateľ:{" "}
                <strong className="text-ink-50">{company.legalName}</strong>, IČO{" "}
                {company.ico}, DIČ {company.dic}, {company.addressDisplay}. Kontakt:{" "}
                <a href={`mailto:${company.email}`} className="text-signal-bright">
                  {company.email}
                </a>
                , tel. {company.phoneDisplay}.
              </p>
              <p>
                Spracúvanie osobných údajov prebieha v súlade s Nariadením EÚ
                2016/679 (GDPR) a zákonom č. 18/2018 Z. z. o ochrane osobných
                údajov.
              </p>
              <p>
                <strong className="text-ink-50">Účel:</strong> generovanie
                výsledkov procesného auditu, stanovenie prioritných odporúčaní
                a následný obchodný kontakt súvisiaci s auditom / službami
                AddValueEngineering.
              </p>
              <p>
                <strong className="text-ink-50">Rozsah údajov:</strong> meno a
                priezvisko, pracovný e-mail, názov firmy, telefón, odpovede
                auditu a vypočítané skóre.
              </p>
              <p>
                <strong className="text-ink-50">Právny základ:</strong> súhlas
                dotknutej osoby (čl. 6 ods. 1 písm. a GDPR) udelený pred
                odoslaním lead formulára.
              </p>
              <p>
                <strong className="text-ink-50">Doba uchovávania:</strong>{" "}
                maximálne <strong className="text-ink-50">28 dní</strong> od
                vytvorenia záznamu. Po uplynutí tejto lehoty sú údaje
                automaticky a neodvolateľne vymazané z databázy (pg_cron
                purge job — pozri supabase/purge-28day.sql).
              </p>
              <p>
                <strong className="text-ink-50">Práva:</strong> máte právo na
                prístup, opravu, výmaz, obmedzenie spracúvania, prenosnosť a
                odvolanie súhlasu. Sťažnosť môžete podať na Úrad na ochranu
                osobných údajov SR.
              </p>
              <p>
                Údaje nie sú predávané tretím stranám na marketing. Hosting dát:
                Supabase (EÚ región podľa konfigurácie projektu) + WebSupport
                (statický frontend).
              </p>
            </div>

            <button type="button" className="btn-primary mt-6" onClick={close}>
              Rozumiem
            </button>
          </div>
        </div>
      )}
    </>
  );
}
