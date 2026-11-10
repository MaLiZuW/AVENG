import type { FaqItem, PageCta } from "@/content/types";
import { company } from "@/config/company";

export const ABOUT_META = {
  title: "O nás",
  description:
    "AddValueEngineering pomáha výrobným MSP riešiť konkrétne problémy projektovo. Realizáciu vykonáva tím klienta.",
} as const;

export const ABOUT = {
  eyebrow: "O nás",
  heading: "Projektové riešenia pre výrobné firmy",
  lead:
    `${company.brandName} pomáha výrobným MSP nájsť jeden konkrétny problém, navrhnúť riešenia a pripraviť projektový plán. Projekty vedie Vladimir; realizáciu vykonáva tím klienta.`,
  paragraphs: [
    "Spolupráca sa začína úvodným rozhovorom a pokračuje projektovým sprintom. Ďalšie vedenie projektu je voliteľné; stretnutia prebiehajú pravidelne podľa dohodnutého rozsahu.",
    "Pri rozvoji lídrov sa uplatňujú aj skúsenosti s BCTC.",
    `Právnická osoba: ${company.legalName} (IČO ${company.ico}). Sídlo: ${company.addressDisplay}.`,
  ],
  experienceHeading: "Vybrané skúsenosti z praxe",
  experiences: [
    "Zavedenie procesu zmien a podporného nástroja v globálnej EMS skupine.",
    "Interný nástrojový lab v EMS – úspora nákladov.",
    "Správa dokumentácie v EMS – úspora nákladov.",
    "Automatizácia administratívy: schvaľovacie toky a nahrávanie dokumentácie do ERP robotom.",
  ],
  model:
    "Každá služba má dohodnutý problém, cieľ, rozsah a kritérium prijatia. Cena je cenová ponuka podľa rozsahu.",
  faq: [
    {
      q: "Kto realizuje projekt?",
      a: "Realizáciu vykonáva tím klienta. AddValueEngineering identifikuje problém, navrhne riešenia, pripraví plán a podľa dohody vedie projekt.",
    },
    {
      q: "Čo je potrebné na začatie?",
      a: "Sponzor s rozhodovacou právomocou, pridelení ľudia s vyhradeným časom a prístup k potrebným dátam.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/kontakt/?predmet=o-nas",
    primaryLabel: "Popíšte problém",
    secondaryHref: "/sluzby/",
    secondaryLabel: "Pozrieť projektové služby",
  } satisfies PageCta,
} as const;
