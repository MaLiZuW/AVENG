import type { Metadata } from "next";
import Header from "@/components/Header";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/sluzby/",
  title: "Služby",
  description:
    "Štyri piliere AVENG: Fractional Technical Leadership, PLM/PDM, riadenie zmien ECO a rozvoj lídrov.",
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
