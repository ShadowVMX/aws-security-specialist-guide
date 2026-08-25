/**
 * Generic quiz engine. Expects a global array `QUIZ_DATA` defined by the
 * module page before this script runs, and a <div id="quiz-root"></div>
 * mount point.
 *
 * Each item: { tag, q, options: [string], correct, explain }
 *   correct: <index>   → single answer, picking an option answers it
 *   correct: [i, j]    → multiple response ("choose TWO"), options toggle and
 *                        a check button submits them; scored all-or-nothing,
 *                        the way the real exam scores them.
 *
 * Answers and study preferences are saved to localStorage. Answers are always
 * stored as ORIGINAL option indices, so turning shuffle on or off never
 * invalidates saved progress.
 */
(function () {
  const root = document.getElementById("quiz-root");
  if (!root || typeof QUIZ_DATA === "undefined") return;

  const STRINGS = {
    es: {
      answered: (a, t) => `${a} / ${t} respondidas`,
      correctCount: (n) => `${n} correctas`,
      correct: "Correcto.",
      explanation: "Explicación:",
      reset: "Reiniciar quiz",
      resetConfirm:
        "Esto borrará tus respuestas guardadas de este quiz. ¿Seguro?",
      saved: "Tu progreso se guarda en este navegador.",
      choose: (n) => `Elige ${n}`,
      check: "Comprobar respuesta",
      pick: (n) => `Selecciona ${n} opciones`,
      missed: "Faltaba esta",
      allTopics: "Todos los temas",
      viewAll: "Todas",
      viewUnanswered: "Sin responder",
      viewWrong: "Solo falladas",
      viewFlagged: "Marcadas",
      shuffle: "Barajar",
      reshuffle: "Volver a barajar",
      showing: (n, t) => `Mostrando ${n} de ${t}`,
      empty: "No hay preguntas que cumplan este filtro.",
      flag: "Marcar para repasar",
      unflag: "Quitar marca",
    },
    en: {
      answered: (a, t) => `${a} / ${t} answered`,
      correctCount: (n) => `${n} correct`,
      correct: "Correct.",
      explanation: "Explanation:",
      reset: "Reset quiz",
      resetConfirm: "This will erase your saved answers for this quiz. Sure?",
      saved: "Your progress is saved in this browser.",
      choose: (n) => `Choose ${n}`,
      check: "Check answer",
      pick: (n) => `Select ${n} options`,
      missed: "This one was required",
      allTopics: "All topics",
      viewAll: "All",
      viewUnanswered: "Unanswered",
      viewWrong: "Wrong only",
      viewFlagged: "Flagged",
      shuffle: "Shuffle",
      reshuffle: "Shuffle again",
      showing: (n, t) => `Showing ${n} of ${t}`,
      empty: "No questions match this filter.",
      flag: "Flag for review",
      unflag: "Remove flag",
    },
  };

  const LANG = (document.documentElement.lang || "es").slice(0, 2);
  const T = STRINGS[LANG] || STRINGS.es;

  /* ---- answer shape --------------------------------------------------- */

  const isMulti = (item) => Array.isArray(item.correct);
  const correctSet = (item) =>
    isMulti(item) ? item.correct.slice().sort((a, b) => a - b) : [item.correct];

  function sameAnswer(a, b) {
    if (a === null || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (!Array.isArray(a)) return a === b;
    if (a.length !== b.length) return false;
    const x = a.slice().sort((m, n) => m - n);
    const y = b.slice().sort((m, n) => m - n);
    return x.every((v, i) => v === y[i]);
  }

  function isRight(qi) {
    const item = QUIZ_DATA[qi];
    return sameAnswer(state[qi], isMulti(item) ? correctSet(item) : item.correct);
  }

  /* ---- storage -------------------------------------------------------- */

  // Module id from the URL: /modules/iam/index.html -> "iam". Falls back to
  // the whole path so two quizzes can never share a key by accident.
  function moduleId() {
    const parts = location.pathname.split("/").filter(Boolean);
    parts.pop(); // drop index.html
    return parts.pop() || location.pathname;
  }

  const MOD = moduleId();
  const ANSWER_KEY = `scs-c03:quiz:${LANG}:${MOD}`;
  const PREFS_KEY = `scs-c03:quizprefs:${LANG}:${MOD}`;
  const SUMMARY_KEY = `scs-c03:summary:${LANG}:${MOD}`;

  // Answers are stored against a hash of the question rather than its index,
  // so adding or reordering questions later doesn't silently shift every saved
  // answer onto the wrong question. The options are part of the hash too: a
  // saved answer is an option INDEX, so if the options are reordered or
  // reworded that index now points somewhere else, and the honest thing is to
  // drop it rather than resurrect it against the wrong option.
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  const keys = QUIZ_DATA.map((item) => hash(item.q + "\u0000" + item.options.join("\u0000")));

  // Any storage access can throw (private mode, site data blocked), and a
  // quiz that works is worth more than one that saves, so failures are silent.
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
      /* storage unavailable — keep going in memory only */
    }
  }

  function removeKey(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      /* nothing to do */
    }
  }

  // A stored value is only accepted if it still fits the question it belongs
  // to — a question that changed from single to multiple response, or lost an
  // option, must not restore an answer that no longer makes sense.
  function sanitise(v, item) {
    const inRange = (n) =>
      Number.isInteger(n) && n >= 0 && n < item.options.length;
    if (isMulti(item)) {
      if (!Array.isArray(v) || v.length !== item.correct.length) return null;
      const uniq = Array.from(new Set(v));
      return uniq.length === v.length && v.every(inRange) ? v : null;
    }
    return inRange(v) ? v : null;
  }

  const savedAnswers = readJSON(ANSWER_KEY, {});
  const state = QUIZ_DATA.map((item, i) => sanitise(savedAnswers[keys[i]], item));

  // options toggled on a multiple-response question but not submitted yet
  const pending = QUIZ_DATA.map(() => []);

  const storedPrefs = readJSON(PREFS_KEY, {});
  const prefs = {
    shuffle: storedPrefs.shuffle === true,
    // a stored seed keeps the shuffled order stable across reloads: a study
    // list that reorders itself every refresh is disorienting
    seed: Number.isFinite(storedPrefs.seed) ? storedPrefs.seed : Date.now() % 2147483647,
    flags: Array.isArray(storedPrefs.flags) ? storedPrefs.flags.filter((k) => keys.includes(k)) : [],
  };

  function savePrefs() {
    writeJSON(PREFS_KEY, prefs);
  }

  function saveAnswers() {
    const out = {};
    state.forEach((v, i) => {
      if (v !== null) out[keys[i]] = v;
    });
    writeJSON(ANSWER_KEY, out);
    saveSummary();
  }

  // A tiny roll-up the hub can read on its own. Without it the hub would have
  // to load all six question banks (~300 KB) just to know how many questions
  // each module has.
  function saveSummary() {
    writeJSON(SUMMARY_KEY, {
      total: QUIZ_DATA.length,
      answered: answered(),
      correct: score(),
      ts: Date.now(),
    });
  }

  /* ---- shuffling ------------------------------------------------------ */

  // Deterministic PRNG so the same seed always rebuilds the same order.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(arr, seed) {
    const rand = rng(seed);
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // Option order for a question. Answers are stored as original indices, so
  // this only ever affects what is drawn, never what is saved.
  function optionOrder(qi) {
    const n = QUIZ_DATA[qi].options.length;
    const identity = Array.from({ length: n }, (_, i) => i);
    if (!prefs.shuffle) return identity;
    // mix the seed with the question's own hash so questions don't all get
    // permuted the same way
    return shuffled(identity, (prefs.seed ^ parseInt(keys[qi], 36)) >>> 0);
  }

  function questionOrder() {
    const identity = QUIZ_DATA.map((_, i) => i);
    return prefs.shuffle ? shuffled(identity, prefs.seed) : identity;
  }

  /* ---- filtering ------------------------------------------------------ */

  const view = { mode: "all", tag: "all" };

  const TAGS = Array.from(new Set(QUIZ_DATA.map((q) => q.tag).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, LANG)
  );

  function passes(qi) {
    if (view.tag !== "all" && QUIZ_DATA[qi].tag !== view.tag) return false;
    if (view.mode === "unanswered") return state[qi] === null;
    if (view.mode === "wrong") return state[qi] !== null && !isRight(qi);
    if (view.mode === "flagged") return prefs.flags.includes(keys[qi]);
    return true;
  }

  function visible() {
    return questionOrder().filter(passes);
  }

  /* ---- rendering ------------------------------------------------------ */

  function score() {
    return state.reduce((n, v, i) => n + (isRight(i) ? 1 : 0), 0);
  }

  function answered() {
    return state.filter((v) => v !== null).length;
  }

  function select(labelled, value, onChange) {
    const sel = document.createElement("select");
    sel.className = "quiz-select";
    labelled.forEach(([v, label]) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = label;
      if (v === value) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  }

  function renderToolbar() {
    const bar = document.createElement("div");
    bar.className = "quiz-toolbar";

    bar.appendChild(
      select(
        [
          ["all", T.viewAll],
          ["unanswered", T.viewUnanswered],
          ["wrong", T.viewWrong],
          ["flagged", T.viewFlagged],
        ],
        view.mode,
        (v) => {
          view.mode = v;
          render();
        }
      )
    );

    bar.appendChild(
      select(
        [["all", T.allTopics]].concat(TAGS.map((t) => [t, t])),
        view.tag,
        (v) => {
          view.tag = v;
          render();
        }
      )
    );

    const shuffleBtn = document.createElement("button");
    shuffleBtn.type = "button";
    shuffleBtn.className = "quiz-toggle" + (prefs.shuffle ? " on" : "");
    shuffleBtn.setAttribute("aria-pressed", prefs.shuffle ? "true" : "false");
    shuffleBtn.textContent = T.shuffle;
    shuffleBtn.addEventListener("click", () => {
      prefs.shuffle = !prefs.shuffle;
      if (prefs.shuffle) prefs.seed = (Date.now() % 2147483647) >>> 0;
      savePrefs();
      render();
    });
    bar.appendChild(shuffleBtn);

    if (prefs.shuffle) {
      const again = document.createElement("button");
      again.type = "button";
      again.className = "quiz-toggle";
      again.textContent = T.reshuffle;
      again.addEventListener("click", () => {
        prefs.seed = (Date.now() % 2147483647) >>> 0;
        savePrefs();
        render();
      });
      bar.appendChild(again);
    }

    return bar;
  }

  function renderOption(item, qi, oi, optText) {
    const chosen = state[qi];
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.type = "button";
    btn.textContent = optText;

    const multi = isMulti(item);

    if (chosen !== null) {
      const wanted = correctSet(item);
      const picked = multi ? chosen : [chosen];
      btn.disabled = true;
      if (wanted.includes(oi) && picked.includes(oi)) btn.classList.add("correct");
      else if (picked.includes(oi)) btn.classList.add("incorrect");
      else if (wanted.includes(oi)) {
        // required but not picked — say so, or a wrong multi answer looks right
        btn.classList.add("missed");
        btn.setAttribute("data-note", T.missed);
      }
    } else if (multi) {
      btn.setAttribute("aria-pressed", pending[qi].includes(oi) ? "true" : "false");
      if (pending[qi].includes(oi)) btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      if (state[qi] !== null) return;
      if (multi) {
        const at = pending[qi].indexOf(oi);
        if (at >= 0) pending[qi].splice(at, 1);
        else pending[qi].push(oi);
      } else {
        state[qi] = oi;
        saveAnswers();
      }
      render();
    });
    return btn;
  }

  function renderCard(qi, position) {
    const item = QUIZ_DATA[qi];
    const chosen = state[qi];
    const multi = isMulti(item);
    const card = document.createElement("div");
    card.className = "quiz-item";

    const head = document.createElement("div");
    head.className = "quiz-head";

    const tag = document.createElement("span");
    tag.className = "quiz-tag";
    tag.textContent = item.tag || "IAM";
    head.appendChild(tag);

    if (multi) {
      const badge = document.createElement("span");
      badge.className = "quiz-multi";
      badge.textContent = T.choose(item.correct.length);
      head.appendChild(badge);
    }

    const flagged = prefs.flags.includes(keys[qi]);
    const flag = document.createElement("button");
    flag.type = "button";
    flag.className = "quiz-flag" + (flagged ? " on" : "");
    flag.textContent = flagged ? "★" : "☆";
    flag.title = flagged ? T.unflag : T.flag;
    flag.setAttribute("aria-label", flagged ? T.unflag : T.flag);
    flag.setAttribute("aria-pressed", flagged ? "true" : "false");
    flag.addEventListener("click", () => {
      const at = prefs.flags.indexOf(keys[qi]);
      if (at >= 0) prefs.flags.splice(at, 1);
      else prefs.flags.push(keys[qi]);
      savePrefs();
      render();
    });
    head.appendChild(flag);

    card.appendChild(head);

    const qEl = document.createElement("div");
    qEl.className = "quiz-q";
    qEl.textContent = `${position}. ${item.q}`;
    card.appendChild(qEl);

    const opts = document.createElement("div");
    opts.className = "quiz-opts";
    optionOrder(qi).forEach((oi) =>
      opts.appendChild(renderOption(item, qi, oi, item.options[oi]))
    );
    card.appendChild(opts);

    if (multi && chosen === null) {
      const need = item.correct.length;
      const ready = pending[qi].length === need;
      const check = document.createElement("button");
      check.className = "quiz-check";
      check.type = "button";
      check.disabled = !ready;
      check.textContent = ready ? T.check : T.pick(need);
      check.addEventListener("click", () => {
        if (pending[qi].length !== need) return;
        state[qi] = pending[qi].slice();
        saveAnswers();
        render();
      });
      card.appendChild(check);
    }

    const explain = document.createElement("div");
    explain.className = "quiz-explain" + (chosen !== null ? " show" : "");
    explain.innerHTML = `<b>${isRight(qi) ? T.correct : T.explanation}</b> ${item.explain}`;
    card.appendChild(explain);

    return card;
  }

  function render() {
    const total = QUIZ_DATA.length;
    const list = visible();

    root.innerHTML = `
      <div class="quiz-progress">
        <span>${T.answered(answered(), total)}</span>
        <span>${T.correctCount(score())}</span>
      </div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${(answered() / total) * 100}%"></div></div>
    `;

    root.appendChild(renderToolbar());

    if (list.length !== total) {
      const showing = document.createElement("p");
      showing.className = "quiz-showing";
      showing.textContent = T.showing(list.length, total);
      root.appendChild(showing);
    }

    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "quiz-empty";
      empty.textContent = T.empty;
      root.appendChild(empty);
    }

    list.forEach((qi, n) => root.appendChild(renderCard(qi, n + 1)));

    const footer = document.createElement("div");
    footer.className = "quiz-footer";

    const resetBtn = document.createElement("button");
    resetBtn.className = "quiz-reset";
    resetBtn.type = "button";
    resetBtn.textContent = T.reset;
    resetBtn.addEventListener("click", () => {
      // only worth confirming when there is something to lose
      if (answered() > 0 && !window.confirm(T.resetConfirm)) return;
      state.fill(null);
      pending.forEach((p) => (p.length = 0));
      prefs.flags.length = 0;
      savePrefs();
      removeKey(ANSWER_KEY);
      removeKey(SUMMARY_KEY);
      view.mode = "all";
      view.tag = "all";
      render();
    });
    footer.appendChild(resetBtn);

    const note = document.createElement("span");
    note.className = "quiz-saved-note";
    note.textContent = T.saved;
    footer.appendChild(note);

    root.appendChild(footer);
  }

  render();
  saveSummary();
})();
