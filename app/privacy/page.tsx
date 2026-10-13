import type { Metadata } from "next";
import { LegalPage } from "@/components/home/legal-page";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `How ${siteConfig.name} handles your images and data: images are converted in your browser and are not uploaded.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const { name } = siteConfig;
  return (
    <LegalPage title="Privacy Policy" updated={siteConfig.lastUpdated}>
      <p>This policy describes how {name} works today. It reflects the current implementation of the website.</p>

      <h2>Your images stay in your browser</h2>
      <p>
        When you select, drop or paste an image, it is read and converted into SVG by code running in your own browser, including in a Web Worker. The image and the generated SVG are not sent to {name} servers, and they are not written to local storage or cookies. They exist only in your browser&apos;s memory and are released when you replace the image, start over or close the page.
      </p>

      <h2>Files you download</h2>
      <p>SVG and PNG files are created in your browser and saved to your device. We never receive a copy.</p>

      <h2>Information we collect</h2>
      <p>
        The converter does not require an account and does not collect personal information. Like most websites, the hosting provider may process standard technical data such as IP address, browser type and requested URLs in server logs for security and operation of the service.
      </p>
      <ul>
        <li>No analytics or advertising scripts are included in this version of the site.</li>
        <li>The site stores a single preference in your browser, your light or dark theme choice, so it can be remembered on your next visit.</li>
      </ul>

      <h2>Third parties</h2>
      <p>
        The site is delivered through a hosting provider and fonts are served from the site itself at build time. If analytics or advertising are added in the future, this policy will be updated first and, where required, consent will be requested.
      </p>

      <h2>Your rights</h2>
      <p>Because we do not collect or store your images or personal data through the converter, there is generally nothing for us to access, correct or delete. If you have questions, see the contact page.</p>

      <h2>Changes</h2>
      <p>If this policy changes, the date above will be updated.</p>
    </LegalPage>
  );
}
