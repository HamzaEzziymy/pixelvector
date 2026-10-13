import { describe, expect, it } from "vitest";
import { sniffFormat, validateFileBytes, validateDimensions, computeTraceSize, LIMITS } from "@/lib/validation/file";
import { isStrictlySafeSvg } from "@/lib/validation/svg";
import { encodePng, encodeJpeg, logo } from "./fixtures";

describe("file validation", () => {
  it("detects PNG and JPEG from real encoded bytes", () => {
    expect(sniffFormat(encodePng(logo()).slice(0, 16))).toBe("png");
    expect(sniffFormat(encodeJpeg(logo()).slice(0, 16))).toBe("jpeg");
  });
  it("detects WebP signature", () => {
    const head = new Uint8Array([0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50]);
    expect(sniffFormat(head)).toBe("webp");
  });
  it("rejects files whose content is not an image regardless of name", () => {
    const text = new TextEncoder().encode("<svg onload=alert(1)>");
    const r = validateFileBytes(text.length, text);
    expect(r.ok).toBe(false);
  });
  it("rejects empty and oversized files", () => {
    expect(validateFileBytes(0, new Uint8Array()).ok).toBe(false);
    const png = encodePng(logo()).slice(0, 16);
    expect(validateFileBytes(LIMITS.maxFileBytes + 1, png).ok).toBe(false);
    expect(validateFileBytes(1000, png).ok).toBe(true);
  });
  it("validates dimensions", () => {
    expect(validateDimensions(100, 100).ok).toBe(true);
    expect(validateDimensions(0, 10).ok).toBe(false);
    expect(validateDimensions(LIMITS.maxSidePx + 1, 10).ok).toBe(false);
    expect(validateDimensions(7000, 7000).ok).toBe(false);
  });
  it("downscales large images for tracing and reports the compensation factor", () => {
    expect(computeTraceSize(800, 600)).toEqual({ width: 800, height: 600, compensation: 1 });
    const big = computeTraceSize(3200, 1600);
    expect(big.width).toBe(1600);
    expect(big.height).toBe(800);
    expect(big.compensation).toBe(2);
  });
});

describe("svg safety allowlist", () => {
  it("accepts tracer-style output", () => {
    expect(isStrictlySafeSvg('<svg viewBox="0 0 1 1" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="rgb(0,0,0)" stroke-width="0" opacity="1" d="M 0 0 L 1 1 Z"/></svg>')).toBe(true);
  });
  it.each([
    '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/png;base64,AAAA"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div/></foreignObject></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><path fill="url(javascript:alert(1))" d="M0 0"/></svg>',
    "<div>not svg</div>",
  ])("rejects unsafe markup: %s", (bad) => {
    expect(isStrictlySafeSvg(bad)).toBe(false);
  });
});
