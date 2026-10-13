import type { Metadata } from "next";
import { LegalPage } from "@/components/home/legal-page";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `Terms of Service | ${siteConfig.name}`,
  description: `The terms for using the ${siteConfig.name} image to SVG converter.`,
  path: "/terms",
});

export default function TermsPage() {
  const { name } = siteConfig;
  return (
    <LegalPage title="Terms of Service" updated={siteConfig.lastUpdated}>
      <p>By using {name} you agree to these terms. If you do not agree, please do not use the service.</p>

      <h2>The service</h2>
      <p>{name} converts raster images into SVG vector graphics in your browser. The service is provided free of charge.</p>

      <h2>Your content and your responsibility</h2>
      <p>
        You keep all rights to the images you convert. You are responsible for making sure you have the right to convert and use any image, including logos, artwork and photographs that belong to others. Do not use the service for unlawful content.
      </p>

      <h2>Approximate results</h2>
      <p>
        Vectorization is an approximation. Output may differ from the original image, particularly for photographs, gradients and fine detail. We do not guarantee that results are suitable for any specific purpose, or compatible with any particular software or device.
      </p>

      <h2>No warranty</h2>
      <p>The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, to the extent permitted by law.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the service.</p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use after an update means you accept the new terms.</p>
    </LegalPage>
  );
}
