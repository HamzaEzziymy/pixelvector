import type { Metadata } from "next";
import { Examples } from "@/components/home/examples";
import { Faq } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { UseCases } from "@/components/home/use-cases";
import { NativeBanner } from "@/components/ads/native-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { webApplicationJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: `Image to SVG Converter — Free Online PNG to SVG | ${siteConfig.name}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={webApplicationJsonLd("/", `${siteConfig.name} Image to SVG Converter`)} />
      <Hero />
      <div className="border-b border-t py-8 bg-muted/20">
        <NativeBanner />
      </div>
      <Features />
      <HowItWorks />
      <Examples />
      <UseCases />
      <Faq />
    </>
  );
}
