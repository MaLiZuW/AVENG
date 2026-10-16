/**
 * Fails when the static export still contains forbidden public copy.
 * Run after `npm run build`: npm run check:copy
 *
 * The denylist is the wave-2 set named in STEP 18 and findings W5/W6/W8.
 * Draft markers from STEP 26: visible `TODO` / `[[TODO` (bare `[[` is skipped in
 * Next RSC payloads and minified JS, which use `[[` as syntax).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { load } from "cheerio";

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

/** Draft / unpublished markers (STEP 26). */
const DRAFT_MARKERS = ["[[TODO", "TODO(owner)", "Návrh textu"];

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

function visibleHtmlText(html: string): string {
  const $ = load(html);
  $("script, style, noscript").remove();
  return $.root().text();
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
    const ext = extname(file).toLowerCase();

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
    for (const marker of DRAFT_MARKERS) {
      if (text.includes(marker)) {
        errors.push(`${rel}: contains draft marker ${JSON.stringify(marker)}`);
      }
    }

    // Visible HTML only: bare TODO / [[ (draft brackets) without Next RSC false positives.
    if (ext === ".html") {
      const visible = visibleHtmlText(text);
      if (/\bTODO\b/.test(visible)) {
        errors.push(`${rel}: visible text contains TODO`);
      }
      if (visible.includes("[[")) {
        errors.push(`${rel}: visible text contains [[`);
      }
    }
  }

  if (errors.length > 0) fail(errors);
  console.log(`check:copy ok (${files.length} files)`);
}

main();
