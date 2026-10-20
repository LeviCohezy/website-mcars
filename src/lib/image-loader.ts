/**
 * next/image loader for the static GitHub Pages export. With `unoptimized`
 * images next/image emits the raw src and does NOT prepend the basePath, so
 * every photo 404'd under /website-mcars. There is no image optimiser on a
 * static host, so the loader just serves the original file from the sub-path.
 */
export default function exportImageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/")) return src; // remote / data URLs untouched
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // The width query keeps srcset entries unique; static hosts ignore it.
  return `${base}${src}?w=${width}`;
}
