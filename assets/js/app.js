/**
 * Shared page behaviour:
 *   - click-to-explain interactive diagrams (mouse and keyboard)
 *   - sidebar scrollspy on desktop
 *   - a collapsible index on phones, where the sidebar is hidden
 *   - a back-to-top button on long pages
 */
(function () {
  const LANG = (document.documentElement.lang || "es").slice(0, 2);
  const T =
    LANG === "en"
      ? { contents: "Contents", top: "Back to top" }
      : { contents: "Índice del módulo", top: "Volver arriba" };

  /* ---- interactive diagrams ------------------------------------------ */

  function explain(step) {
    const diagram = step.closest(".diagram");
    const box = diagram && diagram.querySelector(".dexplain");
    if (!box) return;
    const label = step.getAttribute("data-label") || "";
    const text = step.getAttribute("data-explain") || "";
    box.innerHTML = `<b>${label}</b> ${text}`;
    diagram.querySelectorAll(".dstep").forEach((s) => {
      s.classList.remove("dstep-active");
      s.setAttribute("aria-pressed", "false");
    });
    step.classList.add("dstep-active");
    step.setAttribute("aria-pressed", "true");
  }

  document.addEventListener("click", (e) => {
    const step = e.target.closest(".dstep");
    if (step) explain(step);
  });

  // The steps are SVG <g> elements, which are not focusable or announced on
  // their own, so a keyboard or screen-reader user could not reach the
  // explanations at all. Promote them to real buttons.
  document.querySelectorAll(".dstep").forEach((step) => {
    step.setAttribute("tabindex", "0");
    step.setAttribute("role", "button");
    step.setAttribute("aria-pressed", "false");
    const label = step.getAttribute("data-label");
    if (label) step.setAttribute("aria-label", label.replace(/\s+/g, " ").trim());
    step.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        explain(step);
      }
    });
  });

  // announce the explanation when it changes, since the click target and the
  // text that updates are far apart in the page
  document.querySelectorAll(".dexplain").forEach((box) => {
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
  });

  /* ---- collapsible index for phones ---------------------------------- */

  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");
  if (sidebar && content && sidebar.querySelector("a")) {
    // <details> gives us open/close, keyboard support and correct semantics
    // for free — no state to manage and nothing to get wrong.
    const toc = document.createElement("details");
    toc.className = "mobile-toc";

    const summary = document.createElement("summary");
    summary.textContent = T.contents;
    toc.appendChild(summary);

    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", T.contents);
    Array.from(sidebar.children).forEach((node) => {
      const copy = node.cloneNode(true);
      copy.classList.remove("active");
      nav.appendChild(copy);
    });
    // jumping to a section should get the index out of the way
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) toc.open = false;
    });
    toc.appendChild(nav);

    content.insertBefore(toc, content.firstChild);
  }

  /* ---- back to top ---------------------------------------------------- */

  if (document.body.scrollHeight > window.innerHeight * 3) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.textContent = "↑";
    btn.title = T.top;
    btn.setAttribute("aria-label", T.top);
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(btn);

    const onScrollTop = () => {
      btn.classList.toggle("show", window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", onScrollTop, { passive: true });
    onScrollTop();
  }

  /* ---- sidebar scrollspy ---------------------------------------------- */

  const links = document.querySelectorAll(".sidebar a[href^='#']");
  if (!links.length) return;
  const sections = Array.from(links)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;

  function onScroll() {
    let current = sections[0];
    const y = window.scrollY + 100;
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec;
    });
    links.forEach((l) => l.classList.remove("active"));
    const active = document.querySelector(`.sidebar a[href='#${current.id}']`);
    if (active) active.classList.add("active");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
