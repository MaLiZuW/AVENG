# Odpovede vlastníka – štruktúrované (záväzné pre STEP 26)

Tento súbor je **záväzný zdroj** pre doplnenie návrhov v `docs/content-drafts/`. Pri rozpore s `QUESTIONS_FOR_OWNER.md` platí tento súbor. Čísla otázok zodpovedajú `QUESTIONS_FOR_OWNER.md`.

## 0. RULES FOR CURSOR (English)
- This file is authoritative. Use ONLY facts written here. Do not add facts, numbers, clients, tools, prices or claims.
- Output language: Slovak, short paragraphs, direct answer first.
- `Publikovať: NIE` or `NEPUBLIKOVAŤ` = must not appear anywhere public (pages, meta, schema, FAQ, PDF, e-mails, alt text, file names).
- `NEROZHODNUTÉ` or `—` = omit the dependent sentence or section and list the omission in your report.
- Do not read, copy or move anything from `docs/loga/` (certificate and logos). Do not copy anything into `public/`.
- Create `docs/content-drafts/GLOBAL_CHANGES.md` from section 4 (copy it verbatim). STEP 26 applies it.
- Do not change any file outside `docs/content-drafts/` while merging.

## 1. Globálne rozhodnutia

| Téma | Rozhodnutie |
|---|---|
| Sídlo (Q1) | Zliechovská ulica 1117/110, 018 64 Košeca. Schéma: `streetAddress` "Zliechovská ulica 1117/110", `postalCode` "01864", `addressLocality` "Košeca", `addressCountry` "SK" |
| Regióny (Q2) | Trenčín, Žilina, Trnava. **Morava sa nepoužíva nikde** |
| Veľkosť klienta (Q3) | 20 – 250 zamestnancov: schválené |
| Sektory (Q3) | automotive, EMS, strojárstvo, plasty, kovovýroba: schválené |
| Fotografia (Q4) | Nie. Žiadny obrázok osoby |
| Bio odsek (Q4) | Nepíše sa. `/o-nas/` iba z overených faktov z tohto súboru (pozri 2.6) |
| Sociálne siete (Q5) | Zatiaľ žiadne. `social.ts` prázdne, `sameAs` vynechať, žiadne ikony |
| BCTC (Q6) | Používať len text „BCTC certifikovaný business coach". Presný názov, inštitúcia a rok: **NEROZHODNUTÉ** (nepísať). Logá a certifikát: **NEPUBLIKOVAŤ** |
| Rezervácia (Q30) | URL neexistuje. `NEXT_PUBLIC_BOOKING_URL` nenastavovať, tlačidlá vedú na kontaktný formulár |
| Hodinová sadzba 80 €/hod (Q10, Q16, Q21, Q27) | **Publikovať: NIE.** Zmena na ÁNO len ak sem vlastník napíše: `Publikovať sumu: ÁNO` |
| Model ceny (Q10, Q16, Q21, Q27) | Publikovať: ÁNO, bez sumy: „Cena vychádza z hodinovej sadzby, prípadne z odmeny viazanej na vopred dohodnuté ciele. Presný rozsah a cena sú v ponuke." |
| Záväzok (Q11) | Žiadny minimálny záväzok. Podmienky vrátane výpovednej lehoty sa dohodnú v ponuke |
| Starter balík (Q26) | Neexistuje. Nepísať |
| FAQ Level 2 (Q28) | Level 2 = rozpis po otázkach, prioritizácia podľa finančného dopadu, podklad na poradu majiteľov. Neslubovať OEE ani COPQ rozklad |
| FAQ retencia (Q29) | Neutrálne znenie, kým `RETENTION_JOB_VERIFIED` nie je true |
| Claimy na `/o-nas/` (Q31) | „15+ rokov" a „až 35 inžinierov": schválené |
| Platba L2/L3 (Q32) | Bankový prevod na základe faktúry. Platobné údaje sa posielajú e-mailom spolu s prístupovým kódom. Online platba (Stripe): nie. **Nepoužívať frázu „po úhrade"** |

## 2. Stránky

### 2.1 Fractional Technical Leadership (Q7 – Q12)
- Rozsah: typicky 4 stretnutia po 2 hodiny mesačne (spolu približne 8 hodín mesačne), upraviteľné dohodou. Nepoužívať pojmy FTE ani „dni v mesiaci".
- Zoznam deliverables v cene: **NIE.** Sekciu „Čo dostanete" nepísať ako zoznam výstupov. Namiesto nej sekcia „Ako spolupráca prebieha":
  1. Konverzácia s majiteľom.
  2. Analýza stavu.
  3. Diskusia o ďalších krokoch.
- Cenový model a záväzok: podľa riadkov v sekcii 1.
- Skúsenosti z praxe: sekcia 3.

### 2.2 Zavádzanie procesov a PLM/PDM (Q13 – Q16)
- Zameranie len na procesy. Nedodávam ani nekonfigurujem softvér.
- Žiadna konkrétna PLM/PDM platforma sa neuvádza ani nenaznačuje.
- Rozsah a dĺžka: podľa požiadavky.
- Cena: ponuka + hodinová sadzba (suma NEPUBLIKOVAŤ, pozri sekciu 1).

### 2.3 Riadenie zmien a ECO (Q17 – Q19)
- Šablóny, checklisty a KPI: podľa požiadavky, na projekt. Žiadny konkrétny zoznam.
- Dĺžka a cenník: podľa požiadavky, na projekt.
- Nástroje a systémy (ERP, PLM): neuvádzať žiadne.

### 2.4 Rozvoj lídrov a koučing (Q20, Q21)
- Formát: individuálny aj skupinový.
- Program: 5 – 6 stretnutí, 1 – 2-krát mesačne, inak dohodou.
- Cena: hodinová sadzba (suma NEPUBLIKOVAŤ).

### 2.5 Optimalizácia a AI (Q22 – Q25)
- Konkrétny stack ani nástroje: neuvádzať.
- Hranica služby: navrhujem riešenia. Implementácia až po samostatnej dohode.
- Samostatná služba alebo doplnok, cenník: **NEROZHODNUTÉ.** Nepísať samostatný balík ani cenník.
- Anonymizovaný príklad: automatizácia správy dokumentácie, schvaľovacie slučky a nahrávanie dokumentácie do ERP pomocou robota. Bez čísel. Neoznačovať ako „AI".

### 2.6 `/o-nas/` (Q4, Q6, Q31)
- Overené fakty, ktoré smú byť použité: 15+ rokov praxe v EMS inžinierstve, vedenie tímu až 35 inžinierov, BCTC certifikovaný business coach, práca s majiteľmi výrobných MSP v regiónoch Trenčín, Žilina, Trnava.
- Bez fotky, bez osobného životopisu, bez mena zamestnávateľov, bez priezviska.
- Prístup k práci: len z textu v sekciách 2.1 až 2.5.

### 2.7 Prehľad služieb, FAQ a audit (Q26 – Q30)
- Prehľad služieb: štyri piliere + Optimalizácia a AI + self-audit. Bez starter balíka a bez cien.
- FAQ: podľa sekcie 1 (Level 2, retencia, platba, rezervácia).
- Platba za Level 2/3, text na kartách (verbatim): „Prístupový kód vám zašleme e-mailom spolu s údajmi na úhradu (prevodom na základe faktúry)."

## 3. Skúsenosti z praxe (Q12, Q25) – verzia na zverejnenie

Nadpis sekcie: „Vybrané skúsenosti z praxe". **Nie „Referencie klientov"** a **nie „Prípadové štúdie AVENG"**: ide o skúsenosti z predchádzajúcej praxe, nie o zákazky AVENG.

Povolené položky (bez čísel, bez mien, bez veľkosti organizácie):
1. Zavedenie procesu zmenového konania (ECO) a podporného nástroja v elektronickej zákazkovej výrobe (EMS).
2. Zriadenie interného tooling laboratória v EMS výrobe. (Vlastník overí význam pojmu „tooling lab" pred publikovaním.)
3. Zavedenie systému správy dokumentácie v EMS výrobe.
4. Automatizácia schvaľovacích tokov a nahrávania dokumentácie do ERP pomocou robota.

**NEPUBLIKOVAŤ nikde:** žiadne sumy úspor v eurách, ročné úspory, počet závodov, označenia typu „globálny líder", názov alebo opis zamestnávateľa a akékoľvek čísla z pôvodnej odpovede 12. Dôvod: ide o údaje z pôsobenia u súčasného zamestnávateľa, ktoré by identifikovali vlastníka a môžu byť dôverné. Zmena je možná iba ak vlastník sem výslovne napíše: `Publikovať čísla: ÁNO` a uvedie, ktoré.

## 4. GLOBAL CHANGES (pre STEP 26)

1. Odstrániť „Morava", „Morave", „Moravu" a „Moravy" zo všetkých verejných textov, meta popisov, FAQ a štruktúrovaných dát (`areaServed`). Konkrétne:
   - meta popis `/o-nas/`, verbatim SK: „Vladimir, Fractional Engineering Manager s koučingom: technické vedenie a procesný audit pre výrobné MSP na Slovensku."
   - štítok v hero: „Regióny: TN · ZA · TT"
   - sekcia „Lokálny partner": Trenčín, Žilina, Trnava
2. Adresa sídla podľa sekcie 1 vo všetkých miestach, kde sa používa (`company.ts`, pätička, zásady, schéma).
3. Sociálne odkazy a `sameAs`: nezobrazovať.
4. Logá a certifikát BCTC: nepoužiť, nekopírovať do `public/`.
5. Karty Level 2/3: použiť verbatim text z 2.7. Zakázané „po úhrade".
6. Ceny: žiadna suma nikde. Model podľa sekcie 1.
7. `NEXT_PUBLIC_BOOKING_URL` nenastavovať. Tlačidlá vedú na `/kontakt/?predmet=...`.
8. Kontrola po zmenách: `Select-String -Path src,public,docs/content-drafts -Pattern "Morav|80 €|80 EUR|50 000|10 000|23 fabr|global leader" -Recurse` nesmie nájsť nič vo verejných súboroch (zdroj `QUESTIONS_FOR_OWNER.md` sa nepočíta).

## 5. Čo ostáva rozhodnúť vlastníkovi (nevypĺňa Cursor)
- Q5 sociálne siete (ďalšia fáza marketingu).
- Q6 presný názov, inštitúcia a rok BCTC, a či smie byť použité logo.
- Q24 samostatná služba alebo doplnok a cenník pre Optimalizáciu a AI.
- Q30 rezervačný odkaz.
- Zverejnenie sumy 80 €/hod (predvolene NIE).
- Význam pojmu „tooling lab" v bode 3.2.
