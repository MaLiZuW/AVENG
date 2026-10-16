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
        <p className="mt-4 max-w-2xl text-sm text-ink-200">
          {OPTIMIZATION.boundary}
        </p>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.whenHeading}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-200">
          {OPTIMIZATION.when.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {OPTIMIZATION.features.map((f, i) => (
            <article
              key={f.title}
              className="animate-fade-up border-t border-signal/40 pt-5"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <h2 className="font-display text-lg font-semibold text-ink-50">
                {f.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-200">
                {f.text}
              </p>
            </article>
          ))}
        </div>

        <h2 className="mt-14 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.processHeading}
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-200">
          {OPTIMIZATION.processSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h2 className="mt-14 font-display text-xl font-semibold text-ink-50">
          {OPTIMIZATION.exampleHeading}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-200">
          {OPTIMIZATION.example}
        </p>

        <p className="mt-10 text-sm text-ink-300">Súvisiace piliere</p>
        <ul className="mt-2 flex flex-wrap gap-3 text-sm">
          {OPTIMIZATION.relatedPillars.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="text-signal-bright underline-offset-2 hover:underline"
              >
                {p.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/self-audit/"
              className="text-signal-bright underline-offset-2 hover:underline"
            >
              Self-audit
            </Link>
          </li>
          <li>
            <Link
              href="/kontakt/?predmet=optimalizacia-a-ai"
              className="text-signal-bright underline-offset-2 hover:underline"
            >
              Kontakt
            </Link>
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={OPTIMIZATION.cta.primaryHref} className="btn-primary">
            {OPTIMIZATION.cta.primaryLabel}
          </Link>
          <Link href={OPTIMIZATION.cta.secondaryHref} className="btn-secondary">
            {OPTIMIZATION.cta.secondaryLabel}
          </Link>
        </div>

        <div className="mx-auto max-w-3xl">
          <PageFaq items={OPTIMIZATION.faq} headingId="opt-faq-heading" />
        </div>
      </div>
    </section>
  );
}
