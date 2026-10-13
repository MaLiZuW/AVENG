import type { Metadata } from "next";
import { company } from "@/config/company";

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "AddValueEngineering — procesný audit pre MSP",
} as const;

type PageMetaInput = {
  /** Short title without "| AVENG" — layout template appends it. */
  title: string;
  description: string;
  /** Canonical path with trailing slash (or "/" for home). */
  path: string;
  /** Exact document title (skips "%s | AVENG" template). */
  absoluteTitle?: boolean;
};

/**
 * Unique per-route metadata for static export (title, description, canonical, OG, Twitter).
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const desc =
    description.length > 155 ? description.slice(0, 152) + "…" : description;
  const displayTitle = absoluteTitle ? title : `${title} | AVENG`;
  const titleField: Metadata["title"] = absoluteTitle
    ? { absolute: title.slice(0, 60) }
    : title.slice(0, 60);

  return {
    title: titleField,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "sk_SK",
      url: path,
      siteName: company.brandName,
      title: displayTitle.slice(0, 60),
      description: desc,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle.slice(0, 60),
      description: desc,
      images: [OG_IMAGE.url],
    },
  };
}
