import type { Metadata } from "next";
import Header from "@/components/Header";
import AuditSection from "@/components/audit/AuditSection";
import Footer from "@/components/sections/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Self-audit procesov",
  description:
    "Bezplatný Level 1 self-audit výrobných procesov pre MSP — indikatívny potenciál úspor a prioritné odporúčania. Inšpirované princípmi procesného auditu (VDA 6.3, Lean, TPM/OEE).",
  path: "/self-audit/",
});

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
