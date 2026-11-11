import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSeoMetadata("/kontakt/");

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
