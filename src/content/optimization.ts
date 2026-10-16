import type { FaqItem, PageCta } from "@/content/types";

export const OPTIMIZATION_META = {
  title: "Optimalizácia a AI",
  description:
    "Procesy, informačné toky a praktické využitie nástrojov vo výrobných MSP — návrhy riešení, implementácia až po dohode.",
} as const;

export const OPTIMIZATION = {
  eyebrow: "Optimalizácia & AI",
  heading: "Procesy, IS a AI — prakticky pre výrobné MSP",
  lead: "Pomáhame výrobným MSP dať do poriadku procesy a informačné toky a prakticky využiť AI tam, kde znižuje chaos — nie ako „big-tech“ projekt. Stránka spája mapovanie plytvania, digitálnu zrelosť (OEE, ERP, shopfloor dáta) a jednoduchú automatizáciu administratívy.",
  whenHeading: "Kedy to dáva zmysel",
  when: [
    "Tok hodnoty je neprehľadný; máte bottlenecky a skryté zásoby.",
    "Máte dáta v ERP, ale rozhodnutia stále idú „od oka“.",
    "Administratíva a dokumentácia žerú čas lídrov.",
    "Chcete AI ako nástroj, nie ako cieľ sám osebe.",
  ],
  features: [
    {
      title: "Mapovanie a analýza plytvania",
      text: "Identifikácia Muda, bottleneckov a skrytých zásob.",
    },
    {
      title: "Digitálna transformácia",
      text: "OEE meranie, prepojenie s ERP a shopfloor dátami; digitálna zrelosť, ktorá prináša rozhodnutia.",
    },
    {
      title: "Využitie AI v sektore MSP",
      text: "Automatizácia administratívy, asistenti pre dokumentáciu, zníženie nákladov bez big-tech komplexity.",
    },
  ],
  boundary:
    "Navrhujeme riešenia. Implementácia nasleduje až po samostatnej dohode.",
  processHeading: "Ako to prebieha",
  processSteps: [
    "Diagnostika (self-audit alebo obchôdzka).",
    "Výber 1–2 pák s najvyšším dopadom.",
    "Pilot merania / procesu / asistenta.",
    "Vyhodnotenie a rozšírenie.",
    "Odovzdanie vlastníctva interne.",
  ],
  exampleHeading: "Príklad z praxe",
  example:
    "Automatizácia správy dokumentácie, schvaľovacie slučky a nahrávanie dokumentácie do ERP pomocou robota.",
  relatedPillars: [
    {
      title: "Fractional Technical Leadership",
      href: "/sluzby/fractional-technical-leadership/",
    },
    {
      title: "Zavádzanie procesov & PLM/PDM",
      href: "/sluzby/zavadzanie-procesov-plm-pdm/",
    },
  ],
  faq: [
    {
      q: "Je toto predaj softvéru?",
      a: "Nie — zameranie je na procesy, meranie a praktické využitie nástrojov, ktoré firma už má alebo vie zvládnuť.",
    },
    {
      q: "Sľubujete AI úspory v percentách?",
      a: "Nie. Žiadne absolútne sľuby; najprv diagnostika a pilot.",
    },
    {
      q: "Súvisí to so self-auditom?",
      a: "Áno. Self-audit ukáže indikatívne medzery; optimalizácia a AI riešia vybrané páky.",
    },
    {
      q: "Pre koho?",
      a: "Výrobné MSP v regiónoch Trenčín, Žilina a Trnava.",
    },
    {
      q: "Ako začať?",
      a: "vladimir@addvalueengineering.sk alebo /kontakt/; prípadne /self-audit/.",
    },
  ] satisfies FaqItem[],
  cta: {
    primaryHref: "/self-audit/",
    primaryLabel: "Spustiť bezplatný self-audit",
    secondaryHref: "/kontakt/?predmet=optimalizacia-a-ai",
    secondaryLabel: "Kontakt",
  } satisfies PageCta,
} as const;
