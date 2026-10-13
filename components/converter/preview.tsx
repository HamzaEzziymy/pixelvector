"use client";

import { useCallback, useRef, useState } from "react";
import { Columns2, Layers, Minus, Maximize, Plus } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils/cn";

type ViewMode = "side" | "compare";

interface Props {
  sourceUrl: string;
  svgUrl: string | null;
  width: number;
  height: number;
  busy: boolean;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 8;

export function Preview({ sourceUrl, svgUrl, width, height, busy }: Props) {
  const [mode, setMode] = useState<ViewMode>("side");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [split, setSplit] = useState(50);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const transform = { transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center" } as const;
  const aspect = { aspectRatio: `${width} / ${height}` };

  const viewportHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode === "compare" && (e.target as HTMLElement).closest("[data-split-handle]")) return;
      drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (!drag.current) return;
      setPan({ x: drag.current.px + e.clientX - drag.current.x, y: drag.current.py + e.clientY - drag.current.y });
    },
    onPointerUp: () => {
      drag.current = null;
    },
    onWheel: (e: React.WheelEvent<HTMLDivElement>) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom((z) => clampZoom(z * (e.deltaY < 0 ? 1.1 : 0.9)));
    },
  };

  const panel = (src: string | null, label: string, alt: string) => (
    <figure className="min-w-0">
      <figcaption className="mb-2 text-sm font-medium text-muted-foreground">{label}</figcaption>
      <div
        className="checkerboard relative max-h-[60vh] w-full cursor-grab touch-none overflow-hidden rounded-lg border active:cursor-grabbing"
        style={aspect}
        {...viewportHandlers}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob URLs cannot use next/image
          <img src={src} alt={alt} draggable={false} className="size-full select-none object-contain" style={transform} />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">Waiting for result…</div>
        )}
        {busy && src === svgUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60" aria-hidden>
            <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </figure>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SegmentedControl
          aria-label="Preview layout"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: "side", label: <><Columns2 className="size-4" aria-hidden />Side by side</> },
            { value: "compare", label: <><Layers className="size-4" aria-hidden />Compare</>, disabled: !svgUrl },
          ]}
        />
        <div className="flex items-center gap-1" role="group" aria-label="Zoom controls">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => clampZoom(z / 1.25))} className="rounded-md border p-2 hover:bg-muted"><Minus className="size-4" /></button>
          <span className="w-14 text-center text-sm tabular-nums" aria-live="off">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => clampZoom(z * 1.25))} className="rounded-md border p-2 hover:bg-muted"><Plus className="size-4" /></button>
          <button type="button" aria-label="Reset zoom and position" onClick={resetView} className="rounded-md border p-2 hover:bg-muted"><Maximize className="size-4" /></button>
        </div>
      </div>

      {mode === "side" || !svgUrl ? (
        <div className="grid gap-4 md:grid-cols-2">
          {panel(sourceUrl, "Original", "Original uploaded image")}
          {panel(svgUrl, "SVG result", "Vectorized SVG result")}
        </div>
      ) : (
        <div>
          <div
            className="checkerboard relative max-h-[70vh] w-full cursor-grab touch-none select-none overflow-hidden rounded-lg border"
            style={aspect}
            {...viewportHandlers}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- blob URL */}
            <img src={svgUrl} alt="Vectorized SVG result" draggable={false} className="absolute inset-0 size-full object-contain" style={transform} />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL */}
              <img src={sourceUrl} alt="Original uploaded image" draggable={false} className="absolute inset-0 size-full object-contain" style={transform} />
            </div>
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${split}%` }} />
          </div>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium">Comparison position</span>
            <input
              data-split-handle
              type="range"
              min={0}
              max={100}
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-valuetext={`${split}% original, ${100 - split}% SVG`}
              className={cn("w-full accent-[var(--primary)]")}
            />
            <span className="flex justify-between text-xs text-muted-foreground"><span>Original</span><span>SVG</span></span>
          </label>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Drag to pan. Hold Ctrl or ⌘ and scroll, or use the buttons, to zoom.</p>
    </div>
  );
}
