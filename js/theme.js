/* Look settings: applies the saved choices before the page paints, then adds a small picker in the corner.
   Loaded in <head> on every page. Two independent settings:
   - Colors (<html data-theme>): palettes live in css/site.css.
   - Style (<html data-style>): fonts and other non-color looks. Classic Type lives in css/style-classic-type.css,
     which only the preview pages load (index, our-denomination, scriptural-doctrine). Classic
     ("classic-type classic") adds css/style-classic.css on top of it.
   ?theme=oxblood and ?style=classic (or classic-type) in a URL also set them. */
(() => {
  const SETTINGS = [
    {
      key: 'srpc-style',
      attr: 'style',
      param: 'style',
      label: 'Style',
      options: [
        { id: 'modern', name: 'Modern' },
        { id: 'classic-type', name: 'Classic Type (preview)' },
        // Full Classic builds on Classic Type, so it sets both words: [data-style~="classic-type"] still matches.
        { id: 'classic', name: 'Classic (preview)', value: 'classic-type classic' },
      ],
    },
    {
      key: 'srpc-theme',
      attr: 'theme',
      param: 'theme',
      label: 'Colors',
      options: [
        { id: 'evergreen', name: 'Evergreen', swatches: ['#0a2521', '#1c5b53', '#a5ff9f'] },
        { id: 'oxblood', name: 'Oxblood', swatches: ['#2b0d12', '#832732', '#f4cf9a'] },
        { id: 'midnight', name: 'Midnight', swatches: ['#0e1b2e', '#2b5c8a', '#f0cf7a'] },
        { id: 'navy', name: 'Navy', swatches: ['#102850', '#2c4f86', '#d9bf93'] },
      ],
    },
  ];
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const load = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, id) => { try { localStorage.setItem(key, id); } catch { /* private mode: lasts this page only */ } };

  const current = {};
  const has = (s, id) => s.options.some((o) => o.id === id);
  // The first option is the default and leaves the attribute off, so the plain :root rules apply.
  const apply = (s, id) => {
    current[s.key] = id;
    const option = s.options.find((o) => o.id === id);
    if (id === s.options[0].id) delete root.dataset[s.attr];
    else root.dataset[s.attr] = option.value || id;
  };

  SETTINGS.forEach((s) => {
    const fromUrl = params.get(s.param);
    if (has(s, fromUrl)) save(s.key, fromUrl);
    const saved = load(s.key);
    apply(s, has(s, saved) ? saved : s.options[0].id);
  });

  const colors = SETTINGS[1];
  const swatches = (o) => `<span class="site-theme__swatches" aria-hidden="true">${o.swatches.map((c) => `<i style="background:${c}"></i>`).join('')}</span>`;

  function build() {
    const wrap = document.createElement('div');
    wrap.className = 'site-theme';
    wrap.innerHTML = `
      <button class="site-theme__toggle" type="button" aria-expanded="false" aria-controls="site-theme-menu" aria-label="Style and colors"></button>
      <div class="site-theme__menu" id="site-theme-menu" hidden>
        ${SETTINGS.map((s) => `<fieldset>
          <legend>${s.label}</legend>
          ${s.options.map((o) => `<label><input type="radio" name="${s.key}" value="${o.id}">${o.swatches ? swatches(o) : ''}${o.name}</label>`).join('')}
        </fieldset>`).join('')}
      </div>`;
    document.body.append(wrap);

    const toggle = wrap.querySelector('.site-theme__toggle');
    const menu = wrap.querySelector('.site-theme__menu');
    const sync = () => {
      toggle.innerHTML = swatches(colors.options.find((o) => o.id === current[colors.key]));
      menu.querySelectorAll('input').forEach((input) => { input.checked = input.value === current[input.name]; });
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
      const s = SETTINGS.find((x) => x.key === e.target.name);
      apply(s, e.target.value);
      save(s.key, e.target.value);
      sync();
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    // Another tab changed a setting
    addEventListener('storage', (e) => {
      const s = SETTINGS.find((x) => x.key === e.key);
      if (s && has(s, e.newValue)) { apply(s, e.newValue); sync(); }
    });

    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
