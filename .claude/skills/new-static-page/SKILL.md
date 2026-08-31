---
name: new-static-page
description: Scaffold a new page for the CBC static site (no build step) from the shared header/nav/footer template with correct relative asset paths and SEO meta boilerplate. Use when creating a new HTML page for this site.
---

# New static page

This site has no build step or templating engine — every page is a standalone HTML file that repeats the same header/nav/footer. To keep that duplication consistent, scaffold new pages from `template.html` in this skill folder instead of hand-copying an existing page.

## Usage

Ask for (or infer from the request): the page's target path (e.g. `prestations/nouvelle-page.html`), its `<title>`, its meta description, and its `<h1>`/main content.

## Steps

1. Read `template.html` in this skill directory.
2. Determine folder depth from the target path: root pages (`index.html`, `prestations.html`, …) use asset paths like `assets/css/style.css`; pages one level down (`prestations/*.html`, `societe/*.html`) use `../assets/css/style.css`, and internal nav links need the matching `../` prefix. Adjust every relative path in the template accordingly (the current nav in the template is written for a root-level page — flip to the one-level-down variant when scaffolding under `prestations/` or `societe/`).
3. Fill in: `<title>`, `<meta name="description">`, canonical URL, OG tags, `<h1>`, and the main content block. Mark the corresponding nav `<li>` as active/current the way the other pages do.
4. Write the new file, then run `seo-page-audit` on it before considering it done.

## Keeping the template current

If the shared header/nav/footer markup changes on a real page during the rebuild (new nav item, footer link, etc.), update `template.html` in this skill folder to match — otherwise future scaffolds drift from the real site.
