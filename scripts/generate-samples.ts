/**
 * Generates the demo rasters in public/samples and their SVG counterparts by running them
 * through the real vectorization engine, so before/after examples are genuine output.
 * Usage: npm run samples
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { vectorize } from "../lib/vectorization/engine";
import { DEFAULT_SETTINGS, PRESETS } from "../lib/vectorization/settings";
import { sanitizeSvgForScript } from "./sanitize-node";
import type { RasterInput, VectorizeSettings } from "../lib/vectorization/types";

type RGBA = [number, number, number, number];
const outDir = path.join(process.cwd(), "public", "samples");

function paint(width: number, height: number, fn: (x: number, y: number) => RGBA): RasterInput {
  const data = new Uint8ClampedArray(width * height * 4);
  const ss = 3; // supersampling for anti-aliased edges, like a real exported raster
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const [pr, pg, pb, pa] = fn(x + (sx + 0.5) / ss, y + (sy + 0.5) / ss);
          r += pr * pa; g += pg * pa; b += pb * pa; a += pa;
        }
      }
      const i = (y * width + x) * 4;
      const n = ss * ss;
      data[i] = a ? r / a : 0;
      data[i + 1] = a ? g / a : 0;
      data[i + 2] = a ? b / a : 0;
      data[i + 3] = a / n;
    }
  }
  return { width, height, data };
}

const W = 480, H = 360;

const logo = () =>
  paint(W, H, (x, y) => {
    const cx = W / 2, cy = H / 2;
    const d = Math.hypot(x - cx, y - cy);
    if (d < 70) return [255, 255, 255, 255];
    if (d < 120) {
      const ang = Math.atan2(y - cy, x - cx);
      return Math.sin(ang * 3) > 0 ? [79, 70, 229, 255] : [124, 58, 237, 255];
    }
    return [248, 247, 255, 255];
  });

const lineart = () =>
  paint(W, H, (x, y) => {
    const cx = W / 2, cy = H / 2;
    const d = Math.hypot(x - cx, y - cy);
    const ring = Math.abs(d - 110) < 5;
    const ang = Math.atan2(y - cy, x - cx);
    const petals = Math.abs(d - (60 + 35 * Math.cos(ang * 6))) < 4 && d < 100;
    const cross = (Math.abs(x - cx) < 3 && Math.abs(y - cy) < 150) || (Math.abs(y - cy) < 3 && Math.abs(x - cx) < 150);
    return ring || petals || cross ? [20, 20, 20, 255] : [255, 255, 255, 255];
  });

const illustration = () =>
  paint(W, H, (x, y) => {
    const ridge1 = 230 + 30 * Math.sin(x / 55) + 14 * Math.sin(x / 17);
    const ridge2 = 285 + 22 * Math.sin(x / 40 + 2);
    if (y > ridge2) return [38, 90, 70, 255];
    if (y > ridge1) return [64, 130, 105, 255];
    if (Math.hypot(x - 340, y - 120) < 44) return [255, 196, 64, 255];
    const t = y / 230;
    return [Math.round(250 - 70 * t), Math.round(160 + 20 * t), Math.round(120 + 100 * t), 255];
  });

const transparent = () =>
  paint(W, H, (x, y) => {
    const d = Math.hypot(x - W / 2, y - H / 2);
    const star = d < 70 + 60 * Math.abs(Math.cos(Math.atan2(y - H / 2, x - W / 2) * 2.5));
    return star && d < 140 ? [236, 72, 153, 255] : [0, 0, 0, 0];
  });

const samples: Array<{ name: string; raster: RasterInput; settings: VectorizeSettings; opaque: boolean }> = [
  { name: "logo", raster: logo(), settings: { ...DEFAULT_SETTINGS, ...PRESETS.logo.settings } as VectorizeSettings, opaque: true },
  { name: "lineart", raster: lineart(), settings: { ...DEFAULT_SETTINGS, ...PRESETS.lineart.settings } as VectorizeSettings, opaque: true },
  { name: "illustration", raster: illustration(), settings: { ...DEFAULT_SETTINGS, ...PRESETS.illustration.settings } as VectorizeSettings, opaque: true },
  { name: "transparent", raster: transparent(), settings: { ...DEFAULT_SETTINGS, ...PRESETS.logo.settings } as VectorizeSettings, opaque: false },
];

async function main() {
for (const s of samples) {
  const png = new PNG({ width: s.raster.width, height: s.raster.height });
  png.data = Buffer.from(s.raster.data);
  writeFileSync(path.join(outDir, `${s.name}.png`), PNG.sync.write(png));
  const { svg, stats } = await vectorize(s.raster, s.settings);
  const clean = sanitizeSvgForScript(svg);
  writeFileSync(path.join(outDir, `${s.name}.svg`), clean);
  console.log(`${s.name}: ${stats.pathCount} paths, ${(stats.svgBytes / 1024).toFixed(1)} KB, ${stats.durationMs.toFixed(0)} ms`);
}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
