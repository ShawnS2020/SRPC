# Southfield site

```
index.html  home page (styled by home.css, tabs and worship schedule in home.js); stays at the root so a server serves it for the bare domain. Its paths have no ../ and its nav links into pages/
pages/  every HTML page; they link to each other directly and reach css/, js/, assets/ through ../
  our-congregation.html   our-leadership.html   our-denomination.html   contact.html (Contact in the nav; worship times, location, phone, email)
  scriptural-doctrine.html   scriptural-worship.html   scriptural-living.html   how-can-i-be-saved.html
  covenant-membership.html   covenant-baptism.html   ordination-vows.html   sabbath-guide.html   (Resources menu; add future resource pages here)
  infant-baptism.html   church-membership.html   choosing-a-church.html   (not in the nav; linked from Our Congregation, styled by resource.css)
  history-thompson.html   history-edgar.html   (not in the nav; linked from Our History > Written Histories, styled by history-doc.css)
css/  site.css (tokens, color themes, picker, reset, footer)  style-classic-type.css and style-classic.css (Classic Type and Classic style previews; loaded only by index, our-denomination, scriptural-doctrine)  nav.css (shared navbar)  doctrine.css  worship.css  living.css  saved.css  contact.css  home.css  congregation.css  leadership.css  denomination.css  resource.css (all Resources pages)  history.css  history-doc.css (written histories)
js/   site.js (navbar, footer year)  theme.js (Style + Colors picker; loaded in <head>)     nav-theme.js   home.js   worship.js  saved.js  history-doc.js
assets/images/  assets/docs/ (PDFs, linked directly)
```

**Naming rules**
- `site-*` classes and `--site-*` variables are shared (navbar, footer, gutter, nav height).
- `doctrine-*` / `worship-*` classes belong to one page only. Page stylesheets use the shared tokens in `css/site.css` directly; only genuinely page-specific values get a prefixed variable (e.g. `--sav-*` on the saved page).
- Each page sets `<body class="page-doctrine">` or `page-worship`; page "skins" for the shared navbar and footer are scoped under that class.
- State classes: `is-open`, `is-engaged`, `is-mobile-open`, `is-missing`.
- New pages go in `pages/` and must prefix shared files with `../` (`../css/site.css`, `../js/theme.js`, `../assets/images/...`). Paths inside `css/` files are relative to the CSS file, so they don't change.

**Style and colors**
- Two independent settings, chosen in the corner picker (js/theme.js) and remembered per browser: **Colors** sets `<html data-theme>` (palettes in `css/site.css`: Evergreen default, Oxblood, Midnight, Navy) and **Style** sets `<html data-style>` (Modern default, Classic Type, Classic).
- Classic Type (`css/style-classic-type.css`, `data-style="classic-type"`) puts the type of Jonathon's mockup on the current layouts: Cormorant Infant, letterspaced labels, a cream navbar on hover, and the pen illustration on the home page.
- Classic (`css/style-classic.css`, `data-style="classic-type classic"`) is the mockup's full look: cream headers, light sections, solid navy buttons, framed images, no colored italics in headings. It builds on Classic Type, whose rules are written as `[data-style~="classic-type"]`, so they apply in both. The navbar goes solid on scroll via `.is-scrolled` (js/site.js); `.site-eyebrow` is the small label over a page title, shown only in Classic.
- Neither style has colors of its own, so both follow the Colors setting (Navy is the mockup's). `--secondary-ink` (every palette) is the palette's highlight hue dark enough for light backgrounds, e.g. the mockup's gold labels.
- Only the preview pages load the two style files: index, our-denomination, scriptural-doctrine. A page opts in by linking both (classic-type first) and adding Cormorant Infant to its Google Fonts URL.
- Links can set both: `?style=classic&theme=navy`, `?style=classic-type&theme=oxblood`.
