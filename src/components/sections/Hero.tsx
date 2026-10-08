export default function Hero() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

  return (
    <section
      id="domov"
      className="relative overflow-hidden bg-hero-glow"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-grid-steel bg-[size:48px_48px] opacity-40"
        aria-hidden
      />
      <div className="container-aveng relative section-pad !pt-16 lg:!pt-24">
        <div className="max-w-3xl animate-fade-up">
          <p className="eyebrow mb-6">Pre MSP · Seniorné technické vedenie</p>
          <h1
            id="hero-heading"
            className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-ink-50 sm:text-5xl lg:text-6xl"
          >
            Zmeňte technický chaos na{" "}
            <span className="text-signal-bright">ziskový a predvídateľný</span>{" "}
            systém
          </h1>
          <p className="prose-muted mt-6 max-w-2xl">
            Pomáhame malým a stredným podnikom rásť cez systémové procesy,
            digitálnu transformáciu a rozvoj technických lídrov. Inžinierska
            presnosť spojená s psychológiou biznisu.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/self-audit/" className="btn-primary">
              Spustiť bezplatný self-audit
            </a>
            {bookingUrl ? (
              <a
                href={bookingUrl}
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dohodnúť 30-min konzultáciu
              </a>
            ) : (
              <a href="/sluzby/" className="btn-secondary">
                Preskúmať 4 piliere
              </a>
            )}
          </div>
        </div>

        <div
          className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-signal/50 to-transparent"
          aria-hidden
        />
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-300 animate-fade-in [animation-delay:200ms]">
          <span>Automotive · EMS · Strojárstvo · Plasty · Kovovýroba</span>
          <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden />
          <span>Regióny: TN · ZA · TT · Morava</span>
        </div>
      </div>
    </section>
  );
}
