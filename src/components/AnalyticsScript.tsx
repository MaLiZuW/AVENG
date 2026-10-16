import { analyticsConfig, isAnalyticsEnabled } from "@/config/analytics";

/**
 * Loads Plausible or Umami only when env is fully configured.
 * Renders nothing when provider is `none` (default).
 */
export default function AnalyticsScript() {
  if (!isAnalyticsEnabled()) return null;

  if (analyticsConfig.provider === "plausible") {
    return (
      <script
        defer
        data-domain={analyticsConfig.siteId}
        src={analyticsConfig.scriptUrl}
      />
    );
  }

  if (analyticsConfig.provider === "umami") {
    return (
      <script
        defer
        data-website-id={analyticsConfig.siteId}
        src={analyticsConfig.scriptUrl}
      />
    );
  }

  return null;
}
