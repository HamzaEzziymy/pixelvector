// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { sanitizeSvg } from "@/lib/validation/svg";
import { vectorize } from "@/lib/vectorization/engine";
import { DEFAULT_SETTINGS } from "@/lib/vectorization/settings";
import { logo } from "./fixtures";

describe("sanitizeSvg (jsdom)", () => {
  it("keeps real tracer output intact and viewable", async () => {
    const { svg } = await vectorize(logo(), { ...DEFAULT_SETTINGS, colors: 4 });
    const clean = await sanitizeSvg(svg);
    expect(clean).toContain("<path");
    expect(clean).toContain("xmlns=");
    expect(clean).toContain("viewBox");
    const doc = new DOMParser().parseFromString(clean, "image/svg+xml");
    expect(doc.querySelector("parsererror")).toBeNull();
    expect(doc.documentElement.tagName.toLowerCase()).toBe("svg");
  });
  it("strips scripts and event handlers", async () => {
    const dirty = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(1)</script><path d="M0 0L5 5Z" fill="rgb(1,2,3)"/></svg>';
    const clean = await sanitizeSvg(dirty);
    expect(clean).not.toMatch(/script|onload/i);
    expect(clean).toContain("<path");
  });
});
