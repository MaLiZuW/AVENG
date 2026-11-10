import type { FaqItem, PageCta } from "@/content/types";

export const OPTIMIZATION_META = {
  title: "Optimalizácia a AI",
  description:
    "Projektový návrh zlepšenia procesov s využitím AI pre výrobné MSP. Riešenia navrhujeme; implementáciu vykoná váš tím alebo dodávateľ po samostatnej dohode.",
} as const;

export const OPTIMIZATION = {
  eyebrow: "Projektové služby",
  heading: "Návrh zlepšenia s využitím AI",
  lead:
    "Projekt sa zameria na jeden definovaný problém vo výrobe alebo administratíve. Navrhneme možné riešenia a projektový plán; implementáciu po samostatnej dohode vykoná váš tím alebo dodávateľ.",
  whenHeading: "Kedy projekt pomôže",
  when: [
    "Máte konkrétny problém v procese alebo informačnom toku.",
    "Chcete posúdiť, či môže AI pomôcť s daným problémom.",
    "Potrebujete plán riešenia, nie dodávku softvéru.",
  ],
  features: [
    {
      title: "Jeden definovaný problém",
      text: "Rozsah a cieľ projektu sa dohodnú so sponzorom pred začiatkom.",
    },
    {
      title: "Varianty riešenia",
      text: "Posúdime možnosti zlepšenia procesu vrátane využitia AI, ak je to vhodné.",
    },
    {
      title: "Projektový plán",
      text: "Výstup určí kroky, zodpovednosti a kritérium prijatia.",
    },
  ],
  boundary:
    "Navrhujeme riešenia. Nedodávame softvér; implementácia sa dohodne samostatne a realizuje ju váš tím alebo dodávateľ.",
  processHeading: "Ako projekt prebieha",
  processSteps: [
    "Úvodným rozhovorom overíme, či má zmysel začať.",
    "Projektový sprint vymedzí problém, varianty riešenia a plán.",
    "Váš tím alebo dodávateľ realizuje schválené riešenie po samostatnej dohode.",
  ],
  exampleHeading: "Skúsenosť z praxe",
  example:
    "Automatizácia administratívy vrátane schvaľovacích tokov a nahrávania dokumentácie do ERP robotom.",
  relatedPillars: [
    {
      title: "Procesný audit a identifikácia problému",
      href: "/sluzby/procesny-audit-identifikacia-problemu/",
    },
    {
      title: "Projekt správy dokumentácie a schvaľovania",
      href: "/sluzby/sprava-dokumentacie-a-schvalovanie/",
    },
  ],
  faq: [
    {
      q: "Dodávate AI softvér?",
      a: "Nie. Navrhujeme riešenie a projektový plán; implementáciu po samostatnej dohode vykoná váš tím alebo dodávateľ.",
    },
    {
      q: "Musí projekt použiť AI?",
      a: "Nie. AI posudzujeme ako jednu z možností riešenia konkrétneho problému.",
    },
    {
      q: "Koľko stojí projekt optimalizácie a AI?",
      a: "Cena je cenová ponuka podľa rozsahu.",
    },
    {
      q: "Kto realizuje schválené riešenie?",
      a: "Váš tím alebo dodávateľ po samostatnej dohode.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/kontakt/?predmet=optimalizacia-a-ai",
    primaryLabel: "Popíšte problém",
    secondaryHref: "/sluzby/",
    secondaryLabel: "Všetky služby",
  } satisfies PageCta,
} as const;
