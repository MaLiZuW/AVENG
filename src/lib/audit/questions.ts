import type { PublishedKpiKey } from "@/config/benchmarks";
import type {
  AuditQuestion,
  AuditQuestionData,
  InputType,
  MaturityOptionData,
  NumericScoreMapping,
  OptionKey,
  ProcessId,
  QualitativeOption,
  QuestionSeverity,
  VdaScore,
} from "./types";

export type { AuditQuestionData, InputType };

export { PROCESSES } from "./benchmarks";
export { SECTORS } from "./benchmarks";

const SCORE_BY_KEY: Record<OptionKey, VdaScore> = {
  A: 0,
  B: 4,
  C: 6,
  D: 8,
  E: 10,
};

const CATEGORY: Record<ProcessId, string> = {
  P1: "Riadenie výroby a plánovanie",
  P2: "Údržba a dostupnosť zariadení",
  P3: "Kvalita a riadenie nezhôd",
  P4: "Logistika a tok materiálu",
  P5: "Ľudské zdroje a rozvoj kompetencií",
};

function severityFromWeight(w: 1 | 2 | 3 | 4 | 5): QuestionSeverity {
  if (w >= 5) return "Critical (*)";
  if (w >= 4) return "Major";
  return "Minor";
}

/** Build A–E options — score attached in data, never shown as a number in UI. */
function opts(
  labels: [string, string, string, string, string],
): QualitativeOption[] {
  const keys: OptionKey[] = ["A", "B", "C", "D", "E"];
  return keys.map((key, i) => ({
    key,
    label: labels[i],
    score: SCORE_BY_KEY[key],
  }));
}

function maturityOpts(
  labels: [string, string, string, string, string],
): MaturityOptionData[] {
  const scores: VdaScore[] = [0, 4, 6, 8, 10];
  return labels.map((label, i) => ({
    scoreInternal: scores[i],
    label,
  }));
}

type QuestionDraft = {
  id: string;
  processCode: ProcessId;
  questionText: string;
  targetExplanation: string;
  methodology: string;
  inputType: InputType;
  weight: 1 | 2 | 3 | 4 | 5;
  /** UI A–E labels (no numeric thresholds). */
  optionLabels: [string, string, string, string, string];
  numericUnit?: string;
  kpiKey?: PublishedKpiKey;
  numericMapping?: NumericScoreMapping;
  maturityLabels?: [string, string, string, string, string];
  benchmarkSme: number | string;
  benchmarkWc: number | string;
};

function buildQuestion(d: QuestionDraft): AuditQuestion {
  const options = opts(d.optionLabels);
  return {
    id: d.id,
    processId: d.processCode,
    processCode: d.processCode,
    category: CATEGORY[d.processCode],
    text: d.questionText,
    questionText: d.questionText,
    helpText: d.targetExplanation,
    targetExplanation: d.targetExplanation,
    methodology: d.methodology,
    inputType: d.inputType,
    weight: d.weight,
    severity: severityFromWeight(d.weight),
    options,
    numericUnit: d.numericUnit,
    kpiKey: d.kpiKey,
    numericMapping: d.numericMapping,
    maturityOptions: d.maturityLabels
      ? maturityOpts(d.maturityLabels)
      : d.inputType === "MATURITY_SCALE"
        ? maturityOpts(d.optionLabels)
        : undefined,
    benchmarkSme: d.benchmarkSme,
    benchmarkWc: d.benchmarkWc,
  };
}

/**
 * Level 1 — 20 otázok podľa metodiky MSP SR v1.0.
 * Váhy w_q ∈ {1..5}, NUMERIC_INPUT + MATURITY_SCALE, benchmarky MSP/WC.
 * UI zatiaľ používa kvalitatívne options (bez viditeľných skóre).
 */
export const LEVEL1_QUESTIONS: AuditQuestion[] = [
  // ── P1 · Riadenie výroby a plánovanie ────────────────────────────
  buildQuestion({
    id: "L1-P1-Q1",
    processCode: "P1",
    questionText:
      "Aká je presnosť plnenia výrobného plánu (plan attainment)?",
    targetExplanation:
      "Meranie odhaľuje, či plánovanie zodpovedá realite a či výroba zvláda takt zákazníka.",
    methodology: "Lean – takt time, dodržiavanie plánu",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "%",
    numericMapping: {
      score0: "< 50%",
      score4: "50 – 69%",
      score6: "70 – 85%",
      score8: "86 – 95%",
      score10: "> 98%",
    },
    benchmarkSme: "75–85 %",
    benchmarkWc: ">98 %",
    optionLabels: [
      "Plán sa väčšinou neplní — denne hasíme odchýlky a meníme priority.",
      "Plán plníme len čiastočne; časté posuny a doháňanie na konci zmeny.",
      "Plán plníme v prevažnej miere; odchýlky riešime denne na operatíve.",
      "Plán plníme spoľahlivo; výnimky sú výnimočné a riadené.",
      "Plán plníme prakticky vždy; systém je predvídateľný a digitálne riadený.",
    ],
  }),
  buildQuestion({
    id: "L1-P1-Q2",
    processCode: "P1",
    questionText:
      "Je výroba riadená pull systémom / Kanban podľa taktu zákazníka?",
    targetExplanation:
      "Pull systém znižuje WIP a preťaženie. Sleduje sa miera ťahu zákazníka, nie tlaku výroby.",
    methodology: "Lean – pull, Kanban",
    inputType: "MATURITY_SCALE",
    weight: 4,
    maturityLabels: [
      "Žiadny pull — výroba je push / ad-hoc.",
      "Ad-hoc ťah; bez štandardu a merania.",
      "Čiastočný pull riadený v Exceli.",
      "Kanban / pull s meraním a vizualizáciou.",
      "Digitálny pull / MES s uzavretou slučkou.",
    ],
    benchmarkSme: "Čiastočne, Excel",
    benchmarkWc: "Digitálny pull / Kanban",
    optionLabels: [
      "Plánovanie je ad-hoc, operatívne ciele sa často neplnia a chýba prehľad o hodinovom výkone.",
      "Ciele sa stanovujú ručne, výkony sa zapisujú na papier na konci zmeny a odchýlky sa riešia spätne.",
      "Plán je prepočítaný v Exceli, na úzkych miestach sa vedú hodinové sledovky a denne prebieha ranná operatíva.",
      "Výroba je riadená fyzickým Kanbanom/Pull systémom, hodinové sledovky sú vizualizované a odchýlky sa ihneď analyzujú.",
      "Výroba je plne riadená digitálnym Pull/MES systémom s automatickým IoT zberom dát a uzavretou nápravnou slučkou.",
    ],
  }),
  buildQuestion({
    id: "L1-P1-Q3",
    processCode: "P1",
    questionText: "Aký je priemerný výrobný lead time v dňoch?",
    targetExplanation:
      "Kratší lead time znamená nižší WIP, vyššiu flexibilitu a nižšie náklady.",
    methodology: "Lean – value stream",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "dni",
    numericMapping: {
      score0: "> 25 dní",
      score4: "20 – 25 dní",
      score6: "10 – 19 dní",
      score8: "6 – 9 dní",
      score10: "≤ 5 dní",
    },
    benchmarkSme: "10–20 dní",
    benchmarkWc: "<5 dní",
    optionLabels: [
      "Lead time je veľmi dlhý a nestabilný; zákazky sa často stratia vo fronte.",
      "Lead time je dlhý; časté čakanie na materiál, ľudí alebo voľnú kapacitu.",
      "Lead time je prijateľný, ale stále s rezervami a občasnými frontami.",
      "Lead time je krátky a predvídateľný; fronty sú riadené.",
      "Lead time je minimalizovaný a stabilný; tok je plynulý end-to-end.",
    ],
  }),
  buildQuestion({
    id: "L1-P1-Q4",
    processCode: "P1",
    questionText: "Aký je podiel núdzového preplánovania (firefighting)?",
    targetExplanation:
      "Vysoký podiel núdzových zmien signalizuje slabé plánovanie, údržbu a kvalitu.",
    methodology: "Lean – plytvanie (muda)",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "%",
    numericMapping: {
      score0: "> 35%",
      score4: "25 – 35%",
      score6: "15 – 24%",
      score8: "5 – 14%",
      score10: "< 5%",
    },
    benchmarkSme: "20–30 %",
    benchmarkWc: "<5 %",
    optionLabels: [
      "Väčšinu dňa hasíme požiare; plán je skôr formálny dokument.",
      "Núdzové zásahy sú časté; plán sa mení niekoľkokrát denne.",
      "Núdzové zásahy sú bežné, ale zvládnuteľné; existuje základný rytmus.",
      "Núdzové zásahy sú výnimočné; zmeny plánu sú riadené a zdôvodnené.",
      "Núdzové zásahy sú raritou; systém absorbá odchýlky bez chaosu.",
    ],
  }),

  // ── P2 · Údržba a dostupnosť zariadení ───────────────────────────
  buildQuestion({
    id: "L1-P2-Q1",
    processCode: "P2",
    questionText: "Aká je nameraná hodnota OEE na kritických zariadeniach?",
    targetExplanation:
      "OEE = Dostupnosť × Výkon × Kvalita. Meranie odhaľuje skryté straty kapacity.",
    methodology: "TPM – Nakajima; OEE formula",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "%",
    kpiKey: "oee_pct",
    numericMapping: {
      score0: "< 40%",
      score4: "40 – 54%",
      score6: "55 – 69%",
      score8: "70 – 84%",
      score10: "≥ 85%",
    },
    benchmarkSme: "40–60 %",
    benchmarkWc: "≥85 %",
    optionLabels: [
      "Zariadenia často stoja alebo idú pomaly; nemáme spoľahlivý prehľad o stratách.",
      "Efektivita je nízka; prestojov a strát je veľa, meranie je neúplné.",
      "Efektivita je na úrovni typického slovenského MSP; meriame základné ukazovatele.",
      "Efektivita je dobrá; straty sú systematicky sledované a znižované.",
      "Efektivita je na úrovni svetovej špičky; straty sú minimalizované a digitalizované.",
    ],
  }),
  buildQuestion({
    id: "L1-P2-Q2",
    processCode: "P2",
    questionText:
      "Existuje plán preventívnej údržby (PM) s dodržaním ≥ 90 %?",
    targetExplanation:
      "PM predchádza neplánovaným prestojom. Sleduje sa plnenie plánu.",
    methodology: "TPM – plánovaná údržba",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "%",
    numericMapping: {
      score0: "< 40%",
      score4: "40 – 59%",
      score6: "60 – 79%",
      score8: "80 – 94%",
      score10: "≥ 95%",
    },
    benchmarkSme: "50–70 %",
    benchmarkWc: "≥95 %",
    optionLabels: [
      "Údržba je takmer výhradne reaktívna — opravujeme, až keď sa niečo pokazí.",
      "Preventívny plán existuje, ale plníme ho len čiastočne.",
      "Preventívnu údržbu plníme v prevažnej miere podľa plánu.",
      "Preventívny plán plníme spoľahlivo; odchýlky sú výnimočné.",
      "Údržba je prediktívna / plne plánovaná s vysokou disciplínou plnenia.",
    ],
  }),
  buildQuestion({
    id: "L1-P2-Q3",
    processCode: "P2",
    questionText: "Aký je podiel neplánovaných prestojov na celkovom čase?",
    targetExplanation:
      "Neplánované prestoje sú najväčšou stratou dostupnosti.",
    methodology: "TPM – 6 veľkých strát; OEE – Availability loss",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "%",
    numericMapping: {
      score0: "> 20%",
      score4: "15 – 20%",
      score6: "8 – 14%",
      score8: "2 – 7%",
      score10: "< 2%",
    },
    benchmarkSme: "8–15 %",
    benchmarkWc: "<2 %",
    optionLabels: [
      "Neplánovaných prestojov je veľa; výroba je často prerušovaná.",
      "Neplánované prestoje tvoria výrazný podiel zmeny; hasenie je bežné.",
      "Neplánované prestoje sú stredné; poznáme hlavné príčiny.",
      "Neplánované prestoje sú nízke; príčiny sa rýchlo odstraňujú.",
      "Neplánované prestoje sú minimálne; dostupnosť je stabilne vysoká.",
    ],
  }),
  buildQuestion({
    id: "L1-P2-Q4",
    processCode: "P2",
    questionText:
      "Sú poruchy zariadení analyzované metódou root-cause (5× Why, Fishbone)?",
    targetExplanation:
      "Bez analýzy príčin sa poruchy opakujú a prestoje stagnujú.",
    methodology: "Lean – Kaizen, kontinuálne zlepšovanie",
    inputType: "MATURITY_SCALE",
    weight: 3,
    maturityLabels: [
      "Žiadna RCA — poruchy sa len opravujú.",
      "Ojedinelá analýza pri veľkých incidentoch.",
      "RCA pri väčších poruchách.",
      "Systematická RCA podľa štandardu.",
      "Uzavretý Kaizen cyklus s overením účinnosti.",
    ],
    benchmarkSme: "Ad-hoc",
    benchmarkWc: "Systematická RCA",
    optionLabels: [
      "Poruchy opravíme a ideme ďalej — hlbšia analýza sa nerobí.",
      "Analýzu robíme ojedinele, zvyčajne pri veľkých incidentoch.",
      "Pri väčších poruchách robíme root-cause; menšie riešime operatívne.",
      "Máme štandardnú RCA metodiku a väčšinu porúch systematicky vyhodnocujeme.",
      "Každá významná porucha má uzavretý Kaizen cyklus s overením účinnosti.",
    ],
  }),

  // ── P3 · Kvalita a riadenie nezhôd ────────────────────────────────
  buildQuestion({
    id: "L1-P3-Q1",
    processCode: "P3",
    questionText: "Aká je úroveň DPMO (defects per million opportunities)?",
    targetExplanation:
      "DPMO kvantifikuje spôsobilosť procesu. Čím nižšie, tým vyššia sigma úroveň.",
    methodology: "Six Sigma – sigma level",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "DPMO",
    numericMapping: {
      score0: "> 100 000",
      score4: "50 000 – 100 000",
      score6: "10 000 – 49 999",
      score8: "233 – 9 999",
      score10: "< 233 (6σ)",
    },
    benchmarkSme: "10 000–50 000",
    benchmarkWc: "<233 (6σ)",
    optionLabels: [
      "Chybovosť je vysoká; nezhody sú každodennou realitou.",
      "Chybovosť je výrazná; veľa reworku a sortovania.",
      "Chybovosť je na úrovni bežného MSP; niektoré procesy sú stabilnejšie.",
      "Chybovosť je nízka; proces je väčšinou pod kontrolou.",
      "Chybovosť je na úrovni špičky; proces je štatisticky riadený.",
    ],
  }),
  buildQuestion({
    id: "L1-P3-Q2",
    processCode: "P3",
    questionText:
      "Aké sú celkové náklady na nekvalitu (COPQ) ako % tržieb?",
    targetExplanation:
      "COPQ zahŕňa scrap, prepracovanie, reklamácie a stratu kapacity.",
    methodology: "Lean Six Sigma – Cost of Poor Quality",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "%",
    kpiKey: "copq_pct_of_sales",
    numericMapping: {
      score0: "> 10%",
      score4: "8 – 10%",
      score6: "4 – 7,9%",
      score8: "1 – 3,9%",
      score10: "< 1%",
    },
    benchmarkSme: "4–8 %",
    benchmarkWc: "<1 %",
    optionLabels: [
      "Náklady nekvality sú veľmi vysoké a výrazne žerú maržu.",
      "Náklady nekvality sú vysoké; sústredene ich neriešime.",
      "Náklady nekvality sú typické pre slovenské MSP; sledujeme ich čiastočne.",
      "Náklady nekvality sú relatívne nízke a systematicky znižované.",
      "Náklady nekvality sú minimálne; prevencia je zabudovaná do procesu.",
    ],
  }),
  buildQuestion({
    id: "L1-P3-Q3",
    processCode: "P3",
    questionText: "Existuje kontrolný plán pre kritické charakteristiky?",
    targetExplanation:
      "Kontrolný plán definuje merania, frekvenciu a reakcie.",
    methodology: "ISO 9001 – riadenie nezhôd a nápravné opatrenia",
    inputType: "MATURITY_SCALE",
    weight: 4,
    maturityLabels: [
      "Kontrolný plán neexistuje.",
      "Čiastočný / neúplný plán.",
      "Dokumentovaný plán.",
      "Implementovaný s reakčnými pravidlami.",
      "Digitálny SPC / uzavretá slučka.",
    ],
    benchmarkSme: "Čiastočný",
    benchmarkWc: "Plne implementovaný",
    optionLabels: [
      "Kontrolný plán prakticky nemáme; kontrola je ad-hoc.",
      "Kontrolný plán je čiastočný; niektoré znaky sú pokryté.",
      "Kontrolný plán je dokumentovaný a väčšinou dodržiavaný.",
      "Kontrolný plán je implementovaný na dielni; odchýlky sa eskalujú.",
      "Kontrolný plán je prepojený so SPC a digitálnym zberom dát.",
    ],
  }),
  buildQuestion({
    id: "L1-P3-Q4",
    processCode: "P3",
    questionText: "Aká je miera reklamácií od zákazníkov (PPM)?",
    targetExplanation:
      "PPM meria externú kvalitu vnímanú zákazníkom.",
    methodology: "Riadenie reklamácií a spätná väzba od zákazníka",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "PPM",
    numericMapping: {
      score0: "> 5 000",
      score4: "1 000 – 5 000",
      score6: "500 – 999",
      score8: "50 – 499",
      score10: "< 50",
    },
    benchmarkSme: "1 000–5 000",
    benchmarkWc: "<50",
    optionLabels: [
      "Reklamácie sú časté a zaťažujú obchod aj výrobu.",
      "Reklamácie prichádzajú pravidelne; opakujú sa podobné témy.",
      "Reklamácie sú na úrovni bežného MSP; niektoré sa opakujú.",
      "Reklamácie sú zriedkavé; väčšina má uzavretú root-cause.",
      "Reklamácie sú výnimočné; systém prevencie funguje spoľahlivo.",
    ],
  }),

  // ── P4 · Logistika a tok materiálu ───────────────────────────────
  buildQuestion({
    id: "L1-P4-Q1",
    processCode: "P4",
    questionText: "Aká je miera dodania na čas (OTD)?",
    targetExplanation:
      "OTD meria spoľahlivosť voči zákazníkovi a stabilitu toku.",
    methodology: "Lean – lead time",
    inputType: "NUMERIC_INPUT",
    weight: 5,
    numericUnit: "%",
    kpiKey: "otd_pct",
    numericMapping: {
      score0: "< 70%",
      score4: "70 – 79%",
      score6: "80 – 89%",
      score8: "90 – 97%",
      score10: "≥ 98%",
    },
    benchmarkSme: "75–85 %",
    benchmarkWc: ">98 %",
    optionLabels: [
      "Termíny často nestíhame; zákazníci to pravidelne pociťujú.",
      "Dodávky sú nestabilné; meškania nie sú výnimkou.",
      "Dodávky sú väčšinou načas; stále máme rezervy na zlepšenie.",
      "Dodávky sú spoľahlivé; meškania sú výnimočné.",
      "Dodávky sú excelentné; zákazník sa môže spoľahnúť takmer vždy.",
    ],
  }),
  buildQuestion({
    id: "L1-P4-Q2",
    processCode: "P4",
    questionText: "Aká je obrátkovosť zásob (inventory turns)?",
    targetExplanation:
      "Vyššia obrátkovosť znižuje viazaný kapitál a WIP.",
    methodology: "Lean – WIP, value stream",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "obraty/rok",
    numericMapping: {
      score0: "< 3",
      score4: "3 – 4",
      score6: "5 – 6",
      score8: "7 – 11",
      score10: "≥ 12",
    },
    benchmarkSme: "4–6×",
    benchmarkWc: ">12×",
    optionLabels: [
      "Zásoby sa otáčajú veľmi pomaly; kapitál je dlhodobo viazaný.",
      "Obrátkovosť je nízka; máme veľa „mŕtveho“ materiálu a WIP.",
      "Obrátkovosť je na úrovni typického MSP; stále sú rezervy.",
      "Obrátkovosť je dobrá; zásoby sú riadené podľa dopytu.",
      "Obrátkovosť je na úrovni špičky; tok materiálu je štíhly.",
    ],
  }),
  buildQuestion({
    id: "L1-P4-Q3",
    processCode: "P4",
    questionText: "Je hodnotový tok mapovaný metódou VSM?",
    targetExplanation:
      "VSM odhaľuje plytvanie a určuje priority toku.",
    methodology: "Lean – Value Stream Mapping",
    inputType: "MATURITY_SCALE",
    weight: 3,
    maturityLabels: [
      "Žiadne VSM.",
      "Jednorazové mapovanie.",
      "Ročné VSM.",
      "Kvartálne VSM s akciami.",
      "Kontinuálne / digitálne VSM.",
    ],
    benchmarkSme: "Ojedinele",
    benchmarkWc: "Kontinuálne",
    optionLabels: [
      "Tok hodnôt sme nikdy systematicky nemapovali.",
      "VSM sme urobili raz; odvtedy sa neaktualizuje.",
      "VSM robíme približne raz ročne alebo pri väčších projektoch.",
      "VSM aktualizujeme pravidelne (kvartálne) a viažeme na akcie.",
      "Máme živý / digitálny VSM prepojený s operatívnym riadením.",
    ],
  }),
  buildQuestion({
    id: "L1-P4-Q4",
    processCode: "P4",
    questionText:
      "Aká je kompletnosť a presnosť dodávok od dodávateľov?",
    targetExplanation:
      "Dodávateľský tok ovplyvňuje OTD, WIP a prestoje.",
    methodology: "Lean – supply chain",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "%",
    numericMapping: {
      score0: "< 80%",
      score4: "80 – 89%",
      score6: "90 – 94%",
      score8: "95 – 98%",
      score10: "≥ 99%",
    },
    benchmarkSme: "85–92 %",
    benchmarkWc: ">99 %",
    optionLabels: [
      "Dodávatelia často meškajú alebo dodávajú nekompletne.",
      "Spoľahlivosť dodávateľov je slabá; často improvizujeme.",
      "Dodávatelia sú väčšinou v poriadku; riziká sledujeme čiastočne.",
      "Dodávatelia sú spoľahliví; kritické položky majú záložný plán.",
      "Dodávateľský reťazec je vysoko spoľahlivý a vizuálne riadený.",
    ],
  }),

  // ── P5 · Ľudské zdroje a rozvoj kompetencií ──────────────────────
  buildQuestion({
    id: "L1-P5-Q1",
    processCode: "P5",
    questionText: "Existuje matica kompetencií a plán školenia?",
    targetExplanation:
      "Kompetencie musia byť merateľné a prepojené na potreby procesov.",
    methodology: "WCM – People Development; ISO 9001",
    inputType: "MATURITY_SCALE",
    weight: 4,
    maturityLabels: [
      "Žiadna matica kompetencií.",
      "Neformálna / neaktuálna.",
      "Dokumentovaná matica.",
      "Prepojená s medzerami a rozvojom.",
      "Strategicky riadená a meraná.",
    ],
    benchmarkSme: "Čiastočná",
    benchmarkWc: "Plne prepojená",
    optionLabels: [
      "Kompetencie nie sú mapované; rozvoj lídrov je náhodný.",
      "Matica existuje neformálne; nie je živá ani viazaná na rozvoj.",
      "Matica je dokumentovaná; čiastočne ju používame pri zastupovaní.",
      "Matica je živá a prepojená s rozvojom a zastupiteľnosťou.",
      "Kompetencie a rozvoj lídrov sú strategicky riadené a merané.",
    ],
  }),
  buildQuestion({
    id: "L1-P5-Q2",
    processCode: "P5",
    questionText: "Aká je miera absencie zamestnancov?",
    targetExplanation:
      "Vysoká absencia znižuje dostupnosť a kvalitu.",
    methodology: "WCM – People pillar; ISO 45001",
    inputType: "NUMERIC_INPUT",
    weight: 3,
    numericUnit: "%",
    numericMapping: {
      score0: "> 10%",
      score4: "8 – 10%",
      score6: "5 – 7,9%",
      score8: "3 – 4,9%",
      score10: "< 3%",
    },
    benchmarkSme: "5–8 %",
    benchmarkWc: "<3 %",
    optionLabels: [
      "Absencia je vysoká a často zastavuje alebo oslabuje linky.",
      "Absencia je nadpriemerná; každá zmena je rizikom.",
      "Absencia je typická pre MSP; kritické pozície niekedy chýbajú.",
      "Absencia je pod kontrolou; zastupiteľnosť väčšinou funguje.",
      "Absencia je nízka; výroba je voči výpadkom odolná.",
    ],
  }),
  buildQuestion({
    id: "L1-P5-Q3",
    processCode: "P5",
    questionText: "Koľko zlepšovacích návrhov na zamestnanca za rok?",
    targetExplanation:
      "Počet návrhov meria angažovanosť a kultúru zlepšovania.",
    methodology: "WCM – Kaizen; Lean",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "návrhy/rok",
    numericMapping: {
      score0: "0",
      score4: "0,1 – 0,5",
      score6: "0,6 – 2",
      score8: "3 – 11",
      score10: "≥ 12",
    },
    benchmarkSme: "<0,5",
    benchmarkWc: ">12",
    optionLabels: [
      "Zamestnanci prakticky nepredkladajú zlepšovacie návrhy.",
      "Návrhy prichádzajú zriedka a často ostanú bez realizácie.",
      "Máme základný systém návrhov; aktivita je stredná.",
      "Zlepšovanie je živé; návrhy sa pravidelne realizujú.",
      "Kaizen je súčasťou kultúry; každý sa podieľa na zlepšovaní.",
    ],
  }),
  buildQuestion({
    id: "L1-P5-Q4",
    processCode: "P5",
    questionText: "Aká je viaczručnosť / multi-skilling coverage?",
    targetExplanation:
      "Viaczručnosť zvyšuje flexibilitu a znižuje závislosť na jednotlivcoch.",
    methodology: "WCM – People Development",
    inputType: "NUMERIC_INPUT",
    weight: 4,
    numericUnit: "stanice",
    numericMapping: {
      score0: "1 stanica",
      score4: "1 – 2 stanice",
      score6: "2 – 3 stanice",
      score8: "> 3 na kritických",
      score10: "> 3 všetci s rotáciou",
    },
    benchmarkSme: "1–2",
    benchmarkWc: ">3 s rotáciou",
    optionLabels: [
      "Operátori ovládajú spravidla jednu stanicu; zastupiteľnosť chýba.",
      "Časť ľudí ovláda 1–2 stanice; absencia stále bolí.",
      "Väčšina ovláda 2–3 stanice; kritické miesta majú čiastočné krytie.",
      "Kritické stanice majú viacero vyškolených ľudí; rotácia funguje.",
      "Viaczručnosť s pravidelnou rotáciou je štandard na celej dielni.",
    ],
  }),
];

/** Počet otázok podľa inputType (metodika v1.0). */
export const LEVEL1_INPUT_SUMMARY = {
  total: LEVEL1_QUESTIONS.length,
  numeric: LEVEL1_QUESTIONS.filter((q) => q.inputType === "NUMERIC_INPUT")
    .length,
  maturity: LEVEL1_QUESTIONS.filter((q) => q.inputType === "MATURITY_SCALE")
    .length,
} as const;

export const LEVEL2_FEATURES = [
  "60 podotázok (20 × 3) bez viditeľných skóre — kvalitatívne A–E",
  "OEE dekompozícia: Availability / Performance / Quality",
  "COPQ, DPMO, Poka-Yoke, Traceability a 8D hĺbka",
  "Guidance karty: cieľ · metodika · Gemba overenie",
  "Indikatívny potenciál €/rok + kritický proces (referencia MSP vs world-class)",
];

export const LEVEL3_FEATURES = [
  "180 otázok — 6M Root-Cause (Man, Machine, Material, Method, Measurement, Environment)",
  "Kvalitatívne A–E bez viditeľných bodov + guidance karty",
  "Digital Twin of Organization (DTO) — What-If simulátor",
  "Live úspory €/rok, extra kapacita (h) a ROI v mesiacoch",
  "Agregácia L3→L2→L1 + odvetvová referencia MSP / world-class medzera",
];

export const LEVEL2_PRICE_EUR = 290;
