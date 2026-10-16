import type { MetadataRoute } from "next";
import { company } from "@/config/company";
import { CONTENT_LASTMOD } from "@/content/lastmod";

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
  return routes.map((path) => {
    const key = path || "/";
    const lastmod = CONTENT_LASTMOD[key];
    return {
      url: `${base}${path || "/"}`,
      lastModified: lastmod ? new Date(lastmod) : new Date(),
      changeFrequency: path.includes("self-audit") ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
    };
  });
}
