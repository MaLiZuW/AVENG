import type { Metadata } from "next";
import Header from "@/components/Header";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "O nás | AVENG",
  description:
    "AddValueEngineering — technické vedenie a procesný audit pre výrobné MSP na Slovensku a Morave.",
  alternates: { canonical: "/o-nas/" },
};

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
