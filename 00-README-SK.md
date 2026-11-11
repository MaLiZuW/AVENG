# Podklady pre GitHub Copilot agenta: obsah a SEO webu AddValueEngineering (v2)

Stav: 11. 11. 2026. Cieľ: nasadiť schválený návrh (texty, SEO, štruktúra stránok, toky) bez zmeny brandingu.

## Čo je v balíku
| Súbor | Účel |
|---|---|
| `.github/copilot-instructions.md` | Stále pokyny pre všetky relácie Copilota v tomto repozitári |
| `docs/content-v2/GLOBAL-RULES.md` | Pravidlá platné pre všetky stránky |
| `docs/content-v2/pages/*.md` | Záväzný obsah každej stránky |
| `docs/content-v2/seo.json` | Title, description, frázy, schéma pre každú adresu |
| `docs/content-v2/REDIRECTS.md` | 301 presmerovania, sitemap, robots |
| `docs/content-v2/STRUCTURED-DATA.md` | JSON-LD (fáza 2) |
| `docs/content-v2/UX-ADDITIONS.md` | Drobečková navigácia, súvisiace projekty, mobilná výzva (fáza 3) |
| `docs/content-v2/PRIVACY-ADDITIONS.md` | Doplnky ochrany osobných údajov |
| `docs/content-v2/PROMPTS.md` | Hotové prompty na kopírovanie |
| `docs/content-v2/ACCEPTANCE.md` | Kontrolný zoznam pre vás |
| `docs/content-v2/reference/aveng-novy-web-nahlad-v2.html` | Náhľad schváleného návrhu (len obsah, nie dizajn) |
| `scripts/check-content.mjs` | Automatická kontrola výstupu `out/` |

## Postup (PowerShell)
1. Skontrolujte, že PR #1 je zmergovaný do `remediation`.
2. V priečinku repozitára:
   ```
   cd C:\dev\aveng-site-new
   git checkout remediation
   git pull
   ```
3. Rozbaľte ZIP do koreňa repozitára (zlúčiť priečinky `.github`, `docs`, `scripts`).
4. ```
   git add .github docs scripts
   git commit -m "docs: content v2 spec, Copilot instructions and content check"
   git push
   ```
5. GitHub → záložka **Agents** → vetva `remediation` → vložte **PROMPT 1** z `PROMPTS.md`.
6. Keď Copilot otvorí PR: skontrolujte **Files changed**, v PR musí byť výstup `check:content`. Potom **Merge**, `git pull` a ďalší prompt.
7. Poradie: Prompt 1 → 2 → 3 → (4 voliteľne) → 5. Po každom merge lokálne `npm run build`, potom FTP nasadenie (priečinok `out\`).

## Rozhodnutia, ktoré nie sú v balíku (sú vaše)
Cenové pásmo sprintu, sľub času odpovede, zber e-mailov, LinkedIn a Google Business Profile, nový `og-image.png`.

## Poznámky
- Texty sú z náhľadu v2, ktorý ste videli. Zmeny textu urobte najprv v `pages/*.md`, až potom ich dajte Copilotovi.
- Kontrolný skript je prísny: porovnáva title, description a H1 s týmito súbormi.
