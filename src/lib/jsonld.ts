import { company } from "@/config/company";
import { getSameAsUrls } from "@/config/social";
import { FAQ } from "@/components/sections/FaqSection";

const SITE = company.siteUrl;

/** Schema.org JSON-LD object (serializable). */
export type JsonLdObject = Record<string, unknown>;

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
      "Procesný audit a seniorné technické vedenie pre výrobné MSP na Slovensku a Morave. Inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE).",
    address: {
      "@type": "PostalAddress",
      addressLocality: company.addressLocality,
      postalCode: company.postalCode,
      addressCountry: company.addressCountry,
    },
    telephone: company.phoneTel,
    email: company.email,
    priceRange: "€€",
    areaServed: ["Slovensko", "Morava"],
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

export function buildFaqPageLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
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
    },
    areaServed: ["Slovensko", "Morava"],
  };
}
