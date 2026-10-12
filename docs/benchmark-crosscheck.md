# Krížová kontrola referencií modelu a publikovaných rozsahov

Skóre S_SME a S_WC sú skóre zrelosti procesu, nie hodnoty KPI. Priame porovnanie s publikovanými rozsahmi je len orientačné. Žiadna hodnota modelu sa nemení.

Čísla pochádzajú z `getProcessBenchmarks()` v `src/lib/audit/benchmarks.ts`. Vstupom sú sektorové KPI v `SECTORS` v tom istom súbore. Funkcia ich oreže na interval 30–99,5 a zaokrúhli na jedno desatinné miesto:

- P1: S_SME = 72 × (OTD MSP / 88), S_WC = 95 × (OTD špička / 98,5)
- P2: S_SME a S_WC sú priamo sektorové OEE
- P3: S_SME = 100 − COPQ MSP × 3,6, S_WC = 100 − COPQ špička × 6
- P4: S_SME a S_WC sú priamo sektorové OTD
- P5: S_SME = 100 − absencia MSP × 7, S_WC = 100 − absencia špička × 3,2

`SECTORS` obsahuje aj DPMO a obrátkovosť zásob. Do S_SME / S_WC sa neprenášajú, preto v tejto kontrole nie sú samostatná doména.

Publikované rozsahy sú v `src/config/benchmarks.reference.json` (kópia `docs/benchmarks/benchmarks.seed.json`). Stav zdroja modelových skóre P1–P5 ostáva `expert-estimate`. `published-secondary` platí len pre štyri kľúče KPI: `oee_pct`, `copq_pct_of_sales`, `otd_pct`, `schedule_adherence_pct`.

## Záver podľa domény

| Doména | Čo skóre v kóde je | S_SME cez odvetvia | S_WC cez odvetvia | Publikovaný rozsah | Záver |
|---|---|---|---|---|---|
| P1 Riadenie výroby a plánovanie | zrelosť odvodená z OTD, nie dodržiavanie plánu | 71,2–76,1 | 93,6–96 | prah dodávateľov 90–100 % (nie nameraný priemer) | nepodporené (expertný odhad) |
| P2 Údržba a dostupnosť zariadení | priamo sektorové OEE v % | 58–70 | 82–88 | typicky 60; diskrétna výroba 66–67; horný kvartil 75; špička 85 (podľa odvetvia 75–87) | podporené publikovanou hodnotou |
| P3 Kvalita a riadenie nezhôd | zrelosť prepočítaná z COPQ, nie % z tržieb | 74,8–85,6 | 92,8–97,6 | typicky 15 (rozsah 5–35); náklady súvisiace s kvalitou podľa ASQ 15–20; špička pod 5 | nepodporené (expertný odhad) |
| P4 Logistika a tok materiálu | priamo sektorové OTD v % | 87–93 | 97–99,5 | priemer 90–94; špička 95–99; OEM scorecard 98–99 | podporené publikovanou hodnotou |
| P5 Ľudské zdroje a kompetencie | zrelosť prepočítaná z absencie, nie kompetencie | 51–65 | 88,8–92 | publikovaná referencia nie je (`hr_skills.available` = false) | nepodporené (expertný odhad) |

P2 a P4 sú podporené preto, že skóre je tá istá veličina ako publikované KPI a väčšina odvetví leží v publikovanom pásme alebo tesne pri ňom. Pri P2 je potravinárstvo (S_SME 58) tesne pod typickou hodnotou 60 a elektronika / EMS (S_WC 88) tesne nad pásmom 75–87. Pri P4 sú kovospracovanie (S_SME 87), potravinárstvo a všeobecná výroba (S_SME 88) pod pásmom 90–94 a automobilový priemysel (S_WC 99,5) nad pásmom špičky 95–99. Porovnanie ostáva orientačné.

P1, P3 a P5 sú nepodporené, lebo skóre nie je publikované KPI. Pri P3 ani vstupné COPQ modelu (MSP 4–7 %, špička 0,4–1,2 %) nesedí s publikovaným typickým údajom okolo 15 % tržieb. Pri P5 verejný benchmark nie je.

## S_SME a S_WC po odvetviach

| Odvetvie | P1 SME | P1 WC | P2 SME | P2 WC | P3 SME | P3 WC | P4 SME | P4 WC | P5 SME | P5 WC |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Automobilový priemysel | 75,3 | 96 | 65 | 86 | 82 | 97 | 92 | 99,5 | 65 | 92 |
| Elektronika / EMS | 76,1 | 95,5 | 70 | 88 | 85,6 | 97,6 | 93 | 99 | 65 | 92 |
| Plasty a kaučuk | 73,6 | 95 | 63 | 86 | 78,4 | 95,2 | 90 | 98,5 | 58 | 90,4 |
| Potravinárstvo | 72 | 94,5 | 58 | 83 | 74,8 | 94 | 88 | 98 | 51 | 88,8 |
| Kovospracovanie a strojárstvo | 71,2 | 93,6 | 60 | 82 | 74,8 | 92,8 | 87 | 97 | 58 | 90,4 |
| Farmácia a chémia | 76,1 | 95,5 | 62 | 84 | 82 | 96,4 | 93 | 99 | 65 | 92 |
| Obaly a tlač | 73,6 | 95 | 60 | 83 | 78,4 | 94 | 90 | 98,5 | 58 | 90,4 |
| Všeobecná priemyselná výroba | 72 | 95 | 62 | 85 | 78,4 | 94 | 88 | 98,5 | 58 | 90,4 |

## Vstupné sektorové KPI v kóde

Tieto hodnoty model nepreberá z publikovaných zdrojov. P2 a P4 ich používajú priamo, P1, P3 a P5 až po vzorci vyššie.

| Odvetvie | OEE MSP | OEE špička | COPQ MSP | COPQ špička | OTD MSP | OTD špička | Absencia MSP | Absencia špička |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Automobilový priemysel | 65 | 86 | 5,0 | 0,5 | 92,0 | 99,5 | 5,0 | 2,5 |
| Elektronika / EMS | 70 | 88 | 4,0 | 0,4 | 93,0 | 99,0 | 5,0 | 2,5 |
| Plasty a kaučuk | 63 | 86 | 6,0 | 0,8 | 90,0 | 98,5 | 6,0 | 3,0 |
| Potravinárstvo | 58 | 83 | 7,0 | 1,0 | 88,0 | 98,0 | 7,0 | 3,5 |
| Kovospracovanie a strojárstvo | 60 | 82 | 7,0 | 1,2 | 87,0 | 97,0 | 6,0 | 3,0 |
| Farmácia a chémia | 62 | 84 | 5,0 | 0,6 | 93,0 | 99,0 | 5,0 | 2,5 |
| Obaly a tlač | 60 | 83 | 6,0 | 1,0 | 90,0 | 98,5 | 6,0 | 3,0 |
| Všeobecná priemyselná výroba | 62 | 85 | 6,0 | 1,0 | 88,0 | 98,5 | 6,0 | 3,0 |
