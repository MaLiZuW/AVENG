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
      <div className="container-aveng max-w-3xl">
        <p className="eyebrow mb-4">{ABOUT.eyebrow}</p>
        <h1 id="about-heading" className="heading-display">
          {ABOUT.heading}
        </h1>
        <p className="prose-muted mt-4">{ABOUT.lead}</p>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {ABOUT.workHeading}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-200">
          {ABOUT.work.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {ABOUT.experienceHeading}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-200">
          {ABOUT.experiences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-display text-xl font-semibold text-ink-50">
          {ABOUT.audienceHeading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-200">
          {ABOUT.audience}
        </p>

        <PageFaq items={ABOUT.faq} headingId="about-faq-heading" />
        <div className="mt-10">
          <Link href="/kontakt/" className="btn-primary">
            Popíšte nám problém
          </Link>
        </div>
      </div>
    </section>
  );
}
