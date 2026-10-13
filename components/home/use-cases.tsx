import { Code2, Cpu, Globe, Palette, Printer, Scissors } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "./section";

const CASES = [
  { icon: Palette, title: "Logos and icons", text: "Rebuild a flat PNG logo as a vector you can resize and edit." },
  { icon: Scissors, title: "Cutting machines", text: "SVG is a format many cutting-machine apps can import. Traced files often need cleanup, and compatibility depends on your software." },
  { icon: Globe, title: "Web graphics", text: "Use sharp SVG graphics on websites that look right on high-density screens." },
  { icon: Cpu, title: "Illustrations", text: "Convert simple drawings into editable vector shapes." },
  { icon: Printer, title: "Print and design", text: "Open the SVG in a vector editor and prepare it for your print workflow." },
  { icon: Code2, title: "Developer assets", text: "Get plain-text vector files you can inline, style and version in code." },
];

export function UseCases() {
  return (
    <Section id="use-cases" title="What people use it for" muted>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Card className="h-full p-5">
              <Icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
