import {
  PDFDocument,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { MARK_PNG_B64 } from "./mark";
import {
  BRAND,
  bookingUrlFromEnv,
  COL_COST_BASE_SK,
  COL_COGS_SHARE_SK,
  COL_DOMAIN_SK,
  COL_REF_SOURCE_SK,
  COST_BASE_SHARES_NOTE_SK,
  costBaseDisclosureRowsForReport,
  CTA_MAIL,
  CTA_PHONE,
  disclaimerForLevel,
  EXPERT_ESTIMATE_SOURCE_SK,
  LABEL_COST_BASE_TABLE_SK,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_MATURITY_TABLE_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  NOTE_MATURITY_TABLE_SK,
  SITE,
  domainLabel,
  eur,
  formatGapEur,
  formatProcessGap,
  pct,
  pdfFooterForLevel,
  reliabilityBlock,
  sortedByGap,
  upsellForLevel,
  type ReportBody,
} from "../../supabase/functions/send-audit-report/_shared";

export type PdfThemeName = "light" | "dark";

type Theme = {
  bg: ReturnType<typeof rgb>;
  surface: ReturnType<typeof rgb>;
  card: ReturnType<typeof rgb>;
  signal: ReturnType<typeof rgb>;
  signalBright: ReturnType<typeof rgb>;
  ember: ReturnType<typeof rgb>;
  ink: ReturnType<typeof rgb>;
  muted: ReturnType<typeof rgb>;
  track: ReturnType<typeof rgb>;
  white: ReturnType<typeof rgb>;
  line: ReturnType<typeof rgb>;
  onSignal: ReturnType<typeof rgb>;
};

const THEMES: Record<PdfThemeName, Theme> = {
  light: {
    bg: rgb(1, 1, 1),
    surface: rgb(0.96, 0.97, 0.985),
    card: rgb(0.97, 0.975, 0.99),
    signal: rgb(0.184, 0.435, 0.929),
    signalBright: rgb(0.12, 0.35, 0.82),
    ember: rgb(0.72, 0.45, 0.12),
    ink: rgb(0.08, 0.1, 0.14),
    muted: rgb(0.35, 0.4, 0.48),
    track: rgb(0.88, 0.9, 0.93),
    white: rgb(1, 1, 1),
    line: rgb(0.82, 0.85, 0.9),
    onSignal: rgb(1, 1, 1),
  },
  dark: {
    bg: rgb(0.027, 0.043, 0.071),
    surface: rgb(0.059, 0.09, 0.165),
    card: rgb(0.08, 0.12, 0.2),
    signal: rgb(0.184, 0.435, 0.929),
    signalBright: rgb(0.357, 0.576, 1),
    ember: rgb(0.91, 0.647, 0.294),
    ink: rgb(0.91, 0.93, 0.96),
    muted: rgb(0.58, 0.64, 0.72),
    track: rgb(0.12, 0.16, 0.24),
    white: rgb(1, 1, 1),
    line: rgb(0.18, 0.22, 0.3),
    onSignal: rgb(1, 1, 1),
  },
};

let C: Theme = THEMES.light;

let cachedRegular: Uint8Array | null = null;
let cachedBold: Uint8Array | null = null;

async function loadFonts() {
  if (cachedRegular && cachedBold) {
    return { regular: cachedRegular, bold: cachedBold };
  }
  const [reg, bold] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
    ).then((r) => r.arrayBuffer()),
    fetch(
      "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
    ).then((r) => r.arrayBuffer()),
  ]);
  cachedRegular = new Uint8Array(reg);
  cachedBold = new Uint8Array(bold);
  return { regular: cachedRegular, bold: cachedBold };
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function fill(page: PDFPage) {
  const { width, height } = page.getSize();
  page.drawRectangle({ x: 0, y: 0, width, height, color: C.bg });
}

function addUriLink(
  pdf: PDFDocument,
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  uri: string,
) {
  const link = pdf.context.register(
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + w, y + h],
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: pdf.context.obj(uri),
      },
    }),
  );
  page.node.addAnnot(link);
}

function footer(
  page: PDFPage,
  font: PDFFont,
  n: number,
  total: number,
  auditLevel: number,
) {
  const { width } = page.getSize();
  page.drawText(`${BRAND} · Self-Audit report · ${n}/${total}`, {
    x: 40,
    y: 26,
    size: 8,
    font,
    color: C.muted,
  });
  const right = pdfFooterForLevel(auditLevel);
  page.drawText(right, {
    x: width - 40 - font.widthOfTextAtSize(right, 8),
    y: 26,
    size: 8,
    font,
    color: C.muted,
  });
}

function drawRadar(
  page: PDFPage,
  cx: number,
  cy: number,
  radius: number,
  values: number[],
  sme: number[],
  labels: string[],
  font: PDFFont,
) {
  const n = values.length;
  const angle0 = -Math.PI / 2;
  const pt = (i: number, r: number) => {
    const a = angle0 + (i * 2 * Math.PI) / n;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  for (const ring of [0.33, 0.66, 1]) {
    const pts = Array.from({ length: n }, (_, i) => pt(i, radius * ring));
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      page.drawLine({
        start: a,
        end: b,
        thickness: 0.6,
        color: C.line,
      });
    }
  }
  for (let i = 0; i < n; i++) {
    const tip = pt(i, radius);
    page.drawLine({
      start: { x: cx, y: cy },
      end: tip,
      thickness: 0.5,
      color: C.line,
    });
    const lab = pt(i, radius + 14);
    const t = labels[i] ?? "";
    page.drawText(t, {
      x: lab.x - font.widthOfTextAtSize(t, 7) / 2,
      y: lab.y - 3,
      size: 7,
      font,
      color: C.muted,
    });
  }

  const poly = (vals: number[], color: ReturnType<typeof rgb>, thick: number) => {
    const pts = vals.map((v, i) => pt(i, radius * Math.min(1, Math.max(0, v / 100))));
    for (let i = 0; i < n; i++) {
      page.drawLine({
        start: pts[i],
        end: pts[(i + 1) % n],
        thickness: thick,
        color,
      });
    }
  };
  poly(sme, C.ember, 1.4);
  poly(values, C.signalBright, 2);
}

export type BuildPdfOptions = {
  theme?: PdfThemeName;
  bookingUrl?: string | null;
  getEnv?: (key: string) => string | undefined;
};

export async function buildPdf(
  body: ReportBody,
  options: BuildPdfOptions = {},
): Promise<Uint8Array> {
  C = THEMES[options.theme === "dark" ? "dark" : "light"];
  const r = body.result!;
  const level = r.auditLevel ?? 1;
  const scores = r.processScores ?? [];
  const sorted = sortedByGap(scores);
  const maxGap = Math.max(...sorted.map((s) => s.gapSmeEur), 1);
  const recs = (r.recommendations ?? []).slice(0, 3);
  const cp = r.criticalProcess;
  const company = body.company_name ?? "";
  const upsell = upsellForLevel(level, company);
  const headline = formatGapEur(
    body.presentation?.gapSmeLowEur,
    body.presentation?.gapSmeHighEur,
    r.gapSmeEur ?? 0,
  );
  const rel = reliabilityBlock(body.presentation?.reliabilityLevel, level);
  const date = new Date().toLocaleDateString("sk-SK");
  const breakdown = body.presentation?.questionBreakdown ?? [];
  const hasBreakdown = level >= 2 && breakdown.length > 0;
  /** cover + table + radar + CTA + optional breakdown + methodology */
  const TOTAL = hasBreakdown ? 6 : 5;
  const booking =
    options.bookingUrl !== undefined
      ? options.bookingUrl
      : bookingUrlFromEnv(options.getEnv);

  const pdf = await PDFDocument.create();
  pdf.setTitle(`AVENG Self-Audit Level ${level} — ${company || "report"}`);
  pdf.setAuthor("AddValueEngineering");
  pdf.setLanguage("sk");
  pdf.registerFontkit(fontkit);
  const { regular, bold } = await loadFonts();
  const font = await pdf.embedFont(regular, { subset: true });
  const fontBold = await pdf.embedFont(bold, { subset: true });
  let mark: PDFImage | null = null;
  try {
    const markBytes = Uint8Array.from(atob(MARK_PNG_B64), (c) =>
      c.charCodeAt(0),
    );
    mark = await pdf.embedPng(markBytes);
  } catch {
    mark = null;
  }

  // ═══════════════ PAGE 1 — Cover ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 0,
      y: height - 168,
      width,
      height: 168,
      color: C.surface,
    });
    page.drawRectangle({
      x: 0,
      y: height - 172,
      width,
      height: 4,
      color: C.signal,
    });

    if (mark) {
      page.drawImage(mark, { x: 40, y: height - 78, width: 40, height: 28 });
    }
    page.drawText(BRAND, {
      x: mark ? 92 : 40,
      y: height - 66,
      size: 18,
      font: fontBold,
      color: C.ink,
    });
    page.drawText(`SELF-AUDIT REPORT · LEVEL ${level}`, {
      x: 40,
      y: height - 104,
      size: 9,
      font: fontBold,
      color: C.signalBright,
    });
    page.drawText(date, {
      x: width - 40 - font.widthOfTextAtSize(date, 9),
      y: height - 66,
      size: 9,
      font,
      color: C.muted,
    });
    page.drawText(`${r.sectorLabel ?? "—"}  ·  ${company}`, {
      x: 40,
      y: height - 128,
      size: 11,
      font,
      color: C.muted,
    });
    page.drawText(body.full_name ?? "", {
      x: 40,
      y: height - 146,
      size: 10,
      font,
      color: C.muted,
    });

    let y = height - 220;
    page.drawText("Kde unikajú peniaze", {
      x: 40,
      y,
      size: 26,
      font: fontBold,
      color: C.ink,
    });
    y -= 32;
    page.drawText("a čo urobiť ako prvé", {
      x: 40,
      y,
      size: 26,
      font: fontBold,
      color: C.signalBright,
    });
    y -= 28;
    const sub = wrap(
      "Kompletný executive súhrn Self-Auditu — rovnaké metriky ako na webe: indikatívny potenciál voči referencii MSP, porovnanie domén, kritický proces a 3 prioritné kroky.",
      font,
      10,
      width - 80,
    );
    for (const line of sub) {
      page.drawText(line, { x: 40, y, size: 10, font, color: C.muted });
      y -= 14;
    }

    y -= 28;
    const boxW = (width - 80 - 16) / 2;
    page.drawRectangle({
      x: 40,
      y: y - 88,
      width: boxW,
      height: 100,
      color: C.card,
      borderColor: C.ember,
      borderWidth: 1,
    });
    page.drawRectangle({
      x: 40 + boxW + 16,
      y: y - 88,
      width: boxW,
      height: 100,
      color: C.card,
      borderColor: C.signal,
      borderWidth: 1,
    });
    const headLines = wrap(LABEL_GAP_HEADLINE_SK, fontBold, 7, boxW - 24).slice(0, 2);
    headLines.forEach((line, i) => {
      page.drawText(line, {
        x: 52,
        y: y - 14 - i * 10,
        size: 7,
        font: fontBold,
        color: C.muted,
      });
    });
    const rangeLines = wrap(headline, fontBold, 11, boxW - 24).slice(0, 2);
    rangeLines.forEach((line, i) => {
      page.drawText(line, {
        x: 52,
        y: y - 42 - i * 14,
        size: 11,
        font: fontBold,
        color: C.ember,
      });
    });

    page.drawText("CELKOVÁ ÚROVEŇ PROCESU", {
      x: 52 + boxW + 16,
      y: y - 14,
      size: 7,
      font: fontBold,
      color: C.muted,
    });
    page.drawText(pct(r.overallPercent ?? 0, 1), {
      x: 52 + boxW + 16,
      y: y - 48,
      size: 22,
      font: fontBold,
      color: C.signalBright,
    });
    page.drawText(`${LABEL_MSP_REF_SK} ${pct(r.smeOverallPercent ?? 0, 1)}`, {
      x: 52 + boxW + 16,
      y: y - 70,
      size: 10,
      font,
      color: C.muted,
    });

    y -= 120;
    for (const line of wrap(disclaimerForLevel(level), font, 8, width - 80)) {
      page.drawText(line, { x: 40, y, size: 8, font, color: C.muted });
      y -= 11;
    }
    y -= 8;
    if (rel) {
      page.drawText(rel.lineSk, {
        x: 40,
        y,
        size: 10,
        font: fontBold,
        color: C.ink,
      });
      y -= 14;
      for (const line of wrap(rel.hintSk, font, 9, width - 80)) {
        page.drawText(line, { x: 40, y, size: 9, font, color: C.muted });
        y -= 12;
      }
      y -= 6;
    }
    y -= 10;
    if (cp) {
      page.drawRectangle({
        x: 40,
        y: y - 100,
        width: width - 80,
        height: 112,
        color: C.card,
      });
      page.drawRectangle({
        x: 40,
        y: y - 100,
        width: 5,
        height: 112,
        color: C.ember,
      });
      page.drawText("KRITICKÁ DOMÉNA K RIEŠENIU", {
        x: 58,
        y: y - 12,
        size: 8,
        font: fontBold,
        color: C.ember,
      });
      page.drawText(`${domainLabel(cp.processId)} · ${cp.label || cp.shortLabel}`, {
        x: 58,
        y: y - 34,
        size: 14,
        font: fontBold,
        color: C.ink,
      });
      let ry = y - 54;
      for (const line of wrap(cp.reason || "", font, 10, width - 120).slice(0, 2)) {
        page.drawText(line, { x: 58, y: ry, size: 10, font, color: C.muted });
        ry -= 13;
      }
      const critLabel = `${LABEL_GAP_SHORT_SK}: ${formatGapEur(body.presentation?.criticalLowEur, body.presentation?.criticalHighEur, cp.gapSmeEur)}`;
      const critLines = wrap(
        `${critLabel}   ·   ${pct(cp.userPercent)} vs ${LABEL_MSP_REF_SK} ${pct(cp.smePercent ?? 0)}`,
        fontBold,
        9,
        width - 120,
      ).slice(0, 2);
      critLines.forEach((line, i) => {
        page.drawText(line, {
          x: 58,
          y: y - 82 - i * 12,
          size: 9,
          font: fontBold,
          color: C.ember,
        });
      });
      y -= 128;
    }

    page.drawText("Kontext vstupu", {
      x: 40,
      y,
      size: 12,
      font: fontBold,
      color: C.ink,
    });
    y -= 20;
    for (const t of [
      `Ročný obrat: ${eur(r.annualRevenueEur ?? 0)}`,
      `COGS: ${pct(r.cogsPercent ?? 0, 0)}`,
      `Zodpovedané otázky: ${r.answeredCount ?? "—"} / ${r.totalQuestions ?? "—"}`,
      `Kontakt: ${body.work_email ?? ""}${body.phone ? ` · ${body.phone}` : ""}`,
    ]) {
      page.drawText(`•  ${t}`, { x: 40, y, size: 10, font, color: C.muted });
      y -= 16;
    }

    footer(page, font, 1, TOTAL, level);
  }

  // ═══════════════ PAGE 2 — Table + bars ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;

    page.drawText(LABEL_MATURITY_TABLE_SK, {
      x: 40,
      y,
      size: 14,
      font: fontBold,
      color: C.ink,
    });
    y -= 16;
    page.drawText("Úroveň zrelosti (%) a indikatívna medzera (€ / rok)", {
      x: 40,
      y,
      size: 9,
      font,
      color: C.muted,
    });
    y -= 28;

    const cols = [48, 188, 268, 360];
    page.drawRectangle({
      x: 40,
      y: y - 8,
      width: width - 80,
      height: 28,
      color: C.surface,
    });
    page.drawText("Doména", { x: cols[0], y: y + 2, size: 8, font: fontBold, color: C.muted });
    page.drawText("Vaša firma", { x: cols[1], y: y + 2, size: 8, font: fontBold, color: C.signalBright });
    page.drawText(LABEL_MSP_REF_SK, { x: cols[2], y: y + 2, size: 7, font: fontBold, color: C.ember });
    page.drawText(LABEL_GAP_SHORT_SK, { x: cols[3], y: y + 6, size: 7, font: fontBold, color: C.muted });
    y -= 34;

    for (const p of scores) {
      const gapLabel = formatProcessGap(body.presentation, p.processId, p.gapSmeEur);
      page.drawText(`${domainLabel(p.processId)} · ${p.shortLabel}`, {
        x: cols[0],
        y,
        size: 9,
        font,
        color: C.ink,
      });
      page.drawText(pct(p.percent, 1), {
        x: cols[1],
        y,
        size: 9,
        font: fontBold,
        color: C.signalBright,
      });
      page.drawText(pct(p.smePercent ?? 0, 1), {
        x: cols[2],
        y,
        size: 9,
        font: fontBold,
        color: C.ember,
      });
      const gapLines = wrap(gapLabel, fontBold, 7, width - cols[3] - 36);
      gapLines.forEach((line, i) => {
        page.drawText(line, {
          x: cols[3],
          y: y - i * 9,
          size: 7,
          font: fontBold,
          color: C.ink,
        });
      });
      y -= Math.max(18, gapLines.length * 10 + 6);
      page.drawLine({
        start: { x: 48, y: y + 8 },
        end: { x: width - 48, y: y + 8 },
        thickness: 0.4,
        color: C.line,
      });
    }
    y -= 6;
    page.drawText("Celkom (vážené)", {
      x: cols[0],
      y,
      size: 10,
      font: fontBold,
      color: C.white,
    });
    page.drawText(pct(r.overallPercent ?? 0, 1), {
      x: cols[1],
      y,
      size: 10,
      font: fontBold,
      color: C.signalBright,
    });
    page.drawText(pct(r.smeOverallPercent ?? 0, 1), {
      x: cols[2],
      y,
      size: 10,
      font: fontBold,
      color: C.ember,
    });
    const totalLines = wrap(headline, fontBold, 7, width - cols[3] - 36);
    totalLines.forEach((line, i) => {
      page.drawText(line, {
        x: cols[3],
        y: y - i * 9,
        size: 7,
        font: fontBold,
        color: C.ember,
      });
    });
    y -= Math.max(0, (totalLines.length - 1) * 9);

    y -= 18;
    const noteLines = wrap(NOTE_MATURITY_TABLE_SK, font, 8, width - 80);
    noteLines.forEach((line, i) => {
      page.drawText(line, {
        x: 40,
        y: y - i * 11,
        size: 8,
        font,
        color: C.muted,
      });
    });
    y -= noteLines.length * 11;

    y -= 10;
    const sourceLines = wrap(EXPERT_ESTIMATE_SOURCE_SK, font, 8, width - 80);
    sourceLines.forEach((line, i) => {
      page.drawText(line, {
        x: 40,
        y: y - i * 11,
        size: 8,
        font,
        color: C.muted,
      });
    });
    y -= sourceLines.length * 11;

    const costBaseRows = costBaseDisclosureRowsForReport(r);
    if (costBaseRows.length > 0) {
      y -= 22;
      page.drawText(LABEL_COST_BASE_TABLE_SK, {
        x: 40,
        y,
        size: 12,
        font: fontBold,
        color: C.ink,
      });
      y -= 16;
      const cbCols = [48, 150, 250, 360];
      page.drawText(COL_DOMAIN_SK, {
        x: cbCols[0],
        y,
        size: 7,
        font: fontBold,
        color: C.muted,
      });
      page.drawText(COL_COGS_SHARE_SK, {
        x: cbCols[1],
        y,
        size: 7,
        font: fontBold,
        color: C.muted,
      });
      page.drawText(COL_COST_BASE_SK, {
        x: cbCols[2],
        y,
        size: 7,
        font: fontBold,
        color: C.muted,
      });
      page.drawText(COL_REF_SOURCE_SK, {
        x: cbCols[3],
        y,
        size: 7,
        font: fontBold,
        color: C.muted,
      });
      y -= 12;
      for (const row of costBaseRows) {
        page.drawText(row.domainLabel, {
          x: cbCols[0],
          y,
          size: 8,
          font,
          color: C.ink,
        });
        page.drawText(pct(row.cogsShare * 100, 0), {
          x: cbCols[1],
          y,
          size: 8,
          font,
          color: C.muted,
        });
        page.drawText(eur(row.costBaseEur), {
          x: cbCols[2],
          y,
          size: 8,
          font,
          color: C.ink,
        });
        const srcWrap = wrap(row.referenceSourceSk, font, 7, width - cbCols[3] - 40);
        srcWrap.forEach((line, i) => {
          page.drawText(line, {
            x: cbCols[3],
            y: y - i * 9,
            size: 7,
            font,
            color: C.muted,
          });
        });
        y -= Math.max(14, srcWrap.length * 9 + 4);
      }
      const shareNote = wrap(COST_BASE_SHARES_NOTE_SK, font, 8, width - 80);
      shareNote.forEach((line, i) => {
        page.drawText(line, {
          x: 40,
          y: y - i * 11,
          size: 8,
          font,
          color: C.muted,
        });
      });
      y -= shareNote.length * 11;
    }

    y -= 28;
    page.drawText(LABEL_PROCESS_GAPS_SK, {
      x: 40,
      y,
      size: 14,
      font: fontBold,
      color: C.ink,
    });
    y -= 14;
    page.drawText("Väčší stĺpec = väčšia príležitosť voči referencii MSP", {
      x: 40,
      y,
      size: 9,
      font,
      color: C.muted,
    });
    y -= 28;

    const barMaxW = width - 80 - 150;
    for (const p of sorted) {
      const barW = Math.max(6, (p.gapSmeEur / maxGap) * barMaxW);
      page.drawRectangle({
        x: 40,
        y: y - 46,
        width: width - 80,
        height: 52,
        color: C.card,
      });
      page.drawText(`${domainLabel(p.processId)} · ${p.shortLabel}`, {
        x: 52,
        y: y - 12,
        size: 10,
        font: fontBold,
        color: C.ink,
      });
      const barGap = formatProcessGap(body.presentation, p.processId, p.gapSmeEur);
      const barGapW = fontBold.widthOfTextAtSize(barGap, 8);
      page.drawText(barGap, {
        x: Math.max(180, width - 52 - barGapW),
        y: y - 12,
        size: 8,
        font: fontBold,
        color: C.ember,
      });
      page.drawRectangle({
        x: 52,
        y: y - 30,
        width: barMaxW,
        height: 9,
        color: C.track,
      });
      page.drawRectangle({
        x: 52,
        y: y - 30,
        width: barW,
        height: 9,
        color: C.ember,
      });
      page.drawText(
        `Úroveň ${pct(p.percent)} · ${LABEL_MSP_REF_SK} ${pct(p.smePercent ?? 0)}`,
        { x: 52, y: y - 44, size: 8, font, color: C.muted },
      );
      y -= 62;
    }

    footer(page, font, 2, TOTAL, level);
  }

  // ═══════════════ PAGE 3 — Radar + recommendations ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;

    page.drawText("Radar zrelosti (vs referencia MSP)", {
      x: 40,
      y,
      size: 16,
      font: fontBold,
      color: C.ink,
    });
    y -= 14;
    page.drawText(`Modrá = vaša firma · Oranžová = ${LABEL_MSP_REF_SK}`, {
      x: 40,
      y,
      size: 9,
      font,
      color: C.muted,
    });

    drawRadar(
      page,
      width / 2,
      height - 280,
      110,
      scores.map((s) => s.percent),
      scores.map((s) => s.smePercent ?? 0),
      scores.map((s) => domainLabel(s.processId)),
      font,
    );

    y = height - 430;
    page.drawText("3 prioritné kroky pre konateľa", {
      x: 40,
      y,
      size: 16,
      font: fontBold,
      color: C.ink,
    });
    y -= 14;
    page.drawText("Najvyšší pákový efekt podľa výsledkov Self-Auditu", {
      x: 40,
      y,
      size: 9,
      font,
      color: C.muted,
    });
    y -= 28;

    recs.forEach((rec, i) => {
      const blockH = 96;
      page.drawRectangle({
        x: 40,
        y: y - blockH + 12,
        width: width - 80,
        height: blockH,
        color: C.card,
      });
      page.drawRectangle({
        x: 52,
        y: y - 6,
        width: 26,
        height: 26,
        color: C.signal,
      });
      page.drawText(String(i + 1), {
        x: 52 + (26 - fontBold.widthOfTextAtSize(String(i + 1), 13)) / 2,
        y: y,
        size: 13,
        font: fontBold,
        color: C.white,
      });
      page.drawText(rec.title, {
        x: 88,
        y: y,
        size: 11,
        font: fontBold,
        color: C.ink,
        maxWidth: width - 150,
      });
      page.drawText(
        `${domainLabel(rec.processId)} · dopad ${rec.impact}`,
        { x: 88, y: y - 16, size: 8, font: fontBold, color: C.ember },
      );
      let ly = y - 34;
      for (const line of wrap(rec.description, font, 9, width - 150).slice(0, 3)) {
        page.drawText(line, { x: 88, y: ly, size: 9, font, color: C.muted });
        ly -= 12;
      }
      y -= blockH + 12;
    });

    footer(page, font, 3, TOTAL, level);
  }

  // ═══════════════ PAGE 4 — Upsell CTA ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;

    page.drawText("Od reportu k rozhodnutiu", {
      x: 40,
      y,
      size: 18,
      font: fontBold,
      color: C.ink,
    });
    y -= 18;
    page.drawText("Odporúčaný ďalší krok podľa vašej úrovne auditu", {
      x: 40,
      y,
      size: 10,
      font,
      color: C.muted,
    });
    y -= 36;

    page.drawRectangle({
      x: 40,
      y: y - 220,
      width: width - 80,
      height: 240,
      color: C.signal,
    });
    page.drawText(upsell.eyebrow.toUpperCase(), {
      x: 58,
      y: y - 24,
      size: 9,
      font: fontBold,
      color: rgb(0.85, 0.9, 1),
    });
    let ty = y - 50;
    for (const line of wrap(upsell.title, fontBold, 16, width - 120)) {
      page.drawText(line, { x: 58, y: ty, size: 16, font: fontBold, color: C.white });
      ty -= 22;
    }
    ty -= 8;
    for (const line of wrap(upsell.body, font, 10, width - 120)) {
      page.drawText(line, { x: 58, y: ty, size: 10, font, color: C.white });
      ty -= 14;
    }
    ty -= 10;
    for (const b of upsell.bullets) {
      page.drawText(`✓  ${b}`, { x: 58, y: ty, size: 11, font: fontBold, color: C.white });
      ty -= 18;
    }
    const ctaLine = upsell.cta;
    page.drawText(ctaLine, {
      x: 58,
      y: y - 200,
      size: 11,
      font: fontBold,
      color: C.onSignal,
    });
    addUriLink(
      pdf,
      page,
      58,
      y - 204,
      fontBold.widthOfTextAtSize(ctaLine, 11) + 8,
      16,
      upsell.href.startsWith("mailto:") || upsell.href.startsWith("http")
        ? upsell.href
        : `${SITE}${upsell.href.startsWith("/") ? "" : "/"}${upsell.href}`,
    );

    y -= 270;
    page.drawRectangle({
      x: 40,
      y: y - 110,
      width: width - 80,
      height: 120,
      color: C.card,
      borderColor: C.line,
      borderWidth: 0.8,
    });
    page.drawText(`Kontakt ${BRAND}`, {
      x: 56,
      y: y - 24,
      size: 12,
      font: fontBold,
      color: C.ink,
    });
    page.drawText(CTA_MAIL, {
      x: 56,
      y: y - 46,
      size: 11,
      font,
      color: C.signalBright,
    });
    addUriLink(
      pdf,
      page,
      56,
      y - 50,
      font.widthOfTextAtSize(CTA_MAIL, 11) + 4,
      14,
      `mailto:${CTA_MAIL}`,
    );
    page.drawText(CTA_PHONE, {
      x: 56,
      y: y - 66,
      size: 10,
      font,
      color: C.muted,
    });
    if (booking) {
      page.drawText("Rezervovať konzultáciu", {
        x: 56,
        y: y - 86,
        size: 10,
        font: fontBold,
        color: C.signalBright,
      });
      addUriLink(
        pdf,
        page,
        56,
        y - 90,
        fontBold.widthOfTextAtSize("Rezervovať konzultáciu", 10) + 4,
        14,
        booking,
      );
    }

    footer(page, font, 4, TOTAL, level);
  }

  // ═══════════════ PAGE — Rozpis po otázkach (L2/L3) ═══════════════
  if (hasBreakdown) {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;
    page.drawText("Rozpis po otázkach", {
      x: 40,
      y,
      size: 16,
      font: fontBold,
      color: C.ink,
    });
    y -= 24;
    for (const row of breakdown.slice(0, 28)) {
      if (y < 70) break;
      const head = `${domainLabel(row.processId)} · ${row.bandLabelSk}`;
      page.drawText(head, {
        x: 40,
        y,
        size: 9,
        font: fontBold,
        color: C.ember,
      });
      y -= 12;
      for (const line of wrap(row.text, font, 9, width - 80).slice(0, 2)) {
        page.drawText(line, { x: 40, y, size: 9, font, color: C.ink });
        y -= 12;
      }
      y -= 6;
    }
    footer(page, font, 5, TOTAL, level);
  }

  // ═══════════════ PAGE — Metodika ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;
    const methodPage = hasBreakdown ? 6 : 5;
    page.drawText("Metodika a zdroje", {
      x: 40,
      y,
      size: 16,
      font: fontBold,
      color: C.ink,
    });
    y -= 22;
    page.drawText("Vstupy", {
      x: 40,
      y,
      size: 12,
      font: fontBold,
      color: C.ink,
    });
    y -= 16;
    for (const t of [
      `Ročný obrat: ${eur(r.annualRevenueEur ?? 0)}`,
      `COGS: ${pct(r.cogsPercent ?? 0, 0)}`,
      `Odvetvie: ${r.sectorLabel ?? "—"}`,
      `Úroveň auditu: Level ${level}`,
      `Zodpovedané otázky: ${r.answeredCount ?? "—"} / ${r.totalQuestions ?? "—"}`,
    ]) {
      page.drawText(`•  ${t}`, { x: 40, y, size: 10, font, color: C.muted });
      y -= 14;
    }
    y -= 10;
    page.drawText("Výpočet medzery", {
      x: 40,
      y,
      size: 12,
      font: fontBold,
      color: C.ink,
    });
    y -= 16;
    for (const line of wrap(
      "Skóre domény je 100 × súčet (váha otázky × skóre) / súčet (váha otázky × 10). Medzera v eurách je tržby × podiel COGS × váha nákladov domény × max(0, (referencia − vaše skóre) / 100). Celková medzera je súčtom medzier domén. Rozsah vzniká z pásiem odpovedí A–E.",
      font,
      9,
      width - 80,
    )) {
      page.drawText(line, { x: 40, y, size: 9, font, color: C.muted });
      y -= 12;
    }
    y -= 12;
    page.drawText(LABEL_COST_BASE_TABLE_SK, {
      x: 40,
      y,
      size: 12,
      font: fontBold,
      color: C.ink,
    });
    y -= 16;
    const costRows = costBaseDisclosureRowsForReport(r);
    for (const row of costRows) {
      page.drawText(
        `${row.domainLabel}: ${pct(row.cogsShare * 100, 0)} · ${eur(row.costBaseEur)} · ${row.referenceSourceSk}`,
        { x: 40, y, size: 8, font, color: C.muted },
      );
      y -= 12;
    }
    y -= 10;
    for (const line of wrap(EXPERT_ESTIMATE_SOURCE_SK, font, 9, width - 80)) {
      page.drawText(line, { x: 40, y, size: 9, font, color: C.ink });
      y -= 12;
    }
    y -= 8;
    for (const line of wrap(COST_BASE_SHARES_NOTE_SK, font, 8, width - 80)) {
      page.drawText(line, { x: 40, y, size: 8, font, color: C.muted });
      y -= 11;
    }
    footer(page, font, methodPage, TOTAL, level);
  }

  return pdf.save();
}
