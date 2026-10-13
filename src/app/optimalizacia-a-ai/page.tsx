import type { Metadata } from "next";
import Header from "@/components/Header";
import Optimization from "@/components/sections/Optimization";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/optimalizacia-a-ai/",
  title: "Optimalizácia a AI",
  description:
    "Procesy, informačné systémy a praktické využitie AI vo výrobných MSP.",
});

export default function OptimizationPage() {
  return (
    <>
      <Header />
      <main>
        <Optimization />
      </main>
      <Footer />
    </>
  );
}
