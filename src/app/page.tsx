import type { Metadata } from "next";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import AuditTeaser from "@/components/sections/AuditTeaser";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import {
  HomeAfterProjects,
  HomeBeforeProjects,
} from "@/components/sections/HomeDetails";
import Services from "@/components/sections/Services";
import FaqSection from "@/components/sections/FaqSection";
import { HOME_FAQ } from "@/content/home-faq";
import { buildFaqPageLd } from "@/lib/jsonld";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata("/");

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="site-main">
        <Hero />
        <HomeBeforeProjects />
        <Services />
        <HomeAfterProjects />
        <AuditTeaser />
        <FaqSection />
      </main>
      <Footer variant="full" />
      <JsonLd data={buildFaqPageLd(HOME_FAQ)} />
    </>
  );
}
