/**
 * Visible FAQ — must match JSON-LD FAQPage content.
 * TODO(owner): schváliť finálne znenie otázok a odpovedí.
 */

import { company } from "@/config/company";
import { retentionPeriodClaimSk } from "@/config/retention";
import { LEVEL2_PRICE_EUR } from "@/lib/audit/questions";

const FAQ = [
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
    a: "Pre majiteľov, CEO, COO a technických riaditeľov výrobných MSP (orientačne 20–250 zamestnancov) na Slovensku a Morave — najmä automotive, EMS, strojárstvo, plasty a kovovýroba.",
  },
  {
    q: "Čo obsahuje Level 1 self-audit?",
    a: "Orientačný skríning 20 otázok naprieč piatimi procesnými doménami. Hodnotenie procesov je inšpirované princípmi procesného auditu (napr. VDA 6.3, Lean, TPM/OEE). Výstupom je indikatívny potenciál úspor a tri prioritné odporúčania — nie záruka výsledku.",
  },
  {
    q: "Čo obsahuje Level 2 a Level 3?",
    a: `Level 2 rozkladá kľúčové metriky do väčšieho detailu (60 otázok); prístup stojí ${LEVEL2_PRICE_EUR} €. Level 3 ide do príčinovej analýzy a simulačného režimu investícií. Prístup k L2/L3 je po úhrade alebo dohode.`,
  },
  {
    q: "Ako spracúvate osobné údaje z auditu a kontaktov?",
    a: `Údaje používame na vyhodnotenie auditu a vybavenie dopytu. Spracúvajú ich služby, ktoré web skutočne používa (hosting, databáza, e-mailové doručenie). Detail nájdete v Zásadách ochrany osobných údajov. Kontakt: ${company.email}.`,
  },
  {
    q: "Ako dlho uchovávate údaje z auditu?",
    a: `${retentionPeriodClaimSk()} Detail nájdete v Zásadách ochrany osobných údajov.`,
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
    a: `Cez kontaktný formulár, e-mail ${company.email} alebo tlačidlo rezervácie, ak je na webe nastavené.`,
  },
] as const;

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="section-pad border-t border-white/5"
      aria-labelledby="faq-heading"
    >
      <div className="container-aveng max-w-3xl">
        <p className="eyebrow mb-4">FAQ</p>
        <h2 id="faq-heading" className="heading-display">
          Časté otázky
        </h2>
        <ul className="mt-10 space-y-4">
          {FAQ.map((item) => (
            <li key={item.q}>
              <details className="group rounded-md border border-white/10 bg-ink-900/40 px-4 py-3">
                <summary className="cursor-pointer list-none font-semibold text-ink-50 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span
                      className="text-signal-bright transition group-open:rotate-90"
                      aria-hidden
                    >
                      ▸
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-200">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { FAQ };
