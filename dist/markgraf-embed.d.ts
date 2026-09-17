// Hand-written declarations for the standalone, side-effect-only browser bundle.
// Importing the package registers window.markgraf; there are no runtime ESM exports.
export type MarkgrafCueKind = "step" | "tokenLine";
export type MarkgrafPlaybackDirection = "auto" | "forward" | "backward";

/** Finite, monotonic spring-shaped playhead easing; it never overshoots. */
export interface MarkgrafPlaybackEasing {
  bounce?: 0;
}

export interface MarkgrafArrival {
  node: string;
  /** Ancestor node IDs, outermost first. Omit for a root-level node. */
  path?: string[];
  /** Defaults to 0.25; finite values are clamped to [0, 1]. */
  bounce?: number;
}

export interface MarkgrafPlaybackOptions {
  direction?: MarkgrafPlaybackDirection;
  speed?: number;
  /** Seconds for a bounded move; with easing/arrival, takes precedence over speed. */
  duration?: number;
  loop?: boolean;
  stopAt?: MarkgrafCueKind[];
  easing?: MarkgrafPlaybackEasing;
  arrival?: MarkgrafArrival;
}

export interface MarkgrafCueBase {
  readonly id: string;
  readonly index: number;
  readonly kind: MarkgrafCueKind;
  readonly time: number;
  readonly endTime: number;
  readonly path: readonly string[];
}

export interface MarkgrafStepCue extends MarkgrafCueBase {
  readonly kind: "step";
  readonly name: string;
}

export interface MarkgrafTokenLineCue extends MarkgrafCueBase {
  readonly kind: "tokenLine";
  readonly tokenIndex: number;
  readonly lineIndex: number;
  readonly text: string;
  readonly from: string;
  readonly to: string;
}

export type MarkgrafCue = MarkgrafStepCue | MarkgrafTokenLineCue;

export interface MarkgrafCompleteEvent {
  readonly reason: "target" | "boundary" | string;
  readonly direction: "forward" | "backward";
  readonly targetId: string;
  readonly targetStep: string;
  readonly reached: boolean;
  readonly time: number;
}

export interface MarkgrafTickEvent {
  readonly time: number;
  readonly keyframe: string;
  readonly playing: boolean;
}

/** Ready player with live observation getters; mounting returns its disposer. */
export interface MarkgrafApi extends MarkgrafTickEvent {
  readonly ready: true;
  readonly duration: number;
  readonly cues: readonly MarkgrafCue[];
  readonly steps: readonly MarkgrafStepCue[];
  play(options?: MarkgrafPlaybackOptions): void;
  playWith(options?: MarkgrafPlaybackOptions): void;
  pause(): void;
  toggle(): void;
  /** Clamped to [0, duration]; cancels a bounded move, retaining playing/paused state. */
  seek(seconds: number): void;
  seekCue(cueId: string): void;
  seekStep(stepName: string): void;
  playToCue(cueId: string, options?: MarkgrafPlaybackOptions): void;
  playToStep(stepName: string, options?: MarkgrafPlaybackOptions): void;
  playNext(options?: MarkgrafPlaybackOptions): void;
  playPrevious(options?: MarkgrafPlaybackOptions): void;
  /** Does not change an opted-in move's captured deadline. */
  setSpeed(speed: number): void;
  /** Immediately emits the current snapshot, then subsequent playback updates. */
  subscribe(callback: (event: MarkgrafTickEvent) => void): () => void;
  onCueEnter(callback: (cue: MarkgrafCue) => void): () => void;
  onStepEnter(stepName: string, callback: (cue: MarkgrafStepCue) => void): () => void;
  onComplete(callback: (event: MarkgrafCompleteEvent) => void): () => void;
}

export interface MarkgrafEmbed {
  /** onReady runs after compilation and first draw, never after cancellation/remount. */
  mount(element: HTMLElement, source: string, startPaused?: boolean, onReady?: (api: MarkgrafApi) => void): () => void;
  mountAll(root?: ParentNode): void;
  tryParse(source: string): { ok: true } | { ok: false; error: string };
}

declare global {
  var markgraf: MarkgrafEmbed;
  interface Window {
    markgraf: MarkgrafEmbed;
  }
}
