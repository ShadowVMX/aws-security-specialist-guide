/**
 * Powers click-to-explain interactive diagrams.
 * Any element with class="dstep" and data-explain="..." reveals its text
 * inside the nearest sibling ".dexplain" box when clicked.
 */
document.addEventListener("click", (e) => {
  const step = e.target.closest(".dstep");
  if (!step) return;
  const diagram = step.closest(".diagram");
  const explainBox = diagram && diagram.querySelector(".dexplain");
  if (!explainBox) return;
  const label = step.getAttribute("data-label") || "";
  const text = step.getAttribute("data-explain") || "";
  explainBox.innerHTML = `<b>${label}</b> ${text}`;

  diagram.querySelectorAll(".dstep").forEach((s) => s.classList.remove("dstep-active"));
  step.classList.add("dstep-active");
});

// highlight current section in sidebar while scrolling
(function () {
  const links = document.querySelectorAll(".sidebar a[href^='#']");
  if (!links.length) return;
  const sections = Array.from(links)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

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
