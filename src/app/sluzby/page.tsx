import type { Metadata } from "next";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";
import { buildBreadcrumbLd } from "@/lib/jsonld";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata("/sluzby/");

export default function ServicesPage() {
  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "Služby", path: "/sluzby/" },
  ]);

  return (
    <>
      <Header />
      <main id="main-content" className="site-main">
        <Services headingAs="h1" full />
      </main>
      <Footer />
      <JsonLd data={breadcrumb} />
    </>
  );
}
