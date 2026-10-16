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
