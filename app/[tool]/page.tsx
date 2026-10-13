import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "@/components/home/tool-page";
import { siteConfig } from "@/lib/config/site";
import { TOOL_PAGES, TOOL_SLUGS } from "@/lib/content/tool-pages";
import { buildMetadata } from "@/lib/seo/metadata";

// Only the four known tool slugs are generated; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_SLUGS.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: PageProps<"/[tool]">): Promise<Metadata> {
  const { tool } = await params;
  const page = TOOL_PAGES[tool];
  if (!page) return {};
  return buildMetadata({ title: `${page.title} | ${siteConfig.name}`, description: page.description, path: `/${page.slug}` });
}

export default async function Page({ params }: PageProps<"/[tool]">) {
  const { tool } = await params;
  const page = TOOL_PAGES[tool];
  if (!page) notFound();
  return <ToolPage page={page} />;
}
