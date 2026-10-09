import type { AuditResult, LeadPayload } from "./audit/types";

const REPORT_API =
  process.env.NEXT_PUBLIC_AUDIT_REPORT_API_URL?.trim() ?? "";

export type AuditReportMailPayload = {
  lead_id?: string;
  full_name: string;
  work_email: string;
  company_name: string;
  phone: string;
  result: Pick<
    AuditResult,
    | "overallPercent"
    | "smeOverallPercent"
    | "wcOverallPercent"
    | "gapSmeEur"
    | "gapWcEur"
    | "sectorLabel"
    | "annualRevenueEur"
    | "cogsPercent"
    | "auditLevel"
    | "criticalProcess"
    | "processScores"
    | "recommendations"
    | "answeredCount"
    | "totalQuestions"
  >;
};

export function isAuditReportApiConfigured(): boolean {
  return Boolean(REPORT_API);
}

/**
 * Calls Supabase Edge Function which emails PDF to owner + client.
 * Failures are soft — lead is already saved in Supabase.
 */
export async function sendAuditReportEmail(
  payload: AuditReportMailPayload,
): Promise<{ ok: boolean; error?: string }> {
  if (!REPORT_API) {
    return { ok: false, error: "Report API nie je nakonfigurované." };
  }

  try {
    const res = await fetch(REPORT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      return {
        ok: false,
        error: data.error ?? `Odoslanie PDF zlyhalo (${res.status}).`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Odoslanie PDF zlyhalo (sieť)." };
  }
}

export function leadPayloadToReportMail(
  lead: LeadPayload,
  result: AuditResult,
  leadId?: string,
): AuditReportMailPayload {
  return {
    lead_id: leadId,
    full_name: lead.full_name,
    work_email: lead.work_email,
    company_name: lead.company_name,
    phone: lead.phone,
    result: {
      overallPercent: result.overallPercent,
      smeOverallPercent: result.smeOverallPercent,
      wcOverallPercent: result.wcOverallPercent,
      gapSmeEur: result.gapSmeEur,
      gapWcEur: result.gapWcEur,
      sectorLabel: result.sectorLabel,
      annualRevenueEur: result.annualRevenueEur,
      cogsPercent: result.cogsPercent,
      auditLevel: result.auditLevel,
      criticalProcess: result.criticalProcess,
      processScores: result.processScores,
      recommendations: result.recommendations,
      answeredCount: result.answeredCount,
      totalQuestions: result.totalQuestions,
    },
  };
}
