#!/usr/bin/env node
/**
 * Checks that each question's source link points at a page about that question,
 * not merely at a page that exists.
 *
 *   node tools/check-sources.js           report suspected mismatches
 *   node tools/check-sources.js --titles  also dump every url and its title
 *
 * A 200 response proves a page is there. It does not prove it is the right
 * page: a KMS question linking to a live VPC page passes a link check and
 * still misleads the reader. So this fetches each page, takes its title, and
 * asks whether the title and the question share any meaningful term.
 *
 * Needs outbound HTTPS to docs.aws.amazon.com. Where that is blocked the run
 * says so instead of reporting phantom mismatches.
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
const DUMP = process.argv.includes("--titles");

function load(rel) {
  const src = fs.readFileSync(path.join(REPO, rel), "utf8");
  return new Function("window", src + "; return QUIZ_DATA;")({});
}

// Words too common to prove anything: if the only overlap is "aws" or "data",
// the link has not been shown to be relevant.
const STOP = new Set(
  ("aws amazon the and for with what how user guide developer latest doc docs " +
   "html service services page reference con los las del que para una uno por " +
   "como más este esta cuando donde sobre entre desde hasta cada todo todos " +
   "data security access management overview introduction welcome using use " +
   "your you are can not but its it's").split(/\s+/)
);

function terms(s) {
  return new Set(
    String(s)
      .toLowerCase()
      .replace(/<[^>]+>/g, " ")
      .replace(/[^a-z0-9áéíóúüñ\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length >= 4 && !STOP.has(w))
  );
}

async function titleOf(url, attempt = 0) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "scs-c03-guide-source-check" },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const html = await res.text();
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!m) return { error: "sin <title>" };
    // Some AWS guides render the page title in the browser, so the served
    // <title> is just the guide name. The h1 is in the HTML either way.
    const h = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    return {
      title: m[1].replace(/\s+/g, " ").trim(),
      h1: h ? h[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "",
      final: res.url,
    };
  } catch (e) {
    // AWS throttles a burst of requests; one retry separates a rate limit
    // from a page that is really gone.
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      return titleOf(url, attempt + 1);
    }
    return { error: e.message };
  }
}

(async () => {
  /* gather every question that carries a source link */
  const items = [];
  for (const mod of MODULES) {
    load(`modules/${mod}/quiz-data.js`).forEach((q, i) => {
      const url = (q.explain.match(/href=\\?"(https:\/\/[^"\\]+)/) || [])[1];
      if (url) items.push({ mod, i, url, q });
      else items.push({ mod, i, url: null, q });
    });
  }

  const missing = items.filter((x) => !x.url);
  const linked = items.filter((x) => x.url);
  const urls = Array.from(new Set(linked.map((x) => x.url)));
  console.log(
    `${items.length} preguntas · ${linked.length} con enlace · ${urls.length} páginas distintas\n`
  );

  /* fetch each distinct page once */
  const titles = new Map();
  let unreachable = 0;
  const CONCURRENCY = 6;
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const got = await Promise.all(batch.map((u) => titleOf(u)));
    batch.forEach((u, j) => {
      titles.set(u, got[j]);
      if (got[j].error) unreachable++;
    });
  }

  if (unreachable === urls.length) {
    console.log("Ninguna página fue alcanzable: es la red, no los enlaces.");
    console.log("Ejecuta esto desde una máquina con salida a docs.aws.amazon.com.");
    process.exit(2);
  }

  // A page AWS has retired often answers 200 after redirecting to the guide's
  // front page. That is a dead source dressed as a live one, and the only way
  // to see it is to compare the url asked for with the url that answered.
  const redirected = urls.filter((u) => {
    const t = titles.get(u);
    return t.final && t.final.replace(/#.*$/, "") !== u;
  });

  if (DUMP) {
    console.log("::group::Título de cada página enlazada");
    urls.forEach((u) => {
      const t = titles.get(u);
      console.log(`${u}\t${t.error ? "ERROR " + t.error : t.title}\t${t.h1 || ""}`);
    });
    console.log("::endgroup::");
    console.log("");
  }

  if (redirected.length) {
    console.log("REDIRIGIDAS — la página pedida no es la que responde:");
    redirected.forEach((u) => console.log(`  ${u}\n     -> ${titles.get(u).final}`));
    console.log("");
  }

  /* compare each question against its page title */
  const broken = [];
  const suspect = [];

  linked.forEach(({ mod, i, url, q }) => {
    const got = titles.get(url);
    if (got.error) {
      broken.push(`[${mod}/${i}] ${got.error} — ${url}`);
      return;
    }
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
    const asked = terms(
      `${q.tag} ${q.q} ${correct.map((j) => q.options[j]).join(" ")}`
    );
    // the URL slug is written by AWS and describes the page as well as the title
    const page = terms(
      `${got.title} ${got.h1 || ""} ${url.split("/").slice(3).join(" ")}`
    );
    const shared = [...page].filter((w) => asked.has(w));

    if (!shared.length) {
      suspect.push(
        `[${mod}/${i}] ${q.tag}\n      pregunta: ${q.q.slice(0, 100)}\n      página  : ${got.h1 || got.title}\n      ${url}`
      );
    }
  });

  console.log(`${"—".repeat(64)}`);
  console.log(`páginas inalcanzables : ${unreachable}`);
  console.log(`preguntas sin enlace  : ${missing.length}`);
  console.log(`enlaces rotos         : ${broken.length}`);
  console.log(`redirigidas           : ${redirected.length}`);
  console.log(`sin relación aparente : ${suspect.length} de ${linked.length}`);

  if (missing.length) {
    console.log("\nSIN FUENTE:");
    missing.forEach((m) => console.log(`  [${m.mod}/${m.i}] ${m.q.tag}`));
  }
  if (broken.length) {
    console.log("\nROTOS:");
    broken.forEach((b) => console.log("  " + b));
  }
  if (suspect.length) {
    console.log("\nREVISAR — la página no comparte ningún término con la pregunta:");
    suspect.forEach((s) => console.log("  " + s + "\n"));
  }

  // A broken source is a hard failure. A term mismatch needs a human to look,
  // so it is reported loudly but does not by itself fail the build.
  process.exit(broken.length ? 1 : 0);
})();
