/**
 * Data retention / consent flags (presentation + schema proposal).
 * Do not claim automatic deletion in UI unless RETENTION_JOB_VERIFIED is true.
 */

/** Default retention for audit + contact data (days). */
export const RETENTION_DAYS = 28;

/**
 * Set true only after owner approves and deploys the purge migration in production.
 * TODO(owner): verify pg_cron job before enabling public retention claims.
 */
export const RETENTION_JOB_VERIFIED = false;

/**
 * Optional longer follow-up marketing consent (separate unchecked checkbox).
 * TODO(owner/legal): confirm FOLLOWUP_RETENTION_DAYS before enabling.
 */
export const FOLLOWUP_CONSENT_ENABLED = false;
/**
 * Placeholder only. The purge proposal does not delete consented leads
 * until the owner/legal confirms a number.
 * TODO(owner/legal)
 */
export const FOLLOWUP_RETENTION_DAYS = 180;

/**
 * Redeemed/expired unlock codes hold recipient data.
 * No deletion until the owner sets a number.
 * TODO(owner)
 */
export const UNLOCK_CODE_RETENTION_DAYS: number | null = null;

/** Neutral retention sentence when purge is not verified (verbatim SK). */
export const RETENTION_NEUTRAL_SK =
  "Údaje uchovávame len po dobu nevyhnutnú na vyhodnotenie auditu a spracovanie dopytu";

export function retentionPeriodClaimSk(): string {
  if (RETENTION_JOB_VERIFIED) {
    return `Údaje uchovávame najviac ${RETENTION_DAYS} dní.`;
  }
  return `${RETENTION_NEUTRAL_SK}.`;
}

/**
 * Pre-audit start notice body (no absolute promises).
 * UI appends the privacy-policy link: "Podrobnosti nájdete v Zásadách…".
 */
export function auditStartNoticeSk(): string {
  if (RETENTION_JOB_VERIFIED) {
    return `Odpovede používame na vyhodnotenie auditu. Údaje uchovávame najviac ${RETENTION_DAYS} dní.`;
  }
  return `Odpovede používame na vyhodnotenie auditu. ${RETENTION_NEUTRAL_SK}.`;
}

export function followupConsentLabelSk(): string {
  return `Súhlasím s kontaktovaním ohľadom služieb AVENG v nasledujúcich ${FOLLOWUP_RETENTION_DAYS} dňoch`;
}
