import type { Metadata } from "next";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Optimization from "@/components/sections/Optimization";
import Footer from "@/components/sections/Footer";
import { OPTIMIZATION, OPTIMIZATION_META } from "@/content/optimization";
import {
  buildBreadcrumbLd,
  buildFaqPageLd,
  buildServiceLd,
} from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/optimalizacia-a-ai/",
  title: OPTIMIZATION_META.title,
  description: OPTIMIZATION_META.description,
});

export default function OptimizationPage() {
  const breadcrumb = buildBreadcrumbLd([
    { name: "Domov", path: "/" },
    { name: "Optimalizácia a AI", path: "/optimalizacia-a-ai/" },
  ]);
  const serviceLd = buildServiceLd({
    name: OPTIMIZATION_META.title,
    description: OPTIMIZATION_META.description,
  });

  return (
    <>
      <Header />
      <main id="main-content" className="site-main">
        <Optimization />
      </main>
      <Footer />
      <JsonLd
        data={[breadcrumb, serviceLd, buildFaqPageLd(OPTIMIZATION.faq)]}
      />
    </>
  );
}
