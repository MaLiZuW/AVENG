import Link from "next/link";
import PageFaq from "@/components/sections/PageFaq";
import { ABOUT } from "@/content/about";

export default function About() {
  return (
    <section
      id="o-nas"
      className="section-pad border-t border-white/5 bg-ink-900/40"
      aria-labelledby="about-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">{ABOUT.eyebrow}</p>
        <h1 id="about-heading" className="heading-display max-w-2xl">
          {ABOUT.heading}
        </h1>
        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 prose-muted">
            <p>{ABOUT.lead}</p>
            {ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <p className="text-sm text-ink-300">{ABOUT.model}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={ABOUT.cta.primaryHref} className="btn-primary">
                {ABOUT.cta.primaryLabel}
              </Link>
              <Link href={ABOUT.cta.secondaryHref} className="btn-secondary">
                {ABOUT.cta.secondaryLabel}
              </Link>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-50">
              {ABOUT.experienceHeading}
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-ink-200">
              {ABOUT.experiences.map((experience) => (
                <li key={experience}>{experience}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-4 max-w-3xl">
          <PageFaq items={ABOUT.faq} headingId="about-faq-heading" />
        </div>
      </div>
    </section>
  );
}
