/**
 * Generic quiz engine. Expects a global array `QUIZ_DATA` defined by the
 * module page before this script runs, and a <div id="quiz-root"></div>
 * mount point. Each item: { tag, q, options: [string], correct: index, explain }
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
    },
    en: {
      answered: (a, t) => `${a} / ${t} answered`,
      correctCount: (n) => `${n} correct`,
      correct: "Correct.",
      explanation: "Explanation:",
      reset: "Reset quiz",
      resetConfirm: "This will erase your saved answers for this quiz. Sure?",
      saved: "Your progress is saved in this browser.",
    },
  };

  const LANG = (document.documentElement.lang || "es").slice(0, 2);
  const T = STRINGS[LANG] || STRINGS.es;

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

  const saved = load();
  const state = QUIZ_DATA.map((item, i) => {
    const v = saved[keys[i]];
    // ignore anything that isn't a valid option index for this question
    return Number.isInteger(v) && v >= 0 && v < item.options.length ? v : null;
  });

  /* ---- rendering ------------------------------------------------------ */

  function score() {
    return state.filter((v, i) => v === QUIZ_DATA[i].correct).length;
  }

  function answered() {
    return state.filter((v) => v !== null).length;
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
      const card = document.createElement("div");
      card.className = "quiz-item";

      const tag = document.createElement("div");
      tag.className = "quiz-tag";
      tag.textContent = item.tag || "IAM";
      card.appendChild(tag);

      const qEl = document.createElement("div");
      qEl.className = "quiz-q";
      qEl.textContent = `${qi + 1}. ${item.q}`;
      card.appendChild(qEl);

      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      item.options.forEach((optText, oi) => {
        const btn = document.createElement("button");
        btn.className = "quiz-opt";
        btn.type = "button";
        btn.textContent = optText;
        if (chosen !== null) {
          btn.disabled = true;
          if (oi === item.correct) btn.classList.add("correct");
          else if (oi === chosen) btn.classList.add("incorrect");
        }
        btn.addEventListener("click", () => {
          if (state[qi] !== null) return;
          state[qi] = oi;
          save();
          render();
        });
        opts.appendChild(btn);
      });
      card.appendChild(opts);

      const explain = document.createElement("div");
      explain.className = "quiz-explain" + (chosen !== null ? " show" : "");
      explain.innerHTML = `<b>${chosen === item.correct ? T.correct : T.explanation}</b> ${item.explain}`;
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
