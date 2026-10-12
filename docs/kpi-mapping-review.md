# Mapovanie presných vstupov na publikované KPI

Rozhodnutie pre tabuľku „Vaše KPI voči orientačným referenciám“. `kpiKey` je len pri otázke s presným číslom, ktorej jednotka aj definícia sedia s `docs/benchmarks/benchmarks.seed.json`. Texty otázok sa nemenili. Riadok sa zobrazí len pri zadanom presnom čísle. `hr_skills` sa nezobrazuje (`available: false`).

## Namapované

| Otázka | kpiKey | Prečo sedí |
|---|---|---|
| L1-P2-Q1, OEE na kritických zariadeniach | `oee_pct` | Jednotka %. Definícia v otázke: OEE = dostupnosť × výkon × kvalita. Rovnaká definícia je v `definitionNote` benchmarku. |
| L1-P3-Q2, celkové COPQ ako % tržieb | `copq_pct_of_sales` | Otázka žiada celkové náklady na nekvalitu ako % tržieb. Benchmark má jednotku „% of sales“ a slovenský názov „Náklady zlej kvality (% z tržieb)“. Pole `numericUnit` je „%“; menovateľ je v texte otázky. |
| L1-P4-Q1, miera dodania na čas (OTD) | `otd_pct` | Jednotka %. Otázka je OTD. Benchmark: podiel objednávok dodaných načas k odoslaným objednávkam. |

Do buniek idú len polia, ktoré sú tá istá veličina:

- OEE: typický podnik = `typical` 60 %, diskrétna výroba `discreteAverageRange` 66–67 %, horný kvartil `topQuartile` 75 %. Špička = `worldClass` 85 % a `worldClassBySectorRange` 75–87 %.
- COPQ: typický podnik = `typical` 15 % a `range` 5–35 %. Špička = `worldClassBelow` (pod 5 %). Rozsah ASQ 15–20 % v bunke nie je: `definitionNote` hovorí, že ide o celkové náklady spojené s kvalitou, nie len o náklady chýb.
- OTD: typický podnik = `averageRange` 90–94 %. Špička = `worldClassRange` 95–99 %. OEM scorecard 98–99 % v bunke nie je: `definitionNote` hovorí, že je to kompozitná metrika, nie čisté OTD.

## Kandidáti bez mapovania

| Otázka | Zvažovaný kľúč | Prečo nie |
|---|---|---|
| L1-P1-Q1, presnosť plnenia výrobného plánu (plan attainment), % | `schedule_adherence_pct` | Otázka je plan attainment. `definitionNote` uvádza, že schedule adherence, attainment a compliance sa líšia. `kind` je prah dodávateľa, nie zmeraný údaj pre stĺpec „Typický podnik“. |
| L1-P2-Q2, plnenie plánu preventívnej údržby, % | `schedule_adherence_pct` | Ide o plán údržby, nie o plán výroby. |
| L1-P2-Q3, podiel neplánovaných prestojov, % | `oee_pct` | Je to len strata dostupnosti, nie celé OEE (dostupnosť × výkon × kvalita). |
| L1-P4-Q4, kompletnosť a presnosť dodávok od dodávateľov, % | `otd_pct` | Ide o dodávateľov, nie o OTD voči zákazníkovi. |

## Bez kandidáta

Tieto presné vstupy nemajú v JSON zodpovedajúce KPI: lead time (dni), podiel núdzového preplánovania, DPMO, PPM reklamácií, obrátkovosť zásob, absencia, počet návrhov, viaczručnosť. Absencia, návrhy a viaczručnosť patria k ľudským zdrojom; `hr_skills` referenciu nemá a riadok sa nezobrazuje.

## TODO(owner)

- Potvrdiť tri `kpiKey` vyššie, najmä COPQ: otázka vymenúva scrap, prepracovanie, reklamácie a stratu kapacity, zatiaľ čo publikovaných 15 % je podľa IISE širší údaj o nákladoch kvality.
- Rozhodnúť, či sa plan attainment niekedy zjednotí s dodržiavaním plánu výroby. Kým definície nesedia, `kpiKey` ostáva prázdne.
