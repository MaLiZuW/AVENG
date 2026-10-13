import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Napíšte AddValueEngineering — kontaktný formulár, e-mail a konzultácia pre výrobné MSP.",
  path: "/kontakt/",
});

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
