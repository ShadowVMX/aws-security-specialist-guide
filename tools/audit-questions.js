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

const REPO = path.join(__dirname, "..");
const MODULES = [
  "detection",
  "incident-response",
  "infrastructure-security",
  "iam",
  "data-protection",
  "governance",
];

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
const multiPairs = [];

for (const mod of MODULES) {
  const es = load(`modules/${mod}/quiz-data.js`);
  const en = load(`en/modules/${mod}/quiz-data.js`);

  /* ---- parity between languages ---- */
  if (es.length !== en.length) {
    err(`${mod}: ES tiene ${es.length} preguntas y EN ${en.length}`);
  }

  const seen = new Map();

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
    const lens = q.options.map((o) => o.length);
    const max = Math.max(...lens);
    const uniqueMax = lens.filter((l) => l === max).length === 1;
    if (uniqueMax) {
      longestComparable++;
      if (correct.includes(lens.indexOf(max))) longestIsCorrect++;
    }

    /* ---- explanation should actually explain ---- */
    if (q.explain && q.explain.length < 80) {
      warn(`${where}: explicación muy corta (${q.explain.length} caracteres)`);
    }
  });
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

console.log("Señal de la opción más larga:");
console.log(
  `  la opción más larga es la correcta en ${longestIsCorrect} de ${longestComparable} (${longestPct}%)`
);
if (longestPct > 45) {
  warn(
    `la opción más larga acierta el ${longestPct}% de las veces: se puede aprobar el quiz por longitud`
  );
} else {
  console.log("  -> sin señal explotable\n");
}

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
