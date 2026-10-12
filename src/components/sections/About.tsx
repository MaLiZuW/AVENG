import { company } from "@/config/company";

const BULLETS = [
  {
    title: "15+ rokov praxe",
    text: "EMS priemysel — NPI/ECO, PLM/PDM, vedenie inžinierskych tímov (až 35 inžinierov).",
  },
  {
    title: "BCTC certifikácia",
    text: "Business Coaching — prekonanie odporu voči zmenám na dielni a v tímoch.",
  },
  {
    title: "Lokálny partner",
    text: "Implementácia priamo na shopfloor — Trenčín, Žilina, Trnava a Morava.",
  },
];

export default function About() {
  return (
    <section id="o-nas" className="section-pad border-t border-white/5 bg-ink-900/40" aria-labelledby="about-heading">
      <div className="container-aveng">
        <p className="eyebrow mb-4">O nás</p>
        <h2 id="about-heading" className="heading-display max-w-2xl">
          Fractional Engineering Manager s koučingom na dielni
        </h2>
        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5 prose-muted">
            <p>
              Po viac ako 15 rokoch v EMS priemyselnom inžinierstve — od NPI
              nábehov a ECO zmenového konania až po PLM/PDM — poznám realitu
              výrobných firiem zvnútra.
            </p>
            <p>
              <strong className="font-semibold text-ink-50">
                Problém MSP:
              </strong>{" "}
              majiteľ je na všetko sám a denne hasí požiare v operatíve.
              Chýba systém, nie snaha.
            </p>
            <p>
              <strong className="font-semibold text-ink-50">Riešenie:</strong>{" "}
              Fractional Engineering Manager + BCTC certifikovaný business
              coaching. Spojenie technickej disciplíny s prácou s ľuďmi —
              pretože procesy bez prijatia na dielni neprežijú.
            </p>
            <p className="text-sm text-ink-300">
              {company.founderName} · {company.brandName} · Powered by{" "}
              {company.legalName}
            </p>
          </div>
          <ul className="space-y-6">
            {BULLETS.map((b, i) => (
              <li
                key={b.title}
                className="animate-fade-up border-l-2 border-signal pl-5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <h3 className="font-display text-xl font-semibold text-ink-50">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-200">
                  {b.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
