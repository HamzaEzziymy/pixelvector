import Image from "next/image";
import { Section } from "./section";

const EXAMPLES = [
  { name: "logo", label: "Logo (Logo preset)", note: "8 colors" },
  { name: "lineart", label: "Line art (Line art preset)", note: "Black & white" },
  { name: "illustration", label: "Illustration (Illustration preset)", note: "24 colors" },
  { name: "transparent", label: "Transparent PNG", note: "Transparency kept" },
];

/**
 * Both columns are real files in /public/samples. The SVGs were produced by running the
 * PNGs through this site's own conversion engine (see scripts/generate-samples.ts).
 */
export function Examples() {
  return (
    <Section id="examples" title="Before and after" intro="Raster originals on the left, SVG output from this converter on the right. Gradients show visible banding, which is normal for vectorization.">
      <ul className="grid gap-6 md:grid-cols-2">
        {EXAMPLES.map((ex) => (
          <li key={ex.name} className="rounded-xl border bg-card p-4">
            <div className="grid grid-cols-2 gap-3">
              <figure>
                <div className="checkerboard overflow-hidden rounded-lg border">
                  <Image src={`/samples/${ex.name}.png`} alt={`Original PNG sample: ${ex.label}`} width={480} height={360} loading="lazy" className="h-auto w-full" />
                </div>
                <figcaption className="mt-2 text-xs font-medium text-muted-foreground">Original PNG</figcaption>
              </figure>
              <figure>
                <div className="checkerboard overflow-hidden rounded-lg border">
                  {/* Plain img: SVG files are served as-is and next/image would not optimize them. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/samples/${ex.name}.svg`} alt={`SVG result for sample: ${ex.label}`} width={480} height={360} loading="lazy" className="h-auto w-full" />
                </div>
                <figcaption className="mt-2 text-xs font-medium text-muted-foreground">SVG result</figcaption>
              </figure>
            </div>
            <p className="mt-3 text-sm"><span className="font-medium">{ex.label}</span> <span className="text-muted-foreground">· {ex.note}</span></p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
