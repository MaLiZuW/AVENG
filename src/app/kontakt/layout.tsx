import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/kontakt/",
  title: "Kontakt",
  description:
    "Popíšte problém. Ozveme sa s návrhom ďalšieho kroku, bez povinnosti.",
});

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
