/**
 * Prefixes a public-asset path with the configured basePath.
 *
 * next/image and next/link already prepend the basePath automatically, but raw
 * <video src>, <img src> and CSS url() do not — so under a GitHub Pages
 * sub-path (e.g. /website-mcars) those absolute paths would 404. Wrap them in
 * asset() so they resolve both in dev (no basePath) and in the static export.
 */
export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
