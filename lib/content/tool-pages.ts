import type { VectorizeSettings } from "@/lib/vectorization/types";

export interface ToolPageContent {
  slug: string;
  navLabel: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  initialSettings?: Partial<VectorizeSettings>;
  steps: string[];
  sections: Array<{ heading: string; body: string[] }>;
  tips: string[];
  related: string[];
}

export const TOOL_PAGES: Record<string, ToolPageContent> = {
  "png-to-svg": {
    slug: "png-to-svg",
    navLabel: "PNG to SVG",
    title: "PNG to SVG Converter — Free Online Vectorizer",
    description:
      "Convert PNG images to scalable SVG vector graphics in your browser. Keep transparent backgrounds, tune colors and detail, and download the SVG for free.",
    h1: "PNG to SVG Converter",
    intro:
      "Turn a PNG into an SVG made of real vector paths. Transparent areas stay transparent, and everything is processed in your browser.",
    steps: [
      "Upload your PNG or drag it onto the converter.",
      "Pick a preset, then adjust colors, detail and smoothing while watching the preview.",
      "Click Download SVG.",
    ],
    sections: [
      {
        heading: "Why convert a PNG to SVG?",
        body: [
          "PNG is a pixel format, so enlarging it eventually exposes blurry or blocky edges. An SVG describes shapes instead, so it stays sharp on a favicon, a banner or a printed sign.",
          "PNG is also the most common format for logos and icons exported from design tools, which makes it a natural source for vectorization.",
        ],
      },
      {
        heading: "Transparent PNGs",
        body: [
          "If your PNG has a transparent background, leave Keep transparency switched on in the advanced settings. Transparent regions are left empty in the SVG instead of being traced as a white shape.",
          "Semi-transparent edges from anti-aliasing are blended onto white before tracing, so the SVG uses solid fills. Soft shadows and glows will not be reproduced as transparency gradients.",
        ],
      },
      {
        heading: "What converts well, and what does not",
        body: [
          "Flat logos, icons, screenshots of simple graphics and line art convert well. Screenshots of text become shapes rather than editable text. Photographs saved as PNG will be posterized.",
        ],
      },
    ],
    tips: [
      "Start from the largest PNG you have; small images produce rougher curves.",
      "Use fewer colors for flat artwork. Eight is often enough for a logo.",
      "Raise the speckle filter if you see tiny stray shapes.",
    ],
    related: ["jpg-to-svg", "logo-to-svg", "webp-to-svg"],
  },
  "jpg-to-svg": {
    slug: "jpg-to-svg",
    navLabel: "JPG to SVG",
    title: "JPG to SVG Converter — Convert JPEG to Vector Online",
    description:
      "Convert JPG and JPEG images to SVG online. Reduce compression noise with smoothing and speckle controls, then download your vector file. Processed in your browser.",
    h1: "JPG to SVG Converter",
    intro:
      "Convert JPG and JPEG images into SVG paths. Built-in smoothing and noise filtering help with the artifacts that JPEG compression leaves behind.",
    initialSettings: { smoothing: 1, speckle: 12 },
    steps: [
      "Upload a JPG or JPEG file.",
      "Increase smoothing or the speckle filter if edges look noisy, and lower the number of colors for flat artwork.",
      "Download the SVG when the preview looks right.",
    ],
    sections: [
      {
        heading: "How JPEG compression affects vectorization",
        body: [
          "JPEG is a lossy format. Around sharp edges it creates faint blocks and color fringes that are invisible at normal size but that a tracer treats as real detail, producing extra tiny shapes.",
          "This page starts with light smoothing and a stronger speckle filter than the default to compensate. You can change both in the settings.",
        ],
      },
      {
        heading: "Photographs",
        body: [
          "A JPG photograph can be converted, but the result is a stylized approximation made from flat color regions, not a lifelike copy. Using more colors improves fidelity and increases file size quickly.",
          "If you need a faithful photograph, keep it as JPG or WebP. SVG suits illustration, logos and graphic effects.",
        ],
      },
    ],
    tips: [
      "Use the Illustration preset for drawings and the Photo preset only when you want a posterized effect.",
      "Try Black & white with the threshold slider for scanned signatures and sketches.",
      "If a JPG is very large, it is traced at reduced resolution but the SVG keeps the original dimensions.",
    ],
    related: ["png-to-svg", "logo-to-svg", "webp-to-svg"],
  },
  "webp-to-svg": {
    slug: "webp-to-svg",
    navLabel: "WebP to SVG",
    title: "WebP to SVG Converter — Free Online Image Vectorizer",
    description:
      "Convert WebP images to SVG in your browser. Customize colors and detail and download a scalable vector file without creating an account.",
    h1: "WebP to SVG Converter",
    intro:
      "Got a WebP you need as a vector? Upload it and the converter traces it into SVG paths locally in your browser.",
    steps: [
      "Upload a WebP file. Lossy and lossless WebP are both read by your browser.",
      "Adjust the settings and check the preview.",
      "Download the SVG.",
    ],
    sections: [
      {
        heading: "When WebP to SVG makes sense",
        body: [
          "WebP is common on modern websites, so graphics you save from a page are often WebP. If that graphic is a logo or icon, converting it to SVG gives you an editable, resolution-independent version.",
        ],
      },
      {
        heading: "Browser support note",
        body: [
          "WebP files are decoded by your own browser, which is why this works in current versions of Chrome, Edge, Firefox and Safari. Animated WebP files are read as a single still frame.",
        ],
      },
    ],
    tips: [
      "Lossy WebP can have the same edge noise as JPG. Use smoothing and the speckle filter to clean it up.",
      "Make sure you have the right to convert and reuse the artwork.",
    ],
    related: ["png-to-svg", "jpg-to-svg", "logo-to-svg"],
  },
  "logo-to-svg": {
    slug: "logo-to-svg",
    navLabel: "Logo to SVG",
    title: "Logo to SVG Converter — Make a Logo Scalable Online",
    description:
      "Turn a PNG or JPG logo into a scalable SVG. Start with logo-optimized settings, preview the result, and download clean vector paths for web and print.",
    h1: "Logo to SVG Converter",
    intro:
      "Convert a raster logo into a scalable SVG. This page starts with settings tuned for flat logos: a small palette and crisp edges.",
    initialSettings: { colorMode: "color", colors: 8, detail: 7, smoothing: 0, speckle: 8 },
    steps: [
      "Upload the largest, cleanest version of your logo.",
      "Reduce the number of colors until it matches your brand palette, then compare the result to the original.",
      "Download the SVG.",
    ],
    sections: [
      {
        heading: "Getting a clean result",
        body: [
          "Automatic tracing works best on flat logos with solid colors and clear edges. Start from the highest-resolution file you have; tracing a tiny, blurry logo gives rough curves.",
          "Gradients, drop shadows and textures are rebuilt from bands of flat color, so simplify them in the original if you can.",
        ],
      },
      {
        heading: "Colors and background",
        body: [
          "A logo on a white background will include a white shape behind it in color mode. For a single-color logo with no background, switch to Black & white, which produces just the dark shapes on a transparent canvas.",
          "Traced colors are sampled from the image, so they may differ slightly from your exact brand values. Check them in a vector editor before final use.",
        ],
      },
      {
        heading: "Professional use",
        body: [
          "A traced logo is a good starting point, but professional branding usually deserves a hand-redrawn vector with clean geometry and a minimal number of nodes. Treat this result as a fast draft or a quick working file.",
        ],
      },
    ],
    tips: [
      "Try Black & white for one-color marks and stamps.",
      "Zoom in on the preview to inspect curves before downloading.",
      "Open the downloaded SVG in a vector editor to refine nodes and fix colors.",
    ],
    related: ["png-to-svg", "jpg-to-svg", "webp-to-svg"],
  },
};

export const TOOL_SLUGS = Object.keys(TOOL_PAGES);
