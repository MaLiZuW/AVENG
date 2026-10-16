import type { FaqItem, PageCta } from "@/content/types";

export const SERVICES_META = {
  title: "Služby",
  description:
    "Štyri piliere AVENG, Optimalizácia a AI a self-audit pre výrobné MSP v regiónoch Trenčín, Žilina a Trnava.",
} as const;

export const SERVICES_OVERVIEW = {
  eyebrow: "4 piliere efektivity",
  heading: "Systém, ktorý drží — od stratégie po dielňu",
  lead: "AddValueEngineering (AVENG) pomáha výrobným MSP v regiónoch Trenčín, Žilina a Trnava stabilizovať techniku a procesy. Ponuka má štyri piliere, Optimalizáciu a AI a self-audit. Cieľom je menej hasenia a viac predvídateľnosti — nie ďalšie prezentácie.",
  whenHeading: "Kedy to dáva zmysel",
  when: [
    "Firma rastie, majiteľ denne hasí operatívu, chýba systém v technike alebo zmeny na dielni neprežijú.",
    "Orientačne výrobné MSP s 20 – 250 zamestnancami — automotive, EMS, strojárstvo, plasty, kovovýroba.",
  ],
  frameworkHeading: "Čo dostanete",
  framework: [
    "Diagnostiku (self-audit alebo osobný rozhovor).",
    "Konkrétny rozsah spolupráce podľa dohody.",
    "Dôraz na implementáciu na shopfloori, nie len dokumenty.",
  ],
  processHeading: "Ako to prebieha",
  processSteps: [
    "Self-audit alebo kontakt.",
    "Dohoda priorít.",
    "Zásah v jednom alebo viacerých pilieroch.",
    "Odovzdanie systému tímu.",
  ],
  model:
    "Fractional / projekt / koučing podľa piliera. Cena vychádza z hodinovej sadzby, prípadne z odmeny viazanej na vopred dohodnuté ciele. Presný rozsah a cena sú v ponuke.",
  extras: [
    {
      title: "Optimalizácia a AI",
      href: "/optimalizacia-a-ai/",
      text: "Návrhy riešení. Implementácia až po samostatnej dohode.",
    },
    {
      title: "Self-audit",
      href: "/self-audit/",
      text: "Bezplatný Level 1 skríning a cesta k Level 2/3.",
    },
  ],
  faq: [
    {
      q: "Aké služby ponúkate?",
      a: "Štyri piliere (Fractional Technical Leadership, PLM/PDM procesy, ECO, rozvoj lídrov), Optimalizáciu a AI a self-audit.",
    },
    {
      q: "Kde pôsobíte?",
      a: "V regiónoch Trenčín, Žilina a Trnava.",
    },
    {
      q: "Ako sa určuje cena?",
      a: "Cena vychádza z hodinovej sadzby, prípadne z odmeny viazanej na vopred dohodnuté ciele. Presný rozsah a cena sú v ponuke.",
    },
    {
      q: "Ako začať?",
      a: "Spustite bezplatný self-audit alebo napíšte cez kontaktný formulár.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/self-audit/",
    primaryLabel: "Spustiť bezplatný self-audit",
    secondaryHref: "/kontakt/?predmet=sluzby",
    secondaryLabel: "Kontakt",
  } satisfies PageCta,
} as const;
