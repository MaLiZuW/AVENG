import type { FaqItem, PageCta } from "@/content/types";

export const SERVICES_META = {
  title: "Služby pre výrobné firmy | AddValueEngineering",
  description:
    "Päť projektových služieb pre výrobné firmy: procesný audit, riadenie zmien ECO, dokumentácia, koučing vedúcich a AI. Realizuje váš tím.",
} as const;

export const HOME_PROJECTS = [
  {
    title: "Procesný audit a identifikácia problému",
    href: "/sluzby/procesny-audit-identifikacia-problemu/",
    text: "Nájdeme, čo vás stojí najviac, a navrhneme riešenie.",
  },
  {
    title: "Riadený proces technických zmien (ECO)",
    href: "/sluzby/projekt-zmeny-eco/",
    text: "Zmena prejde firmou bez straty a bez zbytočného čakania.",
  },
  {
    title: "Dokumentácia a schvaľovanie",
    href: "/sluzby/sprava-dokumentacie-a-schvalovanie/",
    text: "Menej papiera, kratšie schvaľovacie slučky, plán automatizácie.",
  },
  {
    title: "Rozvoj vedúcich a koučing",
    href: "/sluzby/rozvoj-liderov-koucing/",
    text: "Aby zlepšenie prežilo aj bez konzultanta.",
  },
] as const;

export const SERVICES_PROJECTS = [
  ...HOME_PROJECTS,
  {
    title: "Optimalizácia a AI",
    href: "/optimalizacia-a-ai/",
    text: "Pre jeden konkrétny problém, kde môže pomôcť automatizácia. Výstup: návrh riešenia. Implementácia samostatne.",
  },
] as const;

export const SERVICES_OVERVIEW = {
  heading: "Každá služba je projekt s jedným cieľom",
  lead:
    "Nenájmete si nás na neurčito. Dohodneme jeden problém, výstup, termín a kritérium prijatia. Potom ho spolu dotiahneme.",
  processHeading: "Každý projekt prebieha rovnako",
  processSteps: [
    "Jeden problém — Vyberieme ten, ktorý vás stojí najviac. Dohodneme rozsah a kritérium prijatia.",
    "Varianty a plán — Navrhneme možné riešenia, vy vyberiete. Zostavíme plán s termínmi a zodpovednými.",
    "Realizácia vaším tímom — My vedieme stretnutia 1 až 2× týždenne a sledujeme plnenie.",
  ],
  rulesHeading: "Pravidlá hry",
  rules: [
    "Sponzor zabezpečí zdroje a súčinnosť ľudí, ktorých určí.",
    "Rozsah a kritérium prijatia sú písomne pred začiatkom.",
    "Zmenu rozsahu riešime dodatkom, nie mlčky.",
    "Cena podľa rozsahu v písomnej ponuke. Úvodný rozhovor je zadarmo.",
  ],
  faq: [] satisfies FaqItem[],
  cta: {
    primaryHref: "/kontakt/",
    primaryLabel: "Popíšte nám problém",
    secondaryHref: "/self-audit/",
    secondaryLabel: "Self-audit",
  } satisfies PageCta,
} as const;
