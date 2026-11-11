import { X } from "lucide-react";

const PAIN_POINTS = [
  {
    title: "Zmeny sa strácajú",
    text: "Technická zmena prejde e-mailom, v dielni sa pracuje podľa starého výkresu.",
  },
  {
    title: "Dokumenty čakajú na podpis",
    text: "Schvaľovanie trvá dni, lebo nikto nevie, kde práve je.",
  },
  {
    title: "Hasíte každý deň",
    text: "Na zlepšovanie nezostáva čas ani kapacita.",
  },
  {
    title: "Dobrý nápad bez dotiahnutia",
    text: "Projekt sa rozbehne, po dvoch mesiacoch ho zastaví bežná prevádzka.",
  },
];

const PROCESS_STEPS = [
  "Úvodný rozhovor — 30 minút, zdarma. Povieme si, či projekt dáva zmysel a či máte kapacitu ho uniesť.",
  "Projektový sprint — 2 až 3 týždne, pevná cena. Pomenujeme problém, navrhneme 2 až 3 varianty a odporučíme jeden.",
  "Vedenie projektu — Voliteľne. 1 až 2 krátke stretnutia týždenne, kontrola plnenia, riešenie prekážok. Prácu robí váš tím.",
];

const REQUIREMENTS = [
  {
    title: "Sponzora.",
    text: "Majiteľ alebo konateľ, ktorý rozhoduje a zabezpečí zdroje.",
  },
  {
    title: "Ľudí s vyhradeným časom.",
    text: "Vami určených kolegov, ktorí projekt reálne vykonajú.",
  },
  {
    title: "Prístup k údajom.",
    text: "Výkresy, zmenové listy, dokumentáciu, čísla z výroby.",
  },
];

const EXPERIENCE = [
  "Zavedenie procesu technických zmien (ECO) s podporným nástrojom v medzinárodnej EMS skupine.",
  "Vybudovanie interného nástrojového laboratória, ktoré znížilo náklady na výrobné pomôcky.",
  "Prebudovanie správy dokumentácie v EMS prostredí.",
  "Automatizácia administratívy: schvaľovacie toky a nahrávanie dokumentácie do ERP robotom.",
];

export function HomeBeforeProjects() {
  return (
    <>
      <section
        className="section-pad border-t border-white/5"
        aria-labelledby="home-pain-heading"
      >
        <div className="container-aveng">
          <h2 id="home-pain-heading" className="heading-display">
            Poznáte to?
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {PAIN_POINTS.map((item) => (
              <li
                key={item.title}
                className="rounded-lg border border-white/10 bg-ink-900/40 p-5"
              >
                <h3 className="font-display text-lg font-semibold text-ink-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-200">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
          <p className="prose-muted mt-8 max-w-3xl">
            Ak sa v jednom z nich spoznávate, je to projekt. Nie permanentný
            konzultant na faktúre.
          </p>

          <h2 className="mt-16 font-display text-2xl font-semibold text-ink-50">
            Ako to funguje
          </h2>
          <ol className="mt-6 grid gap-5 lg:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step}
                className="rounded-lg border border-white/10 bg-ink-900/40 p-5 text-sm leading-relaxed text-ink-200"
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

export function HomeAfterProjects() {
  return (
    <section className="section-pad border-t border-white/5">
      <div className="container-aveng space-y-14">
        <div className="steel-panel max-w-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-50">
            Čo od vás potrebujeme
          </h2>
          <p className="mt-3 text-sm text-ink-200">
            Projekt funguje, keď sú splnené tri veci. Bez nich ho radšej
            nezačneme.
          </p>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm text-ink-200">
            {REQUIREMENTS.map((item) => (
              <li key={item.title}>
                <strong className="text-ink-50">{item.title}</strong>{" "}
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="steel-panel max-w-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-50">
            Pre koho to nie je
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-ink-200">
            {[
              "Hľadáte niekoho, kto za vás povedie firmu alebo oddelenie.",
              "Nechcete uvoľniť ľudí na realizáciu.",
              "Čakáte garantovanú úsporu v eurách vopred.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-signal-bright" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-ink-200">
            Ak sa to týka vás, povieme si to na úvodnom rozhovore hneď.
            Ušetríte čas obom stranám.
          </p>
        </div>

        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink-50">
            Z praxe
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-200">
            Viac ako 15 rokov v elektronickej kontraktnej výrobe, vedenie tímu
            až 35 inžinierov. Vybrané skúsenosti:
          </p>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-ink-200">
            {EXPERIENCE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
