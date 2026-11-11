import type { Metadata } from "next";
import StaticRedirect from "@/components/StaticRedirect";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    path: "/sluzby/",
    title: "Presmerovanie pôvodnej služby",
    description: "Prejdite na aktuálny projektový prehľad služieb.",
  }),
  robots: { index: false, follow: true },
};

export default function LegacyServiceRedirect() {
  return <StaticRedirect destination="/sluzby/" />;
}
