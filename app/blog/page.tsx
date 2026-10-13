import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";
import { POSTS } from "@/lib/content/posts";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `SVG and Vectorization Guides | ${siteConfig.name}`,
  description: "Practical guides on SVG, vectorization, logos and using vector graphics on the web.",
  path: "/blog",
});

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Guides</h1>
      <p className="mt-3 text-muted-foreground">Practical articles about SVG, vectorization and getting better results from the converter.</p>
      <ul className="mt-10 space-y-6">
        {POSTS.map((post) => (
          <li key={post.slug} className="rounded-xl border bg-card p-5 transition-colors hover:border-primary/50">
            <h2 className="text-xl font-semibold"><Link href={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link></h2>
            <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
            <p className="mt-3 text-xs text-muted-foreground"><time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
