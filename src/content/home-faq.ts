import type { FaqItem } from "@/content/types";
import { company } from "@/config/company";
import { retentionFaqClaimSk } from "@/config/retention";

const CONSULTATION_ANSWER_SK =
  "Napíšte cez kontaktný formulár alebo na vladimir@addvalueengineering.sk. Ozveme sa s návrhom termínu.";

/**
 * Homepage FAQ — visible markup must match FAQPage JSON-LD.
 * Booking URL is not set; answer stays form/e-mail only (GLOBAL_CHANGES).
 */
export const HOME_FAQ: FaqItem[] = [
  {
    q: "Čo je fractional engineering manager?",
    a: "Fractional engineering manager (alebo Fractional Technical Leadership) je seniorné technické vedenie na čiastkový úväzok. Pomáha nastaviť procesy, priority a lídrov bez nutnosti plného úväzku manažéra vo firme.",
  },
  {
    q: "Kedy sa fractional technické vedenie oplatí?",
    a: "Keď firma rastie, chýba systém v technike alebo majiteľ denne hasí operatívu — a full-time Head of Engineering zatiaľ nie je úmerný veľkosti tímu. Čiastkové vedenie dáva zmysel aj pri dočasnej stabilizácii priorít a NPI/ECO.",
  },
  {
    q: "Pre koho je AddValueEngineering určené?",
    a: "Pre majiteľov, CEO, COO a technických riaditeľov výrobných MSP (orientačne 20 – 250 zamestnancov) v regiónoch Trenčín, Žilina a Trnava — najmä automotive, EMS, strojárstvo, plasty a kovovýroba.",
  },
  {
    q: "Čo obsahuje Level 1 self-audit?",
    a: "Orientačný skríning 20 otázok naprieč piatimi procesnými doménami. Hodnotenie procesov je inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE). Výstupom je indikatívny potenciál úspor a tri prioritné odporúčania — nie záruka výsledku.",
  },
  {
    q: "Čo obsahuje Level 2 a Level 3?",
    a: "Level 2 je rozpis po otázkach a prioritizácia podľa finančného dopadu. Je to podklad na poradu majiteľov. Level 3 ide do príčinovej analýzy a simulačného režimu investícií. Prístupový kód vám zašleme e-mailom spolu s údajmi na úhradu (prevodom na základe faktúry).",
  },
  {
    q: "Ako spracúvate osobné údaje z auditu a kontaktov?",
    a: `Údaje používame na vyhodnotenie auditu a vybavenie dopytu. Údaje spracúvajú naši poskytovatelia hostingu, databázy a e-mailového doručenia. Detail nájdete v Zásadách ochrany osobných údajov. Kontakt: ${company.email}.`,
  },
  {
    q: "Ako dlho uchovávate údaje z auditu?",
    a: `${retentionFaqClaimSk()} Detail nájdete v Zásadách ochrany osobných údajov.`,
  },
  {
    q: "Sú výsledky auditu zárukou úspor?",
    a: "Nie. Level 1 je rýchla orientačná diagnostika založená na vašich odpovediach. Pre overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe.",
  },
  {
    q: "Odkiaľ pochádzajú referenčné hodnoty?",
    a: "Ide o interné referencie AVENG založené na expertnom odhade a indikatívnych medzinárodných podkladoch — nie oficiálnu štatistiku ani priemer slovenských MSP.",
  },
  {
    q: "Ako sa objedná konzultácia alebo cenová ponuka?",
    a: CONSULTATION_ANSWER_SK,
  },
];
