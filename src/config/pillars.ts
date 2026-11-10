/**
 * Four service pillars — shared by /sluzby and detail routes.
 */

export const PILLARS = [
  {
    slug: "procesny-audit-identifikacia-problemu",
    num: "01",
    title: "Procesný audit a identifikácia problému",
    short: "Projektový sprint na pomenovanie problému, návrh riešení a projektový plán.",
    body: [
      "Projekt s jedným definovaným problémom, cieľom, rozsahom a kritériom prijatia.",
    ],
  },
  {
    slug: "projekt-zmeny-eco",
    num: "02",
    title: "Projekt zmeny a ECO",
    short: "Zavedenie riadeného procesu zmien s jasnými rolami a plánom.",
    body: [
      "Výstupom je popis cieľového procesu, role, checklist a plán zavedenia s termínmi a zodpovednými.",
    ],
  },
  {
    slug: "sprava-dokumentacie-a-schvalovanie",
    num: "03",
    title: "Projekt správy dokumentácie a schvaľovania",
    short: "Zjednodušenie dokumentácie, schvaľovacích tokov a návrh automatizácie.",
    body: [
      "Návrh procesu a plánu automatizácie schvaľovacích slučiek a nahrávania dokumentácie do ERP.",
    ],
  },
  {
    slug: "rozvoj-liderov-koucing",
    num: "04",
    title: "Projekt rozvoja lídrov",
    short: "Individuálny alebo skupinový rozvojový program pre vedúcich.",
    body: [
      "Cieľ a spôsob merania sa dohodnú so sponzorom pred začiatkom projektu.",
    ],
  },
] as const;

export type PillarSlug = (typeof PILLARS)[number]["slug"];

export function getPillar(slug: string) {
  return PILLARS.find((p) => p.slug === slug);
}
