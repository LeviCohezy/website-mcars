import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Static export is opt-in via `EXPORT=true` so the normal dev/build flow is
// unchanged. Used to publish the GitHub Pages preview at a repo sub-path.
const isExport = process.env.EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Route files named `*.local.ts(x)` (the CMS at /cms and its API at /api/inbox) only exist on a
  // real server; the static export has no backend, so it leaves them out.
  pageExtensions: isExport ? ["tsx", "ts"] : ["tsx", "ts", "local.tsx", "local.ts"],
  // The export type-checks without the CMS files and the dev server's route types (see scripts/export-pages.mjs).
  ...(isExport ? { typescript: { tsconfigPath: "tsconfig.export.json" } } : {}),
  env: {
    // Forms post here; empty in the export, where they fall back to a pre-filled e-mail.
    NEXT_PUBLIC_INBOX_URL: process.env.NEXT_PUBLIC_INBOX_URL ?? (isExport ? "" : "/api/inbox"),
  },
  ...(isExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath,
        // next/image doesn't prefix the basePath for unoptimized images, so a tiny
        // loader does it (see src/lib/image-loader.ts).
        images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
        trailingSlash: true,
      }
    : {}),
};

export default withNextIntl(nextConfig);
