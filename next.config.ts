import type { NextConfig } from "next";

// Static export is opt-in via `EXPORT=true` so the normal dev/build flow is
// unchanged. Used to publish the GitHub Pages preview at a repo sub-path.
const isExport = process.env.EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(isExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
