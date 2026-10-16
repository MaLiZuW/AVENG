import type { FaqItem, PageCta } from "@/content/types";
import { company } from "@/config/company";

export const ABOUT_META = {
  title: "O nás | AVENG",
  description:
    "Vladimir, Fractional Engineering Manager s koučingom: technické vedenie a procesný audit pre výrobné MSP na Slovensku.",
} as const;

export const ABOUT = {
  eyebrow: "O nás",
  heading: "Fractional Engineering Manager s koučingom na dielni",
  lead: `${company.brandName} (${company.brandShort}) vedie ${company.founderName}, Fractional Engineering Manager s koučingom. Má 15+ rokov praxe v EMS inžinierstve a viedol tím až 35 inžinierov. Je BCTC certifikovaný business coach. Pracuje s majiteľmi výrobných MSP v regiónoch Trenčín, Žilina a Trnava.`,
  paragraphs: [
    "Majiteľ je často na všetko sám a denne hasí operatívu. Chýba systém, nie snaha. Potrebujete technickú disciplínu spojenú s prijatím zmien na dielni.",
    `Právnická osoba: ${company.legalName} (IČO ${company.ico}). Sídlo: ${company.addressDisplay}.`,
  ],
  bullets: [
    {
      title: "15+ rokov praxe",
      text: "EMS inžinierstvo a vedenie tímu až 35 inžinierov.",
    },
    {
      title: "BCTC certifikovaný business coach",
      text: "Spojenie technickej disciplíny s prácou s ľuďmi — procesy bez prijatia na dielni neprežijú.",
    },
    {
      title: "Lokálny partner",
      text: "Trenčín, Žilina, Trnava.",
    },
  ],
  model:
    "Fractional / projekt / koučing podľa dohody. Cena vychádza z hodinovej sadzby, prípadne z odmeny viazanej na vopred dohodnuté ciele. Presný rozsah a cena sú v ponuke.",
  faq: [
    {
      q: "Kto stojí za AVENG?",
      a: `${company.founderName} · ${company.brandName} · Powered by ${company.legalName} (IČO ${company.ico}).`,
    },
    {
      q: "Kde pôsobíte?",
      a: "V regiónoch Trenčín, Žilina a Trnava.",
    },
    {
      q: "Aké sektory?",
      a: "Najmä automotive, EMS, strojárstvo, plasty a kovovýroba (orientačne 20 – 250 zam.).",
    },
    {
      q: "Ako overíte fit?",
      a: "Self-audit alebo krátky rozhovor — bez sľubu garantovaných úspor.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/self-audit/",
    primaryLabel: "Spustiť bezplatný self-audit",
    secondaryHref: "/kontakt/?predmet=o-nas",
    secondaryLabel: "Napísať",
  } satisfies PageCta,
} as const;
