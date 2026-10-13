import { z } from "zod";
import type { VectorizeSettings } from "./types";

export const settingsSchema = z.object({
  colorMode: z.enum(["color", "blackwhite"]),
  colors: z.number().int().min(2).max(64),
  detail: z.number().int().min(1).max(10),
  smoothing: z.number().int().min(0).max(5),
  speckle: z.number().int().min(0).max(100),
  threshold: z.number().int().min(0).max(255),
  scale: z.number().min(0.25).max(4),
  keepTransparency: z.boolean(),
});

export const DEFAULT_SETTINGS: VectorizeSettings = {
  colorMode: "color",
  colors: 16,
  detail: 6,
  smoothing: 0,
  speckle: 8,
  threshold: 128,
  scale: 1,
  keepTransparency: true,
};

export const PRESETS: Record<string, { label: string; description: string; settings: Partial<VectorizeSettings> }> = {
  logo: {
    label: "Logo / icon",
    description: "Few flat colors, crisp edges.",
    settings: { colorMode: "color", colors: 8, detail: 7, smoothing: 0, speckle: 8 },
  },
  lineart: {
    label: "Line art",
    description: "Black and white drawings and sketches.",
    settings: { colorMode: "blackwhite", detail: 7, smoothing: 1, speckle: 6, threshold: 128 },
  },
  illustration: {
    label: "Illustration",
    description: "More colors with light smoothing.",
    settings: { colorMode: "color", colors: 24, detail: 6, smoothing: 1, speckle: 8 },
  },
  photo: {
    label: "Photo (approximation)",
    description: "Posterized look. Large output, expect differences.",
    settings: { colorMode: "color", colors: 48, detail: 4, smoothing: 3, speckle: 12 },
  },
};

/** Maps the friendly 1–10 detail slider to imagetracerjs error thresholds (lower = more faithful). */
export function detailToThresholds(detail: number): { ltres: number; qtres: number } {
  const d = Math.min(10, Math.max(1, detail));
  // detail 10 -> 0.1, detail 1 -> ~4.0 (exponential feel)
  const value = 4 * Math.pow(0.1 / 4, (d - 1) / 9);
  const rounded = Math.round(value * 100) / 100;
  return { ltres: rounded, qtres: rounded };
}
