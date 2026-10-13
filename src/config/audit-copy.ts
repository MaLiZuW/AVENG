/**
 * Per-level audit copy. Slovak strings are verbatim.
 * No React/Node APIs — imported by the app and the report Edge Function.
 */

export type AuditLevelId = 1 | 2 | 3;

const DISCLAIMER: Record<AuditLevelId, string> = {
  1: "Výsledky Level 1 sú rýchla orientačná diagnostika založená na vašich odpovediach. Nepredstavujú záruku úspor. Pre presné priority a overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe.",
  2: "Výsledky Level 2 sú detailnejší, no stále orientačný odhad založený na vašich odpovediach. Nepredstavujú záruku úspor. Pre overenie dát a príčin odporúčame Level 3 alebo obchôdzku vo výrobe.",
  3: "Výsledky Level 3 sú expertná diagnostika založená na vašich odpovediach a vstupných dátach. Nepredstavujú záruku úspor. Pre overenie priamo vo výrobe odporúčame obchôdzku (Gemba Walk).",
};

const RELIABILITY_HINT: Record<AuditLevelId, string> = {
  1: "Spoľahlivosť zvýšite zadaním presných čísel alebo prechodom na Level 2.",
  2: "Spoľahlivosť zvýšite zadaním presných čísel pri otázkach, kde ich poznáte, alebo prechodom na Level 3.",
  3: "Spoľahlivosť zvýšite zadaním presných čísel a overením dát pri obchôdzke vo výrobe.",
};

const PDF_FOOTER: Record<AuditLevelId, string> = {
  1: "Orientačný skríning — nie je zárukou výsledku",
  2: "Detailný orientačný odhad — nie je zárukou výsledku",
  3: "Expertná diagnostika — nie je zárukou výsledku",
};

export function asAuditLevel(level: number): AuditLevelId {
  if (level === 2 || level === 3) return level;
  return 1;
}

export function disclaimerForLevel(level: number): string {
  return DISCLAIMER[asAuditLevel(level)];
}

export function reliabilityHintForLevel(level: number): string {
  return RELIABILITY_HINT[asAuditLevel(level)];
}

export function pdfFooterForLevel(level: number): string {
  return PDF_FOOTER[asAuditLevel(level)];
}

export function resultTitle(level: number, count: number): string {
  const n = asAuditLevel(level);
  const questions = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  return `Výsledky Level ${n} auditu (${questions} otázok)`;
}
