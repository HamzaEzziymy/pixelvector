import type { RasterInput, VectorizeResult, VectorizeSettings, WorkerRequest, WorkerResponse } from "./types";

export class ConversionCancelledError extends Error {
  constructor() {
    super("Conversion cancelled.");
    this.name = "ConversionCancelledError";
  }
}

interface Pending {
  resolve: (r: VectorizeResult) => void;
  reject: (e: Error) => void;
}

/**
 * Owns a single Web Worker. Cancelling terminates the worker (the only way to interrupt a
 * synchronous trace) and a fresh one is created lazily on the next request.
 */
export class VectorizerClient {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data;
      const entry = this.pending.get(msg.id);
      if (!entry) return;
      this.pending.delete(msg.id);
      if (msg.type === "result") entry.resolve(msg.result);
      else entry.reject(new Error(msg.message));
    };
    worker.onerror = (event) => {
      this.failAll(new Error(event.message || "The conversion worker crashed."));
      this.terminate();
    };
    this.worker = worker;
    return worker;
  }

  convert(input: RasterInput, settings: VectorizeSettings): { id: number; promise: Promise<VectorizeResult> } {
    const worker = this.ensureWorker();
    const id = this.nextId++;
    const promise = new Promise<VectorizeResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    const request: WorkerRequest = { type: "convert", id, input, settings };
    // Transfer the pixel buffer so it is not copied; the caller keeps its own copy via clone.
    worker.postMessage(request, [input.data.buffer]);
    return { id, promise };
  }

  cancel(id: number): void {
    const entry = this.pending.get(id);
    if (!entry) return;
    this.pending.delete(id);
    entry.reject(new ConversionCancelledError());
    // Terminate so heavy synchronous work actually stops; other pending jobs are failed too.
    this.failAll(new ConversionCancelledError());
    this.terminate();
  }

  private failAll(error: Error): void {
    for (const entry of this.pending.values()) entry.reject(error);
    this.pending.clear();
  }

  terminate(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  dispose(): void {
    this.failAll(new ConversionCancelledError());
    this.terminate();
  }
}
