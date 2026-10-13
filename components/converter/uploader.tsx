"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { ACCEPT_ATTR, LIMITS } from "@/lib/validation/file";
import { cn } from "@/lib/utils/cn";

interface UploaderProps {
  onFile: (file: File) => void;
  onSample?: () => void;
  compact?: boolean;
  disabled?: boolean;
}

export function Uploader({ onFile, onSample, compact = false, disabled = false }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null | undefined) => {
      const file = files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  // Paste from clipboard (Ctrl/Cmd+V) anywhere on the page while the uploader is mounted.
  useEffect(() => {
    if (disabled) return;
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const item = Array.from(event.clipboardData?.items ?? []).find((i) => i.kind === "file" && i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) {
        event.preventDefault();
        onFile(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onFile, disabled]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors",
        compact ? "gap-2 p-5" : "gap-4 p-8 sm:p-12",
        dragging ? "border-primary bg-accent" : "border-input bg-card hover:border-primary/60",
      )}
    >
      <input
        ref={inputRef}
        id="pv-file-input"
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <ImageUp className="size-6" aria-hidden />
      </span>
      <div>
        <p className="text-base font-semibold">
          <label
            htmlFor="pv-file-input"
            className="cursor-pointer text-primary underline-offset-4 hover:underline has-[:focus-visible]:underline"
          >
            Choose an image
          </label>{" "}
          <span className="font-normal text-muted-foreground">or drag and drop it here</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          You can also paste an image from your clipboard. PNG, JPG, WebP up to {LIMITS.maxFileBytes / 1024 / 1024} MB.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          Select image
        </button>
        {onSample && (
          <button
            type="button"
            onClick={onSample}
            disabled={disabled}
            className="inline-flex h-11 items-center justify-center rounded-md border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            Try a sample
          </button>
        )}
      </div>
    </div>
  );
}
