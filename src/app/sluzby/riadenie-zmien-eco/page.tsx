import type { Metadata } from "next";
import StaticRedirect from "@/components/StaticRedirect";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/sluzby/projekt-zmeny-eco/",
  title: "Presmerovanie pôvodnej služby ECO",
  description:
    "Aktuálny projekt zmeny a ECO nájdete na novej adrese služieb.",
});

export default function LegacyEcoRedirect() {
  return <StaticRedirect destination="/sluzby/projekt-zmeny-eco/" />;
}
