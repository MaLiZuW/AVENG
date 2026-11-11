import type { FaqItem } from "@/content/types";

export const ABOUT_META = {
  title: "O nás | AddValueEngineering",
  description:
    "Vladimir, inžinier s viac ako 15 rokmi v elektronickej kontraktnej výrobe. Pomáha výrobným firmám riešiť jeden problém projektovo.",
} as const;

export const ABOUT = {
  eyebrow: "O nás",
  heading: "Vladimir. Inžinier z výroby, ktorý rieši problémy projektovo.",
  lead:
    "Viac ako 15 rokov v elektronickej kontraktnej výrobe. Viedol som tím až 35 inžinierov. Viem, ako vyzerá firma, kde všetci hasia a nikto nemá čas na zlepšovanie.",
  workHeading: "Ako pracujem",
  work: [
    "Nájdem jeden problém a pomenujem ho tak, aby ho pochopil aj majiteľ.",
    "Navrhnem možné riešenia a postup. Vyberáte vy.",
    "Zostavím plán a vediem projektové stretnutia.",
    "Realizujú vaši ľudia. Ja nie som náhradný manažér vo vašej firme.",
  ],
  experienceHeading: "Skúsenosti",
  experiences: [
    "Zavedenie procesu technických zmien (ECO) s podporným nástrojom v medzinárodnej EMS skupine.",
    "Interné nástrojové laboratórium v EMS.",
    "Správa dokumentácie v EMS prostredí.",
    "Automatizácia administratívy: schvaľovacie toky a nahrávanie dokumentácie do ERP robotom.",
    "Certifikovaný business kouč (BCTC).",
  ],
  audienceHeading: "Pre koho",
  audience:
    "Výrobné firmy s 20 až 250 zamestnancami v automotive, EMS, strojárstve, plastoch a kovovýrobe, najmä v regiónoch Trenčín, Žilina a Trnava.",
  faq: [
    {
      q: "Kto za AddValueEngineering stojí?",
      a: "Vladimir, inžinier s dlhoročnou praxou vo výrobe. Spoločnosť je AV – Agency, s. r. o.",
    },
    {
      q: "Ako zistíme, či si sadneme?",
      a: "Úvodný rozhovor je zadarmo a bez záväzku. Povieme si otvorene, či vám viem pomôcť. Úspory nesľubujem.",
    },
  ] satisfies FaqItem[],
} as const;
