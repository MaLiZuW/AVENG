import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Optimization from "@/components/sections/Optimization";
import Services from "@/components/sections/Services";
import FaqSection from "@/components/sections/FaqSection";

export const metadata: Metadata = {
  title: "AVENG | Procesný audit a technické vedenie pre MSP",
  description:
    "Procesný self-audit a Fractional Technical Leadership pre výrobné MSP na Slovensku a Morave.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Hero />
        <About />
        <Services />
        <Optimization />
        <section id="audit" className="section-pad border-t border-white/5">
          <div className="container-aveng max-w-2xl">
            <p className="eyebrow mb-4">Self-Audit</p>
            <h2 className="heading-display">3-úrovňový procesný audit</h2>
            <p className="prose-muted mt-4">
              Level 1 je bezplatný orientačný skríning. Level 2 a 3 prinášajú
              hlbšiu diagnostiku. Výsledok: indikatívny potenciál úspor a
              prioritné odporúčania — bez záruky konkrétnych úspor.
            </p>
            <Link href="/self-audit/" className="btn-primary mt-8 inline-flex">
              Spustiť bezplatný self-audit
            </Link>
          </div>
        </section>
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
