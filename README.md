# @markgrafhq/markgraf-embed

Drop-in Canvas2D player for [markgraf](https://github.com/i-am-the-slime/markgraf) animations.

Decorate any element with `data-markgraf` containing markgraf source text and
the script replaces it with an interactive player — scrub bar, keyframe ticks,
play/pause, speed control, single-active-player coordination across multiple
embeds on the same page, and Space toggles whichever player is currently
active.

## From a CDN (no build step)

```html
<link rel="stylesheet" href="https://unpkg.com/@markgrafhq/markgraf-embed/dist/markgraf-embed.css">
<script src="https://unpkg.com/@markgrafhq/markgraf-embed/dist/markgraf-embed.js"></script>

<div data-markgraf>
seed 1
frame v1 {
  +node client "Client"
  +node api "API"
  +edge client api
  client -> api "GET /user/42"
}
</div>
```

## From a bundler

```js
import "@markgrafhq/markgraf-embed/dist/markgraf-embed.css";
import "@markgrafhq/markgraf-embed"; // side-effect: registers window.markgraf, auto-mounts
```

## Sizing

Set inline CSS on the embed element:

```html
<!-- Cap canvas height at 320px -->
<div data-markgraf style="--mg-max-height: 320px">…</div>

<!-- Cap the embed width -->
<div data-markgraf style="max-width: 420px">…</div>

<!-- Use most of the viewport for a deep diagram -->
<div data-markgraf style="--mg-max-height: 80svh">…</div>
```

## Programmatic mount

The script also exposes `window.markgraf`:

```js
markgraf.mount(element, "seed 1\nframe v1 { +node a \"A\" }");
markgraf.mountAll();           // scan the whole document
markgraf.mountAll(myContainer); // scan a subtree
```

## Auto-mount details

- Runs on `DOMContentLoaded`, or immediately if the script is loaded after.
- Each `[data-markgraf]` is mounted exactly once; subsequent calls to
  `mountAll` are idempotent.
- Source text can come from (in order of preference):
  1. `data-markgraf-src-b64` attribute (base64-encoded UTF-8)
  2. `data-markgraf-src` attribute
  3. the element's `textContent`

## License

MIT.
