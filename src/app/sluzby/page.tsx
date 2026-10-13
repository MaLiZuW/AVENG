import type { Metadata } from "next";
import Header from "@/components/Header";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Služby",
  description:
    "Štyri piliere AVENG: Fractional Technical Leadership, PLM/PDM, riadenie zmien ECO a rozvoj lídrov.",
  path: "/sluzby/",
});

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Services headingAs="h1" />
      </main>
      <Footer />
    </>
  );
}
