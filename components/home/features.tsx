import { Download, Globe, Lock, Maximize2, SlidersHorizontal, Sparkles, UserX, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "./section";

const FEATURES = [
  { icon: Sparkles, title: "Free image-to-SVG conversion", text: "Convert PNG, JPG and WebP images to SVG at no cost." },
  { icon: Globe, title: "Runs in your browser", text: "Tracing happens locally using a Web Worker, so the page stays responsive." },
  { icon: UserX, title: "No account needed", text: "Open the page, drop an image, and download your SVG." },
  { icon: SlidersHorizontal, title: "Adjustable vectorization", text: "Control colors, detail, smoothing and speckle filtering." },
  { icon: Maximize2, title: "Scalable output", text: "The result is made of paths, so it stays sharp at any size." },
  { icon: Layers, title: "Transparent backgrounds", text: "Transparent areas in PNG and WebP files can stay transparent." },
  { icon: Download, title: "Instant downloads", text: "Download the SVG, copy its code, or save a PNG preview." },
  { icon: Lock, title: "Privacy-focused", text: "Your images are not uploaded to our servers." },
];

export function Features() {
  return (
    <Section id="features" title="Everything you need to vectorize an image" intro="A focused tool with real controls and no sign-up wall.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Card className="h-full p-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
