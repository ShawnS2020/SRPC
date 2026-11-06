# Southfield site

```
index.html  temporary home page (navbar only, styled by home.css); stays at the root so a server serves it for the bare domain. Its paths have no ../ and its nav links into pages/
pages/  every HTML page; they link to each other directly and reach css/, js/, assets/ through ../
  our-congregation.html   our-leadership.html   our-denomination.html   contact.html (Contact in the nav; worship times, location, phone, email)
  scriptural-doctrine.html   scriptural-worship.html   scriptural-living.html   how-can-i-be-saved.html
  covenant-membership.html   covenant-baptism.html   ordination-vows.html   sabbath-guide.html   (Resources menu; add future resource pages here)
  infant-baptism.html   church-membership.html   choosing-a-church.html   (not in the nav; linked from Our Congregation, styled by resource.css)
  history-thompson.html   history-edgar.html   (not in the nav; linked from Our History > Written Histories, styled by history-doc.css)
css/  site.css (tokens, themes, theme picker, reset, footer)  nav.css (shared navbar)  doctrine.css  worship.css  living.css  saved.css  contact.css  home.css  congregation.css  leadership.css  denomination.css  resource.css (all Resources pages)  history.css  history-doc.css (written histories)
js/   site.js (navbar, footer year)  theme.js (theme picker; loaded in <head>)     nav-theme.js              worship.js  saved.js  history-doc.js
assets/images/  assets/docs/ (PDFs, linked directly)
```

**Naming rules**
- `site-*` classes and `--site-*` variables are shared (navbar, footer, gutter, nav height).
- `doctrine-*` / `worship-*` classes and `--doc-*` / `--wor-*` variables belong to one page only.
- Each page sets `<body class="page-doctrine">` or `page-worship`; page "skins" for the shared navbar and footer are scoped under that class.
- State classes: `is-open`, `is-engaged`, `is-mobile-open`, `is-missing`.
- New pages go in `pages/` and must prefix shared files with `../` (`../css/site.css`, `../js/theme.js`, `../assets/images/...`). Paths inside `css/` files are relative to the CSS file, so they don't change.
