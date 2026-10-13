import type { Metadata } from "next";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import AuditTeaser from "@/components/sections/AuditTeaser";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FaqSection from "@/components/sections/FaqSection";
import { buildFaqPageLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AVENG | Procesný audit a technické vedenie pre MSP",
  description:
    "Procesný self-audit a Fractional Technical Leadership pre výrobné MSP na Slovensku a Morave. Inšpirované princípmi procesného auditu (VDA 6.3, Lean, TPM/OEE).",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Hero />
        <Services />
        <AuditTeaser />
        <FaqSection />
      </main>
      <Footer />
      <JsonLd data={buildFaqPageLd()} />
    </>
  );
}
