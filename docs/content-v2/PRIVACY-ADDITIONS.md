# Privacy policy additions (`/ochrana-osobnych-udajov/`)

Do not remove existing correct content. Add or merge the sections below in Slovak. Set "Posledná aktualizácia" to the merge date. This text is a working draft; the PR description must say it needs the owner's review (and legal review if available) before going live.

## Sections to add (text, verbatim)

### Na aké účely údaje spracúvame
- **Odpoveď na vašu správu.** Ak nám napíšete cez kontaktný formulár alebo e-mail, použijeme meno, e-mail, firmu a text správy na odpoveď a prípravu ponuky. Právny základ: opatrenia pred uzavretím zmluvy na vašu žiadosť, prípadne náš oprávnený záujem odpovedať na dopyt.
- **Self-audit.** Odpovede z auditu spracúvame na vyhodnotenie auditu. Uchovávame ich len po dobu nevyhnutnú na vyhodnotenie.
- **Objednávka Level 2 a Level 3, fakturácia a prístupový kód.** Na vystavenie faktúry a zaslanie prístupového kódu spracúvame fakturačné údaje a e-mail. Právny základ: plnenie zmluvy a plnenie zákonných povinností (účtovníctvo).
- **Ochrana právnych nárokov.** Ak je to potrebné, údaje použijeme na uplatnenie alebo obranu právnych nárokov (oprávnený záujem).

### Komu údaje poskytujeme
Údaje spracúvajú naši poskytovatelia služieb, ktorých potrebujeme na prevádzku webu: poskytovateľ hostingu (WebSupport), poskytovateľ databázy (Supabase) a poskytovateľ odosielania e-mailov (Resend). Údaje neposkytujeme na marketingové účely tretím stranám.

### Prenos údajov mimo Európskeho hospodárskeho priestoru
Niektorí poskytovatelia, napríklad služba na odosielanie e-mailov, môžu údaje spracúvať v Spojených štátoch. Prenos zabezpečujeme podľa kapitoly V nariadenia GDPR.

### Ako dlho údaje uchovávame
Údaje z kontaktných správ uchovávame po dobu nevyhnutnú na vybavenie dopytu a následnej komunikácie. Doklady uchovávame po dobu stanovenú právnymi predpismi. Odpovede z auditu uchovávame len po dobu nevyhnutnú na vyhodnotenie.

### Cookies
Include this sentence ONLY if you verified in the code that the site sets no analytics/marketing cookies and loads no third-party tracking scripts: „Web nepoužíva analytické ani marketingové cookies.“ If anything else is found, do not add the sentence and list the finding in the PR.

## Rules for the implementer
- Keep existing sections about data controller, data subject rights and the right to complain to the Úrad na ochranu osobných údajov SR. If they are missing, add them in standard wording and flag it in the PR.
- Do not invent processors, retention periods in years, or legal bases that are not written above.
- Link to the policy from the contact form consent text, the audit consent text and the footer (verify existing links).

## Flag in the PR description for the owner
1. Confirm the retention wording against the actual deletion job (the cron that deletes audit answers) and adjust the sentence on audit answers if the real period is different.
2. Confirm the transfer mechanism for Resend (US) in their data-processing terms.
3. Confirm whether the company is VAT-registered (IČ DPH) so the footer/legal line can be completed. Do not add an IČ DPH on your own.
