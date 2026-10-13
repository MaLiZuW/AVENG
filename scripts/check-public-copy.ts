/**
 * Fails when the static export still contains forbidden public copy.
 * Run after `npm run build`: npm run check:copy
 *
 * The denylist is the wave-2 set named in STEP 18 and findings W5/W6/W8.
 * `.cursor/rules/aveng-wave2.mdc` is not in this repo, so the phrases live here.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const OUT_DIR = "out";

const TEXT_EXT = new Set([
  ".html",
  ".js",
  ".css",
  ".txt",
  ".xml",
  ".json",
  ".svg",
  ".webmanifest",
]);

/** Whole words so minified identifiers are not treated as public labels. */
const FORBIDDEN_WORDS = [/\bSilver\b/g, /\bGold\b/g, /\bPremium\b/g];

const FORBIDDEN_PHRASES = [
  "odvetvový benchmark",
  "odvetvový štandard",
  "odvetvovému štandardu",
  "ak je na webe nastavené",
  "služby, ktoré web skutočne používa",
  "táto aplikácia skutočne používa",
  "Ochrana dát & Transparentnosť",
  "Ochrana dát &amp; Transparentnosť",
];

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (TEXT_EXT.has(extname(entry).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function fail(errors: string[]): never {
  for (const error of errors) console.error(error);
  console.error(`check:copy failed (${errors.length})`);
  process.exit(1);
}

function main(): void {
  if (!existsSync(OUT_DIR)) {
    fail(["out/ is missing. Run npm run build first."]);
  }

  const files = walk(OUT_DIR).sort();
  if (files.length === 0) {
    fail(["out/ matched no text files."]);
  }

  const errors: string[] = [];
  for (const file of files) {
    const rel = relative(".", file).replaceAll("\\", "/");
    const text = readFileSync(file, "utf8");
    for (const pattern of FORBIDDEN_WORDS) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        errors.push(`${rel}: contains ${pattern.source}`);
      }
    }
    for (const phrase of FORBIDDEN_PHRASES) {
      if (text.includes(phrase)) {
        errors.push(`${rel}: contains ${JSON.stringify(phrase)}`);
      }
    }
  }

  if (errors.length > 0) fail(errors);
  console.log(`check:copy ok (${files.length} files)`);
}

main();
