export interface PostSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  sections: PostSection[];
}

export const POSTS: Post[] = [
  {
    slug: "svg-vs-png",
    title: "SVG vs PNG: Which Format Should You Use?",
    description:
      "A practical comparison of SVG and PNG: how each works, when scalability matters, file size trade-offs, and which to choose for logos, icons, photos and the web.",
    date: "2026-10-12",
    readingMinutes: 5,
    sections: [
      {
        heading: "The core difference",
        paragraphs: [
          "PNG is a raster format. It stores a grid of colored pixels, so it has a fixed resolution. SVG is a vector format. It stores instructions for drawing shapes such as paths, circles and fills, so the same file can be rendered at any size.",
          "That single difference drives most of the trade-offs below.",
        ],
      },
      {
        heading: "When SVG is the better choice",
        paragraphs: ["SVG shines for graphics made of clean shapes and flat colors."],
        list: [
          "Logos and wordmarks that must look sharp from a favicon to a billboard.",
          "Icons and UI illustrations, especially on high-density screens.",
          "Charts and diagrams that benefit from crisp lines and selectable shapes.",
          "Graphics you want to style or animate with CSS or JavaScript.",
        ],
      },
      {
        heading: "When PNG is the better choice",
        paragraphs: [
          "PNG handles photographs, screenshots, textures and anything with continuous tone far better. Representing a photograph as vector paths needs thousands of shapes and still looks posterized. For photos, JPEG, WebP or AVIF are usually smaller than PNG.",
          "PNG also remains the safest option when a platform does not accept SVG uploads, which is common on social networks and some marketplaces.",
        ],
      },
      {
        heading: "File size",
        paragraphs: [
          "A simple SVG logo can be only a few kilobytes and stays that size at any resolution. A complex SVG with thousands of paths can be larger than the equivalent PNG. The size of a PNG depends on its pixel dimensions, so a larger PNG costs more.",
        ],
      },
      {
        heading: "Quick rule of thumb",
        paragraphs: [
          "If the image is made of shapes and you need it at several sizes, use SVG. If it is made of pixels and tones, such as a photograph, use a raster format.",
        ],
      },
    ],
  },
  {
    slug: "how-to-convert-png-to-svg",
    title: "How to Convert PNG to SVG",
    description:
      "Learn how PNG to SVG conversion works, how to prepare your image, which settings matter, and how to check and clean up the result.",
    date: "2026-10-12",
    readingMinutes: 6,
    sections: [
      {
        heading: "What conversion actually does",
        paragraphs: [
          "Converting a PNG to SVG is not renaming a file. A tracing algorithm reduces the image to a small set of colors, finds the boundaries between color regions, and fits lines and curves to those boundaries. Those curves are written as SVG path data.",
          "Because it works from pixels, the result is an approximation of the original image.",
        ],
      },
      {
        heading: "Step by step",
        paragraphs: [],
        list: [
          "Start with the best source: a large, sharp PNG with as little compression noise as possible.",
          "Upload it to a converter and choose the preset that matches your artwork, such as logo, line art or illustration.",
          "Compare the original and the result in the preview. Zoom in on edges and small details.",
          "Adjust the settings and watch the preview update, then download the SVG.",
        ],
      },
      {
        heading: "Settings that matter most",
        paragraphs: [
          "The number of colors controls how many flat fills the tracer may use. Flat artwork needs few; gradients need more but produce larger files.",
          "The detail level controls how closely curves follow the original edges. The speckle filter removes tiny stray shapes, and smoothing softens jagged edges before tracing.",
        ],
      },
      {
        heading: "Check and clean up",
        paragraphs: [
          "Open the SVG in a browser at a large size and look for rough curves, missing details and unwanted background shapes. For production work, open it in a vector editor such as Inkscape or Figma to merge shapes, correct colors and delete the background.",
        ],
      },
    ],
  },
  {
    slug: "how-to-make-a-logo-scalable",
    title: "How to Make a Logo Scalable",
    description:
      "How to turn a pixel-based logo into a scalable vector logo: choosing a source file, tracing, checking quality, and when to redraw it by hand.",
    date: "2026-10-12",
    readingMinutes: 5,
    sections: [
      {
        heading: "Why logos should be vectors",
        paragraphs: [
          "A logo appears everywhere: a browser tab, a business card, a trade show banner. A raster logo has to be exported at every size, and enlarging a small one makes it blurry. A vector logo is drawn once and renders cleanly at any size.",
        ],
      },
      {
        heading: "Look for the original first",
        paragraphs: [
          "Before tracing, check whether a vector original already exists. Designers often deliver SVG, AI, EPS or PDF files. Ask whoever created the logo, or search your old project folders. Tracing is the fallback when only a PNG or JPG remains.",
        ],
      },
      {
        heading: "Trace it well",
        paragraphs: [],
        list: [
          "Use the largest, cleanest file you have.",
          "Use a small number of colors that match the flat colors of the logo.",
          "For a one-color mark, use black and white mode and set the threshold so thin lines are kept.",
          "Zoom in and compare against the original before downloading.",
        ],
      },
      {
        heading: "When to redraw by hand",
        paragraphs: [
          "Tracing creates many small curve segments and may round off sharp corners slightly. For a brand mark that will be used for years, a designer can redraw the traced shapes with clean geometry. Use the traced file as a quick reference or working draft.",
        ],
      },
    ],
  },
  {
    slug: "why-does-vectorization-change-the-image",
    title: "Why Does Image Vectorization Change the Original Image?",
    description:
      "Understand why converting an image to SVG never reproduces it exactly, and which kinds of images convert well or poorly.",
    date: "2026-10-12",
    readingMinutes: 5,
    sections: [
      {
        heading: "Pixels and shapes are different languages",
        paragraphs: [
          "A raster image says what color each pixel is. A vector image says where shapes are and what color fills them. Turning pixels into shapes means deciding where one region ends and another begins, and that decision is an interpretation.",
        ],
      },
      {
        heading: "Color reduction",
        paragraphs: [
          "To keep the number of shapes manageable, a tracer first reduces the image to a limited palette. Smooth gradients become bands of flat color, which is why photographs and soft shadows look posterized.",
        ],
      },
      {
        heading: "Curve fitting",
        paragraphs: [
          "Edges are approximated by straight lines and curves within an error tolerance. A higher detail setting follows the pixels more closely and produces more segments; a lower setting gives smoother, simpler paths that drift further from the original.",
        ],
      },
      {
        heading: "Noise and tiny details",
        paragraphs: [
          "Compression artifacts and film grain become tiny shapes unless they are filtered out. Filtering removes noise but can also remove real fine details, so there is always a trade-off.",
        ],
      },
      {
        heading: "What converts best",
        paragraphs: [
          "Images that are already close to vector art, such as logos, icons, line drawings and flat illustrations, convert closest to the original. Photographs and textured images convert the least faithfully.",
        ],
      },
    ],
  },
  {
    slug: "how-to-use-svg-files-on-a-website",
    title: "How to Use SVG Files on a Website",
    description:
      "Four ways to use SVG on a website: img tags, CSS backgrounds, inline SVG and objects. Learn the trade-offs for styling, caching and accessibility.",
    date: "2026-10-12",
    readingMinutes: 5,
    sections: [
      {
        heading: "Option 1: the img tag",
        paragraphs: [
          "The simplest approach is an img element with the SVG as its source and descriptive alt text. The file is cached by the browser, and scripts inside it do not run. You cannot style individual paths from the page's CSS.",
        ],
      },
      {
        heading: "Option 2: CSS backgrounds",
        paragraphs: [
          "SVGs work as background-image values for decorative graphics. This keeps them out of the HTML but gives them no accessible name, so use it only for decoration.",
        ],
      },
      {
        heading: "Option 3: inline SVG",
        paragraphs: [
          "Placing the svg element directly in the HTML lets you style paths with CSS, animate them, and change colors with currentColor. The trade-off is that the markup is not cached separately and large traced SVGs would bloat the page, so inline is best for small icons.",
        ],
      },
      {
        heading: "Option 4: sizing and performance",
        paragraphs: [
          "Always set width and height or an aspect ratio so the layout does not shift while the image loads. Traced SVGs with thousands of paths can be heavy; reduce colors in the converter, and compress the file with gzip or Brotli, which servers normally apply to SVG automatically.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "SVG can contain scripts. Only inline SVG from sources you trust, and sanitize any user-uploaded SVG before displaying it.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
