export type ColorMode = "color" | "blackwhite";

/** User-facing settings. Every field maps to a real imagetracerjs parameter (see settings.ts). */
export interface VectorizeSettings {
  colorMode: ColorMode;
  /** 2–64 palette colors (color mode only). */
  colors: number;
  /** 1 (coarse) – 10 (very detailed). Controls straight-line / curve fit error. */
  detail: number;
  /** 0 (none) – 5. Gaussian blur radius applied before tracing. */
  smoothing: number;
  /** 0–100. Paths shorter than this many edge nodes are discarded. */
  speckle: number;
  /** B/W only: 0–255 luminance threshold. */
  threshold: number;
  /** Output scale multiplier, 0.25–4. */
  scale: number;
  /** Treat fully transparent pixels as empty instead of tracing them. */
  keepTransparency: boolean;
}

export interface RasterInput {
  width: number;
  height: number;
  /** RGBA pixels, length = width * height * 4. */
  data: Uint8ClampedArray;
}

export interface VectorizeStats {
  width: number;
  height: number;
  pathCount: number;
  svgBytes: number;
  durationMs: number;
}

export interface VectorizeResult {
  svg: string;
  stats: VectorizeStats;
}

export type WorkerRequest =
  | { type: "convert"; id: number; input: RasterInput; settings: VectorizeSettings }
  | { type: "cancel"; id: number };

export type WorkerResponse =
  | { type: "result"; id: number; result: VectorizeResult }
  | { type: "error"; id: number; message: string };
