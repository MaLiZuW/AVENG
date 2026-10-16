/**
 * Cookieless analytics provider selection (STEP 27 / T3).
 * Default `none` — no script in the static export.
 * Provider and hosting region are owner decisions (docs/INFRA_FACTS.md).
 */

export type AnalyticsProvider = "none" | "plausible" | "umami";

function readProvider(): AnalyticsProvider {
  const raw = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none")
    .trim()
    .toLowerCase();
  if (raw === "plausible" || raw === "umami") return raw;
  return "none";
}

export const analyticsConfig = {
  provider: readProvider(),
  /** Plausible: data-domain; Umami: data-website-id */
  siteId: (process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID ?? "").trim(),
  /** Full script URL (EU-hosted endpoint when the owner supplies one). */
  scriptUrl: (process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ?? "").trim(),
} as const;

export function isAnalyticsEnabled(): boolean {
  return (
    analyticsConfig.provider !== "none" &&
    analyticsConfig.scriptUrl.length > 0 &&
    analyticsConfig.siteId.length > 0
  );
}

/** Processor entry when analytics is configured (policy page). */
export function analyticsProcessorOrNull(): {
  name: string;
  purpose: string;
  locationNote: string;
} | null {
  if (!isAnalyticsEnabled()) return null;
  if (analyticsConfig.provider === "plausible") {
    return {
      name: "Plausible Analytics",
      purpose: "cookieless meranie návštevnosti a udalostí auditu/kontaktov",
      locationNote: "analytická služba (región podľa nastavenia vlastníka)",
    };
  }
  return {
    name: "Umami",
    purpose: "cookieless meranie návštevnosti a udalostí auditu/kontaktov",
    locationNote: "analytická služba (región podľa nastavenia vlastníka)",
  };
}
