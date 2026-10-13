"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

interface Props<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: ReadonlyArray<SegmentedOption<T>>;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Single-choice toggle group with radio semantics and arrow-key navigation (roving tabindex).
 * Used instead of Tabs where there are no associated panels.
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
  fullWidth,
  ...aria
}: Props<T>) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const move = (from: number, step: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const next = (from + step * i + options.length * i) % options.length;
      if (!options[next].disabled) {
        onValueChange(options[next].value);
        refs.current[next]?.focus();
        return;
      }
    }
  };

  return (
    <div
      role="radiogroup"
      className={cn("inline-flex h-10 items-center rounded-lg bg-muted p-1 text-muted-foreground", fullWidth && "w-full", className)}
      {...aria}
    >
      {options.map((opt, i) => {
        const checked = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={opt.disabled}
            tabIndex={checked ? 0 : -1}
            onClick={() => onValueChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(i, 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(i, -1);
              }
            }}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
              checked && "bg-card text-foreground shadow-sm",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
