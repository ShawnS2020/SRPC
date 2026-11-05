/* Color themes: applies the saved theme before the page paints, then adds a small picker in the corner.
   Loaded in <head> on every page. Themes themselves live in css/site.css. ?theme=oxblood in a URL also sets it. */
(() => {
  const THEMES = [
    { id: 'evergreen', name: 'Evergreen', swatches: ['#0a2521', '#1c5b53', '#a5ff9f'] },
    { id: 'oxblood', name: 'Oxblood', swatches: ['#2b0d12', '#832732', '#f4cf9a'] },
  ];
  const KEY = 'srpc-theme';
  const root = document.documentElement;
  const isTheme = (id) => THEMES.some((t) => t.id === id);
  const load = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const save = (id) => { try { localStorage.setItem(KEY, id); } catch { /* private mode: theme lasts this page only */ } };

  const fromUrl = new URLSearchParams(location.search).get('theme');
  if (isTheme(fromUrl)) save(fromUrl);

  let current = isTheme(load()) ? load() : THEMES[0].id;
  const apply = (id) => {
    current = id;
    if (id === THEMES[0].id) root.removeAttribute('data-theme');
    else root.dataset.theme = id;
  };
  apply(current);

  const swatches = (t) => `<span class="site-theme__swatches" aria-hidden="true">${t.swatches.map((c) => `<i style="background:${c}"></i>`).join('')}</span>`;

  function build() {
    const wrap = document.createElement('div');
    wrap.className = 'site-theme';
    wrap.innerHTML = `
      <button class="site-theme__toggle" type="button" aria-expanded="false" aria-controls="site-theme-menu" aria-label="Color theme"></button>
      <fieldset class="site-theme__menu" id="site-theme-menu" hidden>
        <legend>Color theme</legend>
        ${THEMES.map((t) => `<label><input type="radio" name="site-theme" value="${t.id}">${swatches(t)}${t.name}</label>`).join('')}
      </fieldset>`;
    document.body.append(wrap);

    const toggle = wrap.querySelector('.site-theme__toggle');
    const menu = wrap.querySelector('.site-theme__menu');
    const sync = () => {
      toggle.innerHTML = swatches(THEMES.find((t) => t.id === current));
      menu.querySelectorAll('input').forEach((input) => { input.checked = input.value === current; });
    };
    const setOpen = (on) => {
      menu.hidden = !on;
      toggle.setAttribute('aria-expanded', String(on));
    };

    toggle.addEventListener('click', () => {
      setOpen(menu.hidden);
      if (!menu.hidden) menu.querySelector(':checked').focus();
    });
    menu.addEventListener('change', (e) => {
      apply(e.target.value);
      save(current);
      sync();
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    // Another tab changed the theme
    addEventListener('storage', (e) => { if (e.key === KEY && isTheme(e.newValue)) { apply(e.newValue); sync(); } });

    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
