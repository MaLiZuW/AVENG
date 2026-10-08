/**
 * Read-only sanity profiles through existing calculateAuditResult.
 * Does not modify config or math. Output: docs/audit-sanity-report.md
 *
 * Run: npx --yes tsx scripts/audit-sanity.ts
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PROCESSES } from "../src/lib/audit/benchmarks";
import { LEVEL1_QUESTIONS } from "../src/lib/audit/questions";
import { calculateAuditResult } from "../src/lib/audit/scoring";
import type {
  AuditAnswers,
  PreAuditInput,
  ProcessId,
  VdaScore,
} from "../src/lib/audit/types";

const PRE: PreAuditInput = {
  sectorId: "general",
  annualRevenueEur: 5_000_000,
  cogsPercent: 65,
};

const VDA: VdaScore[] = [0, 4, 6, 8, 10];

function fillAll(score: VdaScore): AuditAnswers {
  return Object.fromEntries(LEVEL1_QUESTIONS.map((q) => [q.id, score]));
}

function fillByProcess(map: Record<ProcessId, VdaScore>): AuditAnswers {
  return Object.fromEntries(
    LEVEL1_QUESTIONS.map((q) => [q.id, map[q.processId] ?? 6]),
  );
}

const profiles: { name: string; answers: AuditAnswers }[] = [
  { name: "all_A", answers: fillAll(0) },
  { name: "all_E", answers: fillAll(10) },
  { name: "average_C", answers: fillAll(6) },
  { name: "good_D", answers: fillAll(8) },
  { name: "weak_B", answers: fillAll(4) },
  {
    name: "one_very_bad_domain_P3",
    answers: fillByProcess({ P1: 8, P2: 8, P3: 0, P4: 8, P5: 8 }),
  },
  {
    name: "mixed",
    answers: Object.fromEntries(
      LEVEL1_QUESTIONS.map((q, i) => [q.id, VDA[i % VDA.length]]),
    ),
  },
  {
    name: "borderline_near_MSP",
    answers: fillAll(6),
  },
];

type Row = {
  name: string;
  overall: number;
  gapSme: number;
  gapWc: number;
  costBase: number;
  shareSme: number;
  shareWc: number;
  ratioWcSme: number | null;
  domains: string;
};

const rows: Row[] = profiles.map(({ name, answers }) => {
  const r = calculateAuditResult(answers, PRE);
  const costBase = r.processScores.reduce((a, p) => a + p.costBaseEur, 0);
  const shareSme = costBase > 0 ? r.gapSmeEur / costBase : 0;
  const shareWc = costBase > 0 ? r.gapWcEur / costBase : 0;
  const domains = r.processScores
    .map(
      (p) =>
        `${p.processId}:${p.percent.toFixed(1)}%(smeGap=${p.gapSmeEur},wcGap=${p.gapWcEur})`,
    )
    .join("; ");
  return {
    name,
    overall: r.overallPercent,
    gapSme: r.gapSmeEur,
    gapWc: r.gapWcEur,
    costBase,
    shareSme,
    shareWc,
    ratioWcSme: r.gapSmeEur > 0 ? r.gapWcEur / r.gapSmeEur : null,
    domains,
  };
});

const coeffs = PROCESSES.map(
  (p) =>
    `| ${p.id} | ${p.weight} | ${p.costFactor} | ${p.wcMultiplier} |`,
).join("\n");

const table = rows
  .map(
    (r) =>
      `| ${r.name} | ${r.overall.toFixed(1)} | ${r.gapSme} | ${r.gapWc} | ${r.costBase} | ${(r.shareSme * 100).toFixed(1)}% | ${(r.shareWc * 100).toFixed(1)}% | ${r.ratioWcSme === null ? "—" : r.ratioWcSme.toFixed(2)} |`,
  )
  .join("\n");

const detail = rows
  .map((r) => `### ${r.name}\n\n\`${r.domains}\`\n`)
  .join("\n");

const highWc = rows.filter((r) => r.shareWc > 0.5);

const md = `# Audit sanity report (read-only)

Generated: ${new Date().toISOString()}
Pre-audit: revenue ${PRE.annualRevenueEur} €, COGS ${PRE.cogsPercent} %, sector ${PRE.sectorId}.
Engine: existing \`calculateAuditResult\` — **no math changes**.

## Coefficients (from PROCESSES)

| Process | weight | costFactor (C_Pi) | wcMultiplier (related to M_WC path) |
|---|---|---|---|
${coeffs}

## Profiles

| Profile | overall % | Gap MSP € | Gap WC € | Cost base € | Share MSP | Share WC | WC/MSP |
|---|---|---|---|---|---|---|---|
${table}

## Domain detail

${detail}

## Flags for owner

- Profiles with world-class share of cost base **> 50 %**: ${
  highWc.length
    ? highWc.map((r) => r.name).join(", ")
    : "none"
}
- \`SHOW_WORLD_CLASS_CEILING\` default is **false** until owner decides.
- \`MAX_DISPLAYED_POTENTIAL_SHARE\` placeholder = 0.35 (display only).

## Note

This report does **not** recommend changing \`k_Pi\`, \`S_SME\`, \`S_WC\` or \`M_WC\`.
If WC shares look unrealistic for typical plants, record decision in \`docs/OWNER_DECISIONS.md\`.
`;

const out = join(process.cwd(), "docs", "audit-sanity-report.md");
writeFileSync(out, md, "utf8");
console.log(`Wrote ${out}`);
for (const r of rows) {
  console.log(
    r.name,
    `MSP=${r.gapSme}`,
    `WC=${r.gapWc}`,
    `WCshare=${(r.shareWc * 100).toFixed(1)}%`,
  );
}
