import {
  BRAND,
  CTA_MAIL,
  CTA_PHONE,
  DISCLAIMER_SK,
  SITE,
  domainLabel,
  escapeHtml,
  eur,
  impactTone,
  pct,
  sortedByGap,
  upsellForLevel,
  type ReportBody,
} from "./_shared.ts";

export function buildHtml(body: ReportBody, forOwner: boolean): string {
  const r = body.result!;
  const level = r.auditLevel ?? 1;
  const scores = sortedByGap(r.processScores ?? []);
  const maxGap = Math.max(...scores.map((s) => s.gapSmeEur), 1);
  const recs = (r.recommendations ?? []).slice(0, 3);
  const cp = r.criticalProcess;
  const company = body.company_name ?? "";
  const upsell = upsellForLevel(level, company);
  const date = new Date().toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const intro = forOwner
    ? `<p style="margin:0 0 18px;font-size:14px;color:#cbd5e1;line-height:1.55">
        <strong style="color:#5b93ff">Nový Self-Audit lead · Level ${level}</strong><br/>
        ${escapeHtml(body.full_name ?? "")} · ${escapeHtml(company)}<br/>
        <a href="mailto:${escapeHtml(body.work_email ?? "")}" style="color:#5b93ff">${escapeHtml(body.work_email ?? "")}</a>${
          body.phone ? ` · ${escapeHtml(body.phone)}` : ""
        }
        ${body.lead_id ? `<br/><span style="font-size:11px;color:#64748b">ID ${escapeHtml(body.lead_id)}</span>` : ""}
      </p>`
    : `<p style="margin:0 0 6px;font-size:16px;color:#e8edf5;font-weight:600">Dobrý deň, ${escapeHtml(body.full_name ?? "")}</p>
      <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;line-height:1.55">
        Ďakujeme za Self-Audit. Nižšie je <strong style="color:#e8edf5">kompletný executive report</strong> pre
        <strong style="color:#e8edf5">${escapeHtml(company)}</strong> — rovnaké čísla, grafy a priority ako na webe.
        PDF príloha je určená na poradu majiteľov.
      </p>`;

  const compareRows = (r.processScores ?? [])
    .map(
      (p) => `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid rgba(148,163,184,.12);color:#e2e8f0;font-size:13px">${escapeHtml(domainLabel(p.processId))} · ${escapeHtml(p.shortLabel)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid rgba(148,163,184,.12);color:#5b93ff;font-weight:700;font-size:13px;text-align:right">${pct(p.percent, 1)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid rgba(148,163,184,.12);color:#e8a54b;font-weight:600;font-size:13px;text-align:right">${pct(p.smePercent ?? 0, 1)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid rgba(148,163,184,.12);color:#94a3b8;font-size:12px;text-align:right">${escapeHtml(eur(p.gapSmeEur))}</td>
      </tr>`,
    )
    .join("");

  const barRows = scores
    .map((p) => {
      const w = Math.max(6, Math.round((p.gapSmeEur / maxGap) * 100));
      return `<tr>
        <td style="padding:12px 0 4px;font-size:13px;color:#e8edf5;font-weight:600">${escapeHtml(domainLabel(p.processId))} · ${escapeHtml(p.shortLabel)}</td>
        <td style="padding:12px 0 4px;font-size:13px;color:#e8a54b;font-weight:700;text-align:right">${escapeHtml(eur(p.gapSmeEur))}</td>
      </tr>
      <tr><td colspan="2" style="padding:0 0 14px">
        <div style="background:#1a2336;border-radius:6px;height:11px;overflow:hidden">
          <div style="width:${w}%;height:11px;background:linear-gradient(90deg,#e8a54b,#f0c078);border-radius:6px"></div>
        </div>
        <div style="font-size:11px;color:#94a3b8;margin-top:5px">Vaša úroveň ${pct(p.percent)}${p.smePercent != null ? ` · MSP ${pct(p.smePercent)}` : ""} · báza ${escapeHtml(eur(p.costBaseEur ?? 0))}</div>
      </td></tr>`;
    })
    .join("");

  const recHtml = recs
    .map((rec, i) => {
      const col = impactTone(rec.impact);
      return `<tr><td style="padding:0 0 14px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#121a2b;border:1px solid rgba(91,147,255,.28);border-radius:12px">
          <tr><td style="padding:18px 20px">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td width="40" valign="top"><div style="width:30px;height:30px;border-radius:8px;background:#2f6fed;color:#fff;font-weight:800;font-size:14px;line-height:30px;text-align:center">${i + 1}</div></td>
              <td valign="top" style="padding-left:8px">
                <div style="font-size:15px;font-weight:700;color:#e8edf5;margin-bottom:4px">${escapeHtml(rec.title)}</div>
                <div style="font-size:11px;color:${col};text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${escapeHtml(domainLabel(rec.processId))} · dopad ${escapeHtml(rec.impact)}</div>
                <div style="font-size:13px;color:#94a3b8;line-height:1.55">${escapeHtml(rec.description)}</div>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join("");

  const upsellBullets = upsell.bullets
    .map(
      (b) =>
        `<tr><td style="padding:0 0 8px;font-size:13px;color:#e2e8f0">✓ &nbsp;${escapeHtml(b)}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="sk"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>${BRAND} Self-Audit report</title></head>
<body style="margin:0;padding:0;background:#070b12;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#070b12"><tr><td align="center" style="padding:28px 12px">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#0f172a;border-radius:18px;overflow:hidden;border:1px solid rgba(148,163,184,.14)">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#0b1220 0%,#132038 55%,#1a2d55 100%);padding:30px 34px 26px">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td>
        <img src="${SITE}/aveng-mark.png" width="44" height="30" alt="" style="display:block;border:0;border-radius:7px"/>
        <div style="margin-top:12px;font-size:20px;font-weight:800;color:#e8edf5;letter-spacing:-.02em">${BRAND}</div>
        <div style="font-size:11px;color:#5b93ff;margin-top:4px;letter-spacing:.14em;text-transform:uppercase">Self-Audit report · Level ${level}</div>
      </td>
      <td align="right" valign="top" style="font-size:11px;color:#64748b">${escapeHtml(date)}</td>
    </tr></table>
    <div style="margin-top:22px;font-size:13px;color:#94a3b8">${escapeHtml(r.sectorLabel ?? "—")} · ${escapeHtml(company)}</div>
    <div style="margin-top:8px;font-size:28px;font-weight:800;color:#fff;line-height:1.2;letter-spacing:-.03em">Kde unikajú peniaze — a čo s tým urobiť ako prvé</div>
  </td></tr>

  <tr><td style="padding:28px 34px 6px">${intro}</td></tr>

  <!-- HERO KPIs -->
  <tr><td style="padding:10px 34px 22px">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="48%" style="background:#121a2b;border-radius:14px;padding:20px 18px;border:1px solid rgba(232,165,75,.35)">
        <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em">Indikatívny potenciál vs MSP</div>
        <div style="font-size:28px;font-weight:800;color:#e8a54b;margin-top:8px">${escapeHtml(eur(r.gapSmeEur ?? 0))}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px">/ rok · orientačný odhad</div>
      </td>
      <td width="4%"></td>
      <td width="48%" style="background:#121a2b;border-radius:14px;padding:20px 18px;border:1px solid rgba(91,147,255,.3)">
        <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em">Celková úroveň procesu</div>
        <div style="font-size:28px;font-weight:800;color:#5b93ff;margin-top:8px">${pct(r.overallPercent ?? 0, 1)}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px">referencia MSP ${pct(r.smeOverallPercent ?? 0, 1)}</div>
      </td>
    </tr></table>
  </td></tr>

  <!-- CONTEXT -->
  <tr><td style="padding:0 34px 22px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1220;border-radius:12px">
      <tr>
        <td style="padding:14px 16px;font-size:12px;color:#94a3b8">Obrat<br/><strong style="color:#e8edf5;font-size:14px">${escapeHtml(eur(r.annualRevenueEur ?? 0))}</strong></td>
        <td style="padding:14px 16px;font-size:12px;color:#94a3b8">COGS<br/><strong style="color:#e8edf5;font-size:14px">${r.cogsPercent ?? 0} %</strong></td>
        <td style="padding:14px 16px;font-size:12px;color:#94a3b8">Otázky<br/><strong style="color:#e8edf5;font-size:14px">${r.answeredCount ?? "—"}/${r.totalQuestions ?? "—"}</strong></td>
        <td style="padding:14px 16px;font-size:12px;color:#94a3b8">Level<br/><strong style="color:#e8edf5;font-size:14px">${level}</strong></td>
      </tr>
    </table>
  </td></tr>

  ${
    cp
      ? `<!-- CRITICAL -->
  <tr><td style="padding:0 34px 24px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(90deg,#1f1724,#121a2b);border-radius:14px;border-left:5px solid #e8a54b">
      <tr><td style="padding:18px 22px">
        <div style="font-size:10px;color:#e8a54b;text-transform:uppercase;letter-spacing:.12em;font-weight:700">Kritická doména k riešeniu</div>
        <div style="font-size:18px;font-weight:800;color:#e8edf5;margin-top:6px">${escapeHtml(domainLabel(cp.processId))} · ${escapeHtml(cp.label || cp.shortLabel)}</div>
        <div style="font-size:13px;color:#94a3b8;margin-top:8px;line-height:1.5">${escapeHtml(cp.reason)}</div>
        <div style="margin-top:12px;font-size:13px;color:#cbd5e1">
          Medzera vs MSP: <strong style="color:#e8a54b">${escapeHtml(eur(cp.gapSmeEur))} / rok</strong>
          &nbsp;·&nbsp; Úroveň ${pct(cp.userPercent)} vs MSP ${pct(cp.smePercent ?? 0)}
        </div>
      </td></tr>
    </table>
  </td></tr>`
      : ""
  }

  <!-- COMPARISON TABLE -->
  <tr><td style="padding:0 34px 8px">
    <div style="font-size:17px;font-weight:800;color:#e8edf5;margin-bottom:4px">Porovnanie voči referencii MSP</div>
    <div style="font-size:12px;color:#64748b;margin-bottom:12px">Efektivita procesu (%) a indikatívna medzera (€ / rok)</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#121a2b;border-radius:12px;overflow:hidden">
      <tr style="background:#0b1220">
        <th align="left" style="padding:12px 8px;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em">Doména</th>
        <th align="right" style="padding:12px 8px;font-size:10px;color:#5b93ff;text-transform:uppercase;letter-spacing:.08em">Vaša firma</th>
        <th align="right" style="padding:12px 8px;font-size:10px;color:#e8a54b;text-transform:uppercase;letter-spacing:.08em">MSP</th>
        <th align="right" style="padding:12px 8px;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em">Gap</th>
      </tr>
      ${compareRows}
      <tr>
        <td style="padding:12px 8px;font-size:13px;font-weight:800;color:#fff">Celkom (vážené)</td>
        <td style="padding:12px 8px;font-size:13px;font-weight:800;color:#5b93ff;text-align:right">${pct(r.overallPercent ?? 0, 1)}</td>
        <td style="padding:12px 8px;font-size:13px;font-weight:700;color:#e8a54b;text-align:right">${pct(r.smeOverallPercent ?? 0, 1)}</td>
        <td style="padding:12px 8px;font-size:13px;font-weight:800;color:#e8a54b;text-align:right">${escapeHtml(eur(r.gapSmeEur ?? 0))}</td>
      </tr>
    </table>
  </td></tr>

  <!-- BARS -->
  <tr><td style="padding:28px 34px 8px">
    <div style="font-size:17px;font-weight:800;color:#e8edf5;margin-bottom:4px">Indikatívny potenciál úspor podľa procesu</div>
    <div style="font-size:12px;color:#64748b;margin-bottom:10px">Väčší stĺpec = väčšia príležitosť voči referencii MSP</div>
    <table width="100%" cellpadding="0" cellspacing="0">${barRows}</table>
  </td></tr>

  <!-- RECS -->
  <tr><td style="padding:20px 34px 8px">
    <div style="font-size:17px;font-weight:800;color:#e8edf5;margin-bottom:14px">3 prioritné kroky pre konateľa</div>
    <table width="100%" cellpadding="0" cellspacing="0">${recHtml}</table>
  </td></tr>

  <!-- UPSELL -->
  <tr><td style="padding:16px 34px 28px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#2f6fed,#1e4fc4);border-radius:16px">
      <tr><td style="padding:26px 26px 22px">
        <div style="font-size:11px;color:rgba(255,255,255,.75);text-transform:uppercase;letter-spacing:.14em;font-weight:700">${escapeHtml(upsell.eyebrow)}</div>
        <div style="font-size:20px;font-weight:800;color:#fff;margin-top:8px;line-height:1.25">${escapeHtml(upsell.title)}</div>
        <div style="font-size:13px;color:rgba(255,255,255,.88);margin:12px 0 16px;line-height:1.5">${escapeHtml(upsell.body)}</div>
        <table width="100%" cellpadding="0" cellspacing="0">${upsellBullets}</table>
        <div style="margin-top:18px">
          <a href="${upsell.href}" style="display:inline-block;background:#fff;color:#1e4fc4;font-weight:800;font-size:14px;padding:13px 22px;border-radius:9px;text-decoration:none">${escapeHtml(upsell.cta)}</a>
        </div>
        <div style="margin-top:14px;font-size:12px;color:rgba(255,255,255,.7)">${CTA_MAIL} · ${CTA_PHONE}</div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 34px 30px;font-size:11px;color:#64748b;line-height:1.55;text-align:center">
    ${escapeHtml(DISCLAIMER_SK)}<br/><br/>
    © ${new Date().getFullYear()} ${BRAND} · <a href="${SITE}" style="color:#5b93ff">${SITE.replace("https://", "")}</a>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}
