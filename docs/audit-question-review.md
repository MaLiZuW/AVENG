# Revízia otázok — zmiešané konštrukty (návrh)

Texty otázok a odpovedí v kóde sa **nemenili**. Nižšie sú len návrhy pre vlastníka. Škála 0/4/6/8/10 ostáva. Interné ID procesov ostávajú P1–P5; na obrazovke a v reporte sú štítky D1–D5 z jednej mapy `DOMAIN_DISPLAY_LABEL` v `src/config/audit-display.ts` (zrkadlo v `supabase/functions/send-audit-report/_shared.ts`).

Zmiešaný konštrukt: jedna karta A–E vyžaduje dve veci, ktoré firma môže mať každú zvlášť. Odpoveď potom nemeria to, na čo sa pýta otázka.

## Úpravy metadát `methodology` (tento krok)

Čísla noriem a klauzúl bez podkladu v repozitári sú preč. Namiesto nich je vecný opis metódy. Texty otázok a kariet sa nemenili.

| ID | Pôvodné | Nové |
|---|---|---|
| L1-P3-Q3 | ISO 9001 – riadenie nezhôd a nápravné opatrenia | Kontrolný plán – kritické charakteristiky |
| L1-P5-Q1 | WCM – People Development; ISO 9001 | WCM – matica kompetencií |
| L1-P5-Q2 | WCM – People pillar; ISO 45001 | Miera absencie |
| L1-P3-Q1 zobrazenie pásma | `< 233 (6σ)` a benchmark `<233 (6σ)` | `< 233` a `<233` (body 0/4/6/8/10 sa nemenili) |
| L2-P1-Q1a | Lean Takt Time Calculation / VDA 6.3 P4 | Lean – takt zákazníka |
| L2-P1-Q2b | FIFO / Pull Replenishment / VDA 6.3 P4 | Lean – FIFO a Kanban |
| L2-P1-Q4a | Firefighting Pareto Analysis / VDA 6.3 P4 | Lean – príčiny preplánovania |
| L2-P2-Q2b | CMMS Spare Parts Management / VDA 6.3 P6 | Riadenie náhradných dielov |
| L2-P2-Q3c | MTTR / MTBF Indicators / ISO 55000 | MTTR a MTBF |
| L2-P3-Q1a | SPC (Statistical Process Control) / ISO 22514 | SPC – indexy spôsobilosti |
| L2-P3-Q1b | Poka-Yoke Master Sample Verification / VDA 6.3 P6 | Poka-Yoke – skúška étalonom |
| L2-P3-Q1c | Barcode Traceability / IATF 16949 | Sledovateľnosť šarží a kusov |
| L2-P3-Q2b | Rework Authorization / VDA 6.3 P6 | Schvaľovanie prepracovania |
| L2-P3-Q2c | Non-Conforming Product Quarantine / ISO 9001 | Karanténa nezhodných dielov |
| L2-P3-Q3a | PFMEA to Control Plan Alignment / IATF 16949 | Prepojenie FMEA a kontrolného plánu |
| L2-P3-Q3b | MSA (Measurement System Analysis) / ISO 10012 | Kalibrácia a MSA |
| L2-P3-Q4a | 8D Problem Solving Methodology / VDA 6.3 P7 | 8D – rýchlosť reakcie na reklamáciu |
| L2-P4-Q1a | Logistics Time-Slot Management / VDA 6.3 P5 | Lean – časové okná expedície |
| L2-P4-Q4a | Supplier Scorecard / VDA 6.3 P5 | Hodnotenie dodávateľov |
| L2-P4-Q4b | Skip-Lot Inspection / ISO 2859 | Vstupná kontrola podľa rizika dodávateľa |
| L2-P4-Q4c | Supplier Process Audit / VDA 6.3 P5 | Procesný audit dodávateľov |
| L2-P5-Q1b | Training Needs Analysis (TNA) / ISO 9001 Clause 7.2 | Plán vzdelávania z medzier v matici |
| L2-P5-Q2a | Absenteeism Pareto / ISO 45001 | Vyhodnotenie absencie |
| L2-P5-Q2b | Ergonomic Assessment (EAWS / REBA / NLE) / ISO 45001 | Ergonomický audit pracovísk |
| L3-P1-Q1a-i (seed) | Lean Takt Time / VDA 6.3 P4 | Lean – takt zákazníka |
| L3-P1-Q1a-iii (seed) | ISO/IEC 33020 PA 4.1 / Operational Agility | Meranie reakčnej doby na zmenu taktu |
| L3-P1-Q1b-iii (seed) | Andon Escalation / VDA 6.3 P4 | Lean – eskalácia odchýlky |

Odvodené L3 otázky preberajú `methodology` rodiča L2 a dopĺňajú ` / 6M …`. Pregenerované sú `scripts/generate-l3.mjs` → `src/lib/audit/level3-questions.generated.ts`.

V texte otázky a v karte D ostáva „VDA 6.3 P5“ pri L2-P4-Q4c (a v L3 vetách, ktoré citujú túto otázku). To nie je metadáta. Návrh, ak sa texty budú meniť: otázka „Vykonávajú sa u kľúčových dodávateľov procesné audity?“ Karta D: „Štandardizovaný procesný audit dodávateľa s overením nápravných opatrení.“

## Level 1

### L1-P1-Q1 (presnosť plánu)

| Karta | Problém | Návrh |
|---|---|---|
| E | „plán plníme prakticky vždy“ a zároveň „systém je predvídateľný a digitálne riadený“ | „Plán plníme prakticky vždy; odchýlky sú výnimočné a riadené.“ Digitalizáciu dať do samostatnej otázky. |

### L1-P1-Q2 (pull / Kanban)

Otázka je o ťahu. Karty miešajú plán, hodinové sledovky, rannú operatívu, Kanban a IoT.

| Karta | Problém | Návrh |
|---|---|---|
| A | ad-hoc plán + neplnenie cieľov + chýbajúci hodinový výkon | „Výroba ide push alebo ad-hoc, bez ťahu zákazníka.“ |
| B | ručné ciele + papier na konci zmeny + spätné odchýlky | „Ťah je len neformálny, bez štandardu.“ |
| C | Excel + hodinové sledovky + ranná operatíva | „Čiastočný pull v tabuľke, bez uzavretého signálu.“ |
| D | fyzický Kanban + vizuálne sledovky + okamžitá analýza odchýlok | „Fyzický Kanban alebo pull, signál sa dodržiava.“ |
| E | digitálny Pull/MES + IoT zber + uzavretá slučka | „Digitálny pull viazaný na skutočnú spotrebu.“ |

### L1-P1-Q3 (lead time v dňoch)

| Karta | Problém | Návrh |
|---|---|---|
| A | veľmi dlhý a zároveň nestabilný, zákazky sa strácajú vo fronte | „Lead time je veľmi dlhý.“ |
| D | krátky a zároveň predvídateľný, fronty sú riadené | „Lead time je krátky.“ |
| E | minimalizovaný, stabilný a plynulý end-to-end | „Lead time je veľmi krátky.“ |

### L1-P1-Q4

Karty A–E držia jeden konštrukt: podiel núdzového preplánovania. Úprava nie je potrebná.

### L1-P2-Q1 (OEE)

Otázka pýta namerané OEE. Karty miešajú výšku OEE s meraním, TPM a digitalizáciou.

| Karta | Problém | Návrh |
|---|---|---|
| A | prestoje alebo pomalý chod + chýba prehľad o stratách | „OEE je veľmi nízke.“ |
| B | nízka efektivita + neúplné meranie | „OEE je nízke.“ |
| C | „typické slovenské MSP“ + meriame základné ukazovatele | „OEE je v strednom pásme.“ |
| D | dobrá efektivita + straty sa systematicky sledujú a znižujú | „OEE je dobré.“ |
| E | svetová špička + straty minimalizované + digitalizované | „OEE je veľmi vysoké.“ |

### L1-P2-Q2 (plnenie plánu PM)

| Karta | Problém | Návrh |
|---|---|---|
| E | prediktívna údržba a zároveň plne plánovaná disciplína PM | „Plán preventívnej údržby plníme takmer vždy.“ Predikciu nechať v L2-P2-Q2c. |

### L1-P2-Q3

Karty A–E držia podiel neplánovaných prestojov. Úprava nie je potrebná.

### L1-P2-Q4 (root-cause)

| Karta | Problém | Návrh |
|---|---|---|
| E | uzavretý Kaizen cyklus s overením účinnosti, nie len 5× Why / Fishbone | „Root-cause (5× Why alebo Fishbone) robíme pri významných poruchách štandardne.“ |

### L1-P3-Q1 (DPMO)

| Karta | Problém | Návrh |
|---|---|---|
| C | „bežné MSP“ + niektoré procesy sú stabilnejšie | „Chybovosť je stredná.“ |
| E | nízka chybovosť + proces je štatisticky riadený | „Chybovosť je veľmi nízka.“ |

### L1-P3-Q2 (COPQ)

| Karta | Problém | Návrh |
|---|---|---|
| B | vysoké náklady + „sústredene ich neriešime“ | „Náklady nekvality sú vysoké.“ |
| C | „typické pre slovenské MSP“ + čiastočné sledovanie | „Náklady nekvality sú stredné.“ |
| D | relatívne nízke + systematicky znižované | „Náklady nekvality sú nízke.“ |
| E | minimálne náklady + prevencia zabudovaná do procesu | „Náklady nekvality sú veľmi nízke.“ |

Reklamácie v tejto otázke nie sú. Tie ostávajú v L1-P3-Q4.

### L1-P3-Q3 (kontrolný plán)

| Karta | Problém | Návrh |
|---|---|---|
| D | plán na dielni + eskalácia odchýlok | „Kontrolný plán je na dielni a dodržiava sa.“ |
| E | prepojenie na SPC + digitálny zber | „Kontrolný plán pokrýva kritické znaky a je aktuálny.“ |

### L1-P3-Q4 (PPM reklamácií)

| Karta | Problém | Návrh |
|---|---|---|
| D | zriedkavé reklamácie + uzavretá root-cause | „Reklamácie sú zriedkavé.“ |
| E | výnimočné reklamácie + fungujúci systém prevencie | „Reklamácie sú výnimočné.“ |

### L1-P4-Q1

Karty A–E držia spoľahlivosť dodania načas. Úprava nie je potrebná.

### L1-P4-Q2 (obráťkovosť)

| Karta | Problém | Návrh |
|---|---|---|
| D | dobrá obrátkovosť + riadenie podľa dopytu | „Obrátkovosť zásob je dobrá.“ |
| E | špičková obrátkovosť + štíhly tok materiálu | „Obrátkovosť zásob je veľmi vysoká.“ |

### L1-P4-Q3 (VSM)

| Karta | Problém | Návrh |
|---|---|---|
| E | živý alebo digitálny VSM + prepojenie na operatívne riadenie | „VSM aktualizujeme priebežne.“ |

### L1-P4-Q4 (kompletnosť a presnosť dodávateľov)

| Karta | Problém | Návrh |
|---|---|---|
| A | meškanie (OTD) alebo nekompletná dodávka | „Dodávky sú často nekompletné alebo nepresné.“ |
| C | väčšinou v poriadku + čiastočné sledovanie rizík | „Dodávky sú väčšinou kompletné a presné.“ |
| D | spoľahlivosť + záložný plán kritických položiek | „Dodávky sú spoľahlivo kompletné a presné.“ |
| E | vysoká spoľahlivosť + vizuálne riadenie reťazca | „Dodávky sú takmer vždy kompletné a presné.“ |

### L1-P5-Q1 (matica kompetencií)

| Karta | Problém | Návrh |
|---|---|---|
| A | nemapované kompetencie + náhodný rozvoj lídrov | „Matica kompetencií neexistuje.“ |
| E | kompetencie aj rozvoj lídrov strategicky riadené a merané | „Matica je aktuálna a používa sa pri plánovaní zmien a školení.“ |

### L1-P5-Q2 (absencia)

| Karta | Problém | Návrh |
|---|---|---|
| C | „typická pre MSP“ + chýbajú kritické pozície (to je zastupiteľnosť) | „Miera absencie je stredná.“ |
| D | absencia pod kontrolou + zastupiteľnosť funguje | „Miera absencie je nízka.“ |
| E | nízka absencia + odolnosť výroby voči výpadkom | „Miera absencie je veľmi nízka.“ |

### L1-P5-Q3 (počet návrhov na zamestnanca)

| Karta | Problém | Návrh |
|---|---|---|
| B | málo návrhov + často bez realizácie | „Zlepšovacích návrhov je málo.“ |
| C | existuje systém + stredná aktivita | „Zlepšovacích návrhov je stredný počet.“ |
| D | živá kultúra + pravidelná realizácia | „Zlepšovacích návrhov je veľa.“ |

Realizáciu a odmenu merajú L2-P5-Q3b a L2-P5-Q3c.

### L1-P5-Q4 (viaczručnosť)

| Karta | Problém | Návrh |
|---|---|---|
| D | viac vyškolených ľudí na kritických staniciach + rotácia funguje | „Kritické stanice ovláda viacero ľudí.“ |
| E | viaczručnosť + pravidelná rotácia na celej dielni | „Väčšina ľudí ovláda viac ako tri stanice.“ |

Rotáciu nechať v L2-P5-Q4b. Číselné mapovanie skóre 10 pri rotácii sa v tomto kroku nemenilo.

## Level 2

| ID | Karta | Problém | Návrh |
|---|---|---|---|
| L2-P1-Q1a | D | Heijunka a zároveň adaptácia v ERP | „Ciele zmeny sú prepočítané z taktu a priebežne upravené.“ |
| L2-P1-Q1a | E | prepojenie v MES a zároveň takt v reálnom čase | „Ciele zmeny sa prepočítavajú z aktuálneho taktu zákazníka.“ |
| L2-P1-Q1b | E | zber z PLC/IoT a zároveň prediktívne varovanie | „Hodinový výkon sa zbiera zo stroja automaticky.“ |
| L2-P1-Q1c | E | uzavretý PDCA a zároveň automatické sledovanie v CRM/MES | „Odchýlky majú opatrenie, termín a kontrolu splnenia.“ |
| L2-P1-Q2a | E | senzorový monitoring a zároveň automatická blokácia prísunu | „Pri max limite pufra sa ďalší prísun zastaví.“ |
| L2-P1-Q2b | E | AGV/AMR a zároveň e-Kanban | „Dopĺňanie ide len na signál spotreby, bez tlačenia dávok.“ |
| L2-P2-Q2a | E | digitálna aplikácia autonómnej údržby a zároveň prepojenie na plán údržby | „Autonómna údržba beží podľa štandardu pred každou zmenou.“ |
| L2-P2-Q2b | E | automatické objednávanie a zároveň VMI/e-procurement | „Pri poklese pod minimum sa náhradný diel objedná sám.“ |
| L2-P2-Q2c | E | IoT senzory a zároveň AI predikcia | „Na kritických strojoch beží priebežná diagnostika stavu.“ |
| L2-P2-Q3a | E | IoT kódy prestojov a zároveň vyčíslenie straty | „Prestoje sú zatriedené podľa šiestich veľkých strát.“ |
| L2-P2-Q3c | E | monitoring MTTR/MTBF a zároveň odmeny údržby | „MTTR a MTBF sa sledujú a majú cieľ.“ |
| L2-P2-Q4a | E | automatický 8D tiket pri limite prestoju (iný nástroj než 5Why/Ishikawa) | „Väčšia porucha má povinný písomný rozbor príčiny.“ |
| L2-P3-Q1a | A | Cpk sa nemeria a zároveň „proces je nestabilný“ | „Indexy spôsobilosti sa nemerajú.“ |
| L2-P3-Q1a | D | vysoká spôsobilosť a zároveň regulačné karty | „Indexy spôsobilosti kritických znakov sú vysoké.“ |
| L2-P3-Q1a | E | špičková spôsobilosť, automatické SPC a „úroveň 6 Sigma“ | „Indexy spôsobilosti sú veľmi vysoké.“ Škálu neoznačovať ako škálu normy. |
| L2-P3-Q1c | E | sériová sledovateľnosť každého kusu a zároveň parametre procesu | „Každý kritický kus sa dá dohľadať k šarži vstupu.“ |
| L2-P3-Q2a | D | online zaúčtovanie na zákazku a stroj a zároveň Pareto | „Zmetok sa eviduje denne na stroj a typ chyby.“ |
| L2-P3-Q2a | E | stratený materiál a zároveň strojný čas | „Náklad zmetku sa počíta z materiálu.“ Čas dať do samostatnej karty, ak má váhu. |
| L2-P3-Q3b | C | platná kalibrácia všetkých meradiel a zároveň MSA na kritickom meraní | Otázka sama mieša kalibráciu a MSA. Rozdeliť na dve otázky, alebo kartu zúžiť na to, čo otázka po rozdelení meria. |
| L2-P3-Q4a | E | online portál so statusom (kanál) namiesto disciplíny 8D | „Všetky kroky 8D sú v termíne a príčina je overená.“ |
| L2-P3-Q4c | D | priradenie nákladu na stredisko a zároveň zrážka mzdy alebo bonusu | „Náklad reklamácie ide na zodpovedné stredisko.“ Mzdu neriešiť v tej istej karte. |
| L2-P4-Q1a | E | automatický slotting a zároveň GPS kamiónov | „Nakládka má presné časové okno a dodržiava sa.“ |
| L2-P4-Q1c | D | vizuálny manažment baliaceho miesta a zároveň fotodokumentácia | „Balenie sa pred expedíciou kontroluje voči predpisu.“ |
| L2-P4-Q2a | D | účtovné rezervy na ležiaky a zároveň aktívny odpredaj | „Ležiaky sa mesačne pomenujú a majú plán vysporiadania.“ |
| L2-P4-Q2c | D | vysoká presnosť a zároveň čiarové kódy | „Stav v evidencii sedí s fyzickým stavom.“ |
| L2-P4-Q2c | E | WMS a zároveň okamžitý odpis | „Stav v evidencii sedí s fyzickým stavom aj pri priebežnom pohybe.“ |
| L2-P4-Q3c | D | spádové regály a zároveň Kanban (iný systém než rytmus Milkrun) | „Milkrun jazdí v pevnom intervale.“ |
| L2-P4-Q3c | E | automatický Milkrun a zároveň e-Kanban bez človeka | „Zásobovanie linky ide v pevnom rytme podľa spotreby.“ |
| L2-P4-Q4a | D | množstevné aj kvalitatívne KPI z ERP (otázka menuje aj cenu) | „Dodávatelia majú pravidelný prehľad OTD a kvality.“ Cenu, ak ostane v otázke, držať v každej karte rovnako, alebo ju z otázky vybrať. |
| L2-P4-Q4a | E | online portál v reálnom čase a zároveň penalizácia | „Hodnotenie dodávateľa sa počíta z evidencie pravidelne.“ |
| L2-P4-Q4b | E | Free-to-Stock a zároveň zmluvy QA a audity | „Overený dodávateľ ide do výroby bez kusovej vstupnej kontroly.“ |
| L2-P4-Q4c | D | „VDA 6.3 P5“ a zároveň verifikácia nápravných opatrení | „Procesný audit dodávateľa má plán a overenie nápravných opatrení.“ Číslo normy v karte neuvádzať. |
| L2-P5-Q1a | D | viacstupňová matica a zároveň plán rotácie | „Vizuálna matica na dielni ukazuje stupeň spôsobilosti.“ |
| L2-P5-Q1a | E | digitálna matica a zároveň dochádzka a plánovanie | „Matica na pracovisku je aktuálna a používa sa pri obsadení zmeny.“ |
| L2-P5-Q1b | E | individuálny plán a zároveň ROI školení | „Plán školení vychádza z medzier v matici.“ |
| L2-P5-Q2a | E | online dashboard a zároveň predikcia výpadku zmeny | „Absencia sa týždenne číta po strediskách a príčinách.“ |
| L2-P5-Q2c | D | odhalenie príčiny a zároveň úprava podmienok | „Po dlhšej absencii prebehne štruktúrovaný návratový rozhovor.“ |
| L2-P5-Q2c | E | systém zdravia firmy a zároveň lekár | „Po dlhšej absencii je návrat dohodnutý a zaznamenaný.“ |
| L2-P5-Q3a | E | každý operátor sám realizuje Kaizen (otázka je o systéme podania) | „Návrh sa dá podať na dielni v krátkom formulári.“ |
| L2-P5-Q3c | C | fixná odmena a zároveň podiel z úspory | „Za prijatý návrh je dopredu známa odmena.“ |
| L2-P5-Q4b | D | plánovaná rotácia a zároveň striedanie ťažkej a ľahkej práce | „Operátori sa počas zmeny alebo týždňa plánovane striedajú.“ |
| L2-P5-Q4b | E | automatický plán rotácie a zároveň podmienky linky | „Rotácia má plán a v zmenách sa dodržiava.“ |
| L2-P5-Q4c | E | stupeň viaczručnosti a zároveň tarifná trieda a plat | „Je plán, kto a dokedy získa ďalšiu stanicu.“ |

Ostatné karty L2 držia jeden konštrukt tej otázky.

## Level 3

Šesť ručne zadaných otázok (seed) a 174 odvodených otázok zo skriptu.

Odvodené karty majú rovnaký vzor. Platí pre každú odvodenú L3 otázku:

| Karta | Problém | Návrh vzoru |
|---|---|---|
| D | „disciplína je dobrá“ a zároveň „systematicky riadené a merané“ | „Oblasť je riadená podľa štandardu.“ Meranie nechať karte, ktorá sa pýta na meranie. |
| E | „digitálne prepojené“ a zároveň „kontinuálne zlepšované“ | „Štandard sa dodržiava a odchýlka má nápravu.“ Digitalizáciu nespájať so zrelosťou, ak otázka nie je o nástroji. |

Karty A–C odvodených otázok miešajú menej: A je absencia systému, B je neformálna prax, C je základný štandard s rezervou.

Seed, kde sa miešajú dva konštrukty:

| ID | Karta | Problém | Návrh |
|---|---|---|---|
| L3-P1-Q1a-ii | E | expert na APS a zároveň priebežný koučing tímu | „Plánovači vedia vyrovnávať mix a objem a robia to v pláne.“ |
| L3-P1-Q1a-iii | D | reakcia pod 24 hodín a zároveň zmeraný dopad na WIP | „Reakčná doba na zmenu taktu je stabilne krátka.“ |
| L3-P1-Q1b-i | E | IoT snímače a zároveň cloudový DTO dashboard | „Úzke miesto počíta kusy automaticky do evidencie.“ |

## Porovnanie s „typickým slovenským MSP“ v kartách

Tieto vety nie sú priemer slovenských MSP. V kóde ostali, lebo tento krok nemení texty kariet. Návrh je vybrať ich:

- L1-P2-Q1 C, L1-P3-Q1 C, L1-P3-Q2 C, L1-P4-Q2 C, L1-P5-Q2 C
- L2-P2-Q1a C („typického slovenského MSP“), L2-P2-Q1c C („štandardnej úrovni FPY pre MSP“)

Náhrada je pásmo bez porovnania s krajinou, ako v návrhoch vyššie (stredné pásmo).

## Čo vlastník schvaľuje

Po schválení upraviť `optionLabels` v `src/lib/audit/questions.ts`, polia možností v `src/lib/audit/level2/p1.ts`–`p5.ts` a potom znova spustiť `scripts/generate-l3.mjs`. Škálu a výpočet nespájať s číslom normy.
