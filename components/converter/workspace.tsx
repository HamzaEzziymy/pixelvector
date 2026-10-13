"use client";

import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Replace, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { VectorizeSettings } from "@/lib/vectorization/types";
import { formatBytes, formatDuration } from "@/lib/utils/format";
import { Preview } from "./preview";
import { ResultActions } from "./result-actions";
import { SettingsPanel } from "./settings-panel";
import type { ConverterState } from "./use-converter";

export interface WorkspaceProps {
  state: ConverterState;
  settings: VectorizeSettings;
  busy: boolean;
  onSettingsChange: (patch: Partial<VectorizeSettings>) => void;
  onSettingsReset: () => void;
  onFile: (file: File) => Promise<void>;
  onCancel: () => void;
  onRetry: () => void;
  onReset: () => void;
}

/** Everything shown after an image is chosen. Loaded lazily so the first paint ships less JavaScript. */
export function Workspace({ state, settings, busy, onSettingsChange, onSettingsReset, onFile, onCancel, onRetry, onReset }: WorkspaceProps) {
  return (
    <TooltipProvider delayDuration={150}>
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_20rem]">
              <div className="min-w-0 space-y-5 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{state.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {state.originalSize && `${state.originalSize.width}×${state.originalSize.height}px · `}
                      {formatBytes(state.fileBytes)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium hover:bg-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
                      <Replace className="size-4" aria-hidden /> Replace image
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void onFile(f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <Button variant="outline" size="sm" onClick={onReset}><X aria-hidden />Start over</Button>
                  </div>
                </div>

                {state.downscaled && (
                  <p className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
                    This is a large image, so it was traced at reduced resolution to keep your browser responsive. The SVG keeps the original dimensions.
                  </p>
                )}

                {state.phase === "error" && state.error && (
                  <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
                    <span className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />{state.error}</span>
                    <Button size="sm" variant="outline" onClick={onRetry}><RefreshCw aria-hidden />Try again</Button>
                  </div>
                )}

                {state.phase === "cancelled" && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/50 p-4 text-sm">
                    <span>Conversion cancelled.</span>
                    <Button size="sm" variant="outline" onClick={onRetry}><RefreshCw aria-hidden />Convert again</Button>
                  </div>
                )}

                {busy && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-accent/50 p-3 text-sm">
                    <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" aria-hidden />Converting… large or detailed images can take a few seconds.</span>
                    <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
                  </div>
                )}

                {state.sourceUrl && state.originalSize && (
                  <Preview
                    sourceUrl={state.sourceUrl}
                    svgUrl={state.svgUrl}
                    width={state.originalSize.width}
                    height={state.originalSize.height}
                    busy={busy}
                  />
                )}

                {state.svg && state.svgUrl && state.stats && state.phase !== "error" && (
                  <div className="space-y-3 border-t pt-5">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 font-medium text-success"><CheckCircle2 className="size-4" aria-hidden />Ready</span>
                      <span>{state.stats.pathCount} paths</span>
                      <span>{formatBytes(state.stats.svgBytes)}</span>
                      <span>{formatDuration(state.stats.durationMs)}</span>
                    </p>
                    <ResultActions svg={state.svg} svgUrl={state.svgUrl} fileName={state.fileName} width={state.stats.width} height={state.stats.height} />
                    <p className="text-xs text-muted-foreground">Vectorization approximates your image. Photos and gradients may look posterized.</p>
                  </div>
                )}
              </div>

              <aside aria-label="Conversion settings" className="border-t bg-muted/30 p-4 sm:p-6 lg:border-l lg:border-t-0">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Settings2 className="size-4" aria-hidden />Settings</h3>
                <SettingsPanel settings={settings} onChange={onSettingsChange} onReset={onSettingsReset} />
                <p className="mt-4 text-xs text-muted-foreground">Changes apply automatically.</p>
              </aside>
            </div>
          </Card>
    </TooltipProvider>
  );
}
