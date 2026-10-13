/**
 * Central site configuration. Everything brand- or domain-specific lives here
 * so the product can be renamed or moved without touching components.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "PixelVector",
  url: rawUrl.replace(/\/+$/, ""),
  tagline: "Convert Images to SVG Online — Free, Fast & Private",
  description:
    "Convert PNG, JPG and WebP images to SVG online. Customize vectorization settings and download scalable vector graphics with our privacy-focused image converter.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  lastUpdated: "2026-10-12",
} as const;

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean === "/" ? "" : clean}`;
}
