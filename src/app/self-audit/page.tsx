import type { Metadata } from "next";
import Header from "@/components/Header";
import AuditSection from "@/components/audit/AuditSection";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/self-audit/",
  title: "Self-audit výrobných procesov | AVENG",
  description:
    "Bezplatný Level 1 self-audit pre výrobné MSP: indikatívny potenciál úspor, kritická doména a tri prioritné odporúčania.",
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
