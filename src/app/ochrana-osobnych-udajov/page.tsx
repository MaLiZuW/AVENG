import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { company } from "@/config/company";
import { POLICY_UPDATED, processors } from "@/config/processors";
import { retentionPeriodClaimSk } from "@/config/retention";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ochrana osobných údajov",
  description:
    "Zásady spracovania osobných údajov AddValueEngineering — účel, právny základ, doba uchovania a práva dotknutej osoby.",
  path: "/ochrana-osobnych-udajov/",
});

/**
 * Processors are listed from src/config/processors.ts (code-backed only).
 * TODO(owner/legal): review with a lawyer
 * TODO(owner): database backup expiry is not in config
 * TODO(owner): verify registeredSeat street/number against commercial register
 */
export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="section-pad">
        <div className="container-aveng max-w-3xl">
          <p className="eyebrow mb-4">GDPR</p>
          <h1 className="heading-display">
            Zásady spracovania osobných údajov
          </h1>
          <p className="mt-4 text-sm text-ink-300">
            Posledná aktualizácia: {POLICY_UPDATED}
          </p>

          <div className="prose-muted mt-8 space-y-6 text-base text-ink-200">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                1. Prevádzkovateľ
              </h2>
              <p className="mt-2">
                {company.legalName}, IČO {company.ico}, DIČ {company.dic},{" "}
                {company.registeredSeat}.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                2. Účel spracovania
              </h2>
              <p className="mt-2">
                Vybavenie dopytu z kontaktného formulára a zaslanie správy z
                online procesného auditu, vrátane komunikácie potrebnej na
                tieto dve činnosti.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                3. Právny základ
              </h2>
              <p className="mt-2">
                Súhlas dotknutej osoby podľa čl. 6 ods. 1 písm. a) nariadenia
                (EÚ) 2016/679. Súhlas udeľujete zaškrtnutím políčka pred
                odoslaním formulára. Súhlas môžete odvolať e-mailom na adresu
                prevádzkovateľa.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                4. Kategórie údajov
              </h2>
              <p className="mt-2">
                Kontaktný formulár: meno, e-mail, názov firmy, text správy a
                údaj o udelenom súhlase. Procesný audit: meno, pracovný
                e-mail, názov firmy, telefón (ak ho uvediete), odvetvie,
                tržby, podiel COGS, odpovede na otázky a z nich vypočítané
                výsledky.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                5. Doba uchovávania
              </h2>
              <p className="mt-2">
                {retentionPeriodClaimSk()} Správu z kontaktného formulára
                doručíme e-mailom a uchovávame ju po dobu vybavenia dopytu.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                6. Príjemcovia a sprostredkovatelia
              </h2>
              <p className="mt-2">
                Osobné údaje spracúvajú len služby, ktoré táto aplikácia
                skutočne používa:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {processors.map((p) => (
                  <li key={p.name}>
                    {p.name} — {p.purpose} ({p.locationNote}).
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Prenos medzi prehliadačom a týmito službami prebieha cez
                šifrované spojenie (HTTPS).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                7. Prenos údajov mimo EÚ
              </h2>
              <p className="mt-2">
                Niektorí poskytovatelia služieb môžu údaje spracúvať aj mimo
                Európskej únie.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                8. Práva dotknutej osoby
              </h2>
              <p className="mt-2">
                Máte právo na prístup k údajom, na opravu, na výmaz, na
                obmedzenie spracúvania, na prenosnosť, právo namietať a právo
                odvolať súhlas. Máte tiež právo podať sťažnosť na Úrad na
                ochranu osobných údajov Slovenskej republiky.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                9. Kontakt
              </h2>
              <p className="mt-2">
                Žiadosti o uplatnenie práv aj ostatné otázky zasielajte na{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-signal-bright hover:underline"
                >
                  {company.email}
                </a>{" "}
                alebo telefonicky na {company.phoneDisplay}. Poštová adresa:{" "}
                {company.registeredSeat}.
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
