import type { FaqItem } from "@/content/types";
import { company } from "@/config/company";
import { retentionFaqClaimSk } from "@/config/retention";

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Ako prebieha projekt?",
    a: "Najprv úvodným rozhovorom overíme, či má zmysel začať. Projektový sprint pomenuje problém, navrhne riešenia a pripraví plán; realizuje váš tím.",
  },
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
    q: "Ako často sa stretávame?",
    a: "Počas projektu sa stretávame raz až dvakrát týždenne.",
  },
  {
    q: "Čo obsahuje Level 1 self-audit?",
    a: "Orientačný skríning procesov založený na vašich odpovediach. Výstup nie je zárukou úspor.",
  },
  {
    q: "Ako spracúvate osobné údaje z auditu a kontaktov?",
    a: `Údaje používame na vyhodnotenie auditu, vybavenie dopytu a súvisiacu komunikáciu. Údaje spracúvajú naši poskytovatelia hostingu, databázy a e-mailového doručenia. Podrobnosti nájdete v Zásadách ochrany osobných údajov. Kontakt: ${company.email}.`,
  },
  {
    q: "Ako dlho uchovávate údaje z auditu?",
    a: `${retentionFaqClaimSk()} Podrobnosti nájdete v Zásadách ochrany osobných údajov.`,
  },
  {
    q: "Ako objednať úvodný rozhovor?",
    a: "Popíšte problém cez kontaktný formulár. Ozveme sa s návrhom ďalšieho kroku; bez povinnosti.",
  },
];
