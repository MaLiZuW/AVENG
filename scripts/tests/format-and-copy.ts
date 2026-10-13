/**
 * Slovak formatters and per-level audit copy.
 * Run: npx tsx scripts/tests/format-and-copy.ts
 */
import {
  disclaimerForLevel,
  pdfFooterForLevel,
  reliabilityHintForLevel,
  resultTitle,
} from "../../src/config/audit-copy";
import { SECTORS, SECTOR_PUBLIC_LABELS } from "../../src/lib/audit/benchmarks";
import {
  formatDecimal,
  formatEuroRange,
  formatEuroRounded,
  formatInt,
  formatPercent,
} from "../../src/lib/format";
import {
  LEVEL1_DISCLAIMER_SK,
  RELIABILITY_HINT_SK,
} from "../../shared/audit-presentation";

const NBSP = "\u00A0";
const EN_DASH = "\u2013";

let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    failed += 1;
    console.error(`FAIL ${msg}`);
  }
}

assert(formatPercent(56.5) === `56,5${NBSP}%`, `percent, got ${formatPercent(56.5)}`);
assert(!formatPercent(56.5).includes("."), "percent uses a comma");
assert(formatPercent(0) === `0,0${NBSP}%`, "percent zero");
assert(formatPercent(56, 0) === `56${NBSP}%`, "percent integer digits");

assert(formatEuroRounded(61_000) === `61${NBSP}tis.${NBSP}€`, `61 tis, got ${formatEuroRounded(61_000)}`);
assert(formatEuroRounded(61_432) === `61${NBSP}tis.${NBSP}€`, "61 tis from 61432");
assert(formatEuroRounded(8_300) === `8,3${NBSP}tis.${NBSP}€`, `8,3 tis, got ${formatEuroRounded(8_300)}`);
assert(formatEuroRounded(1_200_000) === `1,2${NBSP}mil.${NBSP}€`, `1,2 mil, got ${formatEuroRounded(1_200_000)}`);
assert(formatEuroRounded(950) === `950${NBSP}€`, `950 eur, got ${formatEuroRounded(950)}`);
assert(formatEuroRounded(0) === `0${NBSP}€`, "euro zero");
assert(formatEuroRounded(999) === `1,0${NBSP}tis.${NBSP}€`, "999 rounds up to tis.");
assert(formatEuroRounded(999_999) === `1,0${NBSP}mil.${NBSP}€`, "999999 rounds up to mil.");
assert(!/\d\.\d/.test(formatEuroRounded(8_300)), "euro decimal is a comma");

assert(
  formatEuroRange(560_000, 860_000) === `560${NBSP}${EN_DASH}${NBSP}860${NBSP}tis.${NBSP}€`,
  `range, got ${formatEuroRange(560_000, 860_000)}`,
);
assert(
  formatEuroRange(860_000, 560_000) === formatEuroRange(560_000, 860_000),
  "range orders ends",
);
assert(formatEuroRange(0, 0) === `0${NBSP}€`, "range zero");
assert(formatEuroRange(950, 950) === `950${NBSP}€`, "range collapses when equal");

assert(formatInt(0) === "0", "int zero");
assert(formatInt(999_999) === `999${NBSP}999`, `int group, got ${formatInt(999_999)}`);
assert(formatInt(950) === "950", "int below 1000");
assert(formatDecimal(6, 1) === "6,0", "decimal comma");

assert(disclaimerForLevel(1) === LEVEL1_DISCLAIMER_SK, "L1 disclaimer matches shared verbatim");
assert(reliabilityHintForLevel(1) === RELIABILITY_HINT_SK, "L1 hint matches shared verbatim");

const l1Only = [
  disclaimerForLevel(1),
  reliabilityHintForLevel(1),
  pdfFooterForLevel(1),
];

for (const level of [2, 3] as const) {
  const texts = [
    disclaimerForLevel(level),
    reliabilityHintForLevel(level),
    pdfFooterForLevel(level),
    resultTitle(level, level === 2 ? 60 : 180),
  ];
  for (const text of texts) {
    for (const banned of l1Only) {
      assert(text !== banned && !text.includes(banned), `L${level} still exposes L1 text: ${text}`);
    }
  }
  assert(disclaimerForLevel(level).includes(`Level ${level}`), `disclaimer names level ${level}`);
  assert(!disclaimerForLevel(level).includes("Level 1"), `disclaimer L${level} has no Level 1`);
  assert(!reliabilityHintForLevel(level).includes("Level 1"), `hint L${level} has no Level 1`);
  assert(
    !reliabilityHintForLevel(level).includes("prechodom na Level 2"),
    `hint L${level} is not the Level 1 hint`,
  );
  assert(!pdfFooterForLevel(level).includes("Orientačný skríning"), `footer L${level}`);
  assert(resultTitle(level, 60).startsWith(`Výsledky Level ${level} auditu`), "title level");
}

assert(
  resultTitle(2, 60) === "Výsledky Level 2 auditu (60 otázok)",
  resultTitle(2, 60),
);
assert(resultTitle(1, 20) !== resultTitle(2, 60), "titles differ by level");
assert(!resultTitle(3, 180).includes("Level 1"), "L3 title");

assert(SECTOR_PUBLIC_LABELS.plastics === "Plasty a kaučuk", "plastics public label");
for (const sector of SECTORS) {
  assert(sector.label === SECTOR_PUBLIC_LABELS[sector.id], `${sector.id} uses the label map`);
  assert(!sector.label.includes("("), `${sector.id} label has no English parenthesis`);
  assert(sector.id === sector.id.toLowerCase(), `${sector.id} id unchanged`);
}

if (failed > 0) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log("format-and-copy ok");
