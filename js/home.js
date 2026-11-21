/* Home page: Who We Are / What We Believe tabs, and the worship schedule's upcoming-Sunday card. */
(() => {
  // ---------- Tabs ----------
  const tabs = [...document.querySelectorAll('.home-tab')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });

  // ---------- Worship schedule ----------
  const card = document.getElementById('home-next');
  const suns = [...document.querySelectorAll('.home-sun')];
  if (!card || !suns.length) return;

  const ORD = ['1st', '2nd', '3rd', '4th', '5th'];

  // The coming Lord's Day; after evening worship ends on a Sunday, look ahead a week.
  const now = new Date();
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  let add = (7 - date.getDay()) % 7;
  if (add === 0 && now.getHours() >= 19) add = 7;
  date.setDate(date.getDate() + add);
  const upcoming = Math.min(4, Math.ceil(date.getDate() / 7) - 1);
  const isToday = add === 0;

  // The badge sits inside the button, so it is read as part of its name.
  const badge = document.createElement('span');
  badge.className = 'home-sun__badge';
  badge.textContent = isToday ? 'Today' : 'Next';
  suns[upcoming].prepend(badge);

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function render(sel) {
    const isUp = sel === upcoming;
    const label = isUp ? (isToday ? 'Today' : 'Upcoming Sunday') : 'Selected Sunday';
    const big = isUp
      ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      : `${ORD[sel]} Sunday`;
    const sub = isUp
      ? `The ${ORD[sel]} Sunday of the month`
      : (sel === 4 ? 'Months with five Sundays only' : 'Every month');

    // Read the services straight from the chosen card so the HTML stays the single source.
    const rows = [...suns[sel].querySelectorAll('.home-rail li')].map((li) => {
      const dot = li.querySelector('.home-dot').className;
      const t = li.querySelector('.home-rail__t').textContent;
      const n = li.querySelector('.home-rail__n').textContent;
      return `<li><i class="${esc(dot)}"></i><span class="home-next__time">${esc(t)}</span><span>${esc(n)}</span></li>`;
    }).join('');

    card.innerHTML = `
      <div>
        <p class="home-next__label">${label}</p>
        <p class="home-next__date">${esc(big)}</p>
        <p class="home-next__sub">${sub}</p>
        ${isUp ? '' : '<button class="home-next__back" type="button">Show upcoming Sunday</button>'}
      </div>
      <ul>${rows}</ul>`;
    card.hidden = false;
    suns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === sel)));

    const back = card.querySelector('.home-next__back');
    if (back) back.addEventListener('click', () => { render(upcoming); suns[upcoming].focus(); });
  }

  suns.forEach((b, i) => b.addEventListener('click', () => render(i)));
  render(upcoming);
})();
