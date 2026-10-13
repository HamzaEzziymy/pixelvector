import Link from "next/link";
import { Converter } from "@/components/converter/converter";
import { JsonLd } from "@/components/seo/json-ld";
import { Faq } from "@/components/home/faq";
import { NativeBanner } from "@/components/ads/native-banner";
import { siteConfig } from "@/lib/config/site";
import { TOOL_PAGES, type ToolPageContent } from "@/lib/content/tool-pages";
import { breadcrumbJsonLd, webApplicationJsonLd } from "@/lib/seo/structured-data";

export function ToolPage({ page }: { page: ToolPageContent }) {
  const path = `/${page.slug}`;
  return (
    <>
      <JsonLd data={webApplicationJsonLd(path, `${siteConfig.name} ${page.h1}`, page.description)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.navLabel, path }])} />

      <section aria-labelledby="tool-title" className="border-b bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">{page.navLabel}</li>
            </ol>
          </nav>
          <h1 id="tool-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{page.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{page.intro}</p>
          <div className="mt-8">
            <Converter initialSettings={page.initialSettings} />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your image is processed in your browser and is not uploaded to {siteConfig.name} servers. Vectorization approximates the original image.
            </p>
          </div>
        </div>
      </section>

      {/* Ad slot: right after the converter, before the guide content — high-attention moment */}
      <div className="border-b bg-muted/20 py-8">
        <NativeBanner />
      </div>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-14 sm:px-6">
        <section aria-labelledby="steps-title">
          <h2 id="steps-title" className="text-2xl font-semibold tracking-tight">How to use the {page.navLabel} converter</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
            {page.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
              {section.body.map((p) => <p key={p}>{p}</p>)}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Tips for better results</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            {page.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        <section aria-labelledby="related-title">
          <h2 id="related-title" className="text-2xl font-semibold tracking-tight">Related converters</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {page.related.map((slug) => (
              <li key={slug}>
                <Link href={`/${slug}`} className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  {TOOL_PAGES[slug].navLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                General image to SVG converter
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <Faq />
    </>
  );
}
