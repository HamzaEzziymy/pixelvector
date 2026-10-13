export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "What is an SVG file?",
    answer:
      "SVG (Scalable Vector Graphics) is an image format that describes shapes with mathematical paths instead of a grid of pixels. Because of that, an SVG can be scaled to any size without becoming blurry. It is an open web standard supported by all modern browsers.",
  },
  {
    question: "How do I convert PNG to SVG?",
    answer:
      "Upload your PNG in the converter above, choose a preset or adjust the settings, check the preview, and click Download SVG. The conversion traces the shapes and colors in your image and writes them as vector paths.",
  },
  {
    question: "Can I convert JPG to SVG?",
    answer:
      "Yes. JPG and JPEG files are supported. Keep in mind that JPG compression adds noise around edges, so you may get cleaner results by raising the speckle filter or using fewer colors.",
  },
  {
    question: "Is the image-to-SVG converter free?",
    answer: "Yes. Conversion and downloads are free, and you do not need to create an account.",
  },
  {
    question: "Are uploaded images stored on a server?",
    answer:
      "No. Your image is decoded and converted inside your browser. It is not sent to our servers, and nothing you convert is saved after you close or reset the page.",
  },
  {
    question: "Why does a converted photograph look different?",
    answer:
      "Vectorization approximates an image with a limited number of flat-colored shapes. Photographs contain millions of subtle color changes, so the result looks posterized or painterly. Logos, icons, line art and simple illustrations convert far better.",
  },
  {
    question: "Can I convert a logo to SVG?",
    answer:
      "Yes, and logos are one of the best use cases. For best results start with the largest, cleanest version of the logo you have, and use the Logo preset with a small number of colors.",
  },
  {
    question: "How do I download an SVG file?",
    answer:
      "After the conversion finishes, click Download SVG under the preview. You can also copy the SVG code or download a PNG preview.",
  },
  {
    question: "What is the difference between SVG and PNG?",
    answer:
      "PNG stores a fixed grid of pixels, so enlarging it eventually shows blurry or blocky edges. SVG stores shapes and scales cleanly. PNG is better for photographs and complex textures; SVG is better for logos, icons and illustrations.",
  },
  {
    question: "Can SVG files be edited?",
    answer:
      "Yes. SVG files open in vector editors such as Inkscape, Figma, Adobe Illustrator and Affinity Designer, and they are plain text, so developers can also edit them in a code editor. Traced files may contain many small paths, so expect some cleanup.",
  },
  {
    question: "Why is my SVG file larger than the original image?",
    answer:
      "Every traced shape is stored as path data. Images with many colors, gradients or fine texture create thousands of paths, which can outweigh a compressed PNG or JPG. Reduce the number of colors, raise the speckle filter or lower the detail level to shrink the file.",
  },
];
