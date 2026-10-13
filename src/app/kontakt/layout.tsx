import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/kontakt/",
  title: "Kontakt",
  description:
    "Napíšte AddValueEngineering — kontaktný formulár, e-mail a konzultácia pre výrobné MSP.",
});

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
