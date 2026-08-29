#!/usr/bin/env node
/**
 * Coverage of the official SCS-C03 content outline.
 *
 *   node tools/check-coverage.js         summary plus every gap
 *   node tools/check-coverage.js --full  every skill with its question count
 *
 * A study guide for a certification is only as good as its worst-covered
 * skill: the exam draws from all of them, so one with no questions is a
 * domain the student never practises and finds out about on exam day.
 *
 * This reports two hard failures — a skill with no question at all, and a
 * question whose correct answer is a service AWS lists as out of scope — and
 * warns about skills resting on a single question.
 *
 * The keyword match finds candidates; it does not prove a question teaches
 * the skill. Treat a zero as certain and a one as worth a look.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { selected } = require("./certs.js");

const REPO = path.join(__dirname, "..");
const FULL = process.argv.includes("--full");
const CERTS = selected(process.argv.slice(2));

function load(rel) {
  const src = fs.readFileSync(path.join(REPO, rel), "utf8");
  return new Function("window", src + "; return QUIZ_DATA;")({});
}

const errors = [];
const warnings = [];

for (const cert of CERTS) {
// A draft's gaps are the work still to do, not a regression: they are
// reported in full but recorded as warnings.
const problem = cert.draft ? warnings : errors;
const {
  DOMAINS,
  IN_SCOPE_SERVICES,
  OUT_OF_SCOPE,
  NEW_IN_C03,
  GUIDE_EDITION,
  allSkills,
} = require(cert.guide);

/* ---- load every question once, with the text used for matching ---- */
const banks = {};
DOMAINS.forEach((d) => {
  const bankPath = `${cert.dir}/${cert.lang.es.modules}/${d.module}/quiz-data.js`;
  banks[d.module] = fs.existsSync(path.join(REPO, bankPath))
    ? load(bankPath).map((q, i) => ({
        i,
        q,
        text: `${q.tag} ${q.q} ${q.options.join(" ")} ${q.explain}`,
      }))
    : [];
});
const theory = {};
DOMAINS.forEach((d) => {
  const page = path.join(
    REPO, `${cert.dir}/${cert.lang.es.modules}/${d.module}/index.html`
  );
  theory[d.module] = fs.existsSync(page) ? fs.readFileSync(page, "utf8") : "";
});

/* ---- nothing out of scope may be a correct answer ---- */
DOMAINS.forEach((d) => {
  banks[d.module].forEach(({ i, q }) => {
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
    OUT_OF_SCOPE.forEach((s) => {
      if (correct.some((j) => s.match.test(q.options[j]))) {
        problem.push(
          `${d.module}[${i}]: la respuesta correcta es ${s.name}, que la guía lista como fuera de alcance`
        );
      }
    });
  });
});

/* ---- every skill needs questions ---- */
const rows = [];
allSkills().forEach((s) => {
  const mod = s.domain.module;
  const hits = banks[mod].filter((b) => s.match.test(b.text));
  // The theory pages annotate each heading with the skill numbers it covers
  // ("Log sources & logging architecture (1.2.1 / 1.2.2)"). Looking for the
  // number itself is exact, where a keyword match would only be a guess.
  const inTheory = theory[mod].includes(s.id);
  rows.push({ skill: s, n: hits.length, inTheory, hits });

  if (hits.length === 0) {
    problem.push(
      `skill ${s.id} sin ninguna pregunta en ${mod}: ${s.text.slice(0, 74)}`
    );
  } else if (hits.length === 1) {
    warnings.push(
      `skill ${s.id} descansa en una sola pregunta (${mod}[${hits[0].i}]): ${s.text.slice(0, 60)}`
    );
  }
  if (!inTheory) {
    problem.push(
      `skill ${s.id} no está anotado en ningún encabezado de la teoría de ${mod}`
    );
  }
});

/* ---- every service AWS lists as in scope should appear somewhere ----
   The exam can ask about any of them. One the bank never names is a service
   the student meets for the first time in the exam room. */
const allText = DOMAINS.flatMap((d) => banks[d.module].map((b) => b.text)).join(" ");
const allTheory = Object.values(theory).join(" ");
const missingService = [];
const thinService = [];
IN_SCOPE_SERVICES.forEach(([group, list]) => {
  list.forEach(([name, re]) => {
    const inQuestions = DOMAINS.flatMap((d) => banks[d.module]).filter((b) =>
      re.test(b.text)
    ).length;
    if (inQuestions === 0) {
      if (re.test(allTheory)) thinService.push(`${name} (${group}): solo en la teoría, ninguna pregunta`);
      else missingService.push(`${name} (${group}): no aparece en ninguna parte`);
    } else if (inQuestions === 1) {
      thinService.push(`${name} (${group}): una sola pregunta`);
    }
  });
});
missingService.forEach((m) => problem.push(`servicio en alcance sin cubrir — ${m}`));
thinService.forEach((t) => warnings.push(`servicio en alcance apenas cubierto — ${t}`));
void allText;

/* ---- the simulator must mirror the official weights ---- */
const examSrc = cert.examEngine
  ? fs.readFileSync(path.join(REPO, cert.examEngine), "utf8")
  : "";
const TOTAL = cert.examTotal || 0;
if (cert.examEngine) DOMAINS.forEach((d) => {
  const m = examSrc.match(
    // Microsoft publishes weights as ranges, so a guide's midpoint can carry a
    // decimal (22.5). Matching only integers would silently skip the check.
    new RegExp(`id:\\s*"${d.module}",\\s*weight:\\s*([\\d.]+),\\s*count:\\s*(\\d+)`)
  );
  if (!m) {
    errors.push(`el simulacro no reparte preguntas de ${d.module}`);
    return;
  }
  if (Number(m[1]) !== d.weight) {
    errors.push(
      `el simulacro dice que ${d.module} pesa ${m[1]}%; la guía dice ${d.weight}%`
    );
  }
  const want = Math.round((d.weight / 100) * TOTAL);
  if (Number(m[2]) !== want) {
    errors.push(
      `el simulacro da ${m[2]} preguntas a ${d.module}; el ${d.weight}% oficial sobre ${TOTAL} son ${want}`
    );
  }
  if (banks[d.module].length < want) {
    errors.push(
      `${d.module} tiene ${banks[d.module].length} preguntas y el simulacro necesita ${want}`
    );
  }
});

/* ---- the numbers the site prints must be the numbers in the banks ----
   A page that says "40 preguntas" over a bank of 48 is a small lie that
   erodes trust in every other number on the site. */
const TOTAL_QUESTIONS = DOMAINS.reduce((n, d) => n + banks[d.module].length, 0);

DOMAINS.forEach((d) => {
  [
    [`${cert.dir}/${cert.lang.es.modules}/${d.module}/index.html`, cert.countWord.es, d.weightLabel || `${d.weight}%`],
    [`${cert.dir}/${cert.lang.en.modules}/${d.module}/index.html`, cert.countWord.en, d.weightLabel || `${d.weight}%`],
  ].forEach(([rel, word, weight]) => {
    if (!fs.existsSync(path.join(REPO, rel))) return;
    const html = fs.readFileSync(path.join(REPO, rel), "utf8");
    const n = banks[d.module].length;
    const stated = [...html.matchAll(new RegExp(`(\\d+) ${word}`, "g"))]
      .map((m) => Number(m[1]))
      .filter((v) => v !== TOTAL_QUESTIONS);
    if (stated.length && stated.some((v) => v !== n)) {
      errors.push(
        `${rel}: dice ${[...new Set(stated)].join(", ")} ${word} y el banco tiene ${n}`
      );
    }
    if (!html.includes(weight)) {
      problem.push(`${rel}: no muestra el ${weight} que la guía asigna al dominio`);
    }
  });
});

[
  [`${cert.dir}/${cert.lang.es.hub}`, cert.totalWord.es],
  [`${cert.dir}/${cert.lang.en.hub}`, cert.totalWord.en],
  [`${cert.dir}/${cert.lang.es.exam}`, cert.totalWord.es],
  [`${cert.dir}/${cert.lang.en.exam}`, cert.totalWord.en],
].forEach(([rel, word]) => {
  // Un borrador sin banco todavía no anuncia ninguna cifra, y no debe: lo que
  // se comprueba es que no mienta, no que presuma.
  if (!fs.existsSync(path.join(REPO, rel)) || TOTAL_QUESTIONS === 0) return;
  const html = fs.readFileSync(path.join(REPO, rel), "utf8");
  if (!html.includes(`${TOTAL_QUESTIONS} ${word}`)) {
    problem.push(`${rel}: no anuncia las ${TOTAL_QUESTIONS} preguntas que hay realmente`);
  }
});

/* ---- report ---- */
console.log(`\n=== ${cert.name} (${cert.code})${cert.draft ? " · BORRADOR" : ""} — ${GUIDE_EDITION} ===\n`);

DOMAINS.forEach((d) => {
  const mine = rows.filter((r) => r.skill.domain.id === d.id);
  const covered = mine.filter((r) => r.n > 0).length;
  const total = banks[d.module].length;
  console.log(
    `Dominio ${d.id} · ${d.nameEs} (${d.weightLabel || d.weight + "%"}) — ${covered}/${mine.length} skills con preguntas, ${total} preguntas en el módulo`
  );
  mine.forEach((r) => {
    const flag = r.n === 0 ? "  ✗" : r.n === 1 ? "  !" : "   ";
    const isNew = NEW_IN_C03.includes(r.skill.id) ? " [nuevo en C03]" : "";
    if (FULL || r.n <= 1) {
      console.log(
        `${flag} ${r.skill.id.padEnd(6)} ${String(r.n).padStart(3)} preg.  ${r.skill.text.slice(0, 70)}${isNew}`
      );
    }
  });
  console.log("");
});

const newRows = rows.filter((r) => NEW_IN_C03.includes(r.skill.id));
console.log("Contenido añadido en SCS-C03 respecto a SCS-C02:");
newRows.forEach((r) =>
  console.log(`  ${r.skill.id.padEnd(6)} ${String(r.n).padStart(3)} preguntas`)
);

const zero = rows.filter((r) => r.n === 0).length;
const one = rows.filter((r) => r.n === 1).length;
console.log(
  `\n${"—".repeat(64)}\nskills totales: ${rows.length}  ·  sin preguntas: ${zero}  ·  con una sola: ${one}`
);

} /* fin del bucle por certificación */

if (warnings.length) {
  console.log(`\nAvisos (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  · ${w}`));
}
if (errors.length) {
  console.log(`\nERRORES (${errors.length}):`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}
console.log("\nTodo el temario oficial tiene preguntas.");
