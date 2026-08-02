# 3rd Sun Labs Website Starter

This package contains a complete responsive one-page website, a browser-based brand guide,
design tokens, favicon/app icons, social-sharing artwork, and extracted logo assets.

## Open it locally

Double-click `index.html` to preview the site in a browser.

For a more accurate local preview, run a simple local server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Files

- `index.html` — responsive landing page
- `styles.css` — site components, layout, responsive rules
- `tokens.css` — reusable colors, gradients, typography, spacing, and effects
- `script.js` — mobile menu and sticky-header behavior
- `brand-guide.html` — printable/browser-based visual style guide
- `site.webmanifest` — installable-site metadata
- `robots.txt` and `sitemap.xml` — search-engine starter files
- `assets/` — logo files, favicons, app icons, Open Graph image, and JSON design tokens

## Before publishing

1. Confirm your final domain and update it in:
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`
2. Confirm or replace `hello@3rdsunlabs.com`.
3. Replace the starter service copy with your final offers.
4. Add analytics only after choosing a provider and defining your privacy approach.
5. Test the final deployment on desktop, tablet, and mobile.

## Deployment

This is a static site. It can be uploaded directly to most static hosting platforms or
placed behind your existing web server. No build process is required.

## Important logo note

The selected logo originated as raster artwork. The included transparent PNGs are suitable
for the website and normal digital use. Before producing large signs, embroidered apparel,
or other large-format materials, commission or create a clean vector master in SVG/EPS/PDF.
