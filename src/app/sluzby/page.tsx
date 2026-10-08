import type { Metadata } from "next";
import Header from "@/components/Header";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Služby | AVENG",
  description:
    "Štyri piliere AVENG: Fractional Technical Leadership, PLM/PDM, riadenie zmien ECO a rozvoj lídrov.",
  alternates: { canonical: "/sluzby/" },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Services />
      </main>
      <Footer />
    </>
  );
}
