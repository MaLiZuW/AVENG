import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/sections/Footer";
import { getPillar, PILLARS } from "@/config/pillars";
import {
  buildBreadcrumbLd,
  buildServiceLd,
} from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const pillar = getPillar(params.slug);
  if (!pillar) return { title: "Služba" };
  return pageMetadata({
    title: pillar.title,
    description: pillar.short,
    path: `/sluzby/${pillar.slug}/`,
  });
}

export default function PillarPage({ params }: Props) {
  const pillar = getPillar(params.slug);
  if (!pillar) notFound();

  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "Služby", path: "/sluzby/" },
    { name: pillar.title, path: `/sluzby/${pillar.slug}/` },
  ]);

  const serviceLd = buildServiceLd({
    name: pillar.title,
    description: pillar.short,
  });

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
      <JsonLd data={[breadcrumb, serviceLd]} />
    </>
  );
}
