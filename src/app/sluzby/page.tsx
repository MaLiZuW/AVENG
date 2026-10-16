import type { Metadata } from "next";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";
import { SERVICES_META, SERVICES_OVERVIEW } from "@/content/services-overview";
import { buildBreadcrumbLd, buildFaqPageLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/sluzby/",
  title: SERVICES_META.title,
  description: SERVICES_META.description,
});

export default function ServicesPage() {
  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "Služby", path: "/sluzby/" },
  ]);

  return (
    <>
      <Header />
      <main>
        <Services headingAs="h1" full />
      </main>
      <Footer />
      <JsonLd data={[breadcrumb, buildFaqPageLd(SERVICES_OVERVIEW.faq)]} />
    </>
  );
}
