/**
 * Full exam simulator. Draws a weighted sample from the six domain banks
 * registered in window.QUIZ_BANK and runs it like the real thing: one
 * question at a time, a countdown, flags, no feedback until you submit.
 *
 * Mounts into <div id="exam-root"></div>.
 */
(function () {
  const root = document.getElementById("exam-root");
  if (!root || !window.QUIZ_BANK) return;

  /* ---- exam shape ----------------------------------------------------- */

  // SCS-C03 is 65 questions in 170 minutes. The per-domain counts follow the
  // official weights (16/14/18/20/18/14) and are chosen to total exactly 65.
  const TOTAL_MINUTES = 170;
  const PASS_PERCENT = 75;
  const BLUEPRINT = [
    { id: "detection", weight: 16, count: 10 },
    { id: "incident-response", weight: 14, count: 9 },
    { id: "infrastructure-security", weight: 18, count: 12 },
    { id: "iam", weight: 20, count: 13 },
    { id: "data-protection", weight: 18, count: 12 },
    { id: "governance", weight: 14, count: 9 },
  ];

  const STRINGS = {
    es: {
      domains: {
        detection: "Detection",
        "incident-response": "Incident Response",
        "infrastructure-security": "Infrastructure Security",
        iam: "Identity and Access Management",
        "data-protection": "Data Protection",
        governance: "Security Foundations & Governance",
      },
      introTitle: "Simulacro de examen completo",
      introBody:
        "65 preguntas en 170 minutos, con la misma mezcla por dominio que el examen real. No verás si aciertas hasta que entregues.",
      introList: [
        "Las preguntas se eligen al azar de los seis bancos, respetando los pesos oficiales.",
        "Puedes marcar preguntas y volver a ellas desde el navegador de abajo.",
        "El progreso se guarda: si cierras la pestaña, retomas donde lo dejaste.",
        "Al entregar verás la nota, el desglose por dominio y la explicación de cada pregunta.",
      ],
      start: "Empezar simulacro",
      resume: "Continuar simulacro",
      startOver: "Empezar uno nuevo",
      inProgress: (a, t) => `Tienes un simulacro a medias: ${a} de ${t} respondidas.`,
      question: (n, t) => `Pregunta ${n} de ${t}`,
      prev: "Anterior",
      next: "Siguiente",
      flag: "Marcar",
      unflag: "Quitar marca",
      submit: "Entregar examen",
      submitConfirm: (n) =>
        n > 0
          ? `Te quedan ${n} preguntas sin responder. ¿Entregar de todas formas?`
          : "¿Entregar el examen?",
      timeUp: "Se acabó el tiempo. El examen se ha entregado automáticamente.",
      timeLeft: "Tiempo restante",
      navigator: "Navegador de preguntas",
      answeredLegend: "Respondida",
      flaggedLegend: "Marcada",
      unansweredLegend: "Sin responder",
      results: "Resultado del simulacro",
      passed: "APROBADO",
      failed: "NO APROBADO",
      scoreLine: (c, t, p) => `${c} de ${t} correctas · ${p}%`,
      passNote: `Se aprueba a partir del ${PASS_PERCENT}%. El examen real usa una puntuación escalada de 100 a 1000 con corte en 750, así que tómalo como una referencia, no como una nota oficial.`,
      byDomain: "Desglose por dominio",
      domain: "Dominio",
      result: "Resultado",
      reviewAll: "Repasar todas las preguntas",
      retake: "Hacer otro simulacro",
      yourAnswer: "Tu respuesta",
      correctAnswer: "Respuesta correcta",
      noAnswer: "Sin responder",
      choose: (n) => `Elige ${n}`,
      weight: "Peso",
    },
    en: {
      domains: {
        detection: "Detection",
        "incident-response": "Incident Response",
        "infrastructure-security": "Infrastructure Security",
        iam: "Identity and Access Management",
        "data-protection": "Data Protection",
        governance: "Security Foundations & Governance",
      },
      introTitle: "Full exam simulation",
      introBody:
        "65 questions in 170 minutes, with the same domain mix as the real exam. You won't see whether you're right until you submit.",
      introList: [
        "Questions are drawn at random from the six banks, following the official weights.",
        "You can flag questions and jump back to them from the navigator below.",
        "Progress is saved: close the tab and you pick up where you left off.",
        "On submit you get your score, the per-domain breakdown and every explanation.",
      ],
      start: "Start simulation",
      resume: "Resume simulation",
      startOver: "Start a new one",
      inProgress: (a, t) => `You have one in progress: ${a} of ${t} answered.`,
      question: (n, t) => `Question ${n} of ${t}`,
      prev: "Previous",
      next: "Next",
      flag: "Flag",
      unflag: "Remove flag",
      submit: "Submit exam",
      submitConfirm: (n) =>
        n > 0
          ? `You have ${n} unanswered questions. Submit anyway?`
          : "Submit the exam?",
      timeUp: "Time is up. The exam was submitted automatically.",
      timeLeft: "Time left",
      navigator: "Question navigator",
      answeredLegend: "Answered",
      flaggedLegend: "Flagged",
      unansweredLegend: "Unanswered",
      results: "Simulation result",
      passed: "PASS",
      failed: "NOT PASSED",
      scoreLine: (c, t, p) => `${c} of ${t} correct · ${p}%`,
      passNote: `The pass mark here is ${PASS_PERCENT}%. The real exam uses a scaled score from 100 to 1000 with a cut at 750, so treat this as a guide, not an official grade.`,
      byDomain: "Per-domain breakdown",
      domain: "Domain",
      result: "Result",
      reviewAll: "Review every question",
      retake: "Take another simulation",
      yourAnswer: "Your answer",
      correctAnswer: "Correct answer",
      noAnswer: "Not answered",
      choose: (n) => `Choose ${n}`,
      weight: "Weight",
    },
  };

  const LANG = (document.documentElement.lang || "es").slice(0, 2);
  const T = STRINGS[LANG] || STRINGS.es;
  const STORE_KEY = `scs-c03:exam:${LANG}`;
  const EXAM_SUMMARY_KEY = `scs-c03:examsummary:${LANG}`;

  /* ---- helpers -------------------------------------------------------- */

  const isMulti = (item) => Array.isArray(item.correct);
  // `wanted` is for DRAWING (always a list of indices to highlight);
  // `expected` is for COMPARING, and must keep the shape the answer is stored
  // in — a single answer is a number, so comparing it against a one-item array
  // would never match.
  const wanted = (item) =>
    isMulti(item) ? item.correct.slice().sort((a, b) => a - b) : [item.correct];
  const expected = (item) => (isMulti(item) ? item.correct.slice().sort((a, b) => a - b) : item.correct);

  function sameAnswer(a, b) {
    if (a === null || a === undefined || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (!Array.isArray(a)) return a === b;
    if (a.length !== b.length) return false;
    const x = a.slice().sort((m, n) => m - n);
    const y = b.slice().sort((m, n) => m - n);
    return x.every((v, i) => v === y[i]);
  }

  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable — the exam still runs, it just won't survive a reload */
    }
  }

  function removeKey(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      /* nothing to do */
    }
  }

  function sample(arr, n) {
    const pool = arr.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(n, pool.length));
  }

  function formatTime(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  }

  /* ---- session -------------------------------------------------------- */

  // A session stores which questions were drawn (by domain + hash) rather than
  // the question objects, so a reload rebuilds it from the current banks and
  // an edited question never resurrects a stale copy.
  let session = null;
  let ticker = null;

  function buildSession() {
    const picked = [];
    BLUEPRINT.forEach((d) => {
      const bank = window.QUIZ_BANK[d.id] || [];
      sample(bank, d.count).forEach((item) => {
        picked.push({ domain: d.id, key: hash(item.q) });
      });
    });
    return {
      picked,
      answers: {},
      flags: [],
      startedAt: Date.now(),
      endsAt: Date.now() + TOTAL_MINUTES * 60 * 1000,
      current: 0,
      submitted: false,
      submittedAt: null,
    };
  }

  // Resolve stored references back to live question objects. Anything that no
  // longer matches (question edited or removed) is dropped rather than guessed.
  function resolve(sess) {
    const out = [];
    sess.picked.forEach((ref) => {
      const bank = window.QUIZ_BANK[ref.domain] || [];
      const item = bank.find((q) => hash(q.q) === ref.key);
      if (item) out.push({ domain: ref.domain, key: ref.key, item });
    });
    return out;
  }

  function saveSession() {
    if (session) writeJSON(STORE_KEY, session);
  }

  function timeLeft() {
    if (!session) return 0;
    if (session.submitted) return 0;
    return Math.max(0, session.endsAt - Date.now());
  }

  /* ---- rendering: intro ----------------------------------------------- */

  function renderIntro() {
    const stored = readJSON(STORE_KEY, null);
    const hasLive =
      stored && !stored.submitted && Array.isArray(stored.picked) && stored.picked.length;

    root.innerHTML = "";
    const box = document.createElement("section");
    box.className = "exam-intro";

    const h = document.createElement("h2");
    h.textContent = T.introTitle;
    box.appendChild(h);

    const p = document.createElement("p");
    p.className = "lede";
    p.textContent = T.introBody;
    box.appendChild(p);

    const ul = document.createElement("ul");
    T.introList.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    box.appendChild(ul);

    const table = document.createElement("table");
    table.setAttribute("role", "table");
    table.innerHTML =
      `<tr><th>${T.domain}</th><th>${T.weight}</th><th>${LANG === "es" ? "Preguntas" : "Questions"}</th></tr>` +
      BLUEPRINT.map(
        (d) => `<tr><td>${T.domains[d.id]}</td><td>${d.weight}%</td><td>${d.count}</td></tr>`
      ).join("");
    box.appendChild(table);

    const actions = document.createElement("div");
    actions.className = "exam-actions";

    if (hasLive) {
      const answered = Object.keys(stored.answers || {}).length;
      const note = document.createElement("p");
      note.className = "exam-resume-note";
      note.textContent = T.inProgress(answered, stored.picked.length);
      box.appendChild(note);

      const resume = document.createElement("button");
      resume.className = "exam-btn primary";
      resume.type = "button";
      resume.textContent = T.resume;
      resume.addEventListener("click", () => {
        session = stored;
        // a countdown that kept running while the tab was closed is the honest
        // behaviour for a timed exam, but never resurrect a finished one
        if (timeLeft() <= 0) submit(true);
        else renderExam();
      });
      actions.appendChild(resume);

      const fresh = document.createElement("button");
      fresh.className = "exam-btn";
      fresh.type = "button";
      fresh.textContent = T.startOver;
      fresh.addEventListener("click", () => {
        session = buildSession();
        saveSession();
        renderExam();
      });
      actions.appendChild(fresh);
    } else {
      const start = document.createElement("button");
      start.className = "exam-btn primary";
      start.type = "button";
      start.textContent = T.start;
      start.addEventListener("click", () => {
        session = buildSession();
        saveSession();
        renderExam();
      });
      actions.appendChild(start);
    }

    box.appendChild(actions);
    root.appendChild(box);

    if (stored && stored.submitted) renderResults(true);
  }

  /* ---- rendering: exam ------------------------------------------------ */

  function startTicker() {
    if (ticker) clearInterval(ticker);
    ticker = setInterval(() => {
      const el = document.getElementById("exam-clock");
      if (!el) return;
      const left = timeLeft();
      el.textContent = formatTime(left);
      el.classList.toggle("low", left < 15 * 60 * 1000);
      if (left <= 0) submit(true);
    }, 1000);
  }

  function renderExam() {
    const list = resolve(session);
    if (!list.length) {
      removeKey(STORE_KEY);
      renderIntro();
      return;
    }
    if (session.current >= list.length) session.current = list.length - 1;

    const entry = list[session.current];
    const item = entry.item;
    const multi = isMulti(item);
    const given = session.answers[entry.key];
    const flagged = session.flags.includes(entry.key);

    root.innerHTML = "";

    /* header: counter + clock */
    const bar = document.createElement("div");
    bar.className = "exam-bar";
    const counter = document.createElement("span");
    counter.className = "exam-counter";
    counter.textContent = T.question(session.current + 1, list.length);
    bar.appendChild(counter);

    const clockWrap = document.createElement("span");
    clockWrap.className = "exam-clock-wrap";
    clockWrap.append(`${T.timeLeft}: `);
    const clock = document.createElement("strong");
    clock.id = "exam-clock";
    clock.textContent = formatTime(timeLeft());
    if (timeLeft() < 15 * 60 * 1000) clock.classList.add("low");
    clockWrap.appendChild(clock);
    bar.appendChild(clockWrap);
    root.appendChild(bar);

    /* question card */
    const card = document.createElement("div");
    card.className = "quiz-item";

    const head = document.createElement("div");
    head.className = "quiz-head";
    const tag = document.createElement("span");
    tag.className = "quiz-tag";
    tag.textContent = T.domains[entry.domain];
    head.appendChild(tag);
    if (multi) {
      const badge = document.createElement("span");
      badge.className = "quiz-multi";
      badge.textContent = T.choose(item.correct.length);
      head.appendChild(badge);
    }
    const flagBtn = document.createElement("button");
    flagBtn.type = "button";
    flagBtn.className = "quiz-flag" + (flagged ? " on" : "");
    flagBtn.textContent = flagged ? "★" : "☆";
    flagBtn.title = flagged ? T.unflag : T.flag;
    flagBtn.setAttribute("aria-label", flagged ? T.unflag : T.flag);
    flagBtn.setAttribute("aria-pressed", flagged ? "true" : "false");
    flagBtn.addEventListener("click", () => {
      const at = session.flags.indexOf(entry.key);
      if (at >= 0) session.flags.splice(at, 1);
      else session.flags.push(entry.key);
      saveSession();
      renderExam();
    });
    head.appendChild(flagBtn);
    card.appendChild(head);

    const qEl = document.createElement("div");
    qEl.className = "quiz-q";
    qEl.textContent = item.q;
    card.appendChild(qEl);

    const opts = document.createElement("div");
    opts.className = "quiz-opts";
    item.options.forEach((text, oi) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt";
      btn.type = "button";
      btn.textContent = text;
      const picked = multi
        ? Array.isArray(given) && given.includes(oi)
        : given === oi;
      // during the exam nothing is graded — selection is the only feedback
      if (picked) btn.classList.add("selected");
      btn.setAttribute("aria-pressed", picked ? "true" : "false");
      btn.addEventListener("click", () => {
        if (multi) {
          const cur = Array.isArray(given) ? given.slice() : [];
          const at = cur.indexOf(oi);
          if (at >= 0) cur.splice(at, 1);
          else if (cur.length < item.correct.length) cur.push(oi);
          if (cur.length) session.answers[entry.key] = cur;
          else delete session.answers[entry.key];
        } else {
          session.answers[entry.key] = oi;
        }
        saveSession();
        renderExam();
      });
      opts.appendChild(btn);
    });
    card.appendChild(opts);
    root.appendChild(card);

    /* prev / next / submit */
    const nav = document.createElement("div");
    nav.className = "exam-actions";

    const prev = document.createElement("button");
    prev.className = "exam-btn";
    prev.type = "button";
    prev.textContent = "← " + T.prev;
    prev.disabled = session.current === 0;
    prev.addEventListener("click", () => {
      session.current--;
      saveSession();
      renderExam();
    });
    nav.appendChild(prev);

    const next = document.createElement("button");
    next.className = "exam-btn";
    next.type = "button";
    next.textContent = T.next + " →";
    next.disabled = session.current === list.length - 1;
    next.addEventListener("click", () => {
      session.current++;
      saveSession();
      renderExam();
    });
    nav.appendChild(next);

    const submitBtn = document.createElement("button");
    submitBtn.className = "exam-btn primary";
    submitBtn.type = "button";
    submitBtn.textContent = T.submit;
    submitBtn.addEventListener("click", () => {
      const missing = list.length - Object.keys(session.answers).length;
      if (window.confirm(T.submitConfirm(missing))) submit(false);
    });
    nav.appendChild(submitBtn);
    root.appendChild(nav);

    /* question navigator */
    const navBox = document.createElement("div");
    navBox.className = "exam-nav";
    const navTitle = document.createElement("h4");
    navTitle.textContent = T.navigator;
    navBox.appendChild(navTitle);

    const grid = document.createElement("div");
    grid.className = "exam-grid";
    list.forEach((e, i) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "exam-cell";
      if (session.answers[e.key] !== undefined) cell.classList.add("answered");
      if (session.flags.includes(e.key)) cell.classList.add("flagged");
      if (i === session.current) cell.classList.add("current");
      cell.textContent = i + 1;
      cell.addEventListener("click", () => {
        session.current = i;
        saveSession();
        renderExam();
      });
      grid.appendChild(cell);
    });
    navBox.appendChild(grid);

    const legend = document.createElement("p");
    legend.className = "exam-legend";
    legend.innerHTML =
      `<span class="k answered"></span>${T.answeredLegend}` +
      `<span class="k flagged"></span>${T.flaggedLegend}` +
      `<span class="k"></span>${T.unansweredLegend}`;
    navBox.appendChild(legend);
    root.appendChild(navBox);

    startTicker();
  }

  /* ---- rendering: results --------------------------------------------- */

  function submit(auto) {
    if (ticker) clearInterval(ticker);
    session.submitted = true;
    session.submittedAt = Date.now();
    saveSession();
    renderResults(false, auto);
  }

  function renderResults(fromStore, auto) {
    if (fromStore) session = readJSON(STORE_KEY, null);
    if (!session) return renderIntro();
    if (ticker) clearInterval(ticker);

    const list = resolve(session);
    const rows = BLUEPRINT.map((d) => ({ id: d.id, total: 0, ok: 0 }));
    let correct = 0;

    list.forEach((e) => {
      const row = rows.find((r) => r.id === e.domain);
      row.total++;
      if (sameAnswer(session.answers[e.key], expected(e.item))) {
        correct++;
        row.ok++;
      }
    });

    const pct = list.length ? Math.round((correct / list.length) * 100) : 0;
    const passed = pct >= PASS_PERCENT;

    // leave a roll-up for the hub so the last result is visible from there
    writeJSON(EXAM_SUMMARY_KEY, {
      correct,
      total: list.length,
      pct,
      passed,
      ts: session.submittedAt || Date.now(),
    });

    root.innerHTML = "";

    if (auto) {
      const warn = document.createElement("div");
      warn.className = "callout warn";
      warn.innerHTML = `<b>${LANG === "es" ? "Tiempo agotado" : "Time up"}</b>${T.timeUp}`;
      root.appendChild(warn);
    }

    const head = document.createElement("section");
    head.className = "exam-result " + (passed ? "pass" : "fail");
    head.innerHTML =
      `<h2>${T.results}</h2>` +
      `<p class="exam-verdict">${passed ? T.passed : T.failed}</p>` +
      `<p class="exam-score">${T.scoreLine(correct, list.length, pct)}</p>` +
      `<p class="exam-note">${T.passNote}</p>`;
    root.appendChild(head);

    const h3 = document.createElement("h3");
    h3.textContent = T.byDomain;
    root.appendChild(h3);

    const table = document.createElement("table");
    table.setAttribute("role", "table");
    table.innerHTML =
      `<tr><th>${T.domain}</th><th>${T.result}</th><th>%</th></tr>` +
      rows
        .map((r) => {
          const p = r.total ? Math.round((r.ok / r.total) * 100) : 0;
          return `<tr><td>${T.domains[r.id]}</td><td>${r.ok} / ${r.total}</td><td>${p}%</td></tr>`;
        })
        .join("");
    root.appendChild(table);

    const actions = document.createElement("div");
    actions.className = "exam-actions";
    const again = document.createElement("button");
    again.className = "exam-btn primary";
    again.type = "button";
    again.textContent = T.retake;
    again.addEventListener("click", () => {
      removeKey(STORE_KEY);
      session = buildSession();
      saveSession();
      renderExam();
    });
    actions.appendChild(again);
    root.appendChild(actions);

    const h4 = document.createElement("h3");
    h4.textContent = T.reviewAll;
    root.appendChild(h4);

    list.forEach((e, i) => {
      const item = e.item;
      const multi = isMulti(item);
      const given = session.answers[e.key];
      const ok = sameAnswer(given, expected(item));

      const card = document.createElement("div");
      card.className = "quiz-item";

      const hd = document.createElement("div");
      hd.className = "quiz-head";
      const tag = document.createElement("span");
      tag.className = "quiz-tag";
      tag.textContent = T.domains[e.domain];
      hd.appendChild(tag);
      if (multi) {
        const badge = document.createElement("span");
        badge.className = "quiz-multi";
        badge.textContent = T.choose(item.correct.length);
        hd.appendChild(badge);
      }
      card.appendChild(hd);

      const qEl = document.createElement("div");
      qEl.className = "quiz-q";
      qEl.textContent = `${i + 1}. ${item.q}`;
      card.appendChild(qEl);

      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      const need = wanted(item);
      const picked = multi ? (Array.isArray(given) ? given : []) : [given];
      item.options.forEach((text, oi) => {
        const btn = document.createElement("button");
        btn.className = "quiz-opt";
        btn.type = "button";
        btn.disabled = true;
        btn.textContent = text;
        if (need.includes(oi) && picked.includes(oi)) btn.classList.add("correct");
        else if (picked.includes(oi)) btn.classList.add("incorrect");
        else if (need.includes(oi)) {
          btn.classList.add("missed");
          btn.setAttribute("data-note", LANG === "es" ? "Faltaba esta" : "This one was required");
        }
        opts.appendChild(btn);
      });
      card.appendChild(opts);

      if (given === undefined) {
        const none = document.createElement("p");
        none.className = "exam-unanswered";
        none.textContent = T.noAnswer;
        card.appendChild(none);
      }

      const explain = document.createElement("div");
      explain.className = "quiz-explain show";
      explain.innerHTML = `<b>${ok ? (LANG === "es" ? "Correcto." : "Correct.") : (LANG === "es" ? "Explicación:" : "Explanation:")}</b> ${item.explain}`;
      card.appendChild(explain);

      root.appendChild(card);
    });
  }

  /* ---- boot ----------------------------------------------------------- */

  const stored = readJSON(STORE_KEY, null);
  if (stored && stored.submitted) {
    session = stored;
    renderResults(false);
  } else {
    renderIntro();
  }
})();
