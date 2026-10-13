import type { Metadata } from "next";
import { company } from "@/config/company";

const BRAND_SUFFIX = " | AVENG";

/** Homepage `<title>`. The brand suffix is not applied a second time. */
export const HOME_TITLE = "AVENG | Procesný audit a technické vedenie pre MSP";

const OG_IMAGE_PATH = "/og-image.png";

const OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: "AddValueEngineering — procesný audit pre MSP",
} as const;

type BuildMetadataInput = {
  /** Canonical path. A trailing slash is added when missing. `"/"` is the homepage. */
  path: string;
  /**
   * Page name, or a full title that already ends with " | AVENG".
   * The homepage always uses `HOME_TITLE`.
   */
  title: string;
  description: string;
};

function siteOrigin(): string {
  return company.siteUrl.replace(/\/+$/, "");
}

function absolutePageUrl(path: string): string {
  const origin = siteOrigin();
  const raw = path.trim();
  if (raw === "" || raw === "/") return `${origin}/`;
  const withLead = raw.startsWith("/") ? raw : `/${raw}`;
  const withSlash = withLead.endsWith("/") ? withLead : `${withLead}/`;
  return `${origin}${withSlash}`;
}

function documentTitle(path: string, title: string): string {
  if (absolutePageUrl(path) === `${siteOrigin()}/`) return HOME_TITLE;

  let page = title.trim();
  while (page.endsWith(BRAND_SUFFIX)) {
    page = page.slice(0, -BRAND_SUFFIX.length).trim();
  }
  return `${page}${BRAND_SUFFIX}`;
}

/**
 * Per-route metadata for the static export.
 * `<title>` is "{Page} | AVENG" (homepage keeps `HOME_TITLE`).
 * Open Graph and Twitter repeat that title, the meta description, and the
 * absolute canonical URL (trailing slash).
 */
export function buildMetadata({
  path,
  title,
  description,
}: BuildMetadataInput): Metadata {
  const document = documentTitle(path, title);
  const url = absolutePageUrl(path);

  return {
    title: { absolute: document },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "sk_SK",
      url,
      siteName: company.brandName,
      title: document,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: document,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
