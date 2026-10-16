import Link from "next/link";
import PageFaq from "@/components/sections/PageFaq";
import { ABOUT } from "@/content/about";
import { FOUNDER_PHOTO } from "@/content/founder";
import { company } from "@/config/company";

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
            {FOUNDER_PHOTO ? (
              // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized
              <img
                src={FOUNDER_PHOTO.src}
                alt={FOUNDER_PHOTO.alt}
                width={FOUNDER_PHOTO.width}
                height={FOUNDER_PHOTO.height}
                className="mb-2 max-w-xs rounded-md"
              />
            ) : null}
            <p>{ABOUT.lead}</p>
            {ABOUT.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <p className="text-sm text-ink-300">{ABOUT.model}</p>
            <p className="text-sm text-ink-300">
              {company.founderName} · {company.brandName} · Powered by{" "}
              {company.legalName}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={ABOUT.cta.primaryHref} className="btn-primary">
                {ABOUT.cta.primaryLabel}
              </Link>
              <Link href={ABOUT.cta.secondaryHref} className="btn-secondary">
                {ABOUT.cta.secondaryLabel}
              </Link>
            </div>
          </div>
          <ul className="space-y-6">
            {ABOUT.bullets.map((b, i) => (
              <li
                key={b.title}
                className="animate-fade-up border-l-2 border-signal pl-5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <h2 className="font-display text-xl font-semibold text-ink-50">
                  {b.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-200">
                  {b.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto mt-4 max-w-3xl">
          <PageFaq items={ABOUT.faq} headingId="about-faq-heading" />
        </div>
      </div>
    </section>
  );
}
