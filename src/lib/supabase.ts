import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LeadPayload } from "./audit/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function submitAuditLead(payload: LeadPayload): Promise<{
  ok: boolean;
  error?: string;
  id?: string;
}> {
  const sb = getSupabase();
  if (!sb) {
    if (typeof window !== "undefined") {
      const local = JSON.parse(
        localStorage.getItem("aveng_audit_leads") ?? "[]",
      ) as unknown[];
      const id = crypto.randomUUID();
      local.push({ id, ...payload, created_at: new Date().toISOString() });
      localStorage.setItem("aveng_audit_leads", JSON.stringify(local));
      return { ok: true, id };
    }
    return { ok: false, error: "Supabase nie je nakonfigurovaný." };
  }

  const { data: lead, error: leadError } = await sb
    .from("audit_leads")
    .insert({
      full_name: payload.full_name,
      work_email: payload.work_email,
      company_name: payload.company_name,
      phone: payload.phone,
      gdpr_consent: payload.gdpr_consent,
      audit_level: payload.audit_level,
      overall_score: payload.overall_score,
      financial_gap_eur: payload.financial_gap_eur,
      gap_sme_eur: payload.gap_sme_eur,
      gap_wc_eur: payload.gap_wc_eur,
      sector_id: payload.sector_id,
      annual_revenue_eur: payload.annual_revenue_eur,
      cogs_percent: payload.cogs_percent,
      critical_process_id: payload.critical_process_id,
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    return {
      ok: false,
      error: leadError?.message ?? "Nepodarilo sa uložiť lead.",
    };
  }

  const { error: resultError } = await sb.from("audit_results").insert({
    lead_id: lead.id,
    process_scores: payload.process_scores,
    recommendations: payload.recommendations,
    answers: payload.answers,
  });

  if (resultError) {
    return { ok: false, error: resultError.message };
  }

  return { ok: true, id: lead.id as string };
}
