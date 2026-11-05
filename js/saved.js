/* How Can I Be Saved? page: scroll reveals, the earthquake, mirror cards, the sunrise, the great exchange, and the progress rail. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n) => Math.min(1, Math.max(0, n));

  // Reveal on scroll. Reaching Acts 16:26 shakes the story once.
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const quake = (beat) => {
    const wrap = beat.closest('.saved-story')?.querySelector('.saved-wrap');
    if (!wrap) return;
    setTimeout(() => {
      wrap.parentElement.classList.add('is-quaking');
      wrap.addEventListener('animationend', () => wrap.parentElement.classList.remove('is-quaking'), { once: true });
    }, 350);
  };

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
      if (e.target.hasAttribute('data-quake')) quake(e.target);
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  }

  // Mirror cards: flip between the commandment and Jesus' explanation of it.
  document.querySelectorAll('.saved-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'));
    });
  });

  const hero = document.querySelector('.saved-hero');
  const sky = document.querySelector('.saved-sky');
  const dawn = document.querySelector('.saved-dawn');
  const exchange = document.querySelector('.saved-exchange');
  const rail = document.querySelector('.saved-rail');
  const railLinks = rail ? [...rail.querySelectorAll('a')] : [];
  const railTargets = railLinks.map((a) => document.querySelector(a.getAttribute('href')));
  const themed = [...document.querySelectorAll('[data-nav-theme]')];

  // The exchange pins and animates only when motion is welcome; otherwise it shows its finished state.
  if (exchange) {
    if (reduce) exchange.classList.add('is-done');
    else exchange.classList.add('is-live');
  }

  let ticking = false;

  function update() {
    ticking = false;
    const vh = innerHeight;

    // Stars drift slower than the page.
    if (sky && !reduce) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0) sky.style.setProperty('--sky-shift', (-r.top * 0.35).toFixed(1));
    }

    // The sun climbs as the dawn section scrolls into view.
    if (dawn && !reduce) {
      const r = dawn.getBoundingClientRect();
      dawn.style.setProperty('--rise', clamp((vh - r.top) / (r.height * 0.8)).toFixed(3));
    }

    // 2 Cor. 5:21: sin and righteousness trade places across the pinned stage.
    if (exchange && !reduce) {
      const r = exchange.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh));
      const m = clamp((p - 0.1) / 0.68);
      exchange.style.setProperty('--m', m.toFixed(4));
      exchange.style.setProperty('--arc', Math.sin(Math.PI * m).toFixed(4));
      exchange.dataset.step = m >= 1 ? 4 : m > 0.66 ? 3 : m > 0.33 ? 2 : m > 0 ? 1 : 0;
      exchange.classList.toggle('is-done', m >= 1);
    }

    // Rail: mark the current chapter and match the sky behind it.
    if (rail && getComputedStyle(rail).display !== 'none') {
      const mid = vh / 2;
      let current = 0;
      railTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= mid) current = i; });
      railLinks.forEach((a, i) => {
        if (i === current) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      const under = themed.filter((el) => {
        const b = el.getBoundingClientRect();
        return b.top <= mid && b.bottom > mid;
      }).pop();
      if (under) rail.classList.toggle('saved-rail--light', under.dataset.navTheme === 'light');
    }
  }

  const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
})();
