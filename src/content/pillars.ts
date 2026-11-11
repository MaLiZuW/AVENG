import type { FaqItem, PageCta } from "@/content/types";
import type { PillarSlug } from "@/config/pillars";

type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

type LinkParagraphBlock = {
  type: "link-paragraph";
  before: string;
  linkText: string;
  href: string;
  after: string;
};

type ListBlock = {
  type: "list" | "ordered";
  items: string[];
};

export type ProjectSection = {
  heading: string;
  blocks: (ParagraphBlock | LinkParagraphBlock | ListBlock)[];
};

export type PillarPageContent = {
  slug: PillarSlug;
  title: string;
  metaDescription: string;
  lead: string;
  sections: ProjectSection[];
  faq: FaqItem[];
  cta: PageCta;
};

const CONTACT_CTA = {
  primaryHref: "/kontakt/",
  primaryLabel: "Popíšte nám problém",
  secondaryHref: "/sluzby/",
  secondaryLabel: "Všetky služby",
} as const;

export const PILLAR_PAGES: Record<PillarSlug, PillarPageContent> = {
  "procesny-audit-identifikacia-problemu": {
    slug: "procesny-audit-identifikacia-problemu",
    title: "Procesný audit výroby: nájdeme problém, ktorý vás stojí najviac",
    metaDescription:
      "Procesný audit výroby formou 2–3-týždňového sprintu: jeden pomenovaný problém, varianty riešenia a projektový plán. Pevná cena.",
    lead:
      "Viete, že vo výrobe niečo drhne, ale nie ste si istý, čo je príčina a čo je len príznak. Za 2 až 3 týždne dostanete jeden pomenovaný problém a plán, ako ho vyriešiť.",
    sections: [
      {
        heading: "Čo dostanete",
        blocks: [
          {
            type: "list",
            items: [
              "Jeden pomenovaný problém s najväčším dopadom a jasne vymedzeným rozsahom.",
              "Odhad dopadu v rozsahu, nie vymyslené číslo.",
              "2 až 3 varianty riešenia s výhodami, rizikami a nárokmi na ľudí.",
              "Odporúčanie a projektový plán: cieľ, kroky, termíny, zodpovední.",
            ],
          },
          {
            type: "paragraph",
            text: "Projekt je prijatý, keď sponzor schváli vybraný variant a plán.",
          },
        ],
      },
      {
        heading: "Ako prebieha",
        blocks: [
          {
            type: "ordered",
            items: [
              "Úvodný rozhovor — 30 minút zdarma. Rozhodneme, či projekt začať.",
              "Projektový sprint — 2 až 3 týždne. Rozhovory s ľuďmi, obhliadka prevádzky, pohľad do dát.",
              "Prezentácia sponzorovi — Varianty, odporúčanie a plán. Rozhodnete vy.",
            ],
          },
        ],
      },
      {
        heading: "Čo potrebujeme od vás",
        blocks: [
          {
            type: "list",
            items: [
              "Sponzora, ktorý je k dispozícii na úvod a záver.",
              "2 až 3 kolegov na rozhovory a vysvetlenie súčasného stavu.",
              "Prístup k základným údajom o výrobe.",
            ],
          },
        ],
      },
      {
        heading: "Cena",
        blocks: [
          {
            type: "link-paragraph",
            before:
              "Pevná cena projektového sprintu podľa rozsahu v písomnej ponuke. Ak chcete lacnejší začiatok, vyskúšajte ",
            linkText: "self-audit",
            href: "/self-audit/",
            after: " (Level 1 zdarma, Level 2 za 290 €).",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Zrealizujete aj riešenie?",
        a: "Nie. Realizuje váš tím. My plán napíšeme, vedieme stretnutia a kontrolujeme postup, ak si vedenie projektu objednáte.",
      },
      {
        q: "Čo ak nemáme voľných ľudí?",
        a: "Projekt odložíme, kým sponzor ľudí nevyhradí.",
      },
      {
        q: "Ako sa líši od self-auditu?",
        a: "Self-audit je online dotazník, ktorý vám dá orientačný obraz. Projektový sprint je práca s vašimi ľuďmi a dátami na konkrétnom probléme.",
      },
    ],
    cta: {
      ...CONTACT_CTA,
      secondaryLabel: "Všetky služby",
    },
  },
  "projekt-zmeny-eco": {
    slug: "projekt-zmeny-eco",
    title: "Riadenie technických zmien (ECO) vo výrobe",
    metaDescription:
      "Zavedenie riadeného procesu technických zmien (ECO) vo výrobe: role, checklist a plán zavedenia. Realizuje váš tím, my vedieme projekt.",
    lead:
      "ECO (zmenové konanie) je formálna technická zmena: úprava výkresu, zloženia výrobku alebo postupu. Keď neprebieha riadene, výroba pracuje podľa starej verzie a zákazník to zistí ako prvý.",
    sections: [
      {
        heading: "Kedy projekt pomôže",
        blocks: [
          {
            type: "list",
            items: [
              "Nikto nevie, ktorá verzia dokumentu platí.",
              "Zmeny sa strácajú medzi konštrukciou, nákupom a výrobou.",
              "Schválenie zmeny trvá týždne a zmenia sa prioritou.",
            ],
          },
        ],
      },
      {
        heading: "Čo dostanete",
        blocks: [
          {
            type: "list",
            items: [
              "Popis cieľového procesu zmien od podnetu po zavedenie vo výrobe.",
              "Role a zodpovednosti: kto zmenu podáva, posudzuje, schvaľuje, zavádza.",
              "Checklist a vzor zmenového listu podľa vašich potrieb.",
              "Plán zavedenia s termínmi a zodpovednými osobami.",
            ],
          },
          {
            type: "paragraph",
            text: "Kritérium prijatia dohodneme písomne pred začiatkom. Napríklad: proces je odsúhlasený sponzorom a prvé tri zmeny prešli podľa neho.",
          },
        ],
      },
      {
        heading: "Ako prebieha",
        blocks: [
          {
            type: "ordered",
            items: [
              "Vymedzenie — Jeden problém, rozsah, kritérium prijatia.",
              "Návrh — Navrhneme proces a varianty spolu s ľuďmi, ktorých sa týka.",
              "Plán a vedenie — Plán zavedenia a stretnutia 1 až 2× týždenne. Zavádza váš tím.",
            ],
          },
        ],
      },
      {
        heading: "Cena",
        blocks: [
          {
            type: "paragraph",
            text: "Podľa rozsahu v písomnej ponuke.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Potrebujeme na to špeciálny softvér?",
        a: "Nie. Najprv navrhneme proces. Nástroj sa vyberá až potom a môže to byť aj to, čo už máte.",
      },
      {
        q: "Kto proces zavedie?",
        a: "Váš tím. My navrhneme, vedieme stretnutia a kontrolujeme plán.",
      },
    ],
    cta: CONTACT_CTA,
  },
  "sprava-dokumentacie-a-schvalovanie": {
    slug: "sprava-dokumentacie-a-schvalovanie",
    title: "Výrobná dokumentácia a schvaľovanie bez čakania",
    metaDescription:
      "Kratšie schvaľovanie a poriadok vo výrobnej dokumentácii. Navrhneme cieľový tok a plán automatizácie. Bez nákupu softvéru.",
    lead:
      "Výkresy, postupy a protokoly cestujú medzi ľuďmi e-mailom a na papieri. Podpis čaká na dovolenke a výroba stojí. Navrhneme jednoduchší tok a plán, ako ho zautomatizovať.",
    sections: [
      {
        heading: "Čo dostanete",
        blocks: [
          {
            type: "list",
            items: [
              "Mapu súčasného toku dokumentov a miest, kde sa zdržiava.",
              "Návrh cieľového toku a schvaľovacích krokov.",
              "Plán automatizácie: čo sa dá robiť robotom, čo prepojením systémov, čo zostane ručne.",
              "Plán s termínmi a zodpovednými.",
            ],
          },
        ],
      },
      {
        heading: "Z praxe",
        blocks: [
          {
            type: "paragraph",
            text: "Podobný problém sme riešili v EMS prostredí: schvaľovacie toky a automatické nahrávanie dokumentácie do ERP robotom.",
          },
        ],
      },
      {
        heading: "Hranice projektu",
        blocks: [
          {
            type: "list",
            items: [
              "Nedodávame ani nekonfigurujeme PLM/PDM softvér. Riešime proces a plán.",
              "Implementáciu robí váš tím alebo dodávateľ, na základe samostatnej dohody.",
            ],
          },
        ],
      },
      {
        heading: "Cena",
        blocks: [
          {
            type: "paragraph",
            text: "Podľa rozsahu v písomnej ponuke.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Musíme mať už vybraný systém?",
        a: "Nie. Projekt začína procesom a požiadavkami. Nástroj vyberiete na ich základe.",
      },
      {
        q: "Dodáte aj softvér?",
        a: "Nie. Navrhneme riešenie a plán. Softvér dodá váš dodávateľ alebo interný tím.",
      },
    ],
    cta: CONTACT_CTA,
  },
  "rozvoj-liderov-koucing": {
    slug: "rozvoj-liderov-koucing",
    title: "Koučing majstrov a vedúcich výroby",
    metaDescription:
      "Koučing majstrov a vedúcich tímov vo výrobe, aby zlepšenia vydržali. 5–6 sedení, individuálne alebo skupinovo.",
    lead:
      "Zlepšenie zavedie konzultant a po troch mesiacoch všetko vyprchá. Aby sa držalo, potrebujú ho niesť majstri a vedúci tímov.",
    sections: [
      {
        heading: "Kedy to dáva zmysel",
        blocks: [
          {
            type: "list",
            items: [
              "Po zavedení zmeny sa pracuje postaru.",
              "Majstri riešia hasenie namiesto riadenia tímu.",
              "Medzi vedením a dielňou sa stráca informácia.",
            ],
          },
        ],
      },
      {
        heading: "Ako prebieha",
        blocks: [
          {
            type: "ordered",
            items: [
              "Cieľ so sponzorom — Dohodneme, čo sa má u vedúcich zmeniť a podľa čoho to poznáte.",
              "Koučovacie sedenia — 5 až 6 sedení, individuálne alebo skupinovo, 1 až 2× mesačne. Rozsah podľa dohody.",
              "Vyhodnotenie — Spoločné zhodnotenie so sponzorom, čo sa zmenilo.",
            ],
          },
        ],
      },
      {
        heading: "Koučing",
        blocks: [
          {
            type: "paragraph",
            text: "Vedie certifikovaný business kouč (BCTC). Je to obchodný koučing zameraný na riadenie tímu, nie psychoterapia.",
          },
        ],
      },
      {
        heading: "Cena",
        blocks: [
          {
            type: "paragraph",
            text: "Podľa rozsahu v písomnej ponuke.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Pre koho sú sedenia?",
        a: "Najmä pre majstrov a vedúcich tímov. Pre stredný manažment podľa dohody.",
      },
      {
        q: "Je to psychoterapia?",
        a: "Nie. Pracujeme s riadením tímu a pracovnými návykmi.",
      },
    ],
    cta: CONTACT_CTA,
  },
};

export function getPillarPage(slug: string): PillarPageContent | undefined {
  return PILLAR_PAGES[slug as PillarSlug];
}
