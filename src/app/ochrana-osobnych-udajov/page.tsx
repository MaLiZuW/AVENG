import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { company } from "@/config/company";
import { POLICY_UPDATED, getProcessors } from "@/config/processors";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/ochrana-osobnych-udajov/",
  title: "Ochrana osobných údajov",
  description:
    "Zásady spracovania osobných údajov AddValueEngineering — účel, právny základ, doba uchovania a práva dotknutej osoby.",
});

/**
 * Processors are listed from src/config/processors.ts (code-backed only).
 * TODO(owner/legal): review with a lawyer
 * TODO(owner): database backup expiry is not in config
 * TODO(owner): add the verified commercial-register entry and IČ DPH, if applicable.
 * TODO(owner): confirm retention periods for invoice and unlock-code data.
 */
export default function PrivacyPage() {
  const optionalProcessors = getProcessors().filter(
    (processor) => !["WebSupport", "Supabase", "Resend"].includes(processor.name),
  );

  return (
    <>
      <Header />
      <main id="main-content" className="site-main section-pad">
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
                2. Na aké účely údaje spracúvame
              </h2>
              <ul className="mt-2 list-disc space-y-3 pl-5">
                <li>
                  <strong>Odpoveď na vašu správu.</strong> Ak nám napíšete cez
                  kontaktný formulár alebo e-mail, použijeme meno, e-mail,
                  firmu a text správy na odpoveď a prípravu ponuky. Právny
                  základ: opatrenia pred uzavretím zmluvy na vašu žiadosť,
                  prípadne náš oprávnený záujem odpovedať na dopyt.
                </li>
                <li>
                  <strong>Self-audit.</strong> Odpovede z auditu spracúvame na
                  vyhodnotenie auditu. Uchovávame ich len po dobu nevyhnutnú na
                  vyhodnotenie.
                </li>
                <li>
                  <strong>
                    Objednávka Level 2 a Level 3, fakturácia a prístupový kód.
                  </strong>{" "}
                  Na vystavenie faktúry a zaslanie prístupového kódu
                  spracúvame fakturačné údaje a e-mail. Právny základ: plnenie
                  zmluvy a plnenie zákonných povinností (účtovníctvo).
                </li>
                <li>
                  <strong>Ochrana právnych nárokov.</strong> Ak je to potrebné,
                  údaje použijeme na uplatnenie alebo obranu právnych nárokov
                  (oprávnený záujem).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                3. Kategórie údajov
              </h2>
              <p className="mt-2">
                Kontaktný formulár: meno, e-mail, názov firmy, text správy a
                údaj o udelenom súhlase. Procesný audit: meno, pracovný
                e-mail, názov firmy, telefón (ak ho uvediete), odvetvie,
                tržby, podiel COGS, odpovede na otázky a z nich vypočítané
                výsledky. Fakturácia: údaje potrebné na vystavenie faktúry.
                Odomykacie kódy: e-mailová adresa a údaje potrebné na ich
                vydanie a správu.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                4. Ako dlho údaje uchovávame
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  Údaje z kontaktných správ uchovávame po dobu nevyhnutnú na
                  vybavenie dopytu a následnej komunikácie.
                </li>
                <li>
                  Doklady uchovávame po dobu stanovenú právnymi predpismi.
                </li>
                <li>
                  Odpovede z auditu uchovávame len po dobu nevyhnutnú na
                  vyhodnotenie.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                5. Komu údaje poskytujeme
              </h2>
              <p className="mt-2">
                Údaje spracúvajú naši poskytovatelia služieb, ktorých
                potrebujeme na prevádzku webu: poskytovateľ hostingu
                (WebSupport), poskytovateľ databázy (Supabase) a poskytovateľ
                odosielania e-mailov (Resend). Údaje neposkytujeme na
                marketingové účely tretím stranám.
              </p>
              {optionalProcessors.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {optionalProcessors.map((p) => (
                  <li key={p.name}>
                    {p.name} — {p.purpose} ({p.locationNote}).
                  </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-2">
                Prenos medzi prehliadačom a týmito službami prebieha cez
                šifrované spojenie.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                6. Prenos údajov mimo Európskeho hospodárskeho priestoru
              </h2>
              <p className="mt-2">
                Niektorí poskytovatelia, napríklad služba na odosielanie
                e-mailov, môžu údaje spracúvať v Spojených štátoch. Prenos
                zabezpečujeme podľa kapitoly V nariadenia GDPR.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink-50">
                7. Práva dotknutej osoby
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
                8. Kontakt
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
