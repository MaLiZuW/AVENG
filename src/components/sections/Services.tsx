import Link from "next/link";
import PageFaq from "@/components/sections/PageFaq";
import { PILLARS } from "@/config/pillars";
import { SERVICES_OVERVIEW } from "@/content/services-overview";

type ServicesProps = {
  /** Homepage keeps h2 under Hero h1; /sluzby/ uses h1. */
  headingAs?: "h1" | "h2";
  /** Full overview copy + FAQ (service index page). */
  full?: boolean;
};

export default function Services({
  headingAs = "h2",
  full = false,
}: ServicesProps) {
  const Heading = headingAs;
  const copy = SERVICES_OVERVIEW;
  return (
    <section id="sluzby" className="section-pad" aria-labelledby="services-heading">
      <div className="container-aveng">
        <p className="eyebrow mb-4">{copy.eyebrow}</p>
        <Heading id="services-heading" className="heading-display max-w-2xl">
          {copy.heading}
        </Heading>
        <p className="prose-muted mt-4 max-w-2xl">
          {full ? copy.lead : "Štyri piliere, jeden cieľ: predvídateľná výroba a silní technickí lídri."}
        </p>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <li key={p.slug} className="group relative">
              <span
                className="font-display text-5xl font-semibold text-signal-soft transition group-hover:text-signal-bright motion-reduce:transition-none"
                aria-hidden
              >
                {p.num}
              </span>
              <h3 className="-mt-2 font-display text-xl font-semibold text-ink-50">
                <Link
                  href={`/sluzby/${p.slug}/`}
                  className="hover:text-signal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-200">
                {p.short}
              </p>
              <Link
                href={`/sluzby/${p.slug}/`}
                className="mt-3 inline-block text-sm text-signal-bright underline-offset-2 hover:underline"
              >
                Viac o pilieri
              </Link>
            </li>
          ))}
        </ol>

        {full ? (
          <div className="mt-14 max-w-3xl space-y-10">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                {copy.whenHeading}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-200">
                {copy.when.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                {copy.frameworkHeading}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-200">
                {copy.framework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                {copy.processHeading}
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-200">
                {copy.processSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <p className="text-sm leading-relaxed text-ink-200">{copy.model}</p>
            <ul className="space-y-3">
              {copy.extras.map((extra) => (
                <li key={extra.href} className="text-sm text-ink-200">
                  <Link
                    href={extra.href}
                    className="font-semibold text-signal-bright underline-offset-2 hover:underline"
                  >
                    {extra.title}
                  </Link>
                  {" — "}
                  {extra.text}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href={copy.cta.primaryHref} className="btn-primary">
                {copy.cta.primaryLabel}
              </Link>
              <Link href={copy.cta.secondaryHref} className="btn-secondary">
                {copy.cta.secondaryLabel}
              </Link>
            </div>
            <PageFaq items={copy.faq} headingId="services-faq-heading" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
