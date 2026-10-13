/// <reference lib="webworker" />
import { vectorize } from "./engine";
import type { WorkerRequest, WorkerResponse } from "./types";

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const cancelled = new Set<number>();

ctx.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  if (msg.type === "cancel") {
    cancelled.add(msg.id);
    return;
  }
  try {
    const result = await vectorize(msg.input, msg.settings);
    if (cancelled.delete(msg.id)) return;
    const response: WorkerResponse = { type: "result", id: msg.id, result };
    ctx.postMessage(response);
  } catch (error) {
    if (cancelled.delete(msg.id)) return;
    const response: WorkerResponse = {
      type: "error",
      id: msg.id,
      message: error instanceof Error ? error.message : "Vectorization failed.",
    };
    ctx.postMessage(response);
  }
};
