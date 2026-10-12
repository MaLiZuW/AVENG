import type { Metadata } from "next";
import Header from "@/components/Header";
import AuditSection from "@/components/audit/AuditSection";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Self-audit procesov | AVENG",
  description:
    "Bezplatný Level 1 self-audit výrobných procesov pre MSP — indikatívny potenciál úspor a prioritné odporúčania. Hodnotenie procesov je inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE).",
  alternates: { canonical: "/self-audit/" },
};

export default function SelfAuditPage() {
  return (
    <>
      <Header />
      <main>
        <AuditSection />
      </main>
      <Footer />
    </>
  );
}
