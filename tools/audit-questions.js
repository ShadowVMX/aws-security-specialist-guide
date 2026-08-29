#!/usr/bin/env node
/**
 * Quality audit for the question banks.
 *
 * Practice questions can be factually right and still train the wrong habit:
 * if the correct answer is nearly always the longest option, or always lands
 * in the same position, you learn to spot the pattern instead of knowing the
 * material — and the pattern is gone on exam day. This checks for those tells
 * plus the structural defects that make a bank untrustworthy.
 *
 *   node tools/audit-questions.js
 *
 * Exits non-zero if any hard error is found. Biases are reported as warnings,
 * since they are judgement calls about the bank as a whole.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const { selected } = require("./certs.js");

const REPO = path.join(__dirname, "..");
const CERTS = selected(process.argv.slice(2));

function load(relPath) {
  const src = fs.readFileSync(path.join(REPO, relPath), "utf8");
  // the bank files register themselves on window for the exam page; give them
  // a stand-in so they can be evaluated head-less
  return new Function("window", src + "; return QUIZ_DATA;")({});
}

// The sentence that actually asks something: everything after the last "¿" in
// Spanish, the last sentence otherwise. A stem can mention "DOS capas de
// cifrado" as part of the scenario without asking for two answers, and only
// the asking clause tells them apart.
function askClause(text) {
  const q = String(text).trim();
  const open = q.lastIndexOf("\u00bf");
  if (open >= 0) return q.slice(open);
  const parts = q.split(/(?<=[.?])\s+/);
  return parts[parts.length - 1];
}

const ASKS_SEVERAL = /\b(DOS|TRES|TWO|THREE)\b/;

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, " ").replace(/[^\w áéíóúüñ]/gi, "").trim();
}

const errors = [];
const warnings = [];

function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }

let grandTotal = 0;
const positionCounts = {};
let longestIsCorrect = 0;
let longestComparable = 0;
// El banco en inglés se auditaba solo por paridad de recuento, así que un
// sesgo de longitud introducido al traducir pasaba inadvertido. Se mide igual.
let enLongestIsCorrect = 0;
let enLongestComparable = 0;
// Umbral duro: la correcta nunca debe superar a todas las demás por diez
// caracteres o más, que es la distancia a partir de la cual se ve al leer.
const marginOffenders = [];
// El agregado del repo diluye un módulo sesgado, así que se mide por archivo.
const perModule = [];
const multiPairs = [];

for (const cert of CERTS) {
 const { DOMAINS } = require(cert.guide);
 for (const mod of DOMAINS.map((d) => d.module)) {
  const esPath = `${cert.dir}/${cert.lang.es.modules}/${mod}/quiz-data.js`;
  const enPath = `${cert.dir}/${cert.lang.en.modules}/${mod}/quiz-data.js`;
  // Un módulo todavía sin escribir no tiene nada que auditar; que le falten
  // preguntas es asunto del informe de cobertura, no de este.
  if (!fs.existsSync(path.join(REPO, esPath))) continue;
  if (!fs.existsSync(path.join(REPO, enPath))) {
    err(`${cert.id}/${mod}: existe el banco en español y falta el inglés`);
    continue;
  }
  const es = load(esPath);
  const en = load(enPath);

  /* ---- parity between languages ---- */
  if (es.length !== en.length) {
    err(`${mod}: ES tiene ${es.length} preguntas y EN ${en.length}`);
  }

  const seen = new Map();
  const modBuckets = {
    es: { comparable: 0, isCorrect: 0 },
    en: { comparable: 0, isCorrect: 0 },
  };

  es.forEach((q, i) => {
    const where = `${mod}[${i}]`;
    grandTotal++;

    /* ---- structural ---- */
    if (!q.q || !q.q.trim()) err(`${where}: enunciado vacío`);
    if (!q.explain || !q.explain.trim()) err(`${where}: sin explicación`);
    if (!q.tag || !q.tag.trim()) err(`${where}: sin tag`);
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      err(`${where}: ${q.options ? q.options.length : 0} opciones, deberían ser 4`);
      return;
    }

    const multi = Array.isArray(q.correct);
    const correct = multi ? q.correct : [q.correct];
    correct.forEach((c) => {
      if (!Number.isInteger(c) || c < 0 || c >= q.options.length) {
        err(`${where}: índice correcto ${c} fuera de rango`);
      }
    });
    if (multi) {
      if (q.correct.length < 2) err(`${where}: multi-respuesta con menos de 2 correctas`);
      if (new Set(q.correct).size !== q.correct.length) {
        err(`${where}: índices correctos duplicados`);
      }
    }

    /* ---- the stem and the answer type must agree ----
       A stem that asks for TWO answers but stores a single correct index
       submits on the first click: the reader picks one, the quiz closes the
       question and marks the other as missed. It reads as a broken quiz,
       because it is one. */
    [["ES", q], ["EN", en[i]]].forEach(([lang, v]) => {
      if (!v || !v.q) return;
      const asksSeveral = ASKS_SEVERAL.test(askClause(v.q));
      const storedMulti = Array.isArray(v.correct);
      if (asksSeveral && !storedMulti) {
        err(`${where} ${lang}: el enunciado pide varias respuestas pero solo hay un índice correcto`);
      } else if (storedMulti && !asksSeveral) {
        warn(`${where} ${lang}: es de respuesta múltiple pero el enunciado no dice cuántas`);
      }
    });

    /* ---- duplicate options inside one question ---- */
    const optNorm = q.options.map(norm);
    if (new Set(optNorm).size !== optNorm.length) {
      err(`${where}: dos opciones son iguales`);
    }
    if (optNorm.some((o) => !o)) err(`${where}: opción vacía`);

    /* ---- duplicate questions within the module ---- */
    const key = norm(q.q);
    if (seen.has(key)) {
      err(`${where}: enunciado duplicado de ${mod}[${seen.get(key)}]`);
    } else {
      seen.set(key, i);
    }

    /* ---- ES/EN alignment ---- */
    const e = en[i];
    if (e) {
      if (Array.isArray(e.correct) !== multi) {
        err(`${where}: EN cambia el tipo de respuesta`);
      } else if (JSON.stringify(e.correct) !== JSON.stringify(q.correct)) {
        err(`${where}: los índices correctos difieren entre ES y EN`);
      }
      if (e.options.length !== q.options.length) {
        err(`${where}: EN tiene distinto número de opciones`);
      }
      if (norm(e.q) === norm(q.q) && q.q.length > 40) {
        warn(`${where}: el enunciado EN es idéntico al ES — ¿sin traducir?`);
      }
    }

    /* ---- answer-position bias (single answer only) ---- */
    if (!multi) {
      positionCounts[q.correct] = (positionCounts[q.correct] || 0) + 1;
    } else {
      // Multiple-response questions have their own version of the same tell:
      // if every one of them answers [0,1], "tick the first two" scores full
      // marks without reading a word.
      multiPairs.push(correct.slice().sort((a, b) => a - b).join(","));
    }

    /* ---- "longest option is the answer" tell ---- */
    const tell = (opts, bucket, lang) => {
      if (!Array.isArray(opts) || opts.length !== q.options.length) return;
      const lens = opts.map((o) => o.length);
      const max = Math.max(...lens);
      if (lens.filter((l) => l === max).length === 1) {
        bucket.comparable++;
        if (correct.includes(lens.indexOf(max))) bucket.isCorrect++;
      }
      // Margen: sólo tiene sentido con una única respuesta correcta.
      if (!multi) {
        const others = lens.filter((_, j) => j !== q.correct);
        const margin = lens[q.correct] - Math.max(...others);
        if (margin >= 10) marginOffenders.push(`${where} (${lang}): +${margin}`);
      }
    };
    const esBucket = modBuckets.es;
    const enBucket = modBuckets.en;
    tell(q.options, esBucket, "es");
    tell(en[i] && en[i].options, enBucket, "en");

    /* ---- explanation should actually explain ---- */
    if (q.explain && q.explain.length < 80) {
      warn(`${where}: explicación muy corta (${q.explain.length} caracteres)`);
    }
  });

  for (const lang of ["es", "en"]) {
    const b = modBuckets[lang];
    if (!b.comparable) continue;
    perModule.push({ mod: `${cert.id}/${mod}`, lang, ...b });
  }
  longestComparable += modBuckets.es.comparable;
  longestIsCorrect += modBuckets.es.isCorrect;
  enLongestComparable += modBuckets.en.comparable;
  enLongestIsCorrect += modBuckets.en.isCorrect;
 }
}

/* ---- bank-wide biases ---- */

const singleTotal = Object.values(positionCounts).reduce((a, b) => a + b, 0);
const expected = singleTotal / 4;
const posLine = [0, 1, 2, 3]
  .map((i) => `${String.fromCharCode(65 + i)}=${positionCounts[i] || 0}`)
  .join("  ");

// A bank where one position holds far more answers than the others teaches
// "when in doubt pick B", which is worth nothing in the real exam.
const worst = Math.max(...[0, 1, 2, 3].map((i) => positionCounts[i] || 0));
const skew = worst / expected;

const longestPct = longestComparable
  ? Math.round((longestIsCorrect / longestComparable) * 100)
  : 0;

/* ---- report ---- */

console.log(`Preguntas auditadas: ${grandTotal}\n`);

console.log("Distribución de la respuesta correcta (una sola respuesta):");
console.log(`  ${posLine}   esperado ~${expected.toFixed(1)} en cada una`);
if (skew > 1.5) {
  warn(
    `la posición más frecuente concentra ${worst} respuestas frente a ~${expected.toFixed(
      1
    )} esperadas (x${skew.toFixed(2)}): sesgo de posición`
  );
} else {
  console.log("  -> reparto equilibrado\n");
}

const enLongestPct = enLongestComparable
  ? Math.round((enLongestIsCorrect / enLongestComparable) * 100)
  : 0;

console.log("Señal de la opción más larga:");
console.log(
  `  español: la más larga es la correcta en ${longestIsCorrect} de ${longestComparable} (${longestPct}%)`
);
console.log(
  `  inglés:  la más larga es la correcta en ${enLongestIsCorrect} de ${enLongestComparable} (${enLongestPct}%)`
);
for (const [lang, pct] of [["español", longestPct], ["inglés", enLongestPct]]) {
  if (pct > 45) {
    warn(
      `en ${lang} la opción más larga acierta el ${pct}% de las veces: se puede aprobar el quiz por longitud`
    );
  }
}
if (longestPct <= 45 && enLongestPct <= 45) {
  console.log("  -> sin señal explotable en ninguno de los dos idiomas");
}
for (const m of perModule) {
  const pct = Math.round((m.isCorrect / m.comparable) * 100);
  if (pct > 45) {
    warn(
      `${m.mod} (${m.lang}): la más larga es la correcta el ${pct}% de las veces, por encima del umbral`
    );
  }
}
console.log(
  `  la correcta supera a todas las demás por diez caracteres o más en ${marginOffenders.length} preguntas`
);
if (marginOffenders.length) {
  marginOffenders.slice(0, 20).forEach((m) => warn(`margen de longitud delator — ${m}`));
  if (marginOffenders.length > 20) {
    warn(`y ${marginOffenders.length - 20} preguntas más con el mismo margen`);
  }
}
console.log("");

if (multiPairs.length > 1) {
  const spread = {};
  multiPairs.forEach((p) => (spread[p] = (spread[p] || 0) + 1));
  const worstPair = Math.max(...Object.values(spread));
  console.log("\nPreguntas de respuesta múltiple:");
  console.log(
    "  " +
      Object.entries(spread)
        .map(([p, n]) => `[${p}]=${n}`)
        .join("  ")
  );
  if (worstPair / multiPairs.length > 0.6) {
    warn(
      `${worstPair} de ${multiPairs.length} multi-respuesta comparten la misma combinación: se pueden acertar sin leer`
    );
  } else {
    console.log("  -> combinaciones repartidas\n");
  }
}

if (warnings.length) {
  console.log(`\nAvisos (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  · ${w}`));
}

if (errors.length) {
  console.log(`\nERRORES (${errors.length}):`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}

console.log(`\nSin errores estructurales en las ${grandTotal} preguntas.`);
