import type { Metadata } from "next";
import StaticRedirect from "@/components/StaticRedirect";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/sluzby/sprava-dokumentacie-a-schvalovanie/",
  title: "Presmerovanie pôvodnej služby dokumentácie",
  description:
    "Aktuálny projekt správy dokumentácie a schvaľovania nájdete na novej adrese.",
});

export default function LegacyDocumentationRedirect() {
  return (
    <StaticRedirect destination="/sluzby/sprava-dokumentacie-a-schvalovanie/" />
  );
}
