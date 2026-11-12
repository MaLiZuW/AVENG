# Dizajnový balík v2: postup krok za krokom

Cieľ: vizuálne a štrukturálne vylepšiť web podľa súčasných zásad (čitateľnosť, hierarchia, prístupnosť WCAG 2.2 AA, Core Web Vitals) bez zmeny brandingu.

## Čo je v balíku
| Súbor | Účel |
|---|---|
| `docs/design-v2/DESIGN-SPEC.md` | Záväzná dizajnová špecifikácia (v angličtine pre Copilota) |
| `docs/design-v2/PROMPTS-DESIGN.md` | Prompty S1, D1, D2, D3, D4 |
| `scripts/check-design.mjs` | Automatická kontrola štruktúry a prístupnosti v `out/` |
| `docs/design-v2/reference/navrh-vizualu.html` | Vizuálny náhľad schváleného návrhu (len orientačný) |

## Krok A (PowerShell, jednorazovo): nahrať balík do repozitára
Stiahnite ZIP z chatu (napr. do Stiahnutých súborov), potom:
```
cd C:\dev\aveng-site-new
git checkout remediation
git pull
Expand-Archive "$env:USERPROFILE\Downloads\aveng-design-pack.zip" -DestinationPath C:\dev\_design_tmp -Force
robocopy C:\dev\_design_tmp\aveng-design-pack . /E
npm pkg set "scripts.check:design=node scripts/check-design.mjs"
git status --short
git add -A
git commit -m "docs: design spec v2, prompts and design check"
git push
```
`robocopy` hlási kódy 1 až 3 ako úspech. Skontrolujte: `git ls-files docs/design-v2 scripts/check-design.mjs`.

## Krok B: poradie relácií v GitHub Agents
Zakaždým: Agents → AVENG → vetva `remediation` → nová relácia → vložiť prompt (blok medzi trojitými zvratkami) → odoslať. Keď Copilot otvorí PR, spravte lokálnu kontrolu (krok C), potom PR zmergujte a `git pull`.

| # | Prompt | Odkiaľ | Čo robí |
|---|---|---|---|
| 1 | **S1** | `docs/design-v2/PROMPTS-DESIGN.md` | Bezpečnostná aktualizácia Next 14.2.x, oprava `<img>` |
| 2 | **Prompt 2** | `docs/content-v2/PROMPTS.md` | Štruktúrované údaje JSON-LD |
| 3 | **D1** | `docs/design-v2/PROMPTS-DESIGN.md` | Základ: kontajner, typografia, tlačidlá, hlavička, pätička, prístupnosť |
| 4 | **D2** | `docs/design-v2/PROMPTS-DESIGN.md` | Komponenty a stránky (karty, kroky, bočný panel, kontakt) |
| 5 | **D3** | `docs/design-v2/PROMPTS-DESIGN.md` | Zjednotenie stránky Self-audit |
| 6 | **Prompt 3** | `docs/content-v2/PROMPTS.md` | Drobečky, súvisiace projekty, lepiace tlačidlo na mobile |
| 7 | **D4** (voliteľné) | `docs/design-v2/PROMPTS-DESIGN.md` | SVG ilustrácie |
| 8 | **Prompt 5** | `docs/content-v2/PROMPTS.md` | Záverečná kontrola |

Copilot v cloude nevie spustiť `npm run build`, preto mu to prompty zakazujú. Build a kontroly robíte vy.

## Krok C (PowerShell): lokálna kontrola po každom PR
Názov vetvy uvidíte v PR (napr. `copilot/…`):
```
cd C:\dev\aveng-site-new
git fetch
git checkout copilot/NAZOV-VETVY
git pull
npm ci
npm run build
npm run check:content -- --phase=1
npm run check:design
npx serve out
```
Číslo fázy v `check:content` zvýšte podľa toho, čo je zmergované (po Prompte 2 `--phase=2`, po Prompte 3 `--phase=3`). V prehliadači na `http://localhost:3000` skontrolujte vzhľad na šírke okna asi 1280 px a potom na úzkom okne (F12, ikona mobilu, 390 px). Servír zastavíte cez Ctrl+C. `npm ci` stačí spustiť po zmene balíkov (po S1).

## Krok D: zmergovanie a nasadenie
1. Na GitHube pri PR: **Ready for review** (ak je Draft) → **Merge pull request** → **Confirm merge**.
2. ```
   git checkout remediation
   git pull
   npm run build
   ```
3. Nahrajte obsah priečinka `out\` na FTP (záloha, zmazanie starého, nahratie vrátane `.htaccess`).
4. Po nasadení: PageSpeed Insights na `/`, `/sluzby/` a jednej projektovej stránke. Ciele: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms.

Nasadzovať môžete po každom zmergovanom PR alebo raz po D3. Odporúčam po D2 a po Prompte 3.

## Čo skript nehodnotí
`check:design` kontroluje štruktúru (landmarky, poradie nadpisov, aria-current, alt, CSS pravidlá). Skutočný kontrast, vzhľad a pohodlie na mobile musíte posúdiť okom a nástrojom (Lighthouse v Chrome DevTools).
