#!/usr/bin/env node
/**
 * Writes the official SCS-C03 task and skill list into every module page,
 * from tools/exam-guide.js.
 *
 *   node tools/render-syllabus.js          rewrite the twelve module pages
 *   node tools/render-syllabus.js --check   fail if any page is out of date
 *
 * A student preparing for a certification navigates by the exam guide, not by
 * whatever headings we chose. Printing the guide's own task and skill numbers
 * on each module lets them tick items off against the source of truth — and
 * generating it from data means the page cannot drift from the guide.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { selected } = require("./certs.js");

const REPO = path.join(__dirname, "..");
const CERTS = selected(process.argv.slice(2));
const CHECK = process.argv.includes("--check");
const OPEN = "<!-- temario:inicio -->";
const CLOSE = "<!-- temario:fin -->";

const T = {
  es: {
    heading: "Temario oficial cubierto",
    lede: (d) =>
      `Las tareas y skills que AWS publica para el dominio ${d.id} en la guía del examen. El ${d.weight}% de las preguntas del examen sale de aquí.`,
    note: "Redacción adaptada al español; la versión normativa es la de la guía oficial de AWS.",
    task: "Tarea",
    isNew: "nuevo en C03",
    newTitle: "Contenido que AWS añadió al pasar de SCS-C02 a SCS-C03",
  },
  en: {
    heading: "Official exam content covered",
    lede: (d) =>
      `The tasks and skills AWS publishes for domain ${d.id} in the exam guide. ${d.weight}% of the exam's questions come from here.`,
    note: "Wording as published by AWS in the exam guide.",
    task: "Task",
    isNew: "new in C03",
    newTitle: "Content AWS added when moving from SCS-C02 to SCS-C03",
  },
};

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function block(domain, lang, NEW_IN_C03, GUIDE_EDITION) {
  const t = T[lang];
  const tasks = domain.tasks
    .map((task) => {
      const skills = task.skills
        .map((s) => {
          // Someone who studied with SCS-C02 material has never seen these,
          // so they are worth pointing at rather than leaving in the list.
          const badge = NEW_IN_C03.includes(s.id)
            ? ` <span class="skill-new" title="${t.newTitle}">${t.isNew}</span>`
            : "";
          return `        <li><span class="skill-id">${s.id}</span> <span>${esc(
            lang === "es" ? s.textEs : s.text
          )}${badge}</span></li>`;
        })
        .join("\n");
      return (
        `      <h4>${t.task} ${task.id} — ${esc(
          lang === "es" ? task.titleEs : task.title
        )}</h4>\n` +
        `      <ul class="skills">\n${skills}\n      </ul>`
      );
    })
    .join("\n");

  return [
    OPEN,
    `    <h2 id="temario">${t.heading}</h2>`,
    `    <p class="lede">${t.lede(domain)}</p>`,
    `    <div class="syllabus">`,
    tasks,
    `      <p class="syllabus-note">${t.note} ${esc(GUIDE_EDITION)}.</p>`,
    `    </div>`,
    CLOSE,
  ].join("\n");
}

let stale = 0;
CERTS.forEach((cert) => {
 const { DOMAINS, NEW_IN_C03, GUIDE_EDITION } = require(cert.guide);
 DOMAINS.forEach((d) => {
  [
    [`${cert.dir}/${cert.lang.es.modules}/${d.module}/index.html`, "es"],
    [`${cert.dir}/${cert.lang.en.modules}/${d.module}/index.html`, "en"],
  ].forEach(([rel, lang]) => {
    const file = path.join(REPO, rel);
    if (!fs.existsSync(file)) return; // módulo aún por escribir
    const html = fs.readFileSync(file, "utf8");
    const want = block(d, lang, NEW_IN_C03, GUIDE_EDITION);

    const from = html.indexOf(OPEN);
    const to = html.indexOf(CLOSE);
    if (from === -1 || to === -1) {
      console.error(`${rel}: faltan los marcadores ${OPEN} / ${CLOSE}`);
      stale++;
      return;
    }
    const current = html.slice(from, to + CLOSE.length);
    if (current === want) return;
    if (CHECK) {
      console.error(`${rel}: el temario impreso no coincide con la guía`);
      stale++;
      return;
    }
    fs.writeFileSync(file, html.slice(0, from) + want + html.slice(to + CLOSE.length));
    console.log(`actualizado ${rel}`);
  });
 });
});

if (stale) process.exit(1);
if (CHECK) console.log("El temario impreso coincide con la guía en las doce páginas.");
