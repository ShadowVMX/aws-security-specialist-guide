/**
 * Hub progress panel. Reads the small roll-ups the quiz and exam engines
 * leave behind (scs-c03:summary:* and scs-c03:examsummary:*) and shows where
 * you stand, per domain and overall, plus a global reset.
 *
 * Deliberately does NOT load the question banks: the summaries exist so the
 * hub stays light.
 */
(function () {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  const LANG = (document.documentElement.lang || "es").slice(0, 2);
  const T =
    LANG === "en"
      ? {
          title: "Your progress",
          none: "No progress yet. Open a domain and answer a few questions — it saves automatically in this browser.",
          overall: (a, t) => `${a} of ${t} questions answered`,
          partial: (a) => `${a} questions answered so far`,
          accuracy: (p) => `${p}% correct`,
          lastExam: (p, c, t) => `Last simulation: ${p}% (${c}/${t})`,
          examPass: "passed",
          examFail: "not passed",
          reset: "Erase all progress",
          resetConfirm:
            "This erases your answers, flags and simulation results for every domain in this browser. Sure?",
          done: "done",
          notStarted: "Not started",
        }
      : {
          title: "Tu progreso",
          none: "Aún no hay progreso. Abre un dominio y responde algunas preguntas — se guarda solo en este navegador.",
          overall: (a, t) => `${a} de ${t} preguntas respondidas`,
          partial: (a) => `${a} preguntas respondidas hasta ahora`,
          accuracy: (p) => `${p}% de acierto`,
          lastExam: (p, c, t) => `Último simulacro: ${p}% (${c}/${t})`,
          examPass: "aprobado",
          examFail: "no aprobado",
          reset: "Borrar todo el progreso",
          resetConfirm:
            "Esto borra tus respuestas, marcas y resultados de simulacro de todos los dominios en este navegador. ¿Seguro?",
          done: "completado",
          notStarted: "Sin empezar",
        };

  function read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Module id straight from the card's own href, so this never needs a
  // hardcoded list that could drift from the actual modules on the page.
  function moduleIdFromHref(href) {
    const m = href.match(/modules\/([^/]+)\//);
    return m ? m[1] : null;
  }

  const cards = Array.from(grid.querySelectorAll("a.card[href*='modules/']"));
  if (!cards.length) return;

  let totalQ = 0;
  let totalA = 0;
  let totalC = 0;
  let any = false;

  let known = 0;

  cards.forEach((card) => {
    const id = moduleIdFromHref(card.getAttribute("href") || "");
    if (!id) return;
    const s = read(`scs-c03:summary:${LANG}:${id}`);

    if (s && s.total) {
      known++;
      totalQ += s.total;
      totalA += s.answered || 0;
      totalC += s.correct || 0;
      if (s.answered) any = true;
    }

    const pct = s && s.total ? Math.round(((s.answered || 0) / s.total) * 100) : 0;

    const wrap = document.createElement("div");
    wrap.className = "card-progress";

    const bar = document.createElement("div");
    bar.className = "card-progress-bar";
    const fill = document.createElement("div");
    fill.className = "card-progress-fill";
    fill.style.width = pct + "%";
    if (pct === 100) fill.classList.add("full");
    bar.appendChild(fill);
    wrap.appendChild(bar);

    const label = document.createElement("span");
    label.className = "card-progress-label";
    label.textContent =
      s && s.answered
        ? `${s.answered}/${s.total} · ${Math.round((s.correct / Math.max(1, s.answered)) * 100)}% ✓`
        : T.notStarted;
    wrap.appendChild(label);

    card.appendChild(wrap);
  });

  const exam = read(`scs-c03:examsummary:${LANG}`);
  if (!any && !exam) return; // nothing worth showing yet

  /* ---- summary panel above the grid ---- */

  const panel = document.createElement("section");
  panel.className = "progress-panel";

  const h = document.createElement("h2");
  h.textContent = T.title;
  panel.appendChild(h);

  const line = document.createElement("p");
  line.className = "progress-line";
  const accuracy = totalA ? Math.round((totalC / totalA) * 100) : 0;
  line.textContent =
    (known === cards.length ? T.overall(totalA, totalQ) : T.partial(totalA)) +
    ` · ${T.accuracy(accuracy)}`;
  panel.appendChild(line);

  const bar = document.createElement("div");
  bar.className = "progress-bar";
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = (known === cards.length && totalQ ? (totalA / totalQ) * 100 : 0) + "%";
  if (known !== cards.length) bar.classList.add("partial");
  bar.appendChild(fill);
  panel.appendChild(bar);

  if (exam && exam.total) {
    const ex = document.createElement("p");
    ex.className = "progress-exam " + (exam.passed ? "pass" : "fail");
    ex.textContent =
      T.lastExam(exam.pct, exam.correct, exam.total) +
      " — " +
      (exam.passed ? T.examPass : T.examFail);
    panel.appendChild(ex);
  }

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "progress-reset";
  reset.textContent = T.reset;
  reset.addEventListener("click", () => {
    if (!window.confirm(T.resetConfirm)) return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.indexOf("scs-c03:") === 0)
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      /* storage unavailable — nothing was saved to begin with */
    }
    location.reload();
  });
  panel.appendChild(reset);

  grid.parentNode.insertBefore(panel, grid);
})();
