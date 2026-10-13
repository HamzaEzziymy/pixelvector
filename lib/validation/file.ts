export const LIMITS = {
  maxFileBytes: 15 * 1024 * 1024,
  maxSidePx: 8000,
  maxPixels: 40_000_000,
  /** Longest side used for tracing. Larger images are downscaled to keep the UI responsive. */
  maxTraceSidePx: 1600,
} as const;

export type SupportedFormat = "png" | "jpeg" | "webp";

export const FORMAT_MIME: Record<SupportedFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export const ACCEPT_ATTR = "image/png,image/jpeg,image/webp";

export type ValidationResult =
  | { ok: true; format: SupportedFormat }
  | { ok: false; message: string };

/** Detects the real format from file signature bytes, ignoring extension and declared MIME. */
export function sniffFormat(bytes: Uint8Array): SupportedFormat | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

/** Validates size and real content type. Dimensions are checked after decoding. */
export function validateFileBytes(size: number, head: Uint8Array): ValidationResult {
  if (size <= 0) return { ok: false, message: "This file is empty." };
  if (size > LIMITS.maxFileBytes) {
    return {
      ok: false,
      message: `This file is too large. The maximum size is ${LIMITS.maxFileBytes / 1024 / 1024} MB.`,
    };
  }
  const format = sniffFormat(head);
  if (!format) {
    return {
      ok: false,
      message: "Unsupported or corrupted file. Please upload a PNG, JPG or WebP image.",
    };
  }
  return { ok: true, format };
}

export async function validateFile(file: File): Promise<ValidationResult> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return validateFileBytes(file.size, head);
}

export function validateDimensions(width: number, height: number): { ok: true } | { ok: false; message: string } {
  if (!(width > 0) || !(height > 0)) {
    return { ok: false, message: "The image has no readable dimensions." };
  }
  if (width > LIMITS.maxSidePx || height > LIMITS.maxSidePx) {
    return {
      ok: false,
      message: `This image is ${width}×${height}px. The maximum is ${LIMITS.maxSidePx}px on either side.`,
    };
  }
  if (width * height > LIMITS.maxPixels) {
    return { ok: false, message: "This image has too many pixels to process safely in the browser." };
  }
  return { ok: true };
}

/** Returns working dimensions and the scale factor needed to restore original output size. */
export function computeTraceSize(width: number, height: number): { width: number; height: number; compensation: number } {
  const longest = Math.max(width, height);
  if (longest <= LIMITS.maxTraceSidePx) return { width, height, compensation: 1 };
  const ratio = LIMITS.maxTraceSidePx / longest;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
    compensation: longest / LIMITS.maxTraceSidePx,
  };
}
