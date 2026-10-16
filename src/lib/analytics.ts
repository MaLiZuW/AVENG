/**
 * Cookieless analytics events. No personal data, no audit answers in properties.
 * No-ops when NEXT_PUBLIC_ANALYTICS_PROVIDER is unset / none.
 */

export type AnalyticsEvent =
  | "audit_start"
  | "audit_level_complete"
  | "report_requested"
  | "unlock_attempt"
  | "unlock_success"
  | "contact_submit"
  | "booking_click";

type EventProps = {
  level?: 1 | 2 | 3;
};

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
    umami?: {
      track: (
        event: string,
        data?: Record<string, string | number | boolean>,
      ) => void;
    };
  }
}

function propsFor(event: AnalyticsEvent, extra?: EventProps): Record<string, string | number> {
  if (event === "audit_level_complete" && extra?.level != null) {
    return { level: extra.level };
  }
  if (
    (event === "unlock_attempt" || event === "unlock_success") &&
    extra?.level != null
  ) {
    return { level: extra.level };
  }
  return {};
}

/** Fire a named funnel event. Safe to call from client components only. */
export function track(event: AnalyticsEvent, extra?: EventProps): void {
  if (typeof window === "undefined") return;
  const props = propsFor(event, extra);
  try {
    if (typeof window.plausible === "function") {
      window.plausible(event, Object.keys(props).length ? { props } : undefined);
      return;
    }
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(event, Object.keys(props).length ? props : undefined);
    }
  } catch {
    // Never break UX for analytics.
  }
}
