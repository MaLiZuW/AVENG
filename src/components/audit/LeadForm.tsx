"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  FOLLOWUP_CONSENT_ENABLED,
  followupConsentLabelSk,
  retentionPeriodClaimSk,
} from "@/config/retention";
import type { AuditAnswers, AuditResult, PreAuditInput } from "@/lib/audit/types";
import {
  isAuditReportApiConfigured,
  leadPayloadToReportMail,
  sendAuditReportEmail,
} from "@/lib/sendAuditReport";
import { submitAuditLead } from "@/lib/supabase";

interface Props {
  result: AuditResult;
  answers: AuditAnswers;
  preAudit: PreAuditInput;
  onSuccess?: () => void;
}

export default function LeadForm({
  result,
  answers,
  preAudit,
  onSuccess,
}: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [mailNote, setMailNote] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [followupConsent, setFollowupConsent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Pre odoslanie je potrebný súhlas so spracovaním údajov.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const full_name = String(fd.get("full_name") ?? "").trim();
    const work_email = String(fd.get("work_email") ?? "").trim();
    const company_name = String(fd.get("company_name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();

    if (!full_name || !work_email || !company_name) {
      setError("Vyplňte meno, pracovný e-mail a názov firmy.");
      return;
    }

    setPending(true);
    const leadPayload = {
      full_name,
      work_email,
      company_name,
      phone,
      gdpr_consent: true,
      overall_score: result.overallPercent,
      financial_gap_eur: result.gapWcEur,
      gap_sme_eur: result.gapSmeEur,
      gap_wc_eur: result.gapWcEur,
      sector_id: preAudit.sectorId,
      annual_revenue_eur: preAudit.annualRevenueEur,
      cogs_percent: preAudit.cogsPercent,
      critical_process_id: result.criticalProcess.processId,
      process_scores: result.processScores,
      recommendations: result.recommendations,
      answers,
      audit_level: result.auditLevel,
    };
    const res = await submitAuditLead(leadPayload);
    if (!res.ok) {
      setPending(false);
      setError(res.error ?? "Odoslanie zlyhalo. Skúste znova.");
      return;
    }

    if (isAuditReportApiConfigured()) {
      const mail = await sendAuditReportEmail(
        leadPayloadToReportMail(leadPayload, result, res.id),
      );
      setMailNote(
        mail.ok
          ? "Vaše údaje boli uložené."
          : "Vaše údaje boli uložené. E-mail sa nepodarilo odoslať — ozveme sa vám manuálne.",
      );
    } else {
      setMailNote("Vaše údaje boli uložené.");
    }

    setPending(false);
    setDone(true);
    onSuccess?.();
  }

  if (done) {
    return (
      <div className="steel-panel p-5 text-center" role="status">
        <p className="font-display text-lg font-semibold text-signal-bright">
          Ďakujeme — správa vám bola odoslaná
        </p>
        <p className="mt-2 text-sm text-ink-200">
          {mailNote ?? "Vaše údaje boli uložené."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="steel-panel space-y-4 p-5" noValidate>
      <h3 className="font-display text-lg font-semibold text-ink-50">
        Získať správu a 3 prioritné odporúčania
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-ink-300">Meno a priezvisko</span>
          <input
            name="full_name"
            required
            autoComplete="name"
            className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-ink-300">Pracovný E-mail</span>
          <input
            name="work_email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-ink-300">Názov firmy</span>
          <input
            name="company_name"
            required
            autoComplete="organization"
            className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-ink-300">Telefón</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-md border border-white/15 bg-ink-950 px-3 py-2 text-ink-50 outline-none focus:border-signal"
          />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-200">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-signal"
          required
        />
        <span>
          Súhlasím so spracovaním osobných údajov. {retentionPeriodClaimSk()}.{" "}
          <Link
            href="/ochrana-osobnych-udajov/"
            className="text-signal-bright underline-offset-2 hover:underline"
          >
            Zásady ochrany osobných údajov
          </Link>
          .
        </span>
      </label>

      {FOLLOWUP_CONSENT_ENABLED ? (
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-200">
          <input
            type="checkbox"
            checked={followupConsent}
            onChange={(e) => setFollowupConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-signal"
          />
          <span>{followupConsentLabelSk()}</span>
        </label>
      ) : null}

      {/* followupConsent reserved for API when FOLLOWUP_CONSENT_ENABLED + migration */}
      <input type="hidden" name="followup_consent" value={followupConsent ? "1" : "0"} />

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Odosielam…" : "Odoslať a uložiť výsledky"}
      </button>
    </form>
  );
}
