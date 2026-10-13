export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function svgFilename(original: string | null): string {
  const base = (original ?? "image").replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  return `${base}.svg`;
}

export function pngFilename(original: string | null): string {
  return svgFilename(original).replace(/\.svg$/, "-preview.png");
}

/** Renders an SVG blob URL to a PNG blob via canvas. Used for the optional PNG preview download. */
export async function svgUrlToPng(svgUrl: string, width: number, height: number): Promise<Blob> {
  const img = new Image();
  img.src = svgUrl;
  await img.decode();
  const maxSide = 4096;
  const ratio = Math.min(1, maxSide / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create PNG."))), "image/png"),
    );
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}
