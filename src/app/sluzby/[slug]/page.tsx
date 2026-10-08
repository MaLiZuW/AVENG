import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { company } from "@/config/company";
import { getPillar, PILLARS } from "@/config/pillars";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const pillar = getPillar(params.slug);
  if (!pillar) return { title: "Služba | AVENG" };
  const title = `${pillar.title} | AVENG`.slice(0, 60);
  const description = pillar.short.slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `/sluzby/${pillar.slug}/` },
    openGraph: {
      title,
      description,
      url: `/sluzby/${pillar.slug}/`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default function PillarPage({ params }: Props) {
  const pillar = getPillar(params.slug);
  if (!pillar) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domov",
        item: company.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Služby",
        item: `${company.siteUrl}/sluzby/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pillar.title,
        item: `${company.siteUrl}/sluzby/${pillar.slug}/`,
      },
    ],
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pillar.title,
    description: pillar.short,
    provider: {
      "@type": "ProfessionalService",
      name: company.brandName,
      url: company.siteUrl,
    },
    areaServed: ["Slovensko", "Morava"],
  };

  return (
    <>
      <Header />
      <main className="section-pad">
        <div className="container-aveng max-w-3xl">
          <p className="eyebrow mb-4">Pilier {pillar.num}</p>
          <h1 className="heading-display">{pillar.title}</h1>
          <p className="prose-muted mt-4">{pillar.short}</p>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-200">
            {pillar.body.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/self-audit/" className="btn-primary">
              Spustiť bezplatný self-audit
            </Link>
            <Link href="/kontakt/" className="btn-secondary">
              Kontakt
            </Link>
            <Link href="/sluzby/" className="btn-secondary">
              Všetky služby
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
    </>
  );
}
