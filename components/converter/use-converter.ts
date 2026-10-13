"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { validateFile } from "@/lib/validation/file";
import { sanitizeSvg } from "@/lib/validation/svg";
import { decodeImage, type DecodedImage } from "@/lib/vectorization/decode";
import { ConversionCancelledError, VectorizerClient } from "@/lib/vectorization/client";
import { DEFAULT_SETTINGS } from "@/lib/vectorization/settings";
import type { VectorizeSettings, VectorizeStats } from "@/lib/vectorization/types";

export type ConverterPhase = "idle" | "reading" | "converting" | "done" | "error" | "cancelled";

export interface ConverterState {
  phase: ConverterPhase;
  fileName: string | null;
  fileBytes: number;
  sourceUrl: string | null;
  originalSize: { width: number; height: number } | null;
  downscaled: boolean;
  svg: string | null;
  svgUrl: string | null;
  stats: VectorizeStats | null;
  error: string | null;
}

const INITIAL: ConverterState = {
  phase: "idle",
  fileName: null,
  fileBytes: 0,
  sourceUrl: null,
  originalSize: null,
  downscaled: false,
  svg: null,
  svgUrl: null,
  stats: null,
  error: null,
};

const DEBOUNCE_MS = 350;

export function useConverter(initialSettings?: Partial<VectorizeSettings>) {
  const [state, setState] = useState<ConverterState>(INITIAL);
  const [settings, setSettings] = useState<VectorizeSettings>({ ...DEFAULT_SETTINGS, ...initialSettings });

  const clientRef = useRef<VectorizerClient | null>(null);
  const decodedRef = useRef<DecodedImage | null>(null);
  const jobRef = useRef<{ id: number; token: number } | null>(null);
  const tokenRef = useRef(0);
  const urlsRef = useRef<{ source: string | null; svg: string | null }>({ source: null, svg: null });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const getClient = useCallback(() => {
    if (!clientRef.current) clientRef.current = new VectorizerClient();
    return clientRef.current;
  }, []);

  const revoke = useCallback((key: "source" | "svg") => {
    const url = urlsRef.current[key];
    if (url) URL.revokeObjectURL(url);
    urlsRef.current[key] = null;
  }, []);

  const runConversion = useCallback(
    async (current: VectorizeSettings) => {
      const decoded = decodedRef.current;
      if (!decoded) return;
      const token = ++tokenRef.current;

      // Supersede any in-flight job.
      if (jobRef.current) getClient().cancel(jobRef.current.id);
      setState((s) => ({ ...s, phase: "converting", error: null }));

      // The worker takes ownership of the buffer it receives, so hand it a copy.
      const input = {
        width: decoded.input.width,
        height: decoded.input.height,
        data: new Uint8ClampedArray(decoded.input.data),
      };
      const effective: VectorizeSettings = { ...current, scale: current.scale * decoded.compensation };
      const { id, promise } = getClient().convert(input, effective);
      jobRef.current = { id, token };

      try {
        const result = await promise;
        if (token !== tokenRef.current) return;
        const clean = await sanitizeSvg(result.svg);
        if (token !== tokenRef.current) return;
        revoke("svg");
        const url = URL.createObjectURL(new Blob([clean], { type: "image/svg+xml" }));
        urlsRef.current.svg = url;
        setState((s) => ({
          ...s,
          phase: "done",
          svg: clean,
          svgUrl: url,
          stats: { ...result.stats, svgBytes: new TextEncoder().encode(clean).length },
          error: null,
        }));
      } catch (error) {
        if (token !== tokenRef.current) return;
        if (error instanceof ConversionCancelledError) {
          setState((s) => ({ ...s, phase: "cancelled" }));
          return;
        }
        setState((s) => ({
          ...s,
          phase: "error",
          error: error instanceof Error ? error.message : "Conversion failed. Please try again.",
        }));
      } finally {
        if (jobRef.current?.token === token) jobRef.current = null;
      }
    },
    [getClient, revoke],
  );

  const loadFile = useCallback(
    async (file: File) => {
      tokenRef.current++;
      if (jobRef.current) getClient().cancel(jobRef.current.id);
      setState((s) => ({ ...s, phase: "reading", error: null }));

      const validation = await validateFile(file);
      if (!validation.ok) {
        setState((s) => ({ ...s, phase: "error", error: validation.message }));
        return;
      }
      try {
        const decoded = await decodeImage(file);
        decodedRef.current = decoded;
        revoke("source");
        revoke("svg");
        const sourceUrl = URL.createObjectURL(file);
        urlsRef.current.source = sourceUrl;
        setState({
          ...INITIAL,
          phase: "converting",
          fileName: file.name,
          fileBytes: file.size,
          sourceUrl,
          originalSize: { width: decoded.originalWidth, height: decoded.originalHeight },
          downscaled: decoded.compensation > 1,
        });
        await runConversion(settingsRef.current);
      } catch (error) {
        setState((s) => ({
          ...s,
          phase: "error",
          error: error instanceof Error ? error.message : "This image could not be read.",
        }));
      }
    },
    [getClient, revoke, runConversion],
  );

  const cancel = useCallback(() => {
    tokenRef.current++;
    if (jobRef.current) getClient().cancel(jobRef.current.id);
    jobRef.current = null;
    setState((s) => ({ ...s, phase: "cancelled" }));
  }, [getClient]);

  const retry = useCallback(() => {
    void runConversion(settingsRef.current);
  }, [runConversion]);

  const reset = useCallback(() => {
    tokenRef.current++;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (jobRef.current) getClient().cancel(jobRef.current.id);
    jobRef.current = null;
    decodedRef.current = null;
    revoke("source");
    revoke("svg");
    setState(INITIAL);
  }, [getClient, revoke]);

  const updateSettings = useCallback((patch: Partial<VectorizeSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => setSettings({ ...DEFAULT_SETTINGS, ...initialSettings }), [initialSettings]);

  // Re-run conversion (debounced) when settings change after an image is loaded.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!decodedRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void runConversion(settings), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [settings, runConversion]);

  // Release everything on unmount.
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      clientRef.current?.dispose();
      clientRef.current = null;
      if (urls.source) URL.revokeObjectURL(urls.source);
      if (urls.svg) URL.revokeObjectURL(urls.svg);
      decodedRef.current = null;
    };
  }, []);

  const statusMessage = useMemo(() => {
    switch (state.phase) {
      case "reading":
        return "Reading your image…";
      case "converting":
        return "Converting to SVG…";
      case "done":
        return state.stats
          ? `Conversion complete. ${state.stats.pathCount} paths, ${state.stats.width} by ${state.stats.height} pixels.`
          : "Conversion complete.";
      case "error":
        return state.error ?? "Something went wrong.";
      case "cancelled":
        return "Conversion cancelled.";
      default:
        return "";
    }
  }, [state.phase, state.stats, state.error]);

  return { state, settings, updateSettings, resetSettings, loadFile, cancel, retry, reset, statusMessage };
}
