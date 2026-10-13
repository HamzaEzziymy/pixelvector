import { Lock, Zap } from "lucide-react";
import { Converter } from "@/components/converter/converter";
import { siteConfig } from "@/lib/config/site";

/** Static illustration: pixel grid on the left, smooth vector shape on the right. */
function PixelToVector() {
  const cells: Array<[number, number]> = [
    [2, 0], [3, 0], [1, 1], [2, 1], [3, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [1, 4], [2, 4], [3, 4], [4, 4], [2, 5], [3, 5],
  ];
  return (
    <svg viewBox="0 0 320 130" role="img" aria-label="A blocky pixel shape on the left turns into a smooth vector shape on the right" className="h-auto w-full max-w-sm">
      <g transform="translate(10 8)">
        {cells.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x * 18} y={y * 18} width="17" height="17" rx="2" fill="var(--primary)" opacity="0.85" />
        ))}
      </g>
      <path d="M140 65 H176" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M168 57 L178 65 L168 73" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform="translate(196 8)">
        <path d="M54 0 C80 0 98 20 108 44 C118 66 108 90 72 108 C50 118 22 112 8 88 C-6 64 2 38 20 20 C30 8 40 0 54 0 Z" fill="var(--primary)" opacity="0.85" />
        <circle cx="54" cy="0" r="3.5" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.5" />
        <circle cx="108" cy="44" r="3.5" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.5" />
        <circle cx="72" cy="108" r="3.5" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.5" />
        <circle cx="8" cy="88" r="3.5" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lock className="size-3.5" aria-hidden /> Free, fast and private
            </p>
            <h1 id="hero-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Convert Images to SVG in Seconds
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Turn PNG, JPG, and WebP images into scalable vector graphics. Customize colors, detail, and smoothing, then download your SVG — directly in your browser.
            </p>
          </div>
          <div className="hidden justify-center lg:flex">
            <PixelToVector />
          </div>
        </div>

        <div className="mt-8">
          <Converter />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" aria-hidden />Your image is processed in your browser and not uploaded to {siteConfig.name} servers.</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5" aria-hidden />PNG · JPG · WebP</span>
          </div>
        </div>
      </div>
    </section>
  );
}
