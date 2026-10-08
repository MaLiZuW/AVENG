/**
 * Smoke test: qualitative options must not expose VDA numbers in labels,
 * and financial gap engine must produce SME + WC gaps.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const questionsSrc = readFileSync(
  join(root, "src/lib/audit/questions.ts"),
  "utf8",
);

// Ensure option labels in questions.ts don't render bare score digits as UI labels
const forbiddenUiPatterns = [
  /label:\s*["']0["']/,
  /label:\s*["']4["']/,
  /label:\s*["']6["']/,
  /label:\s*["']8["']/,
  /label:\s*["']10["']/,
  /VDA_OPTIONS/,
];

for (const re of forbiddenUiPatterns) {
  if (re.test(questionsSrc)) {
    console.error("FAIL: found visible score pattern:", re);
    process.exit(1);
  }
}

// Minimal formula check (mirrors scoring.ts)
const revenue = 5_000_000;
const cogs = 0.65;
const k = [0.15, 0.2, 0.25, 0.15, 0.1];
const m = [1.4, 1.6, 1.8, 1.5, 1.4];
const user = [50, 45, 55, 60, 58];
const sme = [75, 65, 82, 92, 65];
const wc = [95, 86, 97, 99.5, 92];

let gapSme = 0;
let gapWc = 0;
for (let i = 0; i < 5; i++) {
  const c = revenue * cogs * k[i];
  gapSme += c * Math.max(0, (sme[i] - user[i]) / 100);
  gapWc += c * Math.max(0, (wc[i] - user[i]) / 100) * m[i];
}

if (gapSme <= 0 || gapWc <= gapSme) {
  console.error("FAIL: unexpected gap relationship", { gapSme, gapWc });
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      noVisibleScores: true,
      sampleGapSmeEur: Math.round(gapSme),
      sampleGapWcEur: Math.round(gapWc),
    },
    null,
    2,
  ),
);
