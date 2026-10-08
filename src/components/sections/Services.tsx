import Link from "next/link";
import { PILLARS } from "@/config/pillars";

export default function Services() {
  return (
    <section id="sluzby" className="section-pad" aria-labelledby="services-heading">
      <div className="container-aveng">
        <p className="eyebrow mb-4">4 piliere efektivity</p>
        <h2 id="services-heading" className="heading-display max-w-2xl">
          Systém, ktorý drží — od stratégie po dielňu
        </h2>
        <p className="prose-muted mt-4 max-w-2xl">
          Štyri piliere, jeden cieľ: predvídateľná výroba a silní technickí
          lídri.
        </p>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <li key={p.slug} className="group relative">
              <span
                className="font-display text-5xl font-semibold text-signal/45 transition group-hover:text-signal/70"
                aria-hidden
              >
                {p.num}
              </span>
              <h3 className="-mt-2 font-display text-xl font-semibold text-ink-50">
                <Link
                  href={`/sluzby/${p.slug}/`}
                  className="hover:text-signal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-200">
                {p.short}
              </p>
              <Link
                href={`/sluzby/${p.slug}/`}
                className="mt-3 inline-block text-sm text-signal-bright underline-offset-2 hover:underline"
              >
                Viac o pilieri
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
