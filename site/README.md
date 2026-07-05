# The Long Way Home — Ekaterina & Norayr

A trilingual (English / Русский / Հայերեն) one-page wedding site.
**Sunday, 6 September 2026 · Vagharshyan Garden · Saghmosavan, Armenia.**

Dependency-free static site (HTML + CSS + vanilla JS). No build step — just
host the folder.

## Run / preview

It's static, so any web server works. From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` mostly works too, but a server
is recommended so the OpenStreetMap iframe and the `<image-slot>` photo
placeholders behave exactly as in production.)

## Deploy (GitHub Pages — automated)

A workflow at [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
publishes this `site/` folder to GitHub Pages on every push to `main`.

**One-time setup:** in the GitHub repo, go to **Settings → Pages → Build and
deployment** and set **Source = "GitHub Actions"**. After that, every push to
`main` (that touches `site/`) redeploys automatically. The live URL will be:

```
https://nor246.github.io/Wedding/
```

You can also host the folder on any other static host (Netlify, Vercel,
Cloudflare Pages, S3) — there is nothing to compile.

## Custom domain (one-line change)

The canonical URL and the link-preview (Open Graph) URLs are absolute, so they
must point at the real domain. They all derive from one base value:

1. In `index.html`, find the comment block marked
   `↓↓↓ When you point a custom domain`. Replace the host in `rel="canonical"`,
   the four `og:*` / `twitter:image` URLs there.
2. Update the same host in `robots.txt`, `sitemap.xml`, and the `href="/Wedding/"`
   home link in `404.html` (a custom apex domain serves from `/`).
3. Add a `CNAME` file here containing just your domain, and set the domain in
   **Settings → Pages**.

## Sharing & SEO

- **Link previews:** when the URL is pasted into WhatsApp / Telegram / iMessage
  / Facebook, the `og:*` tags + [`og-image.png`](og-image.png) (1200×630) show a
  branded card. To regenerate the image, edit the source SVG and re-rasterize
  (see the project's scratch notes) or replace `og-image.png` directly.
- **Icons:** `favicon.svg` (+ `favicon-32.png`), `apple-touch-icon.png`, and the
  PWA manifest (`site.webmanifest` + `icon-192/512.png`).
- `robots.txt` + `sitemap.xml` are included.

## Invitations (unique guest links + RSVP + open tracking)

Each household gets a personal link `…/invite/?g=<token>` — a page in the same
style with the invitation video, an RSVP form (attendance, party size, food
restrictions, arrival date for guests from abroad), and the hosts' contacts.

- **Backend:** a Google Sheet + Apps Script web app in the couple's Google
  account. One-time setup (~10 min): [`../tools/apps-script/SETUP.md`](../tools/apps-script/SETUP.md).
- **Wiring:** paste the deployed `/exec` URL and the unlisted YouTube video id
  into `CONFIG` at the top of [`invite/invite.js`](invite/invite.js).
  While `SCRIPT_URL` is empty the page runs in a harmless demo mode.
- **Tracking:** every open stamps `last_opened_at` / `open_count` (+ best-effort
  IP & city) on the guest's row; RSVPs land in the sheet with full history.
- Guest names and tokens live only in the private sheet — never in this repo.
- The page is `noindex` and deliberately absent from `sitemap.xml`.

## Language

The switcher (EN / РУС / ՀԱՅ) lives in the nav. On first visit the site
auto-selects a language from the visitor's browser settings (falling back to
English); once a guest picks one, that choice is remembered (`localStorage`).
All copy is in `js/main.js` under the `dict` object.

## Files

| File | Purpose |
|------|---------|
| `index.html`        | All markup + inline layout styling + the line-art SVG illustrations + head meta (OG/Twitter/canonical/icons) |
| `css/styles.css`    | Design tokens, keyframes, reveals + hover, skip-link/focus, reduced-motion |
| `js/main.js`        | Countdown, language switcher (auto-detect + persist), scroll reveals, parallax |
| `js/image-slot.js`  | `<image-slot>` web component used for the photo placeholders |
| `img/`              | Real photos go here — see [`img/README.md`](img/README.md) |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Icons |
| `og-image.png`      | 1200×630 social/link-preview image |
| `site.webmanifest`  | PWA manifest |
| `robots.txt`, `sitemap.xml` | Crawl/index hints |
| `404.html`          | On-brand not-found page (served by GitHub Pages) |
| `.nojekyll`         | Disables Jekyll processing on GitHub Pages |

## Adding real photos

Three photo spots are `<image-slot>` elements: the garden photo in
**Essentials**, and the two host avatars in **Your hosts**. On a normal host the
slots are read-only, so set a real image by adding a `src` — full instructions
and the slot ids are in [`img/README.md`](img/README.md).

## Before you go live (content the couple still owes)

From the original brief, these were flagged as "still needed before launch" and
are **not yet on the page** — add them when decided:

- Taxi drop-off point at the venue (the map **pin is now exact** —
  `40.380342, 44.394665`, Vagharshyan Garden's Yandex location, ~170 m west of
  Saghmosavank monastery; verified against Wikidata + Tripadvisor).
- Dress code & shoe guidance (outdoor garden, grass).
- Weather / rain plan.
- Accommodation recommendations.
- What to bring for the evening (it gets cool above the gorge).
- Gift preference.
- Real photos for the three slots.

## Theme

The palette is baked into the root container in `index.html` via CSS custom
properties (dusk time-of-day, Areni-wine accent `--accent:#6e2a35`, gorge + arch
hero). Retune by editing those `--*` variables on the `#top` element.

## Event details encoded in the page

- **Couple:** Ekaterina & Norayr
- **Date/time:** Sun 6 Sep 2026, ceremony 17:15 (countdown targets 16:30 arrival, +04:00)
- **Venue:** Vagharshyan Garden, Saghmosavan — ~40 min by car from Yerevan
  (coordinates `40.380342, 44.394665`; map marker + directions link use these)
- **Return transport:** Sprinters to Yerevan at 23:00 and 00:00
- **Hosts:** Ksenia ([@Kseniya_GY](https://t.me/Kseniya_GY), +7 908 244 8657)
  and Kristina ([@svadba_kris](https://t.me/svadba_kris), +7 912 485 7796)
