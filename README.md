# @markgrafhq/markgraf-embed

Drop-in Canvas2D and SVG player for [markgraf](https://github.com/i-am-the-slime/markgraf) animations.

Decorate any element with `data-markgraf` containing markgraf source text and
the script replaces it with an interactive player — scrub bar, keyframe ticks,
play/pause, speed control, single-active-player coordination across multiple
embeds on the same page, and Space toggles whichever player is currently
active.

## Browser requirements

The default Canvas player compiles and renders in an inline Web Worker. It requires
Workers, transferable OffscreenCanvas, FinalizationRegistry, and worker-side CSS
Font Loading. Content Security Policies must permit `worker-src blob:`.
There is no automatic renderer fallback. For hosts that forbid workers, set
`data-markgraf-renderer="svg"` on the embed element to select the main-thread
SVG player explicitly. Bundled fonts load before the ready callback and first frame.

## From a CDN (no build step)

```html
<link rel="stylesheet" href="https://unpkg.com/@markgrafhq/markgraf-embed/dist/markgraf-embed.css">
<script src="https://unpkg.com/@markgrafhq/markgraf-embed/dist/markgraf-embed.js"></script>

<div data-markgraf>
seed 1
scene v1 {
  + client: Client
  + api: API
  + client -> api
  client ~> api: GET /user/42
}
</div>
```

## From a bundler

```js
import "@markgrafhq/markgraf-embed/css";
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

The script exposes `window.markgraf`. Mounting is asynchronous and returns a
disposer immediately. The optional fourth argument receives the ready API after
compilation and first draw; it is never called after disposal or remount.

```js
const dispose = markgraf.mount(element, source, true, api => {
  // true starts paused; omit it or pass false for the existing autoplay behavior.
  const unsubscribe = api.onComplete(event => {
    console.log(event.reason, event.time);
  });
  api.playNext({ duration: 0.8, easing: { bounce: 0 } });
  // Call unsubscribe() when this listener is no longer needed.
});
// Later, when removing/replacing the player:
dispose();

markgraf.mountAll();            // scan the whole document
markgraf.mountAll(myContainer); // scan a subtree
```

Remounting the same element disposes its previous player. The disposer is
idempotent and cancels pending initialization as well as active playback.
TypeScript declarations are included; import the side-effect package to declare
`window.markgraf`, and use `import type { MarkgrafApi } from
"@markgrafhq/markgraf-embed"` for the callback API. The bundle has no runtime
ESM named exports and requires neither React nor Motion.

### Live node views

`mount` accepts an optional fifth `nodeViews` array. Each binding identifies a
DSL node by `{ node, path }`, where `path` contains ancestor node IDs only,
outermost first. Thus a root `api` is `{ node: "api" }`; an `api` inside
`inside system { ... }` is `{ node: "api", path: ["system"] }`.

```js
const dispose = markgraf.mount(element, source, true, undefined, [
  {
    node: "api",
    path: ["system"],
    mount(host) {
      host.replaceChildren(Object.assign(document.createElement("button"), {
        textContent: "Retry",
        onclick: retry,
      }));
      return () => host.replaceChildren();
    },
  },
]);
```

Each binding mounts once for the lifetime of that player. Its cleanup runs
once on disposal or remount; hiding a node during travel does not dispose its
content. The host fills the node's declared logical width and height, not the
projected pixel box. A registered face keeps its native outline; an
unregistered face retains its normal label fallback. Content
remains live rather than being a screenshot, but is inert during native travel
and miniature/background modes. A reverse-facing node paints an opaque blank
native back, so no front label or child view is visible through it.
Flat Canvas/SVG themes support node views; isometric themes and static exports
retain the DSL representation.

### Ready API

| API | Behavior |
| --- | --- |
| `time`, `keyframe`, `playing` | live observation getters |
| `ready`, `duration`, `cues`, `steps` | readiness, total seconds, scheduled cue/step metadata |
| `play(options?)`, `playWith(options?)`, `pause()`, `toggle()` | ordinary playback controls |
| `seek(seconds)`, `seekCue(id)`, `seekStep(name)` | clamped seek, retaining playing/paused state |
| `setSpeed(speed)` | normal playback is `1`; captured spring-move deadlines do not change |
| `playToCue(id, options?)`, `playToStep(name, options?)` | bounded playback to an explicit cue/step |
| `playNext(options?)`, `playPrevious(options?)` | next/previous matching cue, or end/start boundary |
| `subscribe(callback)` | current snapshot immediately, then playback updates |
| `onCueEnter(callback)`, `onStepEnter(name, callback)` | cue events in traversal order |
| `onComplete(callback)` | one target/boundary completion event per completed move |

All subscription methods return an ordinary unsubscribe function. Snapshot
callbacks receive `{ time, keyframe, playing }`. Cue metadata includes stable
IDs, scheduler indices, timestamps, and graph paths.

### Finite spring-shaped bounded playback

All four bounded methods accept identical options to the React package:

```js
const options = { duration: 0.8, easing: { bounce: 0 } };
api.playToCue(cueId, options);
api.playToStep("received", options);
api.playNext(options);
api.playPrevious(options);
```

`easing: {}` or `easing: { bounce: 0 }` opts into finite, monotonic
spring-shaped motion. The playhead never overshoots, lands exactly at the
target timestamp, and has zero endpoint velocity. No animation dependency or
consumer timer is needed.

The clock starts when the shared engine accepts the command in the Canvas
worker. Dropped frames do not extend the move: the first frame at or after its
deadline renders the exact target and emits completion.

- With `easing` or `arrival`, a positive finite `duration` (seconds) takes
  precedence over `speed`. Otherwise the duration is derived once from the
  distance and normalized supplied speed, or current speed when omitted.
- Speed and duration are local to the opted-in move. `setSpeed` affects
  subsequent runs without changing the current move's captured deadline.
- Without either new field, playback remains constant-speed with legacy
  **speed-first** precedence over duration.
- Invalid/nonpositive durations are ignored. A zero-distance move completes
  immediately without a pulse.
- `stopAt: ["step"]` or `["tokenLine"]` filters next/previous selection; no
  remaining matching cue means the end/start boundary.

### Optional arrival emphasis

Nonzero playhead bounce is rejected. To bounce a node visually, select it
explicitly; for example, if `"received"` is a step and `"api"` is inside `"cluster"`:

```js
api.playToStep("received", {
  duration: 0.8,
  arrival: { node: "api", path: ["cluster"], bounce: 0.25 },
});
```

Arrival alone also opts into timed spring-shaped playback. `node` is the exact
node ID and `path` is its ancestor-node path, outermost first. Omit `path` for
`[]`, the root graph. Markgraf never infers a node from a cue, token, or camera.
Only the selected node pulses during the last 45% of the move: it grows to
`1.08`, then springs back to normal by the deadline. Arrival `bounce` defaults
to `0.25`; finite values are clamped to `[0, 1]`.

### Cancellation and event order

Pause, any seek, a replacement move, and disposal cancel the active bounded
move and clear emphasis without completion. Seeking preserves the current
playing/paused state; it does not implicitly pause.

Cue events follow scheduler-index order in the direction of travel, including
coincident cues only as far as the selected target. Completion fires exactly
once after those cue events and the paused-state update, with the exact target
time. Its `reason` is `"target"` or `"boundary"`. Call the returned unsubscribe
functions to stop observations; disposal tears down the player.

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
