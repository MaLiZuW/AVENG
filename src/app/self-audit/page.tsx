import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

/** Code-split audit UI onto this route only; SSR keeps HTML stable (CLS). */
const AuditSection = dynamic(() => import("@/components/audit/AuditSection"), {
  ssr: true,
  loading: () => (
    <div className="section-pad min-h-[28rem]" role="status" aria-live="polite">
      <div className="container-aveng max-w-3xl">
        <p className="prose-muted">Načítavam self-audit…</p>
      </div>
    </div>
  ),
});

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
      <main id="main-content" className="site-main">
        <AuditSection />
      </main>
      <Footer />
    </>
  );
}
