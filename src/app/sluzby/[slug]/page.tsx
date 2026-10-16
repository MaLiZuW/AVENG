import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import PageFaq from "@/components/sections/PageFaq";
import Footer from "@/components/sections/Footer";
import { getPillar, PILLARS } from "@/config/pillars";
import { getPillarPage } from "@/content/pillars";
import {
  buildBreadcrumbLd,
  buildFaqPageLd,
  buildServiceLd,
} from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const pillar = getPillar(params.slug);
  const page = getPillarPage(params.slug);
  if (!pillar || !page) {
    return buildMetadata({
      path: `/sluzby/${params.slug}/`,
      title: "Služba",
      description: "Požadovaná služba na webe nie je.",
    });
  }
  return buildMetadata({
    path: `/sluzby/${pillar.slug}/`,
    title: pillar.title,
    description: page.metaDescription,
  });
}

export default function PillarPage({ params }: Props) {
  const pillar = getPillar(params.slug);
  const page = getPillarPage(params.slug);
  if (!pillar || !page) notFound();

  const related = page.related
    .map((slug) => getPillar(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "Služby", path: "/sluzby/" },
    { name: pillar.title, path: `/sluzby/${pillar.slug}/` },
  ]);

  const serviceLd = buildServiceLd({
    name: pillar.title,
    description: page.metaDescription,
  });

  return (
    <>
      <Header />
      <main id="main-content" className="site-main section-pad">
        <div className="container-aveng max-w-3xl">
          <p className="eyebrow mb-4">Pilier {pillar.num}</p>
          <h1 className="heading-display">{pillar.title}</h1>
          <p className="prose-muted mt-4">{page.lead}</p>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink-50">
            {page.whenHeading}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-200">
            {page.when.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {page.deliver && page.deliverHeading ? (
            <>
              <h2 className="mt-10 font-display text-xl font-semibold text-ink-50">
                {page.deliverHeading}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-200">
                {page.deliver.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          <h2 className="mt-10 font-display text-xl font-semibold text-ink-50">
            {page.processHeading}
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-200">
            {page.processSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h2 className="mt-10 font-display text-xl font-semibold text-ink-50">
            {page.modelHeading}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-200">
            {page.model.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>

          {page.experiences && page.experiencesHeading ? (
            <>
              <h2 className="mt-10 font-display text-xl font-semibold text-ink-50">
                {page.experiencesHeading}
              </h2>
              {page.experiencesIntro ? (
                <p className="mt-3 text-sm text-ink-300">{page.experiencesIntro}</p>
              ) : null}
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-200">
                {page.experiences.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </>
          ) : null}

          <h2 className="mt-10 font-display text-xl font-semibold text-ink-50">
            Súvisiace piliere
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/sluzby/${p.slug}/`}
                  className="text-signal-bright underline-offset-2 hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={page.cta.primaryHref} className="btn-primary">
              {page.cta.primaryLabel}
            </Link>
            <Link href={page.cta.secondaryHref} className="btn-secondary">
              {page.cta.secondaryLabel}
            </Link>
            <Link href="/sluzby/" className="btn-secondary">
              Všetky služby
            </Link>
          </div>

          <PageFaq items={page.faq} headingId={`faq-${pillar.slug}`} />
        </div>
      </main>
      <Footer />
      <JsonLd data={[breadcrumb, serviceLd, buildFaqPageLd(page.faq)]} />
    </>
  );
}
