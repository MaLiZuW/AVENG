import Link from "next/link";
import GdprLink from "@/components/GdprModal";
import TrackBookingLink from "@/components/TrackBookingLink";
import { company } from "@/config/company";

const FOOTER_NAV = [
  { href: "/", label: "Domov" },
  { href: "/o-nas/", label: "O nás" },
  { href: "/sluzby/", label: "Služby" },
  { href: "/optimalizacia-a-ai/", label: "Optimalizácia & AI" },
  { href: "/self-audit/", label: "Self-Audit" },
  { href: "/kontakt/", label: "Kontakt" },
];

function FooterNav() {
  return (
    <nav
      className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
      aria-label="Navigácia v pätičke"
    >
      {FOOTER_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-signal-bright underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-bright"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function CompactFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 px-5 py-10 sm:px-8 lg:px-12">
      <div className="container-aveng">
        <FooterNav />
        <p className="mt-6 text-xs leading-relaxed text-ink-300">
          Pôsobíme najmä v Trenčianskom, Žilinskom a Trnavskom kraji.
        </p>
        <p className="mt-6 text-xs leading-relaxed text-ink-300">
          {company.legalName.replace("s. r. o.", "s.\u00a0r.\u00a0o.")} · IČO{" "}
          {company.ico} · {company.registeredSeat} ·{" "}
          <GdprLink className="text-signal-bright underline-offset-2 hover:underline" />
        </p>
      </div>
    </footer>
  );
}

export default function Footer({
  variant = "compact",
}: {
  variant?: "full" | "compact";
}) {
  if (variant === "compact") return <CompactFooter />;

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

  return (
    <footer
      id="kontakt"
      className="border-t border-white/10 bg-ink-950 section-pad !py-16"
      aria-labelledby="contact-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">Kontakt</p>
        <h2 id="contact-heading" className="heading-display">
          Popíšte problém
        </h2>
        <p className="prose-muted mt-4">
          Ozveme sa s návrhom ďalšieho kroku. Bez povinnosti.
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="space-y-3 text-sm text-ink-200">
            <p>
              <strong className="text-ink-50">
                {company.brandName} ({company.brandShort})
              </strong>
            </p>
            <p>{company.addressDisplay}</p>
            <p>
              Tel:{" "}
              <a
                href={`tel:${company.phoneTel}`}
                className="text-signal-bright hover:underline"
              >
                {company.phoneDisplay}
              </a>
            </p>
            <p>
              E-mail:{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-signal-bright hover:underline"
              >
                {company.email}
              </a>
            </p>
            <p className="pt-2">
              <Link
                href="/kontakt/"
                className="text-signal-bright underline-offset-2 hover:underline"
              >
                Popísať problém
              </Link>
              {bookingUrl ? (
                <>
                  {" · "}
                  <TrackBookingLink
                    href={bookingUrl}
                    className="text-signal-bright underline-offset-2 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Dohodnúť úvodný rozhovor
                  </TrackBookingLink>
                </>
              ) : null}
            </p>
          </div>

          <div className="space-y-3 text-sm text-ink-200">
            <p className="font-semibold text-ink-50">
              Základné údaje o spoločnosti
            </p>
            <dl className="space-y-1.5">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-ink-100">Názov:</dt>
                <dd>{company.legalName.replace("s. r. o.", "s.\u00a0r.\u00a0o.")}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-ink-100">IČO:</dt>
                <dd>{company.ico}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-ink-100">DIČ:</dt>
                <dd>{company.dic}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-ink-100">Sídlo:</dt>
                <dd>{company.addressDisplay}</dd>
              </div>
            </dl>
            <GdprLink />
          </div>
        </div>
        <div className="mt-10">
          <FooterNav />
        </div>
        <p className="mt-12 text-xs text-ink-300">
          Pôsobíme najmä v Trenčianskom, Žilinskom a Trnavskom kraji.
        </p>
        <p className="mt-6 border-t border-white/10 pt-6 text-xs text-ink-300">
          {company.legalName.replace("s. r. o.", "s.\u00a0r.\u00a0o.")} · IČO{" "}
          {company.ico} · {company.registeredSeat}
        </p>
      </div>
    </footer>
  );
}
