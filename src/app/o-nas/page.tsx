import type { Metadata } from "next";
import Header from "@/components/Header";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "O nás",
  description:
    "AddValueEngineering — technické vedenie a procesný audit pre výrobné MSP na Slovensku a Morave.",
  path: "/o-nas/",
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
