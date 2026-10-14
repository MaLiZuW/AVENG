# Level 2 — chýbajúce vstupy pre OEE / COPQ bloky (STEP 23)

## OEE = Dostupnosť × Výkon × Kvalita

Blok sa zobrazí **len** pri troch **presných číselných** vstupoch (Availability, Performance, Quality).

V dátach otázok dnes:

| Potrebný vstup | Stav v repozitári |
|---|---|
| Dostupnosť (Availability) % | L2-P2-Q1a — len kvalitatívne A–E, **bez** `NUMERIC_INPUT` |
| Výkon (Performance) % | L2-P2-Q1b — len A–E |
| Kvalita (Quality) % | L2-P2-Q1c — len A–E |
| OEE celkom | L1-P2-Q1 — NUMERIC_INPUT + `kpiKey: oee_pct` (celkové OEE, nie A×P×Q) |

**Záver:** OEE dekompozíciu nezobrazujeme a **neodhadujeme**. Published referencia OEE ostáva v KPI tabuľke pri exact OEE %.

## COPQ % tržieb

| Vstup | Stav |
|---|---|
| COPQ % tržieb | L1-P3-Q2 — NUMERIC_INPUT + `kpiKey: copq_pct_of_sales` |

Blok COPQ sa zobrazí, keď používateľ zadal presné číslo (`numericOverrideValue`) na tejto otázke. Po `startLevel(2)` sa L1 odpovede mažú — na čistom L2 behu blok typicky nie je.

## TODO(owner)

Doplniť NUMERIC_INPUT (s jednotkou %) pre A / P / Q na L2, ak má byť OEE dekompozícia súčasťou dodávky za 290 €.
