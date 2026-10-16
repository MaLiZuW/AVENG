/**
 * Four service pillars — shared by /sluzby and detail routes.
 */

export const PILLARS = [
  {
    slug: "fractional-technical-leadership",
    num: "01",
    title: "Fractional Technical Leadership",
    short:
      "Externý Head of Engineering — strategické riadenie techniky, ROI investičné plánovanie a stabilizácia priorít bez full-time nákladov.",
    body: [
      "Dočasné alebo čiastkové seniorné vedenie technickej oblasti pre výrobné MSP, ktoré potrebujú stabilitu priorít bez plného úväzku manažéra.",
      "Typický rozsah: roadmapa techniky, rozhodovanie o investíciách, nastavenie rytmu tímu a prepojenie vývoja s výrobou.",
    ],
  },
  {
    slug: "zavadzanie-procesov-plm-pdm",
    num: "02",
    title: "Zavádzanie procesov & PLM/PDM",
    short:
      "NPI nábehy, poriadok v dokumentácii a TPV. Jedna pravda o produkte — od výkresu po shopfloor.",
    body: [
      "Pomáhame zaviesť jednu pravdu o produkte: štruktúra kusovníkov, verzie výkresov, TPV a uvoľnenia do výroby.",
      "Cieľom je predvídateľný NPI nábeh a menej chýb spôsobených rozptýlenou dokumentáciou.",
    ],
  },
  {
    slug: "riadenie-zmien-eco",
    num: "03",
    title: "Riadenie zmien & ECO",
    short:
      "Zmenové konanie bez chýb a odporu tímu. Jasná stopa verzií, uvoľnení a komunikácie do výroby.",
    body: [
      "Nastavenie zmenového konania (ECO) tak, aby zmeny boli sledovateľné, komunikované a riešiteľné bez chaosu na dielni.",
      "Dôraz na jasné role, stopy verzií a rýchlu spätnú väzbu z výroby.",
    ],
  },
  {
    slug: "rozvoj-liderov-koucing",
    num: "04",
    title: "Rozvoj lídrov & Koučing",
    short:
      "BCTC certifikovaný business coach pre majstrov a team-leaderov — aby zmeny prežili aj po odchode konzultanta.",
    body: [
      "Rozvoj majstrov a team-leaderov, aby systémové zmeny prežili aj bez permanentnej prítomnosti konzultanta.",
      "Kombinácia koučingu a praktických rituálov (denný/týždenný rytmus, vizuálne riadenie, spätná väzba).",
    ],
  },
] as const;

export type PillarSlug = (typeof PILLARS)[number]["slug"];

export function getPillar(slug: string) {
  return PILLARS.find((p) => p.slug === slug);
}
