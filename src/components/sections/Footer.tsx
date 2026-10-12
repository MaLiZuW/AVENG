import Link from "next/link";
import { ExternalLink } from "lucide-react";
import GdprLink from "@/components/GdprModal";
import { company } from "@/config/company";
import { getPublicSocialLinks, type SocialKey } from "@/config/social";

const SOCIAL_LABEL: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

export default function Footer() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  const socialLinks = getPublicSocialLinks();

  return (
    <footer
      id="kontakt"
      className="border-t border-white/10 bg-ink-950 section-pad !py-16"
      aria-labelledby="contact-heading"
    >
      <div className="container-aveng">
        <p className="eyebrow mb-4">Kontakt</p>
        <h2 id="contact-heading" className="heading-display">
          Poďme nastaviť systém
        </h2>
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
            {socialLinks.length > 0 ? (
              <ul className="flex flex-wrap gap-3 pt-1">
                {socialLinks.map(({ key, url }) => (
                  <li key={key}>
                    <a
                      href={url}
                      className="inline-flex items-center gap-1.5 text-signal-bright hover:underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                      {SOCIAL_LABEL[key]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="pt-2">
              <Link
                href="/kontakt/"
                className="text-signal-bright underline-offset-2 hover:underline"
              >
                Kontaktný formulár
              </Link>
              {bookingUrl ? (
                <>
                  {" · "}
                  <a
                    href={bookingUrl}
                    className="text-signal-bright underline-offset-2 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Dohodnúť 30-minútovú konzultáciu
                  </a>
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
                <dd>{company.legalName}</dd>
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
            <p className="pt-2 text-ink-200">
              Prenos údajov je šifrovaný (HTTPS)
            </p>
            <GdprLink />
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-ink-300">
          © {new Date().getFullYear()} {company.brandName} · {company.legalName}{" "}
          · IČO {company.ico} · Všetky práva vyhradené.
        </p>
      </div>
    </footer>
  );
}
