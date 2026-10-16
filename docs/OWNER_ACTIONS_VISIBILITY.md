# Akcie vlastníka — viditeľnosť (Search + AI)

Checklist mimo kódu webu. Entity description (používajte **všade rovnako**):

> AddValueEngineering (AVENG) — procesný self-audit a Fractional Technical Leadership pre výrobné MSP na Slovensku (Trenčín, Žilina, Trnava).

## Jednorazové nastavenie

- [ ] **Google Search Console** — domain property na `addvalueengineering.sk`
- [ ] Odoslať sitemap: `https://www.addvalueengineering.sk/sitemap.xml`
- [ ] Po väčšom update: požiadať o reindex kľúčových URL
- [ ] Staré URL (ak existovali) vrátiť **404** alebo **410**
- [ ] **Bing Webmaster Tools** — import z Google Search Console
- [ ] Po FTP deployi: `npx tsx scripts/indexnow.ts` (Bing/IndexNow; Google IndexNow nepoužíva)
- [ ] **Google Business Profile** — názov / adresa / telefón **presne** ako na webe:
  - AV – Agency, s. r. o. / AddValueEngineering
  - Zliechovská ulica 1117/110, 018 64 Košeca
  - +421 948 007 304
- [ ] **LinkedIn** firemná stránka + pravidelné príspevky (keď budú URL v `social.ts`)
- [ ] Adresáre: Finstat, Firmy.sk, Zoznam, Europages — konzistentná entity description
- [ ] 2–3 externé zmienky (hosťovský článok, odborný portál, podcast)

## Voliteľná analytika (cookieless)

V `.env` / hostingu nastaviť (default = vypnuté, žiadny skript v builde):

```
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible   # alebo umami
NEXT_PUBLIC_ANALYTICS_SCRIPT_URL=https://...
NEXT_PUBLIC_ANALYTICS_SITE_ID=...
```

Poskytovateľa a región hostingu rozhoduje vlastník. Po zapnutí sa zobrazí v zásadách ako sprostredkovateľ.

## Mesačná kontrola AI viditeľnosti

Otázky kupujúceho (10×) položte v **ChatGPT**, **Perplexity**, **Gemini** a **Google AI Mode**. Do tabuľky zapíšte: mentioned / cited / competitor.

| # | Otázka (príklad) | ChatGPT | Perplexity | Gemini | Google AI |
|---|---|---|---|---|---|
| 1 | Fractional engineering manager pre výrobné MSP Slovensko | | | | |
| 2 | Procesný self-audit výroby MSP Trenčín | | | | |
| 3 | Zavedenie ECO / zmenového konania EMS | | | | |
| 4 | PLM PDM procesy bez dodávky softvéru | | | | |
| 5 | Koučing majstrov manufacturing Slovakia | | | | |
| 6 | OEE COPQ orientačný audit MSP | | | | |
| 7 | AddValueEngineering Vladimir | | | | |
| 8 | Externný Head of Engineering MSP Žilina | | | | |
| 9 | Optimalizácia dokumentácie ERP robot MSP | | | | |
| 10 | Self-audit výrobných procesov zdarma | | | | |

Legenda buniek: `N` = named AVENG · `C` = cited s odkazom · `X` = konkurent · `-` = nič.

## Poznámky k llms.txt

Súbor `public/llms.txt` je na webe. Google uvádza, že takéto súbory **nepoužíva**; merateľný nárast citácií v AI nie je dokázaný. Nechávame ho ako voliteľný index stránok.
