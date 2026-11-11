import type { MetadataRoute } from "next";
import { company } from "@/config/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.siteUrl.replace(/\/$/, "");
  const buildDate = new Date();
  const routes = [
    "",
    "/o-nas/",
    "/sluzby/",
    "/sluzby/procesny-audit-identifikacia-problemu/",
    "/sluzby/projekt-zmeny-eco/",
    "/sluzby/sprava-dokumentacie-a-schvalovanie/",
    "/sluzby/rozvoj-liderov-koucing/",
    "/optimalizacia-a-ai/",
    "/self-audit/",
    "/kontakt/",
    "/ochrana-osobnych-udajov/",
  ];
  return routes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: buildDate,
    changeFrequency: path.includes("self-audit") ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
