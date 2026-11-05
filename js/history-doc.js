/* Highlight the current section in the sticky contents. */

(() => {
  const links = [...document.querySelectorAll('.histdoc-toc a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  let ticking = false;

  function spy() {
    ticking = false;
    let current = -1;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= 160) current = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === current));
  }

  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  spy();
})();
