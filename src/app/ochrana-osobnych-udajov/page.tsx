import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov | AVENG",
  description:
    "Zásady spracovania osobných údajov AddValueEngineering — účel, právny základ, doba uchovania a práva dotknutej osoby.",
  alternates: { canonical: "/ochrana-osobnych-udajov/" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="section-pad">
        <div className="container-aveng max-w-3xl">
          <p className="eyebrow mb-4">GDPR</p>
          <h1 className="heading-display">Ochrana osobných údajov</h1>
          {/* TODO(owner/legal): skontrolovať s právnikom pred produkčným nasadením */}
          <p className="mt-4 text-sm text-ink-300">
            Návrh textu na schválenie vlastníkom / právnym poradcom.
          </p>

          <div className="prose-muted mt-8 space-y-6 text-base text-ink-200">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                1. Prevádzkovateľ
              </h2>
              <p className="mt-2">
                {company.legalName}, IČO {company.ico}, DIČ {company.dic}, sídlo{" "}
                {company.addressDisplay}. Kontakt:{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-signal-bright hover:underline"
                >
                  {company.email}
                </a>
                , tel. {company.phoneDisplay}.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                2. Účel spracovania
              </h2>
              <p className="mt-2">
                Spracovanie dopytu a obchodného kontaktu, zaslanie výsledkov /
                správy z online procesného auditu a súvisiaca komunikácia k
                službám {company.brandName}.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                3. Právny základ
              </h2>
              <p className="mt-2">
                Súhlas dotknutej osoby (čl. 6 ods. 1 písm. a GDPR) udelený pred
                odoslaním formulára, prípadne oprávnený záujem pri priamom
                obchodnom dopyte (čl. 6 ods. 1 písm. f), podľa okolností.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                4. Kategórie údajov
              </h2>
              <p className="mt-2">
                Identifikačné a kontaktné údaje (meno, e-mail, telefón, firma),
                údaje o audite (odvetvie, tržby, COGS, odpovede a vypočítané
                výsledky) a obsah správy z kontaktného formulára.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                5. Doba uchovávania
              </h2>
              <p className="mt-2">
                {/* TODO(owner/legal): review with a lawyer; enable RETENTION_JOB_VERIFIED after migration deploy */}
                Údaje uchovávame len po dobu nevyhnutnú na vyhodnotenie auditu a
                spracovanie dopytu. Po schválení a nasadení mazacieho mechanizmu
                bude doba uchovania maximálne {company.dataRetentionDays} dní
                (konfiguračná hodnota RETENTION_DAYS). Termín expirácie záloh
                databázy: TODO(owner).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                6. Príjemcovia / sprostredkovatelia
              </h2>
              <p className="mt-2">
                Podľa aktuálnej konfigurácie aplikácie môžu byť zapojení:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Poskytovateľ databázy / backendu (ak je nastavený Supabase)
                </li>
                <li>
                  Poskytovateľ doručenia formulárov (Web3Forms alebo FormSubmit —
                  podľa konfigurácie)
                </li>
                <li>Hosting webovej prezentácie (WebSupport / zvolený hoster)</li>
              </ul>
              <p className="mt-2 text-sm text-ink-300">
                Zoznam obsahuje len služby, ktoré kód reálne podporuje. Žiadni
                ďalší sprostredkovatelia nie sú vymyslení.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                7. Práva dotknutej osoby
              </h2>
              <p className="mt-2">
                Máte právo na prístup, opravu, výmaz, obmedzenie spracovania,
                prenosnosť, námietku a odvolanie súhlasu. Podnety zasielajte na{" "}
                {company.email}. Máte právo podať sťažnosť na Úrad na ochranu
                osobných údajov SR.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                8. Prenos údajov
              </h2>
              <p className="mt-2">
                Komunikácia prebieha cez šifrované spojenie (HTTPS).
              </p>
            </section>
          </div>

          <p className="mt-10">
            <Link href="/" className="btn-secondary">
              Späť na úvod
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
