import type { Metadata } from "next";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import { ABOUT } from "@/content/about";
import { buildBreadcrumbLd, buildFaqPageLd } from "@/lib/jsonld";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata("/o-nas/");

export default function AboutPage() {
  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "O nás", path: "/o-nas/" },
  ]);

  return (
    <>
      <Header />
      <main id="main-content" className="site-main">
        <About />
      </main>
      <Footer />
      <JsonLd data={[breadcrumb, buildFaqPageLd(ABOUT.faq)]} />
    </>
  );
}
