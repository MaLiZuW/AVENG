import Link from "next/link";
import {
  HOME_PROJECTS,
  SERVICES_OVERVIEW,
  SERVICES_PROJECTS,
} from "@/content/services-overview";

type ServicesProps = {
  headingAs?: "h1" | "h2";
  full?: boolean;
};

export default function Services({
  headingAs = "h2",
  full = false,
}: ServicesProps) {
  const Heading = headingAs;
  const projects = full ? SERVICES_PROJECTS : HOME_PROJECTS;

  return (
    <section
      id="sluzby"
      className="section-pad"
      aria-labelledby="services-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">{full ? "Služby" : "Projektové služby"}</p>
        <Heading id="services-heading" className="heading-display max-w-2xl">
          {full ? SERVICES_OVERVIEW.heading : "Typy projektov"}
        </Heading>
        {full ? (
          <p className="prose-muted mt-4 max-w-2xl">
            {SERVICES_OVERVIEW.lead}
          </p>
        ) : null}
        <ul className="mt-14 grid gap-10 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.href} className="group relative">
              <Link
                href={project.href}
                className="block border-t border-signal/40 pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                {"label" in project && (
                  <p className="eyebrow mb-3">{project.label}</p>
                )}
                <h3 className="font-display text-xl font-semibold text-ink-50 group-hover:text-signal-bright">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-200">
                  {project.text}
                </p>
                <span className="mt-3 inline-block text-sm text-signal-bright">
                  Detail projektu →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {full ? (
          <div className="mt-14 max-w-3xl space-y-10">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                {SERVICES_OVERVIEW.processHeading}
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-200">
                {SERVICES_OVERVIEW.processSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                {SERVICES_OVERVIEW.rulesHeading}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-200">
                {SERVICES_OVERVIEW.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={SERVICES_OVERVIEW.cta.primaryHref} className="btn-primary">
                {SERVICES_OVERVIEW.cta.primaryLabel}
              </Link>
              <Link href={SERVICES_OVERVIEW.cta.secondaryHref} className="btn-secondary">
                {SERVICES_OVERVIEW.cta.secondaryLabel}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
