---
name: seo-page-audit
description: Audit one or more static HTML pages of the CBC site for on-page SEO basics (unique title/description, canonical, Open Graph, h1, alt text, JSON-LD). Use after rewriting or creating a page, or when the user asks for an SEO check.
---

# SEO page audit

Checks a static HTML page of this site against the SEO baseline the site is being rebuilt to meet. Read-only: report findings, don't edit files unless the user asks you to fix them.

## What to check, per page passed as argument (or all `*.html` at repo root, `prestations/`, `societe/` if none given)

1. **`<title>`**: present, unique across the site (compare against other pages), 50-60 chars roughly, includes "CBC" or "Construction Bois Commingeoise".
2. **`<meta name="description">`**: present, unique across the site (the legacy bug this replaces was the *same* description copy-pasted on every page — flag any duplicate immediately), 120-160 chars.
3. **`<link rel="canonical">`**: present, absolute URL, matches `https://www.construction-bois-commingeoise.fr/<path>`.
4. **Open Graph / Twitter**: `og:title`, `og:description`, `og:image` (absolute URL), `og:type`, `og:locale` = `fr_FR`.
5. **Exactly one `<h1>`** per page, containing meaningful page-specific text (not just "Accueil").
6. **Images**: every `<img>` has a non-empty, descriptive `alt` (flag `alt=""` on content images, flag alt text that's just a filename like `alt="1.jpg"`; decorative images may have `alt=""` deliberately — note that distinction).
7. **JSON-LD**: homepage and contact page should carry a `LocalBusiness`/`HomeAndConstructionBusiness` schema block (`<script type="application/ld+json">`) with name, address, telephone, url.
8. **Links**: no lingering `http://` (non-https) internal links, no dead links to removed legacy paths (`templates/`, `plugins/`, `component/`, `components/`, `media/`, `cache/`).

## Output

For each page: a short pass/fail list per check above. Finish with a repo-wide summary flagging any duplicate titles/descriptions found across pages (grep the checked pages for exact-match `<title>`/`<meta name="description">` content).
