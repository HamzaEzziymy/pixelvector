import type { Metadata } from "next";
import { LegalPage } from "@/components/home/legal-page";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `Contact | ${siteConfig.name}`,
  description: `How to contact ${siteConfig.name} about the image to SVG converter.`,
  path: "/contact",
});

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  return (
    <LegalPage title="Contact" updated={siteConfig.lastUpdated}>
      {email ? (
        <p>
          For questions, feedback or bug reports, email{" "}
          <a className="font-medium text-primary underline underline-offset-4" href={`mailto:${email}`}>{email}</a>.
        </p>
      ) : (
        <p>
          A contact address has not been configured for this deployment yet. The site owner can set <code className="rounded bg-muted px-1.5 py-0.5 text-sm">NEXT_PUBLIC_CONTACT_EMAIL</code> to show one here.
        </p>
      )}
      <p>When reporting a conversion problem, please describe the image type, your browser and the settings you used. Do not send images that contain private information.</p>
    </LegalPage>
  );
}
