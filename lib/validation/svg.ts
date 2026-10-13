/**
 * SVG sanitization. The SVG we produce comes from our own tracer, but we still treat it as
 * untrusted: it is run through DOMPurify (SVG profile) and then checked against a strict
 * allowlist before it is ever rendered or exported.
 */
const ALLOWED_TAGS = new Set(["svg", "g", "path"]);
const ALLOWED_ATTRS = new Set([
  "xmlns", "viewbox", "width", "height", "version", "d", "fill", "stroke",
  "stroke-width", "opacity", "fill-opacity", "fill-rule",
]);

export function isStrictlySafeSvg(svg: string): boolean {
  if (!/^\s*<svg[\s>]/.test(svg)) return false;
  const tagRe = /<\/?\s*([a-zA-Z][\w:-]*)([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(svg)) !== null) {
    const tag = match[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return false;
    const attrRe = /([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let a: RegExpExecArray | null;
    while ((a = attrRe.exec(match[2])) !== null) {
      const name = a[1].toLowerCase();
      const value = (a[3] ?? a[4] ?? "").toLowerCase();
      if (name.startsWith("on") || !ALLOWED_ATTRS.has(name)) return false;
      if (value.includes("javascript:") || value.includes("url(") || value.includes("data:")) return false;
    }
  }
  return true;
}

export async function sanitizeSvg(svg: string): Promise<string> {
  const { default: DOMPurify } = await import("dompurify");
  const clean = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    ALLOWED_TAGS: Array.from(ALLOWED_TAGS),
    ALLOWED_ATTR: Array.from(ALLOWED_ATTRS).map((a) => (a === "viewbox" ? "viewBox" : a)),
    KEEP_CONTENT: false,
  });
  if (!clean || !isStrictlySafeSvg(clean)) {
    throw new Error("The generated SVG failed safety checks and was discarded.");
  }
  // DOMPurify serializes via the DOM; ensure the namespace survives for standalone viewing.
  return /xmlns=/.test(clean) ? clean : clean.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
}
