import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/lib/audit/level2");

let total = 0;
const ids = new Set();
for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
  const src = readFileSync(join(dir, f), "utf8");
  const matches = src.match(/l2q\(\s*"L2-[^"]+"/g) || [];
  total += matches.length;
  for (const m of matches) {
    const id = m.match(/"L2-[^"]+"/)[0];
    if (ids.has(id)) {
      console.error("Duplicate id", id);
      process.exit(1);
    }
    ids.add(id);
  }
  // No visible bare score labels in options
  if (/label:\s*["'](?:0|4|6|8|10)["']/.test(src)) {
    console.error("Visible score label in", f);
    process.exit(1);
  }
}

if (total !== 60) {
  console.error("Expected 60 L2 questions, got", total);
  process.exit(1);
}

// Aggregation formula smoke
const avg = (0 + 4 + 6) / 3; // 3.333
const domain =
  (100 *
    (5 * avg + 4 * 6 + 4 * 8 + 4 * 6)) /
  (5 * 10 + 4 * 10 + 4 * 10 + 4 * 10);

console.log(
  JSON.stringify(
    { ok: true, level2Count: total, sampleDomainApprox: Math.round(domain * 10) / 10 },
    null,
    2,
  ),
);
