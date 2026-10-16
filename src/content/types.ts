/** Shared shapes for page content data (STEP 26). */

export type FaqItem = {
  q: string;
  a: string;
};

export type ContentSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type PageCta = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};
