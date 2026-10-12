/**
 * Visible FAQ — must match JSON-LD FAQPage content.
 * TODO(owner): schváliť finálne znenie otázok a odpovedí.
 */

import { company } from "@/config/company";

const FAQ = [
  {
    q: "Čo je Fractional Technical Leadership?",
    a: "Externé seniorné technické vedenie na čiastkový úväzok — nastavenie procesov, priorít a lídrov bez nutnosti full-time manažéra.",
  },
  {
    q: "Pre koho je AddValueEngineering určené?",
    a: "Pre majiteľov, CEO, COO a technických riaditeľov výrobných MSP (približne 20–250 zamestnancov) na Slovensku a Morave.",
  },
  {
    q: "Čo obsahuje Level 1 self-audit?",
    a: "Orientačný skríning 20 otázok naprieč piatimi procesnými doménami. Výstupom je indikatívny potenciál úspor a tri prioritné odporúčania — nie záruka výsledku.",
  },
  {
    q: "Čo pridáva Level 2 a Level 3?",
    a: "Level 2 rozkladá kľúčové metriky do väčšieho detailu (60 otázok). Level 3 ide do príčinovej analýzy a simulačného režimu investícií. Prístup je po úhrade alebo dohode.",
  },
  {
    q: "Ako dlho uchovávate údaje z auditu?",
    a: "Údaje uchovávame len po dobu nevyhnutnú na vyhodnotenie auditu a spracovanie dopytu. Detail nájdete v Zásadách ochrany osobných údajov.",
  },
  {
    q: "Sú výsledky auditu zárukou úspor?",
    a: "Nie. Level 1 je rýchla orientačná diagnostika založená na vašich odpovediach. Pre overenie dát odporúčame Level 2/3 alebo obchôdzku vo výrobe.",
  },
  {
    q: "Odkiaľ pochádzajú referenčné hodnoty MSP?",
    a: "Ide o interné referencie AVENG založené na expertnom odhade, nie oficiálnu štatistiku.",
  },
  {
    q: "Ako sa objedná konzultácia alebo cenová ponuka?",
    a: `Cez kontaktný formulár, e-mail ${company.email} alebo tlačidlo rezervácie, ak je nastavené.`,
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
