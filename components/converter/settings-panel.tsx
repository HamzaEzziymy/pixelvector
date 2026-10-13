"use client";

import { ChevronDown, Info, RotateCcw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PRESETS } from "@/lib/vectorization/settings";
import type { VectorizeSettings } from "@/lib/vectorization/types";

interface Props {
  settings: VectorizeSettings;
  onChange: (patch: Partial<VectorizeSettings>) => void;
  onReset: () => void;
}

function Help({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={`Help: ${text}`} className="rounded-full text-muted-foreground hover:text-foreground">
          <Info className="size-4" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}

interface SliderRowProps {
  id: string;
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

function SliderRow({ id, label, help, value, min, max, step = 1, display, disabled, onChange }: SliderRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Label id={`${id}-label`}>{label}</Label>
          <Help text={help} />
        </div>
        <span className="text-sm tabular-nums text-muted-foreground">{display ?? value}</span>
      </div>
      <Slider id={id} aria-label={label} value={[value]} min={min} max={max} step={step} disabled={disabled} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

export function SettingsPanel({ settings, onChange, onReset }: Props) {
  const isBw = settings.colorMode === "blackwhite";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Presets</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(preset.settings)}
                  className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {preset.label}
                </button>
              </TooltipTrigger>
              <TooltipContent>{preset.description}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label id="color-mode-label">Color mode</Label>
          <Help text="Color keeps a limited palette. Black & white converts to a single-color shape using a brightness threshold." />
        </div>
        <SegmentedControl
          fullWidth
          aria-labelledby="color-mode-label"
          value={settings.colorMode}
          onValueChange={(colorMode) => onChange({ colorMode })}
          options={[
            { value: "color", label: "Color" },
            { value: "blackwhite", label: "Black & white" },
          ]}
        />
      </div>

      {isBw ? (
        <SliderRow
          id="threshold"
          label="Threshold"
          help="Pixels darker than this brightness become black; lighter pixels become empty. Raise it to capture more detail."
          value={settings.threshold}
          min={0}
          max={255}
          onChange={(threshold) => onChange({ threshold })}
        />
      ) : (
        <SliderRow
          id="colors"
          label="Number of colors"
          help="Maximum palette size. Fewer colors give simpler, smaller files; more colors capture gradients better."
          value={settings.colors}
          min={2}
          max={64}
          onChange={(colors) => onChange({ colors })}
        />
      )}

      <Collapsible className="rounded-lg border bg-muted/40">
        <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm font-medium [&[data-state=open]>svg]:rotate-180">
          Advanced settings
          <ChevronDown className="size-4 transition-transform" aria-hidden />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-5 border-t px-4 py-4">
          <SliderRow
            id="detail"
            label="Detail level"
            help="Higher values follow the original edges more closely but create more paths."
            value={settings.detail}
            min={1}
            max={10}
            onChange={(detail) => onChange({ detail })}
          />
          <SliderRow
            id="smoothing"
            label="Smoothing"
            help="Blurs the image slightly before tracing to remove jagged edges and noise. 0 turns it off."
            value={settings.smoothing}
            min={0}
            max={5}
            display={settings.smoothing === 0 ? "Off" : String(settings.smoothing)}
            onChange={(smoothing) => onChange({ smoothing })}
          />
          <SliderRow
            id="speckle"
            label="Speckle filter"
            help="Removes tiny shapes shorter than this many edge points. Raise it to clean up noise; lower it to keep fine details."
            value={settings.speckle}
            min={0}
            max={100}
            display={settings.speckle === 0 ? "Off" : String(settings.speckle)}
            onChange={(speckle) => onChange({ speckle })}
          />
          <SliderRow
            id="scale"
            label="Output scale"
            help="Multiplies the SVG's width and height. The artwork stays sharp at any size; this only sets the default size."
            value={settings.scale}
            min={0.25}
            max={4}
            step={0.25}
            display={`${settings.scale}×`}
            onChange={(scale) => onChange({ scale })}
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="keep-transparency">Keep transparency</Label>
              <Help text="Transparent areas stay empty. Turn off to flatten them onto a white background." />
            </div>
            <Switch id="keep-transparency" checked={settings.keepTransparency} onCheckedChange={(keepTransparency) => onChange({ keepTransparency })} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <RotateCcw className="size-3.5" aria-hidden /> Reset settings
      </button>
    </div>
  );
}
