import { company } from "@/config/company";
import { getSameAsUrls } from "@/config/social";
import type { FaqItem } from "@/content/types";

const SITE = company.siteUrl;

/** Schema.org JSON-LD object (serializable). */
export type JsonLdObject = Record<string, unknown>;

function postalAddress(): JsonLdObject {
  return {
    "@type": "PostalAddress",
    streetAddress: company.streetAddress,
    addressLocality: company.addressLocality,
    postalCode: company.postalCode,
    addressCountry: company.addressCountry,
  };
}

export function buildProfessionalServiceLd(): JsonLdObject {
  const sameAs = getSameAsUrls();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: company.brandName,
    alternateName: company.brandShort,
    url: SITE,
    logo: `${SITE}/aveng-icon.svg`,
    image: `${SITE}/og-image.png`,
    description:
      "Procesný audit a seniorné technické vedenie pre výrobné MSP na Slovensku. Inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE).",
    address: postalAddress(),
    telephone: company.phoneTel,
    email: company.email,
    priceRange: "€€",
    areaServed: [...company.areaServed],
    founder: {
      "@type": "Person",
      name: company.founderName,
    },
    parentOrganization: {
      "@type": "Organization",
      name: company.legalName,
      taxID: company.dic,
      identifier: {
        "@type": "PropertyValue",
        name: "IČO",
        value: company.ico,
      },
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildFaqPageLd(items: readonly FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildBreadcrumbLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  const origin = SITE.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${origin}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

export function buildServiceLd(input: {
  name: string;
  description: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "ProfessionalService",
      name: company.brandName,
      url: SITE,
      address: postalAddress(),
    },
    areaServed: [...company.areaServed],
  };
}
