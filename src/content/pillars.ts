import type { FaqItem, PageCta } from "@/content/types";
import type { PillarSlug } from "@/config/pillars";

export type PillarPageContent = {
  slug: PillarSlug;
  metaDescription: string;
  lead: string;
  whenHeading: string;
  when: string[];
  processHeading: string;
  processSteps: string[];
  deliverHeading?: string;
  deliver?: string[];
  modelHeading: string;
  model: string[];
  related: PillarSlug[];
  faq: FaqItem[];
  cta: PageCta;
};

const CONTACT_CTA = {
  primaryHref: "/kontakt/?predmet=sluzby",
  primaryLabel: "Popíšte problém",
  secondaryHref: "/self-audit/",
  secondaryLabel: "Spustiť self-audit",
} as const;

export const PILLAR_PAGES: Record<PillarSlug, PillarPageContent> = {
  "procesny-audit-identifikacia-problemu": {
    slug: "procesny-audit-identifikacia-problemu",
    metaDescription:
      "Projektový sprint pre výrobné MSP: identifikácia problému, varianty riešenia a projektový plán.",
    lead:
      "Projektový sprint pomenuje problém, ktorý vás stojí najviac, navrhne varianty riešenia a pripraví projektový plán. Realizáciu vykoná váš tím; sponzor zabezpečí zdroje a súčinnosť.",
    whenHeading: "Čo projekt vyrieši",
    when: [
      "Vyberie jeden problém s najvyššou prioritou.",
      "Pomenuje rozsah problému a odhadne jeho dopad v rozsahu.",
      "Pripraví varianty riešenia a odporúčanie pre sponzora.",
    ],
    deliverHeading: "Výstup a kritérium prijatia",
    deliver: [
      "Pomenovaný problém, odhad dopadu v rozsahu, dva až tri varianty riešenia a odporúčanie.",
      "Projektový plán s cieľom, rozsahom a kritériom prijatia.",
      "Projekt je prijatý, keď sponzor schváli výber riešenia.",
    ],
    processHeading: "Ako projekt prebieha",
    processSteps: [
      "Úvodný rozhovor na overenie, či má zmysel začať.",
      "Projektový sprint v trvaní dva až tri týždne.",
      "Predstavenie variantov a odporúčania sponzorovi.",
      "Voliteľné vedenie projektu formou pravidelných stretnutí.",
    ],
    modelHeading: "Cena a potrebné podmienky",
    model: [
      "Cena projektového sprintu je cenová ponuka podľa rozsahu.",
      "Samoobslužný audit je alternatívny vstup: Level 1 je zdarma a Level 2 stojí 290 €.",
      "Projekt sa začína po určení sponzora, vyhradení času pridelených ľudí a sprístupnení potrebných dát.",
    ],
    related: [
      "projekt-zmeny-eco",
      "sprava-dokumentacie-a-schvalovanie",
      "rozvoj-liderov-koucing",
    ],
    faq: [
      {
        q: "Robíte aj realizáciu?",
        a: "Nie. Realizuje ju váš tím; my pripravíme plán, vedieme projektové stretnutia a kontrolujeme postup.",
      },
      {
        q: "Čo ak firma nemá voľných ľudí?",
        a: "Projekt odložíme. Bez vyhradeného času ľudí určených sponzorom nemá zmysel začínať.",
      },
      {
        q: "Koľko stojí projektový sprint?",
        a: "Cena je cenová ponuka podľa rozsahu. Level 2 samoobslužného auditu stojí 290 €.",
      },
    ],
    cta: CONTACT_CTA,
  },
  "projekt-zmeny-eco": {
    slug: "projekt-zmeny-eco",
    metaDescription:
      "Projekt zavedenia riadeného procesu zmien ECO s rolami, checklistom a plánom zavedenia.",
    lead:
      "Projekt zmeny a ECO pripraví riadený postup pre technické zmeny. Výstupom je popis cieľového procesu, roly, checklist a plán zavedenia; realizáciu vykoná váš tím.",
    whenHeading: "Kedy projekt pomôže",
    when: [
      "Zmeny sa strácajú medzi tímami alebo sa do výroby dostanú neskoro.",
      "Nie je jasné, kto zmenu posudzuje, schvaľuje a oznamuje.",
      "Potrebujete dohodnúť zodpovednosti a postup pre technické zmeny.",
    ],
    deliverHeading: "Výstup a kritérium prijatia",
    deliver: [
      "Popis cieľového procesu zmien a dohodnuté role.",
      "Checklist a plán zavedenia s termínmi a zodpovednými.",
      "Kritérium prijatia sa písomne dohodne so sponzorom pred začiatkom.",
    ],
    processHeading: "Ako projekt prebieha",
    processSteps: [
      "Vymedzenie jedného problému, rozsahu a kritéria prijatia.",
      "Návrh procesu a variantov riešenia so zapojenými ľuďmi.",
      "Zostavenie plánu zavedenia a pravidelných projektových stretnutí.",
    ],
    modelHeading: "Cena a realizácia",
    model: [
      "Cena je cenová ponuka podľa rozsahu.",
      "Realizáciu vykoná váš tím. Sponzor zabezpečí zdroje a súčinnosť; bez vyhradených ľudí sa projekt nezačína.",
    ],
    related: [
      "procesny-audit-identifikacia-problemu",
      "sprava-dokumentacie-a-schvalovanie",
      "rozvoj-liderov-koucing",
    ],
    faq: [
      {
        q: "Čo bude výstupom projektu ECO?",
        a: "Popis cieľového procesu zmien, určené role, checklist a plán zavedenia s termínmi a zodpovednými.",
      },
      {
        q: "Kto zavádza nový proces?",
        a: "Váš tím. My navrhneme postup, vedieme projektové stretnutia a kontrolujeme plnenie plánu.",
      },
    ],
    cta: CONTACT_CTA,
  },
  "sprava-dokumentacie-a-schvalovanie": {
    slug: "sprava-dokumentacie-a-schvalovanie",
    metaDescription:
      "Projekt správy výrobnej dokumentácie a schvaľovania vrátane návrhu plánu automatizácie.",
    lead:
      "Projekt zjednodušenia dokumentácie a schvaľovania navrhne cieľový proces a plán automatizácie. Zameriava sa na schvaľovacie slučky a nahrávanie dokumentácie do ERP; implementáciu vykoná váš tím alebo dodávateľ po samostatnej dohode.",
    whenHeading: "Kedy projekt pomôže",
    when: [
      "Dokumenty sa schvaľujú v neprehľadných alebo opakovaných slučkách.",
      "Nahrávanie dokumentácie do ERP je manuálne alebo nejednotné.",
      "Potrebujete upratať proces pred výberom alebo implementáciou nástroja.",
    ],
    deliverHeading: "Výstup a hranice projektu",
    deliver: [
      "Návrh cieľového procesu a plánu automatizácie.",
      "Procesné riešenie bez preferencie konkrétnej PLM/PDM platformy.",
      "Implementácia až po samostatnej dohode; vykonáva ju váš tím alebo dodávateľ.",
    ],
    processHeading: "Ako projekt prebieha",
    processSteps: [
      "Vymedzenie problému a súčasného toku dokumentácie a schvaľovania.",
      "Návrh variantov cieľového procesu a automatizácie.",
      "Dohoda plánu, zodpovedností a kritéria prijatia so sponzorom.",
    ],
    modelHeading: "Cena a realizácia",
    model: [
      "Cena je cenová ponuka podľa rozsahu.",
      "Váš tím alebo dodávateľ zabezpečí implementáciu po samostatnej dohode. My navrhujeme riešenie a vedieme projekt.",
    ],
    related: [
      "procesny-audit-identifikacia-problemu",
      "projekt-zmeny-eco",
      "rozvoj-liderov-koucing",
    ],
    faq: [
      {
        q: "Dodávate alebo implementujete PLM/PDM softvér?",
        a: "Nie. Riešime procesy a plán automatizácie, nie konkrétnu PLM/PDM platformu. Implementáciu po samostatnej dohode vykoná váš tím alebo dodávateľ.",
      },
      {
        q: "Čo ak zatiaľ nemáme vybraný nástroj?",
        a: "Projekt sa zameria na cieľový proces a požiadavky. Konkrétny nástroj nie je podmienkou návrhu procesu.",
      },
    ],
    cta: CONTACT_CTA,
  },
  "rozvoj-liderov-koucing": {
    slug: "rozvoj-liderov-koucing",
    metaDescription:
      "Projektový rozvojový program pre vedúcich s cieľom a meraním dohodnutým so sponzorom.",
    lead:
      "Rozvojový program pre vedúcich môže prebiehať individuálne alebo skupinovo. Cieľ a spôsob merania sa dohodnú so sponzorom pred začiatkom; program zahŕňa päť až šesť sedení, spravidla raz až dvakrát mesačne.",
    whenHeading: "Kedy projekt pomôže",
    when: [
      "Vedúci potrebujú podporu pri zavádzaní dohodnutých zmien.",
      "Sponzor chce vopred určiť cieľ rozvoja a spôsob jeho vyhodnotenia.",
      "Rozvoj má prebiehať individuálne alebo v skupine.",
    ],
    deliverHeading: "Výstup a kritérium prijatia",
    deliver: [
      "Dohodnutý cieľ rozvoja a spôsob merania pred začiatkom.",
      "Program sedení podľa rozsahu dohodnutého so sponzorom.",
      "Kritérium prijatia sa určí v projektovom pláne.",
    ],
    processHeading: "Ako projekt prebieha",
    processSteps: [
      "Dohoda cieľa, rozsahu a merania so sponzorom.",
      "Individuálne alebo skupinové sedenia, spravidla raz až dvakrát mesačne.",
      "Vyhodnotenie podľa vopred dohodnutého kritéria.",
    ],
    modelHeading: "Cena a potrebné podmienky",
    model: [
      "Cena je cenová ponuka podľa rozsahu.",
      "Rozsah programu a účasť vedúcich sa dohodnú so sponzorom pred začiatkom.",
    ],
    related: [
      "procesny-audit-identifikacia-problemu",
      "projekt-zmeny-eco",
      "sprava-dokumentacie-a-schvalovanie",
    ],
    faq: [
      {
        q: "Ako sa určí cieľ programu?",
        a: "Cieľ a spôsob merania sa dohodnú so sponzorom pred začiatkom projektu.",
      },
      {
        q: "Je program individuálny alebo skupinový?",
        a: "Možný je individuálny aj skupinový formát; konkrétny rozsah sa dohodne so sponzorom.",
      },
    ],
    cta: CONTACT_CTA,
  },
};

export function getPillarPage(slug: string): PillarPageContent | undefined {
  return PILLAR_PAGES[slug as PillarSlug];
}
