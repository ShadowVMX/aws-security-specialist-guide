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
 * Progress is saved to localStorage so closing the tab doesn't lose it, and
 * the reset button clears the saved copy as well as the on-screen state.
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

  /* ---- persistence ---------------------------------------------------- */

  // Module id from the URL: /modules/iam/index.html -> "iam". Falls back to
  // the whole path so two quizzes can never share a key by accident.
  function moduleId() {
    const parts = location.pathname.split("/").filter(Boolean);
    parts.pop(); // drop index.html
    return parts.pop() || location.pathname;
  }

  const STORE_KEY = `scs-c03:quiz:${LANG}:${moduleId()}`;

  // Answers are stored against a hash of the question text rather than its
  // index, so adding or reordering questions later doesn't silently shift
  // every saved answer onto the wrong question.
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  const keys = QUIZ_DATA.map((item) => hash(item.q));

  // Any storage access can throw (private mode, site data blocked), and a
  // quiz that works is worth more than one that saves, so failures are silent.
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function save() {
    try {
      const out = {};
      state.forEach((v, i) => {
        if (v !== null) out[keys[i]] = v;
      });
      localStorage.setItem(STORE_KEY, JSON.stringify(out));
    } catch (e) {
      /* storage unavailable — keep going in memory only */
    }
  }

  function clearSaved() {
    try {
      localStorage.removeItem(STORE_KEY);
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

  const saved = load();
  const state = QUIZ_DATA.map((item, i) => sanitise(saved[keys[i]], item));

  // options toggled on a multiple-response question but not submitted yet
  const pending = QUIZ_DATA.map(() => []);

  /* ---- rendering ------------------------------------------------------ */

  function score() {
    return state.reduce((n, v, i) => n + (isRight(i) ? 1 : 0), 0);
  }

  function answered() {
    return state.filter((v) => v !== null).length;
  }

  function renderOption(item, qi, oi, optText) {
    const chosen = state[qi];
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.type = "button";
    btn.textContent = optText;

    const multi = isMulti(item);
    const answeredNow = chosen !== null;

    if (answeredNow) {
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
        save();
      }
      render();
    });
    return btn;
  }

  function render() {
    const total = QUIZ_DATA.length;
    root.innerHTML = `
      <div class="quiz-progress">
        <span>${T.answered(answered(), total)}</span>
        <span>${T.correctCount(score())}</span>
      </div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${(answered() / total) * 100}%"></div></div>
    `;

    QUIZ_DATA.forEach((item, qi) => {
      const chosen = state[qi];
      const multi = isMulti(item);
      const card = document.createElement("div");
      card.className = "quiz-item";

      const tag = document.createElement("div");
      tag.className = "quiz-tag";
      tag.textContent = item.tag || "IAM";
      card.appendChild(tag);

      if (multi) {
        const badge = document.createElement("span");
        badge.className = "quiz-multi";
        badge.textContent = T.choose(item.correct.length);
        card.appendChild(badge);
      }

      const qEl = document.createElement("div");
      qEl.className = "quiz-q";
      qEl.textContent = `${qi + 1}. ${item.q}`;
      card.appendChild(qEl);

      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      item.options.forEach((optText, oi) =>
        opts.appendChild(renderOption(item, qi, oi, optText))
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
          save();
          render();
        });
        card.appendChild(check);
      }

      const explain = document.createElement("div");
      explain.className = "quiz-explain" + (chosen !== null ? " show" : "");
      explain.innerHTML = `<b>${isRight(qi) ? T.correct : T.explanation}</b> ${item.explain}`;
      card.appendChild(explain);

      root.appendChild(card);
    });

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
      clearSaved();
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
})();
