# The Long Way Home — Ekaterina & Norayr

A trilingual (English · Русский · Հայերեն) one-page wedding website.

**Sunday, 6 September 2026 · Vagharshyan Garden · Saghmosavan, Armenia.**

Built as a dependency-free static site (HTML + CSS + vanilla JS), recreated
from a Claude Design prototype. No build step — just host the files.

## Contents

| Path | What it is |
|------|------------|
| **`site/`** | The website — host this folder. `index.html`, `css/`, `js/`, `img/`. |
| `site/README.md` | Run / deploy / add-photos / theme notes for the site. |
| `The-Long-Way-Home.html` | A single self-contained copy (all CSS + JS inlined) for quick preview — just open it in a browser. |
| `project/` | The original Claude Design prototype + assets. |
| `chats/` | Design conversation transcripts. |
| `HANDOFF.md` | The original Claude Design handoff notes. |

## Preview

It's a static site. From `site/`:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Or just open `The-Long-Way-Home.html` directly in any browser.

## Deploy

Upload the `site/` folder to any static host — Netlify, Vercel, GitHub
Pages, Cloudflare Pages, S3, etc. Nothing to compile.

## Features

- Animated line-art hero (Kasakh Gorge, Saghmosavank, ceremony arch,
  candlelight) with a live countdown to the day.
- Sections: Essentials · candlelit Day Timeline · What to Expect ·
  Getting There & Back (with a tinted live map) · Host contacts.
- EN / РУС / ՀԱՅ language switcher, scroll reveals, and parallax.
- Three photo slots (garden + two host avatars) — add real images via the
  `src` attribute on each `<image-slot>` (see `site/README.md`).
