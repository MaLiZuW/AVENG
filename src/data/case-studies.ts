/**
 * Verified case studies only. Empty until the owner supplies real entries.
 * TODO(owner): add verified references before this list is rendered.
 */

export interface CaseStudy {
  id: string;
  sector: string;
  summary: string;
  outcome: string;
}

export const CASE_STUDIES: CaseStudy[] = [];
