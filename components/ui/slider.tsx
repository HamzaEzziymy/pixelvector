"use client";
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils/cn";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & { "aria-label": string };

/** The accessible name is applied to the focusable thumb, which is what screen readers announce. */
export function Slider({ className, "aria-label": ariaLabel, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-6 w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        className="block size-5 rounded-full border-2 border-primary bg-background shadow transition-transform hover:scale-110 disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  );
}
