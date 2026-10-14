/**
 * Generate L1/L2/L3 fixture PDFs into tmp/ and assert extracted text.
 * No e-mail, no remote calls. Run: npx tsx scripts/tests/pdf-fixtures.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { disclaimerForLevel } from "../../src/config/audit-copy";
import { EXPERT_ESTIMATE_SOURCE_SK } from "../../shared/audit-presentation";
import { LEVEL1_QUESTIONS } from "../../src/lib/audit/questions";
import { calculateAuditResult } from "../../src/lib/audit/scoring";
import { buildResultView, toReportPresentation } from "../../src/lib/audit/presentation";
import type { AuditAnswers, PreAuditInput, VdaScore } from "../../src/lib/audit/types";
import {
  auditReportPdfFilename,
  type ReportBody,
} from "../../supabase/functions/send-audit-report/_shared";
import { buildPdf } from "../lib/build-audit-pdf-node";

const PRE: PreAuditInput = {
  sectorId: "general",
  annualRevenueEur: 500_000,
  cogsPercent: 65,
};

let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    failed += 1;
    console.error(`FAIL ${msg}`);
  }
}

function answers(score: VdaScore): AuditAnswers {
  return Object.fromEntries(LEVEL1_QUESTIONS.map((q) => [q.id, score]));
}

function norm(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

async function extractText(bytes: Uint8Array): Promise<string> {
  const parser = new PDFParse({ data: bytes });
  const result = await parser.getText();
  await parser.destroy();
  if (typeof result === "string") return result;
  if (result && typeof result === "object" && "text" in result) {
    return String((result as { text: string }).text);
  }
  return JSON.stringify(result);
}

function fixtureBody(level: 1 | 2 | 3): ReportBody {
  const result = calculateAuditResult(answers(6), PRE);
  result.auditLevel = level;
  result.totalQuestions = level === 1 ? 20 : level === 2 ? 60 : 180;
  result.answeredCount = result.totalQuestions;
  const view = buildResultView(level, { result, preAudit: PRE });
  const presentation = toReportPresentation(view);
  if (level >= 2) {
    presentation.questionBreakdown = [
      {
        processId: "P3",
        text: "Ukážková otázka kvality pre rozpis.",
        bandLabelSk: "slabé",
      },
      {
        processId: "P1",
        text: "Ukážková otázka plánovania pre rozpis.",
        bandLabelSk: "priemerné",
      },
    ];
  }
  return {
    full_name: "Test Majiteľ",
    work_email: "test@example.com",
    company_name: "Test MSP s.r.o.",
    phone: "+421900000000",
    result,
    presentation,
  };
}

async function main(): Promise<void> {
  const tmp = join(process.cwd(), "tmp");
  mkdirSync(tmp, { recursive: true });
  const source = EXPERT_ESTIMATE_SOURCE_SK;

  for (const level of [1, 2, 3] as const) {
    const body = fixtureBody(level);
    const bytes = await buildPdf(body, { theme: "light" });
    const buf = Buffer.from(bytes);
    console.log(`L${level} generated ${buf.length} bytes`);
    const name = auditReportPdfFilename(level, new Date());
    const path = join(tmp, name);
    writeFileSync(path, buf);
    const text = norm(await extractText(buf));
    const disc = norm(disclaimerForLevel(level));

    assert(text.includes(disc), `L${level} disclaimer present`);
    assert(text.includes(norm(source)), `L${level} source sentence present`);
    assert(!/odvetvov/i.test(text), `L${level} no odvetvov`);
    assert(!text.includes("efektivita %"), `L${level} no efektivita %`);
    if (level >= 2) {
      assert(!text.includes("Level 1"), `L${level} must not contain Level 1`);
      assert(
        text.includes("Rozpis po otázkach"),
        `L${level} breakdown heading`,
      );
    }
    assert(text.includes("Metodika a zdroje"), `L${level} methodology page`);
    console.log(`wrote ${path} (${buf.length} bytes)`);
  }

  if (failed > 0) {
    console.error(`${failed} assertion(s) failed`);
    process.exit(1);
  }
  console.log("pdf-fixtures: ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
