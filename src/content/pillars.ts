import type { FaqItem, PageCta } from "@/content/types";
import type { PillarSlug } from "@/config/pillars";

export type PillarPageContent = {
  slug: PillarSlug;
  metaDescription: string;
  lead: string;
  whenHeading: string;
  when: string[];
  processHeading: string;
  processSteps: string[];
  deliverHeading?: string;
  deliver?: string[];
  modelHeading: string;
  model: string[];
  experiencesHeading?: string;
  experiencesIntro?: string;
  experiences?: string[];
  related: PillarSlug[];
  faq: FaqItem[];
  cta: PageCta;
};

const PRICE_MODEL =
  "Cena vychádza z hodinovej sadzby, prípadne z odmeny viazanej na vopred dohodnuté ciele. Presný rozsah a cena sú v ponuke.";

export const PILLAR_PAGES: Record<PillarSlug, PillarPageContent> = {
  "fractional-technical-leadership": {
    slug: "fractional-technical-leadership",
    metaDescription:
      "Fractional Technical Leadership: seniorné technické vedenie na čiastkový úväzok pre výrobné MSP v regiónoch Trenčín, Žilina a Trnava.",
    lead: "Fractional Technical Leadership je seniorné technické vedenie na čiastkový úväzok — externý Head of Engineering pre výrobné MSP, ktoré potrebujú stabilitu priorít, roadmapu techniky a prepojenie vývoja s výrobou bez nákladov na full-time manažéra. Služba je určená majiteľom, CEO, COO a technickým riaditeľom výrobných MSP (orientačne 20 – 250 zamestnancov) v regiónoch Trenčín, Žilina a Trnava.",
    whenHeading: "Kedy to dáva zmysel",
    when: [
      "Firma rastie a majiteľ denne hasí operatívu v technike.",
      "Chýba systém v prioritách, investíciách alebo rytme tímu.",
      "Full-time Head of Engineering zatiaľ nie je úmerný veľkosti tímu.",
      "Treba dočasne stabilizovať NPI, ECO alebo prepojenie vývoja s výrobou.",
    ],
    processHeading: "Ako spolupráca prebieha",
    processSteps: [
      "Konverzácia s majiteľom.",
      "Analýza stavu.",
      "Diskusia o ďalších krokoch.",
    ],
    modelHeading: "Model spolupráce",
    model: [
      "Čiastkové seniorné vedenie bez plného úväzku. Typicky 4 stretnutia po 2 hodiny mesačne (spolu približne 8 hodín mesačne), upraviteľné dohodou.",
      PRICE_MODEL,
      "Žiadny minimálny záväzok. Podmienky vrátane výpovednej lehoty sa dohodnú v ponuke.",
    ],
    experiencesHeading: "Vybrané skúsenosti z praxe",
    experiencesIntro:
      "Ide o skúsenosti z predchádzajúcej praxe, nie o zákazky AVENG.",
    experiences: [
      "Zavedenie procesu zmenového konania (ECO) a podporného nástroja v elektronickej zákazkovej výrobe (EMS).",
      "Zriadenie interného tooling laboratória v EMS výrobe.",
      "Zavedenie systému správy dokumentácie v EMS výrobe.",
      "Automatizácia schvaľovacích tokov a nahrávania dokumentácie do ERP pomocou robota.",
    ],
    related: ["zavadzanie-procesov-plm-pdm", "rozvoj-liderov-koucing"],
    faq: [
      {
        q: "Čo je fractional engineering manager?",
        a: "Fractional engineering manager (alebo Fractional Technical Leadership) je seniorné technické vedenie na čiastkový úväzok. Pomáha nastaviť procesy, priority a lídrov bez nutnosti plného úväzku manažéra vo firme.",
      },
      {
        q: "Kedy sa fractional technické vedenie oplatí?",
        a: "Keď firma rastie, chýba systém v technike alebo majiteľ denne hasí operatívu — a full-time Head of Engineering zatiaľ nie je úmerný veľkosti tímu.",
      },
      {
        q: "Pre koho je služba?",
        a: "Pre majiteľov, CEO, COO a technických riaditeľov výrobných MSP (orientačne 20 – 250 zamestnancov) v regiónoch Trenčín, Žilina a Trnava — najmä automotive, EMS, strojárstvo, plasty a kovovýroba.",
      },
      {
        q: "Ako začať?",
        a: "Napíšte cez kontaktný formulár alebo na vladimir@addvalueengineering.sk. Ozveme sa s návrhom termínu. Prvý krok môže byť aj bezplatný self-audit na webe.",
      },
      {
        q: "Je self-audit zárukou úspor?",
        a: "Nie. Level 1 je rýchla orientačná diagnostika založená na vašich odpovediach.",
      },
    ],
    cta: {
      primaryHref: "/self-audit/",
      primaryLabel: "Spustiť bezplatný self-audit",
      secondaryHref: "/kontakt/?predmet=fractional-technical-leadership",
      secondaryLabel: "Kontakt",
    },
  },
  "zavadzanie-procesov-plm-pdm": {
    slug: "zavadzanie-procesov-plm-pdm",
    metaDescription:
      "Zavádzanie procesov a PLM/PDM: jedna pravda o produkte od výkresu po shopfloor — bez dodávky softvéru.",
    lead: "Pomáhame výrobným MSP zaviesť jednu pravdu o produkte: štruktúru kusovníkov, verzie výkresov, TPV a uvoľnenia do výroby. Služba je pre firmy, ktoré majú chaos v dokumentácii, ťažké NPI nábehy alebo rozptýlené zdroje pravdy medzi Excelom, e-mailom a dielňou. Zameranie je len na procesy.",
    whenHeading: "Kedy to dáva zmysel",
    when: [
      "NPI nábehy sa oneskorujú alebo opakujú chyby z dokumentácie.",
      "Na dielni a vo vývoji neplatí tá istá verzia výkresu / kusovníka.",
      "Chýba jasný proces uvoľnenia do výroby a TPV.",
      "Plánujete alebo už máte PLM/PDM, ale procesy okolo neho nie sú nastavené.",
    ],
    deliverHeading: "Čo dostanete",
    deliver: [
      "Poriadok v dokumentácii a TPV — jedna pravda o produkte od výkresu po shopfloor.",
      "Predvídateľnejší NPI nábeh a menej chýb z rozptýlenej dokumentácie.",
    ],
    processHeading: "Ako to prebieha",
    processSteps: [
      "Diagnostika súčasného stavu dokumentácie a uvoľnení.",
      "Návrh cieľového procesu (jedna pravda o produkte).",
      "Pilot na vybranom produkte / linke.",
      "Rozšírenie a zaškolenie tímu.",
      "Odovzdanie vlastníctva procesu interne.",
    ],
    modelHeading: "Model spolupráce",
    model: [
      "Projektová alebo fractional podpora podľa rozsahu. Môže nadväzovať na Fractional Technical Leadership. Rozsah a dĺžka sa riadia požiadavkou.",
      PRICE_MODEL,
    ],
    related: ["fractional-technical-leadership", "riadenie-zmien-eco"],
    faq: [
      {
        q: "Čo znamená „jedna pravda o produkte“?",
        a: "Že kusovník, výkres, TPV a uvoľnenie do výroby majú jednu riadenú verziu — nie niekoľko súborov v e-mailoch.",
      },
      {
        q: "Je to implementácia softvéru PLM?",
        a: "Nie. Softvér nedodávame ani nekonfigurujeme. Zameranie je len na procesy.",
      },
      {
        q: "Pre koho?",
        a: "Výrobné MSP v regiónoch Trenčín, Žilina a Trnava, najmä s NPI a zmenovým konaním.",
      },
      {
        q: "Ako overíte prínos?",
        a: "Najprv self-audit alebo osobný rozhovor; následne dohoda rozsahu. Bez sľubu „garantovaných úspor“.",
      },
      {
        q: "Ako začať?",
        a: "Kontakt: vladimir@addvalueengineering.sk alebo formulár na /kontakt/.",
      },
    ],
    cta: {
      primaryHref: "/self-audit/",
      primaryLabel: "Spustiť bezplatný self-audit",
      secondaryHref: "/kontakt/?predmet=zavadzanie-procesov-plm-pdm",
      secondaryLabel: "Kontakt",
    },
  },
  "riadenie-zmien-eco": {
    slug: "riadenie-zmien-eco",
    metaDescription:
      "Riadenie zmien a ECO: sledovateľné zmeny, jasné role a komunikácia do výroby pre výrobné MSP.",
    lead: "Nastavujeme zmenové konanie (ECO) tak, aby zmeny boli sledovateľné, komunikované a riešiteľné bez chaosu na dielni. Služba je pre výrobné MSP, kde zmeny produktov a procesov končia v odpore tímu, chýbajúcej stope verzií alebo oneskorenom uvoľnení do výroby.",
    whenHeading: "Kedy to dáva zmysel",
    when: [
      "Zmeny sa „strácajú“ medzi vývojom, kvalitou a výrobou.",
      "Na dielni bežia staré verzie, kým kancelária už pracuje s novými.",
      "Chýbajú jasné role, schvaľovanie a spätná väzba z výroby.",
      "Tím zmenám odporuje, lebo proces je neprehľadný.",
    ],
    deliverHeading: "Čo dostanete",
    deliver: [
      "Jasná stopa verzií, uvoľnení a komunikácie do výroby.",
      "Definované role a rytmus zmenového konania.",
      "Rýchlejšia spätná väzba z výroby do rozhodovania.",
      "Šablóny, checklisty a KPI sa pripravujú podľa požiadavky, na projekt. Pevný zoznam nie je.",
    ],
    processHeading: "Ako to prebieha",
    processSteps: [
      "Mapovanie dnešného toku zmien (kto, čo, kedy).",
      "Návrh cieľového ECO procesu a rolí.",
      "Pilot na vybraných zmenách.",
      "Doladenie s majstrami a kvalitou.",
      "Stabilizácia rituálov a odovzdanie vlastníkovi procesu.",
    ],
    modelHeading: "Model spolupráce",
    model: [
      "Projektová stabilizácia ECO alebo súčasť fractional vedenia. Dĺžka a cena sa určujú podľa požiadavky, na projekt.",
    ],
    related: ["zavadzanie-procesov-plm-pdm", "rozvoj-liderov-koucing"],
    faq: [
      {
        q: "Čo je ECO v tomto kontexte?",
        a: "Zmenové konanie — riadená cesta od návrhu zmeny po uvoľnenie do výroby so stopou verzií.",
      },
      {
        q: "Riešite aj softvér na zmeny?",
        a: "Nie. Zameranie je na proces, role a komunikáciu.",
      },
      {
        q: "Prečo zmeny zlyhávajú na dielni?",
        a: "Často nie pre techniku, ale pre nejasnú komunikáciu a odpor — preto spájame proces s prácou s ľuďmi (pozri aj pilier Rozvoj lídrov).",
      },
      {
        q: "Ako začať?",
        a: "Self-audit alebo e-mail na vladimir@addvalueengineering.sk.",
      },
      {
        q: "Sľubujete percentá úspor?",
        a: "Nie. Cieľom je predvídateľnosť a menej chýb — bez absolútnych sľubov.",
      },
    ],
    cta: {
      primaryHref: "/self-audit/",
      primaryLabel: "Spustiť bezplatný self-audit",
      secondaryHref: "/kontakt/?predmet=riadenie-zmien-eco",
      secondaryLabel: "Kontakt",
    },
  },
  "rozvoj-liderov-koucing": {
    slug: "rozvoj-liderov-koucing",
    metaDescription:
      "Rozvoj lídrov a koučing: BCTC certifikovaný business coach pre majstrov a team-leaderov vo výrobných MSP.",
    lead: "Rozvíjame majstrov a team-leaderov, aby systémové zmeny prežili aj bez permanentnej prítomnosti konzultanta. Vladimir je BCTC certifikovaný business coach. Súčasťou sú praktické rituály (denný/týždenný rytmus, vizuálne riadenie, spätná väzba) — pre výrobné MSP v regiónoch Trenčín, Žilina a Trnava.",
    whenHeading: "Kedy to dáva zmysel",
    when: [
      "Zmeny procesov sa vrátia späť po odchode konzultanta.",
      "Majstri a team-leaderi hasia namiesto riadenia.",
      "Chýba denný/týždenný rytmus a vizuálne riadenie.",
      "Majiteľ chce, aby lídri niesli systém, nie len úlohy.",
    ],
    deliverHeading: "Čo dostanete",
    deliver: [
      "Koučing zameraný na prijatie zmien na dielni a v tímoch.",
      "Praktické rituály: denný/týždenný rytmus, vizuálne riadenie, spätná väzba.",
      "Lídrov, ktorí udržia nastavené procesy.",
      "Formát je individuálny aj skupinový. Program má 5 – 6 stretnutí, 1 – 2-krát mesačne, inak podľa dohody.",
    ],
    processHeading: "Ako to prebieha",
    processSteps: [
      "Dohoda cieľov s majiteľom / COO.",
      "Diagnostika líderského rytmu na dielni.",
      "Koučovacie sedenia + zavedenie rituálov.",
      "Spoločné riešenie odporu voči konkrétnym zmenám.",
      "Vyhodnotenie a odovzdanie návykov tímu.",
    ],
    modelHeading: "Model spolupráce",
    model: [
      "Samostatný program alebo doplnok k Fractional Technical Leadership a ECO/PLM zásahom.",
      PRICE_MODEL,
    ],
    related: ["fractional-technical-leadership", "riadenie-zmien-eco"],
    faq: [
      {
        q: "Čo je BCTC coaching?",
        a: "BCTC certifikovaný business coach.",
      },
      {
        q: "Pre koho sedenia sú?",
        a: "Najmä majstri a team-leaderi; podľa dohody aj stredný manažment.",
      },
      {
        q: "Je to psychoterapia?",
        a: "Nie. Ide o business koučing a praktické návyky riadenia na shopfloori.",
      },
      {
        q: "Prečo to spájať s technikou?",
        a: "Procesy bez prijatia na dielni neprežijú — preto AVENG spája technickú disciplínu s prácou s ľuďmi.",
      },
      {
        q: "Ako začať?",
        a: "Kontakt: vladimir@addvalueengineering.sk alebo /kontakt/.",
      },
    ],
    cta: {
      primaryHref: "/self-audit/",
      primaryLabel: "Spustiť bezplatný self-audit",
      secondaryHref: "/kontakt/?predmet=rozvoj-liderov-koucing",
      secondaryLabel: "Kontakt",
    },
  },
};

export function getPillarPage(slug: string): PillarPageContent | undefined {
  return PILLAR_PAGES[slug as PillarSlug];
}
