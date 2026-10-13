# PixelVector — Image to SVG Converter

A browser-based raster-to-vector converter built with Next.js (App Router), TypeScript (strict), Tailwind CSS 4 and [imagetracerjs](https://github.com/jankovicsandras/imagetracerjs). Images are decoded and traced **in the visitor's browser** inside a Web Worker. Nothing is uploaded; there is no database, auth or backend.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional, see Configuration
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest (engine, validation, sanitizer) |
| `npm run samples` | Regenerate the demo images in `public/samples` |

## Configuration

All optional, see `.env.example`. Brand and domain live in `lib/config/site.ts`.

- `NEXT_PUBLIC_SITE_URL` — production origin (canonical URLs, sitemap, Open Graph). **Set this before deploying**; it defaults to `http://localhost:3000`.
- `NEXT_PUBLIC_BRAND_NAME` — rename the product.
- `NEXT_PUBLIC_CONTACT_EMAIL` — shown on the contact page and footer; hidden when empty.

## Architecture

- `app/` — routes, metadata, `robots.ts`, `sitemap.ts`, icons and OG images. Landing, legal, blog and tool pages are Server Components.
- `components/converter/` — the only interactive client code: uploader, preview (side-by-side / compare, zoom, pan), settings, result actions, `use-converter` hook.
- `lib/vectorization/` — engine (`engine.ts`), Web Worker (`worker.ts`), worker client with cancellation (`client.ts`), image decoding (`decode.ts`), settings and presets. `imagetracerjs` is dynamically imported, so it is not in the initial bundle.
- `lib/validation/` — file validation by magic bytes (not extension), size/dimension limits, SVG sanitizer (DOMPurify).
- `lib/seo/`, `lib/content/` — metadata and JSON-LD helpers, FAQ, tool-page and blog content.

### Routes

`/` · `/png-to-svg` · `/jpg-to-svg` · `/webp-to-svg` · `/logo-to-svg` · `/blog` + 5 articles · `/privacy` · `/terms` · `/contact` · custom 404.

## Implemented features

- Drag and drop, file picker, clipboard paste, and a built-in sample image.
- Real vectorization: colour (quantized palette) and black-and-white (luminance threshold) modes.
- Settings wired to the algorithm: colours, detail, smoothing (blur), speckle filter, B/W threshold, scale, transparency handling, presets.
- Debounced live re-conversion, cancel, retry, and clear error states.
- Side-by-side and compare views, zoom and pan, checkerboard for transparency.
- Download SVG, PNG preview, copy or view SVG code.
- Output is sanitized before display and export; the original raster is never embedded.
- Object URLs are revoked and worker/canvas resources released on replace, reset and unmount.
- Light and dark themes, reduced-motion support, screen-reader status announcements.

## Verification performed

- `tsc --noEmit`, ESLint and `next build` pass; 31 Vitest tests pass.
- Playwright against the production build (Chromium): converted PNG samples (logo, line art, illustration, transparent) plus a JPG and a WebP, downloaded each PNG result as SVG and checked it contains paths, no `<image>`, no scripts; corrupt, `.txt`, GIF and SVG inputs are rejected; settings changes re-convert; theme toggle; mobile menu and conversion at 375px with no horizontal overflow; all routes return 200 and the unknown route 404s.
- Additional browser checks: 9000px-wide image rejected with a clear message; a 4000×3000 image converts in about 2 s, is traced at reduced resolution and keeps its original `viewBox`; clipboard paste converts; after repeated upload/reset cycles and setting changes only the current source and SVG object URLs remain alive (no leak); all downloaded SVGs parse as valid XML; JSON-LD parses on the home, tool and blog pages (WebApplication, BreadcrumbList, Article) with exactly one `h1`, Open Graph and Twitter tags; `robots.txt` and the 14-URL sitemap are served.
- The editor (preview, settings, result actions) is lazy-loaded after an image is chosen, so it is not part of the first page load.
- Lighthouse (home page, local production build): desktop 100 / 100 / 100 / 100 (performance / accessibility / best practices / SEO). Mobile accessibility, best practices and SEO were 100 in every run; mobile performance ranged 93–100 across four runs with LCP between 1.5 s and 2.9 s under simulated slow 4G (run-to-run noise is large, so confirm on the deployed URL), TBT 80–180 ms, CLS 0.

Not yet tested: real mobile devices, Safari and Firefox (only Chromium was available), and large-image behavior on low-end hardware.

## Known limitations

- Vectorization approximates the image. Photographs and gradients come out posterized and can produce large SVGs; the tool is best for logos, icons, line art and flat illustrations.
- Very large images are downscaled before tracing (the output is scaled back up to the original dimensions).
- No background-removal feature; transparent PNG regions can be preserved but are not detected in JPG.
- SVG, GIF, AVIF and animated images are not accepted as input.
- Single image at a time; no batch mode or accounts.

## Deploy on Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel choose **Add New → Project** and import it. The Next.js preset is detected automatically (build `npm run build`).
3. Add `NEXT_PUBLIC_SITE_URL` (your real origin, no trailing slash), and optionally the brand and contact variables.
4. Deploy, then attach your domain. Submit `/sitemap.xml` in Google Search Console and re-run Lighthouse on the live URL.

## Monetization roadmap

The conversion engine is isolated from the UI, so these can be added without rewriting it:

1. **Subtle, labelled ads** below the converter (never inside the upload area or near Download). Add consent management first, and update the Privacy Policy.
2. **Pro tier** (Stripe, with server-side checkout verification and signed webhooks): batch conversion, saved presets, higher size limits, SVGO-style optimization.
3. **Opt-in cloud history** for signed-in users only, with explicit consent and deletion controls.
4. **Developer API** (server-side tracing, API keys in server-only env vars, rate limits).

Basic single-image conversion and download should stay free and ungated.
