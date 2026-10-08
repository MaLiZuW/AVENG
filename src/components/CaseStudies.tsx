/**
 * Placeholder structure for future case studies.
 * Intentionally NOT rendered on the public site until owner provides real data.
 * TODO(owner): doplniť overené referencie a zapnúť export v page.tsx
 */

export interface CaseStudy {
  id: string;
  sector: string;
  summary: string;
  outcome: string;
}

/** Empty until owner supplies verified entries */
export const CASE_STUDIES: CaseStudy[] = [];

/** Hidden stub — do not import into public pages yet */
export default function CaseStudies() {
  if (CASE_STUDIES.length === 0) return null;
  return (
    <section aria-labelledby="cases-heading" className="section-pad">
      <div className="container-aveng">
        <h2 id="cases-heading" className="heading-display">
          Referencie
        </h2>
        <ul className="mt-8 space-y-4">
          {CASE_STUDIES.map((c) => (
            <li key={c.id} className="text-sm text-ink-200">
              <strong className="text-ink-50">{c.sector}</strong> — {c.summary}{" "}
              ({c.outcome})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
