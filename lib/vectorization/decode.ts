import { computeTraceSize, validateDimensions } from "@/lib/validation/file";
import type { RasterInput } from "./types";

export interface DecodedImage {
  input: RasterInput;
  originalWidth: number;
  originalHeight: number;
  /** Multiply the user's scale by this to restore the original output size after downscaling. */
  compensation: number;
}

async function loadBitmap(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // fall through to <img>
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error("This image could not be decoded. It may be corrupted.");
  }
}

/** Decodes a validated image file into RGBA pixels, downscaling for tracing if necessary. */
export async function decodeImage(file: Blob): Promise<DecodedImage> {
  const bmp = await loadBitmap(file);
  const canvas = document.createElement("canvas");
  try {
    const dims = validateDimensions(bmp.width, bmp.height);
    if (!dims.ok) throw new Error(dims.message);

    const size = computeTraceSize(bmp.width, bmp.height);
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas is not available in this browser.");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp.source, 0, 0, size.width, size.height);
    const data = ctx.getImageData(0, 0, size.width, size.height).data;
    return {
      input: { width: size.width, height: size.height, data },
      originalWidth: bmp.width,
      originalHeight: bmp.height,
      compensation: size.compensation,
    };
  } finally {
    bmp.release();
    canvas.width = 0;
    canvas.height = 0;
  }
}
