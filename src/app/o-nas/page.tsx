import type { Metadata } from "next";
import Header from "@/components/Header";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/o-nas/",
  title: "O nás | AVENG",
  description:
    "Vladimir, Fractional Engineering Manager s koučingom: technické vedenie a procesný audit pre výrobné MSP na Slovensku a Morave.",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <About />
      </main>
      <Footer />
    </>
  );
}
