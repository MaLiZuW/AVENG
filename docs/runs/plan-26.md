# Plán STEP 26 (W4, T1) + GLOBAL_CHANGES

## Scope (content / page components / schema + nutné GLOBAL_CHANGES)

| Súbor | Akcia |
|---|---|
| `src/content/*` | Nové TS dátové súbory: home FAQ, o-nas, prehľad služieb, 4 piliere, optimalizácia, lastmod, founder photo (null) |
| `src/config/pillars.ts` | Krátke texty + relatedSlugs; detaily z content |
| `src/config/company.ts` + `supabase/functions/_shared/company.ts` | Adresa sídla (streetAddress), display/registeredSeat |
| `src/config/levels.ts` | L2 bez sumy; access copy podľa 2.7 |
| `src/lib/jsonld.ts` | ProfessionalService / Service / FAQPage / Breadcrumb; areaServed bez Moravy; streetAddress |
| `src/components/sections/{About,Hero,FaqSection,Services,Optimization,Footer}.tsx` | Schválený copy; FAQ; regióny; fotka len ak config |
| `src/components/sections/PageFaq.tsx` | Znovupoužiteľné FAQ (viditeľné = JSON-LD) |
| `src/components/ContentPage.tsx` | Spoločný layout pre pilier / content stránky |
| `src/app/{page,o-nas,sluzby,sluzby/[slug],optimalizacia-a-ai}/page.tsx` | Meta, JSON-LD, content, interné odkazy |
| `src/app/sitemap.ts` | lastmod z `src/content/lastmod.ts` |
| `src/components/audit/{Level2Gate,AuditSection}.tsx` + `AuditTeaser.tsx` | Verbatim L2/L3 text; bez „po úhrade“; bez 290 € |
| `scripts/check-public-copy.ts` | Fail na `[[` a `TODO` v `out/` |
| `docs/content-drafts/o-nas.md` | Odstrániť 290 € (súlad s GLOBAL) |
| `docs/runs/plan-26.md`, `docs/runs/RUN-STATE.md` | Plán + záznam |

## Mimo scope
Remote Supabase, migrácie, deploy, výpočtový engine, nové závislosti, BCTC logá.

## GLOBAL_CHANGES
Morava von; adresa Košeca; sameAs/sociálne skryté; L2/L3 verbatim; žiadne sumy; booking → `/kontakt/?predmet=...`; kontrola Select-String (bez QUESTIONS_FOR_OWNER.md).

## Kritérium pokračovania bez čakania
Áno — len content, page komponenty, schéma/config copy a check skript podľa kroku.
