import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/config/site";
import { POSTS } from "@/lib/content/posts";
import { TOOL_SLUGS } from "@/lib/content/tool-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(siteConfig.lastUpdated);
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    ...TOOL_SLUGS.map((slug) => ({ url: absoluteUrl(`/${slug}`), lastModified: updated, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: absoluteUrl("/blog"), lastModified: updated, changeFrequency: "weekly", priority: 0.6 },
    ...POSTS.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: absoluteUrl("/privacy"), lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/contact"), lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
  ];
  return entries;
}
