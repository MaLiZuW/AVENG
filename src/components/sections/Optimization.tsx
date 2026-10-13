const FEATURES = [
  {
    title: "Mapovanie a analýza plytvania",
    text: "Upratanie toku hodnôt — identifikácia Muda, bottleneckov a skrytých zásob vo výrobnom reťazci.",
  },
  {
    title: "Digitálna transformácia",
    text: "OEE meranie, prepojenie s ERP a shopfloor dátami. Digitálna zrelosť, ktorá prináša rozhodnutia — nie ďalšie tabuľky.",
  },
  {
    title: "Využitie AI v sektore MSP",
    text: "Automatizácia administratívy, asistenti pre dokumentáciu a zníženie nákladov bez big-tech komplexity.",
  },
];

export default function Optimization() {
  return (
    <section
      id="optimalizacia"
      className="section-pad border-t border-white/5 bg-ink-900/40"
      aria-labelledby="opt-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">Optimalizácia & AI</p>
        <h1 id="opt-heading" className="heading-display max-w-2xl">
          Procesy, IS a AI — prakticky pre výrobné MSP
        </h1>
        <p className="prose-muted mt-4 max-w-2xl">
          Žiadna teória z prezentácií. Konkrétne zásahy, ktoré znižujú chaos a
          zvyšujú predvídateľnosť.
        </p>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="animate-fade-up border-t border-signal/40 pt-5"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <h3 className="font-display text-lg font-semibold text-ink-50">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-200">
                {f.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
