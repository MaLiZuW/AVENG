import type { FaqItem, PageCta } from "@/content/types";

export const SERVICES_META = {
  title: "Služby",
  description:
    "Projektové služby pre výrobné MSP: identifikácia problému, návrh riešení a projektový plán. Realizuje váš tím.",
} as const;

export const SERVICES_OVERVIEW = {
  eyebrow: "Projektové služby",
  heading: "Riešime jeden problém vo vašej firme. Projektovo.",
  lead:
    "Pre malé a stredné výrobné podniky s 20 – 250 zamestnancami. Najprv spolu nájdeme problém, ktorý vás stojí najviac. Potom navrhneme možné riešenia, vyberieme jedno a zostavíme projektový plán. Realizujú vaši ľudia, my ich vedieme, kontrolujeme postup a odstraňujeme prekážky na pravidelných stretnutiach.",
  whenHeading: "Čo od vás potrebujeme",
  when: [
    "Sponzora s rozhodovacou právomocou.",
    "Pridelených ľudí s vyhradeným časom.",
    "Prístup k potrebným dátam.",
  ],
  frameworkHeading: "Čo robíme a čo nie",
  framework: [
    "Identifikujeme problém, navrhujeme varianty riešenia a zostavujeme projektový plán.",
    "Vedieme projektové stretnutia raz až dvakrát týždenne a kontrolujeme postup.",
    "Nenahrádzame vaše vedenie, nevykonávame realizáciu za vás a nedodávame softvér.",
  ],
  processHeading: "Ako to funguje",
  processSteps: [
    "Úvodný rozhovor bez poplatku, trvá 30 minút a overí, či má zmysel začať.",
    "Projektový sprint v trvaní dva až tri týždne za pevnú cenu.",
    "Voliteľné vedenie projektu: jedno až dve stretnutia týždenne, kontrola plnenia a eskalácie.",
  ],
  model:
    "Projektový sprint a ostatné služby: cenová ponuka podľa rozsahu. Level 2 samoobslužného auditu stojí 290 €.",
  extras: [
    {
      title: "Optimalizácia a AI",
      href: "/optimalizacia-a-ai/",
      text: "Projektový návrh riešení; implementácia po samostatnej dohode.",
    },
    {
      title: "Samoobslužný audit",
      href: "/self-audit/",
      text: "Level 1 zdarma; Level 2 za 290 €.",
    },
  ],
  faq: [
    {
      q: "Robíte aj realizáciu?",
      a: "Nie. Realizuje váš tím; my plánujeme, vedieme projektové stretnutia a kontrolujeme postup.",
    },
    {
      q: "Čo ak firma nemá voľných ľudí?",
      a: "Projekt odložíme. Bez vyhradeného času ľudí určených sponzorom nemá zmysel začínať.",
    },
    {
      q: "Koľko to stojí?",
      a: "Level 2 samoobslužného auditu stojí 290 €. Projekty sú cenová ponuka podľa rozsahu.",
    },
    {
      q: "Aký je záväzok?",
      a: "Pri cenovej ponuke nemáte žiadny záväzok.",
    },
    {
      q: "Ako sa platí?",
      a: "Platba prebieha prevodom; údaje dostanete spolu s prístupovým kódom alebo faktúrou.",
    },
    {
      q: "Ako často sa stretávame?",
      a: "Počas projektu sa stretávame raz až dvakrát týždenne.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/kontakt/?predmet=sluzby",
    primaryLabel: "Popíšte problém",
    secondaryHref: "/self-audit/",
    secondaryLabel: "Spustiť self-audit",
  } satisfies PageCta,
} as const;
