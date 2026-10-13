import { isStrictlySafeSvg } from "../lib/validation/svg";

/** Node-side guard for build scripts: refuse to write SVG that fails the strict allowlist. */
export function sanitizeSvgForScript(svg: string): string {
  if (!isStrictlySafeSvg(svg)) throw new Error("Generated sample SVG failed the safety allowlist.");
  return svg;
}
