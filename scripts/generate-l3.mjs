/**
 * Generates src/lib/audit/level3-questions.generated.ts — 180 L3 questions.
 * Seed overrides for first 6 from master prompt; rest derived from L2 parents × 6M.
 */
import { writeFileSync, readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const DIMENSIONS = [
  "METHOD",
  "MAN",
  "MEASUREMENT",
  "MACHINE",
  "MATERIAL",
  "ENVIRONMENT",
];

const DIM_SK = {
  MAN: "ľudí a kompetencie",
  MACHINE: "stroje a technológie",
  MATERIAL: "materiál a vstupy",
  METHOD: "metódy a štandardy",
  MEASUREMENT: "meranie a KPI",
  ENVIRONMENT: "prostredie a vizuálny manažment",
};

const DIM_VERIFY = {
  MAN: "Pohovor s obsluhou/majstrom a kontrola záznamov školení.",
  MACHINE: "Gemba kontrola zariadenia, senzorov a stavu technológie.",
  MATERIAL: "Kontrola toku materiálu, označenia a skladových pravidiel.",
  METHOD: "Audit písomného štandardu a dodržiavania postupu na dielni.",
  MEASUREMENT: "Kontrola KPI dashboardu, logov meraní a výpočtov.",
  ENVIRONMENT: "Vizuálna kontrola usporiadania pracoviska a Andon/tabúľ.",
};

function parseL2FromSources() {
  const dir = join(root, "src/lib/audit/level2");
  const items = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
    const src = readFileSync(join(dir, f), "utf8");
    // Match l2q("ID", "PARENT", "Px", "text", "goal", "methodology", "verification",
    const re =
      /l2q\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"(P[1-5])"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"/g;
    let m;
    while ((m = re.exec(src))) {
      items.push({
        id: m[1],
        parentId: m[2],
        processId: m[3],
        text: m[4].replace(/\\"/g, '"'),
        goal: m[5].replace(/\\"/g, '"'),
        methodology: m[6].replace(/\\"/g, '"'),
        verification: m[7].replace(/\\"/g, '"'),
      });
    }
  }
  return items;
}

function suffix(i) {
  return ["i", "ii", "iii"][i];
}

function optsFor(dim, topicShort) {
  const focus = DIM_SK[dim];
  return [
    `Oblasť ${focus} nie je v kontexte „${topicShort}“ systematicky riešená.`,
    `Existujú len neformálne praktiky bez štandardu pre ${focus}.`,
    `Základný štandard MSP je nastavený; ${focus} fungujú s rezervami.`,
    `Disciplína je dobrá; ${focus} sú systematicky riadené a merané.`,
    `World-class úroveň: ${focus} sú digitálne prepojené a kontinuálne zlepšované.`,
  ];
}

function costFor(dim, processId) {
  const base = { P1: 2200, P2: 3200, P3: 2800, P4: 2400, P5: 1800 }[processId];
  const mult = {
    MAN: 0.7,
    MACHINE: 1.2,
    MATERIAL: 0.9,
    METHOD: 0.8,
    MEASUREMENT: 1.0,
    ENVIRONMENT: 0.6,
  }[dim];
  return Math.round(base * mult);
}

function impactFor(dim) {
  return (
    {
      MAN: 0.6,
      MACHINE: 0.9,
      MATERIAL: 0.7,
      METHOD: 0.8,
      MEASUREMENT: 0.75,
      ENVIRONMENT: 0.5,
    }[dim] ?? 0.7
  );
}

function topicShort(text) {
  return text.length > 72 ? text.slice(0, 69) + "…" : text;
}

/** Explicit seeds from master prompt (first 6 of P1-Q1a/Q1b). */
const SEEDS = {
  "L3-P1-Q1a-i": {
    dimension6M: "METHOD",
    questionText:
      "Je výpočet taktu zákazníka (Takt Time) aktualizovaný pri každej zmene odberateľského poriadku?",
    targetExplanation:
      "Overuje pružnosť prispôsobenia výrobných rýchlostí reálnemu dopytu na trhu.",
    methodology: "Lean – takt zákazníka",
    verificationMethod:
      "Porovnanie posledných 3 zmrazených plánov výroby s odberateľskými odvolávkami v ERP.",
    options: [
      "Takt Time sa nevypočítava, vyrába sa na základe odhadu kapacity.",
      "Takt Time sa počíta neformálne raz za polroka pri tvorbe rozpočtu.",
      "Takt Time sa počíta v Exceli pre každý mesačný plán výroby.",
      "Takt Time sa aktualizuje týždenne a premieta sa do normatívov liniek.",
      "Takt Time sa prepočítava v real-time prostredníctvom MES pri každej zmene EDI odvolávky.",
    ],
    costImpactFactor: 0.8,
    estimatedImplementationCostEuro: 2500,
  },
  "L3-P1-Q1a-ii": {
    dimension6M: "MAN",
    questionText:
      "Sú plánovači výroby zaškolení v metodike nivelácie výroby (Heijunka)?",
    targetExplanation:
      "Zisťuje odbornú spôsobilosť plánovačov vyrovnávať výrobné výkyvy.",
    methodology: "WCM People Development / Heijunka",
    verificationMethod:
      "Audit certifikátov školení plánovačov a kontrola rozpracovaných nivelačných tabúľ.",
    options: [
      "Plánovači nemajú vedomosť o metodike Heijunka a plánujú len dávkovo.",
      "Plánovači poznajú pojem, ale v praxi plánujú podľa akútnych požiadaviek obchodu.",
      "Plánovači uplatňujú Heijunka pravidlá v Exceli pre hlavné výrobné uzly.",
      "Plánovači pravidelne vyhladzujú mix produktov a objem pomocou EPEI indexu.",
      "Plánovači sú expertmi na pokročilé sekvenovanie (APS) s priebežným koučingom tímu.",
    ],
    costImpactFactor: 0.6,
    estimatedImplementationCostEuro: 1500,
  },
  "L3-P1-Q1a-iii": {
    dimension6M: "MEASUREMENT",
    questionText:
      "Meria sa odchýlka reakčnej doby výroby na zmenu taktu zákazníka?",
    targetExplanation:
      "Sleduje agilitu reakcie výrobného systému na trhové zmeny.",
    methodology: "Meranie reakčnej doby na zmenu taktu",
    verificationMethod:
      "Audit KPI správ: sledovanie počtu dní od zmeny EDI po fyzickú úpravu taktu na dielni.",
    options: [
      "Reakčná doba sa nemeria, zmeny sa prejavujú s chaotickým oneskorením.",
      "Sleduje sa len celkové meškanie zákaziek bez analýzy reakčného času.",
      "Reakčný čas sa vyhodnocuje mesačne v rámci operatívnych review.",
      "Reakčná doba je stabilne pod 24 hodín s presne zmeraným dopadom na WIP.",
      "Automatizovaný dashboard meria reakčný čas okamžite v hodinách.",
    ],
    costImpactFactor: 0.7,
    estimatedImplementationCostEuro: 3000,
  },
  "L3-P1-Q1b-i": {
    dimension6M: "MACHINE",
    questionText:
      "Sú úzke miesta vybavené automatickými počítadlami vyprodukovaných kusov napojenými na MES/IoT?",
    targetExplanation:
      "Eliminuje ručné skresľovanie dát o hodinovom výkone obsluhou.",
    methodology: "Industry 4.0 / IoT Data Capture",
    verificationMethod:
      "Gemba fyzická kontrola snímačov na linke a porovnanie s databázou MES.",
    options: [
      "Počítadlá neexistujú, kusy sa počítajú ručne na konci zmeny.",
      "Stroje majú len mechanické počítadlo bez prepojenia do siete.",
      "Snímače zapisujú dáta do lokálneho pamäťového modulu s ručným sťahovaním.",
      "IoT snímače odosielajú dáta v real-time na displej pri stroji.",
      "Plne integrované IoT snímače s prenosom do cloudového DTO dashboardu.",
    ],
    costImpactFactor: 0.9,
    estimatedImplementationCostEuro: 4500,
  },
  "L3-P1-Q1b-ii": {
    dimension6M: "ENVIRONMENT",
    questionText:
      "Sú hodinové sledovky umiestnené v bezprostrednom zornom poli operátora a majstra?",
    targetExplanation:
      "Zabezpečuje okamžitú vizuálnu informovanosť bez nutnosti hľadania podkladov.",
    methodology: "Visual Factory / Shopfloor Management",
    verificationMethod:
      "Fyzická kontrola ergonómie a viditeľnosti tabúľ zo vzdialenosti 3 metrov od stanoviska.",
    options: [
      "Tabule neexistujú alebo sú skryté v kancelárii majstra.",
      "Tabuľa je umiestnená na chodbe mimo dohľadu obsluhy stroja.",
      "Papierová hodinová sledovka je pripevnená priamo na rozvádzači stroja.",
      "Digitálny LED panel nad linkou zobrazuje cieľ vs. reálny stav hodiny.",
      "Interaktívny Andon terminál s farebnou signalizáciou stavu plnenia hodiny.",
    ],
    costImpactFactor: 0.5,
    estimatedImplementationCostEuro: 1200,
  },
  "L3-P1-Q1b-iii": {
    dimension6M: "METHOD",
    questionText:
      "Existuje definovaný postup escalation pri nesplnení hodinového cieľa o viac ako 15 %?",
    targetExplanation:
      "Garantuje okamžitý zásah podpory (údržba, kvalita, logistika) už počas prebiehajúcej hodiny.",
    methodology: "Lean – eskalácia odchýlky",
    verificationMethod:
      "Pohovor s majstrom a kontrola logu reálnych eskalácií za posledný týždeň.",
    options: [
      "Postup neexistuje, sklzy sa nariaďujú doháňať nadčasmi.",
      "Operátor má ústne povedané, že má zavolať majstra, ak nestíha.",
      "Písomný escalation model na tabuli s reakčnými časmi do 15 minút.",
      "Stlačenie Andon tlačidla automaticky posiela notifikáciu údržbe a kvalitárovi.",
      "Automatický prediktívny escalation algoritmus v MES pri poklese tempa.",
    ],
    costImpactFactor: 0.8,
    estimatedImplementationCostEuro: 2000,
  },
};

function buildL3(l2List) {
  const out = [];
  for (const l2 of l2List) {
    // Pick 3 dimensions cycling by L2 index for variety
    const baseIdx = out.length / 3;
    const dims = [
      DIMENSIONS[baseIdx % 6],
      DIMENSIONS[(baseIdx + 1) % 6],
      DIMENSIONS[(baseIdx + 2) % 6],
    ];
    for (let i = 0; i < 3; i++) {
      const id = `${l2.id.replace(/^L2/, "L3")}-${suffix(i)}`;
      const seed = SEEDS[id];
      if (seed) {
        out.push({
          id,
          parentL2Id: l2.id,
          parentL1Id: l2.parentId,
          processCode: l2.processId,
          ...seed,
        });
        continue;
      }
      const dim = dims[i];
      const short = topicShort(l2.text);
      out.push({
        id,
        parentL2Id: l2.id,
        parentL1Id: l2.parentId,
        processCode: l2.processId,
        dimension6M: dim,
        questionText: `Ako systematicky riadite ${DIM_SK[dim]} v kontexte: ${short}?`,
        targetExplanation: `${l2.goal} Fokus 6M: ${dim}.`,
        methodology: `${l2.methodology} / 6M ${dim}`,
        verificationMethod: DIM_VERIFY[dim],
        options: optsFor(dim, short),
        costImpactFactor: impactFor(dim),
        estimatedImplementationCostEuro: costFor(dim, l2.processId),
      });
    }
  }
  return out;
}

function emitTs(questions) {
  const lines = [];
  lines.push(`/* AUTO-GENERATED by scripts/generate-l3.mjs — do not edit by hand */`);
  lines.push(`import type { Level3Question } from "./types";`);
  lines.push(``);
  lines.push(`export const LEVEL3_QUESTIONS: Level3Question[] = [`);
  for (const q of questions) {
    lines.push(`  {`);
    lines.push(`    id: ${JSON.stringify(q.id)},`);
    lines.push(`    parentL2Id: ${JSON.stringify(q.parentL2Id)},`);
    lines.push(`    parentL1Id: ${JSON.stringify(q.parentL1Id)},`);
    lines.push(`    processId: ${JSON.stringify(q.processCode)},`);
    lines.push(`    dimension6M: ${JSON.stringify(q.dimension6M)},`);
    lines.push(`    text: ${JSON.stringify(q.questionText)},`);
    lines.push(`    goal: ${JSON.stringify(q.targetExplanation)},`);
    lines.push(`    methodology: ${JSON.stringify(q.methodology)},`);
    lines.push(`    verification: ${JSON.stringify(q.verificationMethod)},`);
    lines.push(`    options: [`);
    const scores = [0, 4, 6, 8, 10];
    const keys = ["A", "B", "C", "D", "E"];
    q.options.forEach((label, i) => {
      lines.push(
        `      { key: "${keys[i]}", label: ${JSON.stringify(label)}, score: ${scores[i]} },`,
      );
    });
    lines.push(`    ],`);
    lines.push(`    costImpactFactor: ${q.costImpactFactor},`);
    lines.push(
      `    estimatedImplementationCostEuro: ${q.estimatedImplementationCostEuro},`,
    );
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);
  lines.push(`if (LEVEL3_QUESTIONS.length !== 180) {`);
  lines.push(
    `  throw new Error(\`Expected 180 Level 3 questions, got \${LEVEL3_QUESTIONS.length}\`);`,
  );
  lines.push(`}`);
  lines.push(``);
  return lines.join("\n");
}

const l2 = parseL2FromSources();
if (l2.length !== 60) {
  console.error("Expected 60 L2 parents, got", l2.length);
  process.exit(1);
}
const l3 = buildL3(l2);
if (l3.length !== 180) {
  console.error("Expected 180 L3, got", l3.length);
  process.exit(1);
}
const outPath = join(root, "src/lib/audit/level3-questions.generated.ts");
writeFileSync(outPath, emitTs(l3));
console.log(JSON.stringify({ ok: true, l2: l2.length, l3: l3.length, out: outPath }));
