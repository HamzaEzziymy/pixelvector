import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionProps {
  id?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

export function Section({ id, title, intro, children, className, muted }: SectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined} className={cn("scroll-mt-16 py-16 sm:py-20", muted && "bg-muted/40", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id={id ? `${id}-heading` : undefined} className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
