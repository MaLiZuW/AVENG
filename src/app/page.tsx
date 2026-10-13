import type { Metadata } from "next";
import Header from "@/components/Header";
import AuditTeaser from "@/components/sections/AuditTeaser";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FaqSection from "@/components/sections/FaqSection";

export const metadata: Metadata = {
  title: "AVENG | Procesný audit a technické vedenie pre MSP",
  description:
    "Procesný self-audit a Fractional Technical Leadership pre výrobné MSP na Slovensku a Morave. Hodnotenie procesov je inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE).",
  alternates: { canonical: "/" },
};

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
    </>
  );
}
