# Structured data (JSON-LD), phase 2

Render JSON-LD server-side so it is present in the static HTML of `out/**/index.html` (`<script type="application/ld+json">`). Escape `<` as `<` in the serialized JSON. Use one shared helper and one `@id` scheme. Do not include ratings, reviews, `sameAs`, person images, `priceRange` or `offers`.

Base URL: `https://www.addvalueengineering.sk`

## Site-wide (in the root layout)
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.addvalueengineering.sk/#organization",
  "name": "AddValueEngineering",
  "legalName": "AV – Agency, s. r. o.",
  "url": "https://www.addvalueengineering.sk/",
  "email": "vladimir@addvalueengineering.sk",
  "telephone": "+421948007304",
  "identifier": { "@type": "PropertyValue", "propertyID": "IČO", "value": "47054328" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Zliechovská ulica 1117/110",
    "postalCode": "018 64",
    "addressLocality": "Košeca",
    "addressCountry": "SK"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Trenčiansky kraj" },
    { "@type": "AdministrativeArea", "name": "Žilinský kraj" },
    { "@type": "AdministrativeArea", "name": "Trnavský kraj" }
  ],
  "audience": { "@type": "BusinessAudience", "name": "Výrobné firmy s 20 až 250 zamestnancami" },
  "knowsAbout": ["procesný audit výroby", "riadenie technických zmien ECO", "správa výrobnej dokumentácie", "koučing vedúcich vo výrobe", "automatizácia administratívy"]
}
```
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.addvalueengineering.sk/#website",
  "url": "https://www.addvalueengineering.sk/",
  "name": "AddValueEngineering",
  "inLanguage": "sk-SK",
  "publisher": { "@id": "https://www.addvalueengineering.sk/#organization" }
}
```

## Project pages (`audit-problem`, `zmeny-eco`, `dokumentacia`, `lideri`, `ai`)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.addvalueengineering.sk{route}#service",
  "name": "{H1 from the page spec}",
  "description": "{meta_description from seo.json}",
  "url": "https://www.addvalueengineering.sk{route}",
  "serviceType": "{primary_keyword from seo.json}",
  "provider": { "@id": "https://www.addvalueengineering.sk/#organization" },
  "areaServed": [ same three regions as above ],
  "audience": { "@type": "BusinessAudience", "name": "Výrobné firmy s 20 až 250 zamestnancami" },
  "inLanguage": "sk-SK"
}
```

## `/sluzby/`
`CollectionPage` or `Service` list is optional. Required: BreadcrumbList.

## `/self-audit/`
`WebApplication` is NOT recommended (audit is gated by a form). Use `Service` with the same shape as project pages and a FAQPage. No `offers`.

## `/o-nas/`
`AboutPage` with `about: { "@id": ".../#organization" }`. Do not add a `Person` with surname, photo or social links.

## `/kontakt/`
`ContactPage` with `about: { "@id": ".../#organization" }`.

## FAQPage (every page that has a visible FAQ)
Build `mainEntity` from the SAME array that renders the visible FAQ. Answer `text` is plain text (no HTML). Never mark up a FAQ that is not visible.

## BreadcrumbList (every page except `/`)
- Project pages: Domov → Služby → {project name}
- Others: Domov → {page name}
- Phase 4 article: Domov → Znalosti → {article name}
Breadcrumb names must equal the visible breadcrumb labels.

## Article (phase 4, `/znalosti/co-je-eco/`)
`headline` = H1, `description` = meta description, `author` and `publisher` = `{ "@id": ".../#organization" }` (no personal name), `datePublished` = merge date (ISO), `mainEntityOfPage` = page URL.

## Validation
`npm run check:content -- --phase=2` parses every JSON-LD block (valid JSON, `@context` present), checks required types per route, and checks FAQPage question count equals the visible FAQ question count.
