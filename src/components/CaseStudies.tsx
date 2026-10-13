/**
 * Placeholder for future case studies.
 * Not mounted on any route. Renders nothing while CASE_STUDIES is empty.
 * TODO(owner): add verified references before importing this into a page.
 */

import { CASE_STUDIES } from "@/data/case-studies";

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
