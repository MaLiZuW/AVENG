export default function Hero() {
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
          <h1
            id="hero-heading"
            className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-ink-50 sm:text-5xl lg:text-6xl"
          >
            Jeden problém vo vašej výrobe vás stojí najviac. Nájdeme ho a
            dáme ho do plánu.
          </h1>
          <p className="prose-muted mt-6 max-w-2xl">
            Pre majiteľov výrobných firiem s 20 až 250 zamestnancami.
            Identifikujeme problém, navrhneme varianty riešenia a zostavíme
            projektový plán. Realizujú vaši ľudia, my ich vedieme a kontrolujeme
            postup.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/kontakt/" className="btn-primary">
              Popíšte nám problém
            </a>
            <a href="/self-audit/" className="btn-secondary">
              Vyskúšať audit zdarma
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-300 animate-fade-in [animation-delay:200ms]">
          <span>Úvodný rozhovor zdarma</span>
          <span>Pevná cena sprintu</span>
          <span>Realizuje váš tím</span>
          <span>15+ rokov v EMS výrobe</span>
        </div>
      </div>
    </section>
  );
}
