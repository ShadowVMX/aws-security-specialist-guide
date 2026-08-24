/**
 * English UI strings variant of quiz.js. Expects a global array `QUIZ_DATA`
 * defined by the module page before this script runs, and a
 * <div id="quiz-root"></div> mount point. Each item:
 * { tag, q, options: [string], correct: index, explain }
 */
(function () {
  const root = document.getElementById("quiz-root");
  if (!root || typeof QUIZ_DATA === "undefined") return;

  const state = QUIZ_DATA.map(() => null); // stores chosen option index or null

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
        <span>${answered()} / ${total} answered</span>
        <span>${score()} correct</span>
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
          render();
        });
        opts.appendChild(btn);
      });
      card.appendChild(opts);

      const explain = document.createElement("div");
      explain.className = "quiz-explain" + (chosen !== null ? " show" : "");
      explain.innerHTML = `<b>${chosen === item.correct ? "Correct." : "Explanation:"}</b> ${item.explain}`;
      card.appendChild(explain);

      root.appendChild(card);
    });

    const resetBtn = document.createElement("button");
    resetBtn.className = "quiz-reset";
    resetBtn.type = "button";
    resetBtn.textContent = "Reset quiz";
    resetBtn.addEventListener("click", () => {
      state.fill(null);
      render();
    });
    root.appendChild(resetBtn);
  }

  render();
})();
