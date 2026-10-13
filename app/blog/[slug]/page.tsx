import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { getPost, POSTS } from "@/lib/content/posts";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({ title: `${post.title} | ${siteConfig.name}`, description: post.description, path: `/blog/${post.slug}`, type: "article", publishedTime: post.date });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/blog" className="hover:text-foreground">← All guides</Link>
      </nav>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground"><time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read</p>
      <div className="mt-8 space-y-8">
        {post.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-2xl font-semibold tracking-tight">{s.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
              {s.list && <ul className="list-disc space-y-1.5 pl-5">{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
            </div>
          </section>
        ))}
      </div>
      <aside className="mt-12 rounded-xl border bg-accent/40 p-6">
        <h2 className="text-lg font-semibold">Try it yourself</h2>
        <p className="mt-1 text-sm text-muted-foreground">Convert a PNG, JPG or WebP to SVG in your browser, with live preview.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild><Link href="/#converter">Open the converter</Link></Button>
          <Button asChild variant="outline"><Link href="/png-to-svg">PNG to SVG</Link></Button>
        </div>
      </aside>
    </article>
  );
}
