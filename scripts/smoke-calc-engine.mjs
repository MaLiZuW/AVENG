/**
 * Smoke: numeric → VDA mapper + weighted S_Pi (metodika MSP SR v1.0).
 * Mirrors src/lib/audit/calculationEngine.ts — keep in sync when bands change.
 */

function map(id, v, opts = {}) {
  const M = {
    "L1-P1-Q1": (x) => (x < 50 ? 0 : x <= 69 ? 4 : x <= 85 ? 6 : x <= 98 ? 8 : 10),
    "L1-P1-Q3": (x) => (x > 25 ? 0 : x >= 20 ? 4 : x >= 10 ? 6 : x >= 6 ? 8 : 10),
    "L1-P1-Q4": (x) => (x > 35 ? 0 : x >= 25 ? 4 : x >= 15 ? 6 : x >= 5 ? 8 : 10),
    "L1-P2-Q1": (x) => (x < 40 ? 0 : x <= 54 ? 4 : x <= 69 ? 6 : x <= 84 ? 8 : 10),
    "L1-P2-Q2": (x) => (x < 40 ? 0 : x <= 59 ? 4 : x <= 79 ? 6 : x <= 94 ? 8 : 10),
    "L1-P2-Q3": (x) => (x > 20 ? 0 : x >= 15 ? 4 : x >= 8 ? 6 : x >= 2 ? 8 : 10),
    "L1-P3-Q1": (x) =>
      x > 100000 ? 0 : x >= 50000 ? 4 : x >= 10000 ? 6 : x >= 233 ? 8 : 10,
    "L1-P3-Q2": (x) => (x > 10 ? 0 : x >= 8 ? 4 : x >= 4 ? 6 : x >= 1 ? 8 : 10),
    "L1-P3-Q4": (x) =>
      x > 5000 ? 0 : x >= 1000 ? 4 : x >= 500 ? 6 : x >= 50 ? 8 : 10,
    "L1-P4-Q1": (x) => (x < 70 ? 0 : x <= 79 ? 4 : x <= 89 ? 6 : x <= 97 ? 8 : 10),
    "L1-P4-Q2": (x) => (x < 3 ? 0 : x <= 4 ? 4 : x <= 6 ? 6 : x <= 11 ? 8 : 10),
    "L1-P4-Q4": (x) => (x < 80 ? 0 : x <= 89 ? 4 : x <= 94 ? 6 : x <= 98 ? 8 : 10),
    "L1-P5-Q2": (x) => (x > 10 ? 0 : x >= 8 ? 4 : x >= 5 ? 6 : x >= 3 ? 8 : 10),
    "L1-P5-Q3": (x) =>
      x <= 0 ? 0 : x <= 0.5 ? 4 : x < 3 ? 6 : x <= 11 ? 8 : 10,
    "L1-P5-Q4": (x) =>
      x <= 1 ? 0 : x <= 2 ? 4 : x <= 3 ? 6 : opts.withRotation ? 10 : 8,
  };
  return M[id](v);
}

const cases = [
  ["L1-P2-Q1", 58, 6],
  ["L1-P2-Q1", 85, 10],
  ["L1-P1-Q1", 78, 6],
  ["L1-P1-Q1", 99, 10],
  ["L1-P1-Q3", 5, 10],
  ["L1-P3-Q1", 12000, 6],
  ["L1-P3-Q2", 6, 6],
  ["L1-P4-Q1", 98, 10],
  ["L1-P5-Q3", 12, 10],
  ["L1-P5-Q4", 4, 8],
];

const failures = [];
for (const [id, v, want] of cases) {
  const got = map(id, v);
  if (got !== want) failures.push(`${id}(${v})=${got} want ${want}`);
}
if (map("L1-P5-Q4", 4, { withRotation: true }) !== 10) {
  failures.push("multi-skill rotation → 10");
}

// Weighted: w=[5,4,5,3], S=[10,8,6,4] → 100*124/170 = 72.941 → 72.9
const w = [5, 4, 5, 3];
const s = [10, 8, 6, 4];
const num = w.reduce((a, wi, i) => a + wi * s[i], 0);
const den = w.reduce((a, wi) => a + wi * 10, 0);
const sPi = Math.round((100 * num) / den * 10) / 10;
if (sPi !== 72.9) failures.push(`S_Pi=${sPi} want 72.9`);

// E_total weights
const W = [0.18, 0.22, 0.25, 0.2, 0.15];
const e = Math.round(W.reduce((a, wi) => a + wi * 60, 0) * 10) / 10;
if (e !== 60) failures.push(`E_total=${e} want 60`);
if (Math.abs(W.reduce((a, x) => a + x, 0) - 1) > 1e-9) {
  failures.push("Σ W_Pi != 1");
}

if (failures.length) {
  console.error("FAIL", failures);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      mapperCases: cases.length,
      sample: { oee58: map("L1-P2-Q1", 58), sP2Weighted: sPi, eTotalFlat60: e },
      formula: "S_Pi = 100 * Σ(w_q*S_q) / Σ(w_q*10)",
    },
    null,
    2,
  ),
);
