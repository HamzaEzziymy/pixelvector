import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { Logo } from "./logo";

const PRODUCT = [
  { href: "/#converter", label: "Converter" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
];
const TOOLS = [
  { href: "/png-to-svg", label: "PNG to SVG" },
  { href: "/jpg-to-svg", label: "JPG to SVG" },
  { href: "/webp-to-svg", label: "WebP to SVG" },
  { href: "/logo-to-svg", label: "Logo to SVG" },
  { href: "/blog", label: "Guides" },
];
const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact" },
];

function Column({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Images are converted in your browser and are not uploaded to our servers.
          </p>
        </div>
        <Column title="Product" links={PRODUCT} />
        <Column title="Tools" links={TOOLS} />
        <Column title="Legal" links={LEGAL} />
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
