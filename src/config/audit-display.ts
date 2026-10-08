/**
 * Display-layer constants (do not change scoring math).
 * TODO(owner): confirm MAX_DISPLAYED_POTENTIAL_SHARE and SHOW_WORLD_CLASS_CEILING
 * after reviewing docs/audit-sanity-report.md.
 */

/** Cap theoretical WC potential share of process cost base when displaying */
export const MAX_DISPLAYED_POTENTIAL_SHARE = 0.35;

/**
 * World-class ceiling is hidden by default until owner enables after sanity review.
 */
export const SHOW_WORLD_CLASS_CEILING = false;

/** Internal process IDs → public domain labels D1–D5 */
export const DOMAIN_DISPLAY_LABEL: Record<
  "P1" | "P2" | "P3" | "P4" | "P5",
  string
> = {
  P1: "D1",
  P2: "D2",
  P3: "D3",
  P4: "D4",
  P5: "D5",
};

export function domainLabel(processId: string): string {
  return (
    DOMAIN_DISPLAY_LABEL[processId as keyof typeof DOMAIN_DISPLAY_LABEL] ??
    processId
  );
}
