import { PNG } from "pngjs";
import jpeg from "jpeg-js";
import type { RasterInput } from "@/lib/vectorization/types";

export function makeRaster(width: number, height: number, paint: (x: number, y: number) => [number, number, number, number]): RasterInput {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = paint(x, y);
      const i = (y * width + x) * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a;
    }
  }
  return { width, height, data };
}

/** Flat logo: red circle + blue square on white. */
export const logo = () =>
  makeRaster(120, 120, (x, y) => {
    if ((x - 40) ** 2 + (y - 60) ** 2 < 28 ** 2) return [220, 40, 40, 255];
    if (x > 70 && x < 105 && y > 40 && y < 80) return [40, 70, 220, 255];
    return [255, 255, 255, 255];
  });

/** Black stroke ring on white (monochrome drawing). */
export const lineArt = () =>
  makeRaster(120, 120, (x, y) => {
    const d = Math.hypot(x - 60, y - 60);
    return d > 30 && d < 38 ? [0, 0, 0, 255] : [255, 255, 255, 255];
  });

/** Opaque shape on a fully transparent background. */
export const transparentPng = () =>
  makeRaster(100, 100, (x, y) => (Math.hypot(x - 50, y - 50) < 30 ? [20, 160, 90, 255] : [0, 0, 0, 0]));

/** Smooth gradient with noise, a photo-like worst case. */
export const photoLike = () =>
  makeRaster(160, 120, (x, y) => {
    const n = ((x * 7919 + y * 104729) % 23) - 11;
    return [Math.min(255, Math.max(0, x * 1.5 + n)), Math.min(255, Math.max(0, y * 2 + n)), Math.min(255, Math.max(0, 128 + n * 3)), 255];
  });

export function encodePng(r: RasterInput): Uint8Array {
  const png = new PNG({ width: r.width, height: r.height });
  png.data = Buffer.from(r.data);
  return new Uint8Array(PNG.sync.write(png));
}

export function encodeJpeg(r: RasterInput): Uint8Array {
  return new Uint8Array(jpeg.encode({ width: r.width, height: r.height, data: Buffer.from(r.data) }, 90).data);
}
