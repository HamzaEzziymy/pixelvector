declare module "imagetracerjs" {
  const ImageTracer: {
    imagedataToTracedata(
      imgd: { width: number; height: number; data: Uint8ClampedArray },
      options?: Record<string, unknown>,
    ): { width: number; height: number; layers: Array<Array<{ isholepath: boolean }>> };
    getsvgstring(trace: unknown, options?: Record<string, unknown>): string;
  };
  export default ImageTracer;
}
