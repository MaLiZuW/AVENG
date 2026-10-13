/**
 * Slovak number formatting for the Next app and Supabase Edge Functions.
 * No React, no Node, no Intl — runtimes disagree on sk-SK output.
 */

const NBSP = "\u00A0";
const EN_DASH = "\u2013";

function groupInt(intRaw: string): string {
  return intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Round to 2 significant figures. Non-finite and zero stay 0. */
export function round2sig(n: number): number {
  if (!Number.isFinite(n) || n === 0) return 0;
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const exp = Math.floor(Math.log10(abs));
  const scale = 10 ** (exp - 1);
  const rounded = Math.round(abs / scale) * scale;
  if (Math.abs(rounded) >= 1) return sign * Math.round(Math.abs(rounded));
  return sign * rounded;
}

/**
 * Fixed fraction digits, decimal comma, NBSP thousands groups.
 * `56.5` with 1 digit → `56,5`.
 */
export function formatDecimal(value: number, digits: number): string {
  const places = Math.max(0, Math.trunc(digits));
  if (!Number.isFinite(value)) {
    return places > 0 ? `0,${"0".repeat(places)}` : "0";
  }
  const sign = value < 0 ? "−" : "";
  const factor = 10 ** places;
  const rounded = Math.round(Math.abs(value) * factor) / factor;
  const [intRaw, frac] = rounded.toFixed(places).split(".");
  const grouped = groupInt(intRaw ?? "0");
  if (!frac) return `${sign}${grouped}`;
  return `${sign}${grouped},${frac}`;
}

/** Up to `digits` fraction digits; trailing zeros omitted. */
export function formatDecimalTrim(value: number, digits: number): string {
  const full = formatDecimal(value, digits);
  if (!full.includes(",")) return full;
  return full.replace(/0+$/, "").replace(/,$/, "");
}

/** `formatPercent(56.5)` → `56,5 %` (NBSP before %). Default 1 decimal. */
export function formatPercent(value: number, digits = 1): string {
  return `${formatDecimal(value, digits)}${NBSP}%`;
}

/** Integer with NBSP thousands groups. `999999` → `999 999`. */
export function formatInt(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}${groupInt(String(Math.abs(rounded)))}`;
}

type EuroUnit = "eur" | "tis" | "mil";

function unitFor(absRounded: number): EuroUnit {
  if (absRounded >= 1_000_000) return "mil";
  if (absRounded >= 1_000) return "tis";
  return "eur";
}

function quantityInUnit(absRounded: number, unit: EuroUnit): string {
  if (unit === "eur") return groupInt(String(Math.round(absRounded)));
  const divisor = unit === "mil" ? 1_000_000 : 1_000;
  const scaled = absRounded / divisor;
  if (scaled >= 10) return groupInt(String(Math.round(scaled)));
  const tenths = Math.round(scaled * 10) / 10;
  const [intRaw, frac] = tenths.toFixed(1).split(".");
  return `${groupInt(intRaw ?? "0")},${frac ?? "0"}`;
}

function unitSuffix(unit: EuroUnit): string {
  if (unit === "mil") return `mil.${NBSP}€`;
  if (unit === "tis") return `tis.${NBSP}€`;
  return "€";
}

function formatEuroAbs(absRounded: number): string {
  const unit = unitFor(absRounded);
  return `${quantityInUnit(absRounded, unit)}${NBSP}${unitSuffix(unit)}`;
}

/**
 * Euro amount at 2 significant digits.
 * `61000` → `61 tis. €`, `8300` → `8,3 tis. €`, `1200000` → `1,2 mil. €`,
 * below 1 000 → `950 €`. Rounding that crosses 1 000 or 1 000 000
 * uses the next unit (`999999` → `1,0 mil. €`).
 */
export function formatEuroRounded(value: number): string {
  if (!Number.isFinite(value) || value === 0) return `0${NBSP}€`;
  const rounded = round2sig(value);
  if (rounded === 0) return `0${NBSP}€`;
  const sign = rounded < 0 ? "−" : "";
  return `${sign}${formatEuroAbs(Math.abs(rounded))}`;
}

/**
 * Inclusive euro range at 2 significant digits, one unit, en dash, NBSP.
 * `formatEuroRange(560000, 860000)` → `560 – 860 tis. €`.
 */
export function formatEuroRange(low: number, high: number): string {
  const a = Number.isFinite(low) ? round2sig(low) : 0;
  const b = Number.isFinite(high) ? round2sig(high) : 0;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (lo === hi) return formatEuroRounded(lo);

  const unit = unitFor(Math.max(Math.abs(lo), Math.abs(hi)));
  const left = `${lo < 0 ? "−" : ""}${quantityInUnit(Math.abs(lo), unit)}`;
  const right = `${hi < 0 ? "−" : ""}${quantityInUnit(Math.abs(hi), unit)}`;
  return `${left}${NBSP}${EN_DASH}${NBSP}${right}${NBSP}${unitSuffix(unit)}`;
}

/** `13. 10. 2026, 12:31` from a Date or ISO string. Empty when invalid. */
export function formatDateTimeSk(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}. ${month}. ${year}, ${hours}:${minutes}`;
}
