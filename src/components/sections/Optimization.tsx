import Link from "next/link";
import PageFaq from "@/components/sections/PageFaq";
import { OPTIMIZATION } from "@/content/optimization";

export default function Optimization() {
  return (
    <section
      id="optimalizacia"
      className="section-pad border-t border-white/5 bg-ink-900/40"
      aria-labelledby="opt-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">{OPTIMIZATION.eyebrow}</p>
        <h1 id="opt-heading" className="heading-display max-w-2xl">
          {OPTIMIZATION.heading}
        </h1>
        <p className="prose-muted mt-4 max-w-2xl">{OPTIMIZATION.lead}</p>
        <div className="mt-8">
          <Link href={OPTIMIZATION.cta.primaryHref} className="btn-primary">
            {OPTIMIZATION.cta.primaryLabel}
          </Link>
        </div>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.whenHeading}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-200">
          {OPTIMIZATION.when.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.deliverHeading}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-200">
          {OPTIMIZATION.deliver.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.boundariesHeading}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-200">
          {OPTIMIZATION.boundaries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.experienceHeading}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-200">
          {OPTIMIZATION.experience}
        </p>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.priceHeading}
        </h2>
        <p className="mt-3 text-sm text-ink-200">{OPTIMIZATION.price}</p>

        <div className="mx-auto max-w-3xl">
          <PageFaq items={OPTIMIZATION.faq} headingId="opt-faq-heading" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={OPTIMIZATION.cta.primaryHref} className="btn-primary">
            {OPTIMIZATION.cta.primaryLabel}
          </Link>
          <Link href={OPTIMIZATION.cta.secondaryHref} className="btn-secondary">
            {OPTIMIZATION.cta.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
