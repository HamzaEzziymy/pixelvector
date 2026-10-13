"use client";

import { useState } from "react";
import { Check, Code2, Copy, Download, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pngFilename, svgFilename, svgUrlToPng, triggerDownload } from "@/lib/utils/download";

interface Props {
  svg: string;
  svgUrl: string;
  fileName: string | null;
  width: number;
  height: number;
}

export function ResultActions({ svg, svgUrl, fileName, width, height }: Props) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [pngError, setPngError] = useState<string | null>(null);

  const downloadSvg = () => triggerDownload(new Blob([svg], { type: "image/svg+xml" }), svgFilename(fileName));

  const downloadPng = async () => {
    setPngError(null);
    try {
      triggerDownload(await svgUrlToPng(svgUrl, width, height), pngFilename(fileName));
    } catch {
      setPngError("Could not create the PNG preview in this browser.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShowCode(true);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={downloadSvg}><Download aria-hidden />Download SVG</Button>
        <Button size="lg" variant="outline" onClick={downloadPng}><FileImage aria-hidden />PNG preview</Button>
        <Button size="lg" variant="outline" onClick={copy}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? "Copied" : "Copy SVG code"}
        </Button>
        <Button size="lg" variant="ghost" onClick={() => setShowCode((s) => !s)} aria-expanded={showCode}>
          <Code2 aria-hidden />{showCode ? "Hide code" : "View code"}
        </Button>
      </div>
      {pngError && <p role="alert" className="text-sm text-destructive">{pngError}</p>}
      {showCode && (
        <div>
          <label htmlFor="svg-code" className="sr-only">Generated SVG markup (read only)</label>
          <textarea
            id="svg-code"
            readOnly
            value={svg.length > 200_000 ? `${svg.slice(0, 200_000)}\n<!-- Preview truncated. Use Download SVG for the full file. -->` : svg}
            className="h-48 w-full rounded-lg border bg-muted p-3 font-mono text-xs"
          />
        </div>
      )}
    </div>
  );
}
