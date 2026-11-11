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
import { buildMetadata, buildSeoMetadata } from "@/lib/seo";

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
  return buildSeoMetadata(`/sluzby/${pillar.slug}/`);
}

export default function PillarPage({ params }: Props) {
  const pillar = getPillar(params.slug);
  const page = getPillarPage(params.slug);
  if (!pillar || !page) notFound();

  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "Služby", path: "/sluzby/" },
    { name: page.title, path: `/sluzby/${pillar.slug}/` },
  ]);
  const serviceLd = buildServiceLd({
    name: page.title,
    description: page.metaDescription,
  });

  return (
    <>
      <Header />
      <main id="main-content" className="site-main section-pad">
        <div className="container-aveng max-w-3xl">
          <p className="eyebrow mb-4">Projekt</p>
          <h1 className="heading-display">{page.title}</h1>
          <p className="prose-muted mt-4">{page.lead}</p>

          <div className="mt-8">
            <Link href={page.cta.primaryHref} className="btn-primary">
              {page.cta.primaryLabel}
            </Link>
          </div>

          {page.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink-50">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-200">
                {section.blocks.map((block, index) => {
                  if (block.type === "paragraph") {
                    return <p key={`${section.heading}-${index}`}>{block.text}</p>;
                  }
                  if (block.type === "link-paragraph") {
                    return (
                      <p key={`${section.heading}-${index}`}>
                        {block.before}
                        <Link
                          href={block.href}
                          className="text-signal-bright underline-offset-2 hover:underline"
                        >
                          {block.linkText}
                        </Link>
                        {block.after}
                      </p>
                    );
                  }
                  const List = block.type === "ordered" ? "ol" : "ul";
                  return (
                    <List
                      key={`${section.heading}-${index}`}
                      className={
                        block.type === "ordered"
                          ? "list-decimal space-y-2 pl-5"
                          : "list-disc space-y-2 pl-5"
                      }
                    >
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </List>
                  );
                })}
              </div>
            </section>
          ))}

          <PageFaq items={page.faq} headingId={`faq-${pillar.slug}`} />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={page.cta.primaryHref} className="btn-primary">
              {page.cta.primaryLabel}
            </Link>
            <Link href={page.cta.secondaryHref} className="btn-secondary">
              {page.cta.secondaryLabel}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={[breadcrumb, serviceLd, buildFaqPageLd(page.faq)]} />
    </>
  );
}
