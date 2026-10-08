import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(
  join(root, "src/lib/audit/level3-questions.generated.ts"),
  "utf8",
);

const ids = [...src.matchAll(/id: "(L3-[^"]+)"/g)].map((m) => m[1]);
if (ids.length !== 180) {
  console.error("Expected 180 ids, got", ids.length);
  process.exit(1);
}
if (new Set(ids).size !== 180) {
  console.error("Duplicate L3 ids");
  process.exit(1);
}
if (/label: "(?:0|4|6|8|10)"/.test(src)) {
  console.error("Visible numeric score labels found");
  process.exit(1);
}
const dims = ["MAN", "MACHINE", "MATERIAL", "METHOD", "MEASUREMENT", "ENVIRONMENT"];
for (const d of dims) {
  if (!src.includes(`dimension6M: "${d}"`)) {
    console.error("Missing dimension", d);
    process.exit(1);
  }
}

console.log(JSON.stringify({ ok: true, count: 180, dimsOk: true }, null, 2));
