# The Long Way Home — Ekaterina & Norayr

A trilingual (English / Русский / Հայերեն) one-page wedding site.
**Sunday, 6 September 2026 · Vagharshyan Garden · Saghmosavan, Armenia.**

Built as a dependency-free static site (HTML + CSS + vanilla JS) ported
from the original Claude Design prototype. No build step — just host the
folder.

## Run / preview

It's static, so any web server works. From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` mostly works too, but a
server is recommended so the OpenStreetMap iframe and the photo
placeholders behave exactly as in production.)

## Deploy

Upload the whole `site/` folder to any static host — Netlify, Vercel,
GitHub Pages, Cloudflare Pages, S3, etc. There is nothing to compile.

## Files

| File | Purpose |
|------|---------|
| `index.html`       | All markup + inline layout styling + the line-art SVG illustrations |
| `css/styles.css`   | Design tokens, keyframes, reveal + hover interactions, reduced-motion |
| `js/main.js`       | Countdown, language switcher, scroll reveals, parallax |
| `js/image-slot.js` | `<image-slot>` web component used for the photo placeholders |
| `img/`             | Drop real photos here if you reference them by `src` (see below) |

## Adding real photos

There are three photo spots, each an `<image-slot>` element: the garden
photo in **Essentials**, and the two host avatars in **Your hosts**.

Until a photo is supplied they show an elegant placeholder. To set a real
image, add a `src` to the slot in `index.html`, e.g.:

```html
<image-slot id="lwh-garden" shape="rounded" radius="1" fit="cover"
            src="img/garden.jpg"
            placeholder="Drop a photo of the garden / gorge"
            style="display:block;width:100%;height:clamp(360px,48vh,520px)"></image-slot>
```

(The drag-and-drop fill is only active inside the Claude Design editor;
on a normal host the slot is read-only, so use `src`.)

## Theme

The palette the couple landed on is baked into the root container in
`index.html` via CSS custom properties: **dusk** time-of-day, **Areni
wine** accent (`--accent:#6e2a35`), and the full **gorge + arch** hero
scene. To retune, edit those `--*` variables on the `#top` element — e.g.
`--accent` for the accent colour, or `--sky-top` / `--sky-bot` / `--glow`
for a brighter daytime sky.

## Event details encoded in the page

- **Couple:** Ekaterina & Norayr
- **Date/time:** Sun 6 Sep 2026, ceremony 17:15 (countdown targets 16:30 arrival, +04:00)
- **Venue:** Vagharshyan Garden, Saghmosavan — ~40 min by car from Yerevan
- **Return transport:** Sprinters to Yerevan at 23:00 and 00:00
- **Hosts:** Ksenia ([@Kseniya_GY](https://t.me/Kseniya_GY), +7 908 244 8657)
  and Kristina ([@svadba_kris](https://t.me/svadba_kris), +7 912 485 7796)
