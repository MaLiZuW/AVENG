import {
  PDFDocument,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "https://esm.sh/pdf-lib@1.17.1";
import fontkit from "https://esm.sh/@pdf-lib/fontkit@1.1.1";
import { MARK_PNG_B64 } from "./mark.ts";
import {
  BRAND,
  CTA_MAIL,
  CTA_PHONE,
  DISCLAIMER_SK,
  LABEL_GAP_HEADLINE_SK,
  LABEL_GAP_SHORT_SK,
  LABEL_MSP_REF_SK,
  LABEL_PROCESS_GAPS_SK,
  SITE,
  domainLabel,
  eur,
  formatGapEur,
  formatProcessGap,
  pct,
  reliabilityBlock,
  sortedByGap,
  upsellForLevel,
  type ReportBody,
} from "./_shared.ts";

const C = {
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
};

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

function footer(page: PDFPage, font: PDFFont, n: number, total: number) {
  const { width } = page.getSize();
  page.drawText(`${BRAND} · Self-Audit report · ${n}/${total}`, {
    x: 40,
    y: 26,
    size: 8,
    font,
    color: C.muted,
  });
  const right = "Indikatívny skríning — nie je zárukou výsledku";
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

export async function buildPdf(body: ReportBody): Promise<Uint8Array> {
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
  const rel = reliabilityBlock(body.presentation?.reliabilityLevel);
  const date = new Date().toLocaleDateString("sk-SK");
  const TOTAL = 4;

  const pdf = await PDFDocument.create();
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
    for (const line of wrap(DISCLAIMER_SK, font, 8, width - 80)) {
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
      `COGS: ${r.cogsPercent ?? 0} %`,
      `Zodpovedané otázky: ${r.answeredCount ?? "—"} / ${r.totalQuestions ?? "—"}`,
      `Kontakt: ${body.work_email ?? ""}${body.phone ? ` · ${body.phone}` : ""}`,
    ]) {
      page.drawText(`•  ${t}`, { x: 40, y, size: 10, font, color: C.muted });
      y -= 16;
    }

    footer(page, font, 1, TOTAL);
  }

  // ═══════════════ PAGE 2 — Table + bars ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;

    page.drawText("Porovnanie voči referencii MSP", {
      x: 40,
      y,
      size: 16,
      font: fontBold,
      color: C.ink,
    });
    y -= 16;
    page.drawText("Efektivita procesu (%) a indikatívna medzera (€ / rok)", {
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

    y -= 40;
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

    footer(page, font, 2, TOTAL);
  }

  // ═══════════════ PAGE 3 — Radar + recommendations ═══════════════
  {
    const page = pdf.addPage([595.28, 841.89]);
    fill(page);
    const { width, height } = page.getSize();
    let y = height - 56;

    page.drawText("Radar efektivity (vs referencia MSP)", {
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

    footer(page, font, 3, TOTAL);
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
    page.drawText(`${upsell.cta}  →  ${SITE.replace("https://", "")}/self-audit/`, {
      x: 58,
      y: y - 200,
      size: 11,
      font: fontBold,
      color: C.white,
    });

    y -= 270;
    page.drawRectangle({
      x: 40,
      y: y - 90,
      width: width - 80,
      height: 100,
      color: C.card,
    });
    page.drawText(`Kontakt ${BRAND}`, {
      x: 56,
      y: y - 24,
      size: 12,
      font: fontBold,
      color: C.ink,
    });
    page.drawText(`${CTA_MAIL}  ·  ${CTA_PHONE}`, {
      x: 56,
      y: y - 46,
      size: 11,
      font,
      color: C.signalBright,
    });
    page.drawText(SITE.replace("https://", ""), {
      x: 56,
      y: y - 66,
      size: 10,
      font,
      color: C.muted,
    });

    footer(page, font, 4, TOTAL);
  }

  return pdf.save();
}
