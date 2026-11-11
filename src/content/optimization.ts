import type { FaqItem, PageCta } from "@/content/types";

export const OPTIMIZATION_META = {
  title: "AI a automatizácia vo výrobe | AddValueEngineering",
  description:
    "Návrh využitia AI a automatizácie pre jeden problém vo výrobe alebo administratíve. Bez predaja softvéru. Implementácia samostatne.",
} as const;

export const OPTIMIZATION = {
  eyebrow: "Projekt",
  heading: "AI a automatizácia vo výrobe: návrh pre jeden konkrétny problém",
  lead:
    "Nepredávame softvér ani nesľubujeme zázraky. Pomenujeme jeden problém vo výrobe alebo administratíve, posúdime, či tu AI alebo automatizácia dáva zmysel, a navrhneme plán.",
  whenHeading: "Kedy to dáva zmysel",
  when: [
    "Ľudia ručne prepisujú to isté z jedného systému do druhého.",
    "Schvaľovanie a evidencia dokumentov zaberá hodiny týždenne.",
    "Chcete vedieť, či sa AI vo vašej firme vôbec oplatí.",
  ],
  deliverHeading: "Čo dostanete",
  deliver: [
    "Jeden vymedzený problém a jeho súčasný stav.",
    "Posúdenie možností vrátane odpovede „AI tu nepotrebujete“, ak je pravda.",
    "Projektový plán: kroky, zodpovední, kritérium prijatia.",
  ],
  boundariesHeading: "Hranice",
  boundaries: [
    "Len navrhujeme riešenia. Implementácia až po samostatnej dohode.",
    "Nedodávame softvér.",
  ],
  experienceHeading: "Z praxe",
  experience:
    "Zavedenie robota do správy dokumentácie a schvaľovacích slučiek v EMS prostredí.",
  priceHeading: "Cena",
  price: "Podľa rozsahu v písomnej ponuke.",
  faq: [
    {
      q: "Predávate AI softvér?",
      a: "Nie. Navrhujeme riešenie a plán. Implementáciu robí váš tím alebo dodávateľ.",
    },
    {
      q: "Musí byť v riešení AI?",
      a: "Nie. Ak postačí jednoduchšia automatizácia alebo zmena procesu, odporučíme ju.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/kontakt/",
    primaryLabel: "Popíšte nám problém",
    secondaryHref: "/sluzby/",
    secondaryLabel: "Všetky služby",
  } satisfies PageCta,
} as const;
