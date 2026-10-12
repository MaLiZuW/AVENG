/**
 * Every published KPI has at least one source URL, and hr_skills is unavailable.
 * Run: npx --yes tsx scripts/check-benchmarks.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PUBLISHED_KPI_KEYS,
  getKpiReference,
  getReferenceSourceStatus,
  isBenchmarkAvailable,
} from "../src/config/benchmarks";

const seedPath = resolve("docs/benchmarks/benchmarks.seed.json");
const copyPath = resolve("src/config/benchmarks.reference.json");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function hasUrl(url: unknown): url is string {
  return typeof url === "string" && /^https?:\/\//.test(url);
}

const seedBytes = readFileSync(seedPath);
const copyBytes = readFileSync(copyPath);
if (!seedBytes.equals(copyBytes)) {
  fail(
    "src/config/benchmarks.reference.json differs from docs/benchmarks/benchmarks.seed.json",
  );
}

type Source = { url?: unknown };
type Kpi = { available?: unknown; sources?: Source[] };

const data = JSON.parse(copyBytes.toString("utf8")) as {
  kpis?: Record<string, Kpi>;
};

const kpis = data.kpis;
if (!kpis) fail("benchmark JSON has no kpis object");

const keys = Object.keys(kpis);
if (!keys.includes("hr_skills")) fail("hr_skills is missing");

const publishedKeys = keys.filter((key) => key !== "hr_skills").sort();
const expectedKeys = [...PUBLISHED_KPI_KEYS].sort();
if (
  publishedKeys.length !== expectedKeys.length ||
  publishedKeys.some((key, index) => key !== expectedKeys[index])
) {
  fail(
    `published KPI keys must be ${expectedKeys.join(", ")}; found ${publishedKeys.join(", ")}`,
  );
}

for (const key of keys) {
  const kpi = kpis[key];
  if (key === "hr_skills") {
    if (kpi.available !== false) fail("hr_skills.available must be false");
    if (isBenchmarkAvailable(key)) fail("hr_skills must not be available");
    if (getKpiReference(key) !== null) {
      fail("hr_skills must not return a KPI reference");
    }
    continue;
  }

  const sources = kpi.sources ?? [];
  if (!sources.some((source) => hasUrl(source.url))) {
    fail(`${key} has no source with a URL`);
  }
  if (!isBenchmarkAvailable(key)) fail(`${key} should be available`);

  const reference = getKpiReference(key);
  if (!reference) fail(`${key} loader returned null`);
  if (!reference.sources.some((source) => hasUrl(source.url))) {
    fail(`${key} loader sources have no URL`);
  }
  if (!reference.direction || !reference.confidence || !reference.definitionNote) {
    fail(`${key} is missing direction, confidence, or definitionNote`);
  }
  if (Object.keys(reference.ranges).length < 1) {
    fail(`${key} has no value ranges`);
  }
}

if (isBenchmarkAvailable("unknown")) fail("unknown keys must be unavailable");
if (getKpiReference("unknown") !== null) fail("unknown keys must return null");

const status = getReferenceSourceStatus();
for (const key of PUBLISHED_KPI_KEYS) {
  if (status[key] !== "published-secondary") {
    fail(`${key} must be published-secondary`);
  }
}
for (const domain of ["P1", "P2", "P3", "P4", "P5"] as const) {
  if (status[domain] !== "expert-estimate") {
    fail(`${domain} must be expert-estimate`);
  }
}

const publishedCount = Object.values(status).filter(
  (value) => value === "published-secondary",
).length;
if (publishedCount !== PUBLISHED_KPI_KEYS.length) {
  fail(
    `expected ${PUBLISHED_KPI_KEYS.length} published-secondary statuses, got ${publishedCount}`,
  );
}

console.log("check:benchmarks ok");
