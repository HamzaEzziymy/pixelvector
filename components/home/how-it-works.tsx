import { Download, SlidersHorizontal, Upload } from "lucide-react";
import { Section } from "./section";

const STEPS = [
  { icon: Upload, title: "Upload an image", text: "Drag in a PNG, JPG or WebP, choose a file, or paste from your clipboard." },
  { icon: SlidersHorizontal, title: "Adjust and preview", text: "Pick a preset or tune the settings. The preview updates as you change them." },
  { icon: Download, title: "Download the SVG", text: "Save the SVG file, copy its code, or grab a PNG preview." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" title="How it works" intro="Three steps from pixels to vectors." muted>
      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative rounded-xl border bg-card p-6">
            <span className="absolute right-5 top-5 text-4xl font-semibold text-muted-foreground/30" aria-hidden>{i + 1}</span>
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold"><span className="sr-only">Step {i + 1}: </span>{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
