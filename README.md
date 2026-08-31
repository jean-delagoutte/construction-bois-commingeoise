# Site CBC — Construction Bois Commingeoise

Site statique HTML/CSS/JS (aucun framework, aucun build), hébergé sur GitHub Pages avec le domaine personnalisé `construction-bois-commingeoise.fr` (voir `CNAME`).

## Structure

```
index.html, prestations.html, realisations.html, societe.html, mentions-legales.html, 404.html
prestations/*.html          — pages de détail des prestations
societe/*.html               — présentation, partenaires, contact
assets/css/style.css         — feuille de style unique du site
assets/js/main.js            — JS vanilla (nav mobile, slider hero, onglets, galerie/lightbox, formulaire)
assets/img/                  — logo, favicon, photos (hero, réalisations)
robots.txt, sitemap.xml      — SEO
```

Chaque page est un fichier HTML autonome : le header/nav/footer sont dupliqués dans chaque fichier (pas de templating). Pour ajouter une page, utiliser le skill Claude Code `new-static-page` (`.claude/skills/new-static-page/`), qui scaffold une nouvelle page à partir du gabarit à jour.

## Aperçu local

Aucun build nécessaire — servir le dossier avec n'importe quel serveur statique, par exemple :

```
python3 -m http.server 8765
```

puis ouvrir `http://localhost:8765/`.

## Cache CSS/JS

`assets/css/style.css` et `assets/js/main.js` sont référencés avec un paramètre `?v=N` (ex. `style.css?v=1`) pour éviter qu'un visiteur reste bloqué sur une version en cache après une modification. **Incrémenter ce numéro dans toutes les pages qui le référencent à chaque changement de `style.css` ou `main.js`.**

## Formulaire de contact

`societe/contact.html` utilise un « mailto amélioré » (pas de service tiers) : le JS construit un lien `mailto:` avec le nom/téléphone/e-mail/message pré-remplis, à destination de `cbc31800@gmail.com`, et ouvre la messagerie du visiteur. Sans JavaScript, le formulaire reste fonctionnel via l'attribut `action="mailto:..."` natif.

## SEO

- Chaque page a un `<title>`, une `<meta description>`, un canonical et des balises Open Graph/Twitter propres — vérifier avec le skill `seo-page-audit` après toute modification de contenu.
- `sitemap.xml` est maintenu à la main : un hook Claude Code rappelle de le mettre à jour quand une nouvelle page `.html` est créée à la racine, dans `prestations/` ou `societe/`.
- Les liens internes vers l'accueil pointent vers `/` (forme canonique), jamais vers `index.html`, pour éviter que Google indexe deux URLs différentes pour la même page.
