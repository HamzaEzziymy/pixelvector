"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { VectorizeSettings } from "@/lib/vectorization/types";
import { Uploader } from "./uploader";
import { useConverter } from "./use-converter";

const Workspace = dynamic(() => import("./workspace").then((m) => m.Workspace), {
  loading: () => (
    <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" aria-hidden /> Loading editor…
    </p>
  ),
});

interface ConverterProps {
  id?: string;
  /** Settings applied on first render and on reset, e.g. the logo preset on /logo-to-svg. */
  initialSettings?: Partial<VectorizeSettings>;
}

export function Converter({ id = "converter", initialSettings }: ConverterProps) {
  const { state, settings, updateSettings, resetSettings, loadFile, cancel, retry, reset, statusMessage } = useConverter(initialSettings);
  const hasImage = state.sourceUrl !== null;
  const busy = state.phase === "reading" || state.phase === "converting";

  const loadSample = useCallback(async () => {
    try {
      const res = await fetch("/samples/logo.png");
      if (!res.ok) throw new Error("Sample not available");
      const blob = await res.blob();
      await loadFile(new File([blob], "sample-logo.png", { type: "image/png" }));
    } catch {
      // Falls back to the upload area; the hook surfaces file errors itself.
    }
  }, [loadFile]);

  return (
          <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
        <h2 id={`${id}-title`} className="sr-only">Image to SVG converter</h2>

        {/* Screen-reader status announcements */}
        <p className="sr-only" role="status" aria-live="polite">{statusMessage}</p>

        {!hasImage ? (
          <div className="space-y-3">
            <Uploader onFile={loadFile} onSample={loadSample} disabled={busy} />
            {state.phase === "reading" && (
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden /> Reading your image…
              </p>
            )}
            {state.phase === "error" && state.error && (
              <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                <p>{state.error}</p>
              </div>
            )}
          </div>
        ) : (
          <Workspace
            state={state}
            settings={settings}
            busy={busy}
            onSettingsChange={updateSettings}
            onSettingsReset={resetSettings}
            onFile={loadFile}
            onCancel={cancel}
            onRetry={retry}
            onReset={reset}
          />
        )}
      </section>
  );
}
