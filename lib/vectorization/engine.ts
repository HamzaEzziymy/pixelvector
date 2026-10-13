import type { RasterInput, VectorizeResult, VectorizeSettings } from "./types";
import { detailToThresholds } from "./settings";

/** Minimal shape of the parts of imagetracerjs we use. */
interface TracerModule {
  imagedataToTracedata(
    imgd: { width: number; height: number; data: Uint8ClampedArray },
    options: Record<string, unknown>,
  ): TraceData;
  getsvgstring(trace: TraceData, options: Record<string, unknown>): string;
}

interface TraceData {
  width: number;
  height: number;
  layers: Array<Array<{ isholepath: boolean }>>;
}

let tracerPromise: Promise<TracerModule> | null = null;

/** Lazily loads the tracer so it never lands in the initial bundle. */
export function loadTracer(): Promise<TracerModule> {
  if (!tracerPromise) {
    tracerPromise = import("imagetracerjs").then((mod) => {
      const resolved = (mod as { default?: unknown }).default ?? mod;
      return resolved as TracerModule;
    });
  }
  return tracerPromise;
}

const BW_PALETTE = [
  { r: 0, g: 0, b: 0, a: 255 },
  { r: 255, g: 255, b: 255, a: 255 },
];

/**
 * Prepares pixels for tracing. For black & white we threshold luminance into
 * exactly black / white; transparent pixels are optionally kept transparent.
 * Returns a copy so the caller's buffer is never mutated.
 */
export function preparePixels(input: RasterInput, settings: VectorizeSettings): Uint8ClampedArray {
  const out = new Uint8ClampedArray(input.data);
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a < 128) {
      // Composite semi/fully transparent pixels. With keepTransparency they become fully
      // transparent (skipped by the tracer); otherwise they are flattened onto white.
      if (settings.keepTransparency) {
        out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
      } else {
        out[i] = out[i + 1] = out[i + 2] = 255;
        out[i + 3] = 255;
      }
      continue;
    }
    if (a < 255) {
      const alpha = a / 255;
      out[i] = Math.round(out[i] * alpha + 255 * (1 - alpha));
      out[i + 1] = Math.round(out[i + 1] * alpha + 255 * (1 - alpha));
      out[i + 2] = Math.round(out[i + 2] * alpha + 255 * (1 - alpha));
      out[i + 3] = 255;
    }
    if (settings.colorMode === "blackwhite") {
      const lum = 0.2126 * out[i] + 0.7152 * out[i + 1] + 0.0722 * out[i + 2];
      const v = lum < settings.threshold ? 0 : 255;
      out[i] = out[i + 1] = out[i + 2] = v;
    }
  }
  return out;
}

export function buildTracerOptions(settings: VectorizeSettings): Record<string, unknown> {
  const { ltres, qtres } = detailToThresholds(settings.detail);
  const options: Record<string, unknown> = {
    ltres,
    qtres,
    pathomit: settings.speckle,
    blurradius: settings.smoothing,
    blurdelta: 20,
    scale: settings.scale,
    roundcoords: 2,
    viewbox: true,
    desc: false,
    strokewidth: 0,
    linefilter: false,
    rightangleenhance: true,
    colorsampling: 2,
    colorquantcycles: 3,
    layering: 0,
  };
  if (settings.colorMode === "blackwhite") {
    options.pal = BW_PALETTE;
  } else {
    options.numberofcolors = settings.colors;
  }
  return options;
}

/**
 * Vectorizes RGBA pixel data into an SVG string. Pure with respect to its inputs and safe
 * to run in a Web Worker or in Node (used by the tests).
 */
export async function vectorize(input: RasterInput, settings: VectorizeSettings): Promise<VectorizeResult> {
  const started = performance.now();
  const tracer = await loadTracer();
  const pixels = preparePixels(input, settings);
  const options = buildTracerOptions(settings);

  const trace = tracer.imagedataToTracedata({ width: input.width, height: input.height, data: pixels }, options);
  let svg = tracer.getsvgstring(trace, options);

  // Drop the tracer's non-standard "desc" attribute and trim the trailing space before ">".
  svg = svg.replace(/\sdesc="[^"]*"/, "").replace(/\s+>/, ">");

  // In B/W mode drop the white layer so the output is a single-color shape on a transparent canvas.
  if (settings.colorMode === "blackwhite") {
    svg = svg.replace(/<path[^>]*fill="rgb\(255,255,255\)"[^>]*\/>/g, "");
  }

  const pathCount = (svg.match(/<path\b/g) ?? []).length;
  return {
    svg,
    stats: {
      width: Math.round(input.width * settings.scale),
      height: Math.round(input.height * settings.scale),
      pathCount,
      svgBytes: new TextEncoder().encode(svg).length,
      durationMs: performance.now() - started,
    },
  };
}
