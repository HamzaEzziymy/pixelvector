import { describe, expect, it } from "vitest";
import { vectorize, buildTracerOptions, preparePixels } from "@/lib/vectorization/engine";
import { DEFAULT_SETTINGS, detailToThresholds, settingsSchema } from "@/lib/vectorization/settings";
import { isStrictlySafeSvg } from "@/lib/validation/svg";
import { logo, lineArt, transparentPng, photoLike } from "./fixtures";

const bw = { ...DEFAULT_SETTINGS, colorMode: "blackwhite" as const };

describe("vectorize", () => {
  it("converts a flat logo into real vector paths without embedding raster data", async () => {
    const { svg, stats } = await vectorize(logo(), { ...DEFAULT_SETTINGS, colors: 4 });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain("<path");
    expect(svg).not.toMatch(/<image|data:image|base64/i);
    expect(stats.pathCount).toBeGreaterThan(1);
    expect(isStrictlySafeSvg(svg)).toBe(true);
  });

  it("produces red and blue fills for the logo", async () => {
    const { svg } = await vectorize(logo(), { ...DEFAULT_SETTINGS, colors: 4 });
    expect(svg).toMatch(/fill="rgb\((2[0-5]\d|1\d\d),\d+,\d+\)"/);
    expect(svg).toMatch(/fill="rgb\(\d+,\d+,(2[0-5]\d|1\d\d)\)"/);
  });

  it("black & white mode only emits black paths and removes the white layer", async () => {
    const { svg } = await vectorize(lineArt(), bw);
    expect(svg).toContain("<path");
    expect(svg).not.toContain("rgb(255,255,255)");
    expect(svg).toContain("rgb(0,0,0)");
  });

  it("keeps transparent regions transparent when enabled", async () => {
    const on = await vectorize(transparentPng(), { ...DEFAULT_SETTINGS, colors: 4, keepTransparency: true });
    const off = await vectorize(transparentPng(), { ...DEFAULT_SETTINGS, colors: 4, keepTransparency: false });
    expect(on.stats.pathCount).toBeLessThan(off.stats.pathCount + 1);
    expect(on.svg).toContain("opacity=");
    // With transparency kept there must be no white background shape.
    expect(on.svg).not.toContain("rgb(255,255,255)");
    expect(off.svg).toContain("rgb(255,255,255)");
  });

  it("scale setting changes output dimensions and viewBox", async () => {
    const one = await vectorize(logo(), { ...DEFAULT_SETTINGS, colors: 4, scale: 1 });
    const two = await vectorize(logo(), { ...DEFAULT_SETTINGS, colors: 4, scale: 2 });
    expect(one.svg).toContain('viewBox="0 0 120 120"');
    expect(two.svg).toContain('viewBox="0 0 240 240"');
    expect(two.stats.width).toBe(240);
  });

  it("more colors yield more (or equal) distinct fills on a photo-like image", async () => {
    const few = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 4 });
    const many = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 32 });
    const fills = (s: string) => new Set(s.match(/fill="rgb\([^"]+\)"/g)).size;
    expect(fills(many.svg)).toBeGreaterThan(fills(few.svg));
  });

  it("speckle filter removes small paths", async () => {
    const noisy = photoLike();
    const low = await vectorize(noisy, { ...DEFAULT_SETTINGS, colors: 16, speckle: 0 });
    const high = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 16, speckle: 100 });
    expect(high.stats.pathCount).toBeLessThan(low.stats.pathCount);
  });

  it("detail setting changes the output", async () => {
    const coarse = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 8, detail: 1 });
    const fine = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 8, detail: 10 });
    expect(fine.svg).not.toEqual(coarse.svg);
  });

  it("threshold changes black & white output", async () => {
    const dark = await vectorize(photoLike(), { ...bw, threshold: 30 });
    const light = await vectorize(photoLike(), { ...bw, threshold: 220 });
    expect(dark.svg).not.toEqual(light.svg);
  });

  it("smoothing changes the output", async () => {
    const none = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 8, smoothing: 0 });
    const smooth = await vectorize(photoLike(), { ...DEFAULT_SETTINGS, colors: 8, smoothing: 5 });
    expect(smooth.svg).not.toEqual(none.svg);
  });

  it("does not mutate the caller's pixel buffer", async () => {
    const input = logo();
    const copy = new Uint8ClampedArray(input.data);
    await vectorize(input, bw);
    expect(Array.from(input.data)).toEqual(Array.from(copy));
  });
});

describe("settings helpers", () => {
  it("detail maps monotonically to stricter thresholds", () => {
    expect(detailToThresholds(1).ltres).toBeGreaterThan(detailToThresholds(5).ltres);
    expect(detailToThresholds(5).ltres).toBeGreaterThan(detailToThresholds(10).ltres);
  });
  it("defaults satisfy the schema", () => {
    expect(settingsSchema.safeParse(DEFAULT_SETTINGS).success).toBe(true);
  });
  it("rejects out-of-range settings", () => {
    expect(settingsSchema.safeParse({ ...DEFAULT_SETTINGS, colors: 500 }).success).toBe(false);
  });
  it("B/W options use a two-color palette; color options use numberofcolors", () => {
    expect(buildTracerOptions(bw).pal).toHaveLength(2);
    expect(buildTracerOptions(DEFAULT_SETTINGS).numberofcolors).toBe(16);
  });
  it("preparePixels thresholds to pure black/white in B/W mode", () => {
    const out = preparePixels(photoLike(), bw);
    for (let i = 0; i < out.length; i += 4) expect([0, 255]).toContain(out[i]);
  });
});
