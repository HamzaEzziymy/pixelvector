import { siteConfig } from "@/lib/config/site";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--primary)" />
      <path d="M9 22 L16 8 L23 22" fill="none" stroke="var(--primary-foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="22" r="2" fill="var(--primary-foreground)" />
      <circle cx="16" cy="8" r="2" fill="var(--primary-foreground)" />
      <circle cx="23" cy="22" r="2" fill="var(--primary-foreground)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
      <LogoMark />
      {siteConfig.name}
    </span>
  );
}
