import type { MetadataRoute } from "next";
import { company } from "@/config/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.siteUrl.replace(/\/$/, "");
  const routes = [
    "",
    "/o-nas/",
    "/sluzby/",
    "/sluzby/fractional-technical-leadership/",
    "/sluzby/zavadzanie-procesov-plm-pdm/",
    "/sluzby/riadenie-zmien-eco/",
    "/sluzby/rozvoj-liderov-koucing/",
    "/optimalizacia-a-ai/",
    "/self-audit/",
    "/kontakt/",
    "/ochrana-osobnych-udajov/",
  ];
  return routes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path.includes("self-audit") ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
