import { company } from "@/config/company";
import { getSameAsUrls } from "@/config/social";
import { FAQ } from "@/components/sections/FaqSection";

const SITE = company.siteUrl;

const professionalService = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.brandName,
  alternateName: company.brandShort,
  url: SITE,
  logo: `${SITE}/aveng-icon.svg`,
  image: `${SITE}/og-image.png`,
  description:
    "Procesný audit a seniorné technické vedenie pre výrobné MSP na Slovensku a Morave. Hodnotenie procesov je inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE).",
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
    jobTitle: "Fractional Engineering Manager & Business Coach",
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
  ...(getSameAsUrls().length ? { sameAs: getSameAsUrls() } : {}),
};

const faqPage = {
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

export default function JsonLd() {
  const payloads = [professionalService, faqPage];
  return (
    <>
      {payloads.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
