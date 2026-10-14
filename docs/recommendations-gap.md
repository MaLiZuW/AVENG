# Odporúčania — chýbajúci per-question text (STEP 22)

Odporúčania majú zatiaľ **iba text podľa domény** (`RECOMMENDATION_BANK`). Pri výsledku sa k existujúcemu textu pridá prefix najslabšej odpovedanej otázky; samostatné znenie na otázku neexistuje.

Všetky L1 otázky bez per-question textu:

| ID | Doména | Otázka |
|---|---|---|
| L1-P1-Q1 | P1 | Aká je presnosť plnenia výrobného plánu (plan attainment)? |
| L1-P1-Q2 | P1 | Je výroba riadená pull systémom / Kanban podľa taktu zákazníka? |
| L1-P1-Q3 | P1 | Aký je priemerný výrobný lead time v dňoch? |
| L1-P1-Q4 | P1 | Aký je podiel núdzového preplánovania (firefighting)? |
| L1-P2-Q1 | P2 | Aká je nameraná hodnota OEE na kritických zariadeniach? |
| L1-P2-Q2 | P2 | Existuje plán preventívnej údržby (PM) s dodržaním ≥ 90 %? |
| L1-P2-Q3 | P2 | Aký je podiel neplánovaných prestojov na celkovom čase? |
| L1-P2-Q4 | P2 | Sú poruchy zariadení analyzované metódou root-cause (5× Why, Fishbone)? |
| L1-P3-Q1 | P3 | Aká je úroveň DPMO (defects per million opportunities)? |
| L1-P3-Q2 | P3 | Aké sú celkové náklady na nekvalitu (COPQ) ako % tržieb? |
| L1-P3-Q3 | P3 | Existuje kontrolný plán pre kritické charakteristiky? |
| L1-P3-Q4 | P3 | Aká je miera reklamácií od zákazníkov (PPM)? |
| L1-P4-Q1 | P4 | Aká je miera dodania na čas (OTD)? |
| L1-P4-Q2 | P4 | Aká je obrátkovosť zásob (inventory turns)? |
| L1-P4-Q3 | P4 | Je hodnotový tok mapovaný metódou VSM? |
| L1-P4-Q4 | P4 | Aká je kompletnosť a presnosť dodávok od dodávateľov? |
| L1-P5-Q1 | P5 | Existuje matica kompetencií a plán školenia? |
| L1-P5-Q2 | P5 | Aká je miera absencie zamestnancov? |
| L1-P5-Q3 | P5 | Koľko zlepšovacích návrhov na zamestnanca za rok? |
| L1-P5-Q4 | P5 | Aká je viaczručnosť / multi-skilling coverage? |

**TODO(owner):** doplniť per-question texty odporúčaní, ak majú nahradiť alebo rozšíriť doménový bank.
