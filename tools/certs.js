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
    // who publishes the exam guide, and how the syllabus block labels the
    // skills this edition added, so tools/render-syllabus.js never has to
    // know which certification it is printing
    vendor: "AWS",
    newBadge: { es: "nuevo en C03", en: "new in C03" },
    newTitle: {
      es: "Contenido que AWS añadió al pasar de SCS-C02 a SCS-C03",
      en: "Content AWS added when moving from SCS-C02 to SCS-C03",
    },
    examEngine: "assets/js/exam.js",
    examTotal: 65,
  },
  {
    id: "sc-100",
    dir: "sc-100",
    guide: "./guides/sc-100.js",
    name: "Microsoft Cybersecurity Architect",
    code: "SC-100",
    // While a certification is a draft its modules are still being written, so
    // the coverage report says what is missing instead of failing the build.
    // Flip this off the day every skill has questions — and not before, so the
    // number on the page never claims more than the bank holds.
    draft: true,
    lang: {
      es: { hub: "index.html", exam: "examen/index.html", modules: "modules" },
      en: { hub: "en/index.html", exam: "en/exam/index.html", modules: "en/modules" },
    },
    countWord: { es: "preguntas", en: "questions" },
    totalWord: { es: "preguntas", en: "practice questions" },
    vendor: "Microsoft",
    newBadge: { es: "nuevo en 2026", en: "new in 2026" },
    newTitle: {
      es: "Contenido que Microsoft añadió en la revisión del 28 de julio de 2026",
      en: "Content Microsoft added in the 28 July 2026 revision",
    },
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
