/* Shared across pages: navbar dropdowns, mobile menu, footer year. */
(() => {
  const nav = document.getElementById('site-nav');
  if (nav) {
    const toggle = nav.querySelector('.site-nav__toggle');
    const items = [...nav.querySelectorAll('.site-nav__item--dropdown')];
    const hoverMq = matchMedia('(min-width: 960px) and (hover: hover)');
    const desktopMq = matchMedia('(min-width: 960px)');
    const trigger = (li) => li.querySelector('.site-nav__link');

    // .is-engaged = any dropdown or the mobile menu is open (page skins can restyle on it)
    const sync = () => nav.classList.toggle('is-engaged',
      items.some((i) => i.classList.contains('is-open')) || nav.classList.contains('is-mobile-open'));
    const setOpen = (li, on) => {
      li.classList.toggle('is-open', on);
      trigger(li).setAttribute('aria-expanded', String(on));
      sync();
    };
    const closeAll = (except) => items.forEach((i) => { if (i !== except) setOpen(i, false); });
    const closeMobile = () => {
      nav.classList.remove('is-mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
      sync();
    };

    items.forEach((li) => {
      trigger(li).addEventListener('click', (e) => {
        // Mouse click on a hover device: already open via hover, keep it open. Keyboard and touch toggle.
        const on = hoverMq.matches && e.detail > 0 ? true : !li.classList.contains('is-open');
        closeAll(li);
        setOpen(li, on);
      });
      li.addEventListener('mouseenter', () => { if (hoverMq.matches) { closeAll(li); setOpen(li, true); } });
      li.addEventListener('mouseleave', () => { if (hoverMq.matches) setOpen(li, false); });
    });

    toggle.addEventListener('click', () => {
      const on = nav.classList.toggle('is-mobile-open');
      toggle.setAttribute('aria-expanded', String(on));
      if (!on) closeAll();
      sync();
    });

    nav.addEventListener('focusout', (e) => {
      if (desktopMq.matches && e.relatedTarget && !nav.contains(e.relatedTarget)) closeAll();
    });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) { closeAll(); closeMobile(); } });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const open = items.find((i) => i.classList.contains('is-open'));
      closeAll();
      closeMobile();
      if (open) trigger(open).focus();
    });
    desktopMq.addEventListener('change', () => { closeAll(); closeMobile(); });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
