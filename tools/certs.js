#!/usr/bin/env node
/**
 * The certifications this site covers.
 *
 * One entry per certification: where its pages live, where its syllabus data
 * lives, and how its pages are laid out. Every tool reads this instead of
 * hardcoding paths, so adding a certification is adding an entry here plus its
 * guide file — nothing else in tools/ needs to change.
 */
"use strict";

const CERTS = [
  {
    id: "aws-scs-c03",
    dir: "aws-scs-c03",
    guide: "./guides/aws-scs-c03.js",
    name: "AWS Certified Security – Specialty",
    code: "SCS-C03",
    // where each language's pages live, relative to dir
    lang: {
      es: { hub: "index.html", exam: "examen/index.html", modules: "modules" },
      en: { hub: "en/index.html", exam: "en/exam/index.html", modules: "en/modules" },
    },
    // the words each language uses when a page states its question count
    countWord: { es: "preguntas", en: "questions" },
    totalWord: { es: "preguntas", en: "practice questions" },
    examEngine: "assets/js/exam.js",
    examTotal: 65,
  },
];

function byId(id) {
  const c = CERTS.find((x) => x.id === id);
  if (!c) {
    console.error(
      `certificación desconocida: ${id}\ndisponibles: ${CERTS.map((x) => x.id).join(", ")}`
    );
    process.exit(2);
  }
  return c;
}

/** The cert named on the command line, or every cert when none is named. */
function selected(argv) {
  const named = argv.filter((a) => !a.startsWith("--"));
  return named.length ? named.map(byId) : CERTS;
}

module.exports = { CERTS, byId, selected };
