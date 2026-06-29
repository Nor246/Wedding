# Photos

Drop real photos here, then reference them from `../index.html` via the
`src` attribute on the matching `<image-slot>` (the slots are read-only on a
normal host, so `src` is how a photo gets in):

| Slot id (in index.html) | Section       | Suggested file        | Shape                |
|-------------------------|---------------|-----------------------|----------------------|
| `lwh-garden`            | Essentials    | `garden.jpg`          | wide (≈4:3 / 3:2)    |
| `lwh-ksenia`            | Your hosts    | `ksenia.jpg`          | square (face center) |
| `lwh-kristina`          | Your hosts    | `kristina.jpg`        | square (face center) |

Example (in `index.html`):

```html
<image-slot id="lwh-garden" shape="rounded" radius="1" fit="cover"
            src="img/garden.jpg"
            placeholder="Drop a photo of the garden / gorge"
            style="display:block;width:100%;height:clamp(360px,48vh,520px)"></image-slot>
```

Keep files reasonably sized — aim for ≤300 KB each (1600px on the long edge,
JPEG/WebP). Until a photo is added, each slot shows an elegant placeholder.
