/**
 * Fail when the Next and Edge Function copies of company identity diverge.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const leftPath = resolve("src/config/company.ts");
const rightPath = resolve("supabase/functions/_shared/company.ts");

const left = readFileSync(leftPath, "utf8").replace(/\r\n/g, "\n");
const right = readFileSync(rightPath, "utf8").replace(/\r\n/g, "\n");

if (left !== right) {
  console.error(
    "company.ts copies differ:\n  src/config/company.ts\n  supabase/functions/_shared/company.ts",
  );
  process.exit(1);
}

console.log("check:shared ok");
