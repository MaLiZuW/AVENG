import type { Metadata } from "next";
import Header from "@/components/Header";
import Optimization from "@/components/sections/Optimization";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Optimalizácia a AI | AVENG",
  description:
    "Procesy, informačné systémy a praktické využitie AI vo výrobných MSP.",
  alternates: { canonical: "/optimalizacia-a-ai/" },
};

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
