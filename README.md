# 3rd Sun Labs marketing site

The static site at https://3rdsunlabs.com, served by GitHub Pages from `main`
(custom domain in `CNAME`). No build step: what's in the repo is what's served.

## Brand

Everything visual comes from the 3rd Sun Labs Brand Package v1.0 (October 2026),
kept in OneDrive under `03 Marketing & Brand/Brand/Brand Package/`:

- `assets/brand/`: the horizontal logo (full color), the mark (full color and
  reversed) and the web banner used as the social share image, copied from
  `01-Logos/` and `02-Digital/Social/`. Use these files; never retype the
  wordmark.
- Favicons and `site.webmanifest` at the root, from `02-Digital/Favicons/`.
- `tokens.css`: the kit's colors and Poppins, from `03-Color-and-Type/`, plus
  the semantic names the CSS uses.

Rules from the guidelines that the CSS follows: mostly light space and navy,
Labs Blue for actions, gold only as a highlight, sentence case (no all caps),
and no gradients, glows or shadows on the logo.

## Pages

- `index.html`: the landing page.
- `privacy.html`, `terms.html`: the SMS program's privacy policy and terms,
  served at `/privacy` and `/terms`. Carriers review these; change the wording
  only deliberately.
- `login.html` + `login.js`: **Client sign in** (`/login`). Someone enters an
  email; the page asks each client portal whether that address is on its
  roster (`POST /api/auth/lookup` in the clientportal repo, yes/no only, rate
  limited) and sends them to the one that says yes, with the email filled in.
  Someone on more than one portal picks one. 3rd Sun Labs addresses are also
  offered the admin portal. **When a client launches a portal, add its URL to
  `PORTALS` in `login.js`.** The page never sees a password.

## Preview locally

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000. `/login` is `login.html` locally (GitHub Pages drops
the extension). To try sign-in against a portal running on your machine in
`PORTAL_AUTH=dev`: `http://localhost:8000/login.html?portals=http://localhost:8010`.
That override only works on localhost.

## Still to do before launch

`robots.txt` blocks crawlers while the copy is placeholder. Switch it to
`Allow: /` once the service copy is final.
