/* Doctrine page: navbar text color follows the [data-nav-theme] section under the navbar's midpoint. */
(() => {
  const nav = document.getElementById('site-nav');
  const targets = [...document.querySelectorAll('[data-nav-theme]')];
  console.log(nav);
  console.log(targets);
  let mid = 0;
  let ticking = false;

  function update() {
    ticking = false;
    // Last match wins, so a nested element beats the one wrapping it.
    const current = targets.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    }).pop();
    if (!current) return;
    nav.classList.remove('site-nav--dark', 'site-nav--light');
    nav.classList.add('site-nav--' + current.dataset.navTheme);
  }

  function measure() {
    mid = Math.round(nav.offsetHeight / 2);
    update();
  }

  measure();
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure); // fonts can shift layout
})();
