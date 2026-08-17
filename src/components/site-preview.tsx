"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A live, scaled-down thumbnail of a real route — rendered in an <iframe> at
 * desktop width and shrunk to fit its container, so the preview always matches
 * the real page (no stale screenshots to maintain). The `?preview=1` flag tells
 * the intro loader and variant switcher to stay out of the frame.
 */
const DESIGN_W = 1440;
const DESIGN_H = 900; // 16:10 — matches the card aspect ratio

export default function SitePreview({ href, title }: { href: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
      {/* Placeholder tint until the frame is measured/loaded */}
      <div className="absolute inset-0 bg-zinc-100" />
      <iframe
        src={`${href}?preview=1`}
        title={title}
        aria-hidden
        tabIndex={-1}
        scrolling="no"
        loading="lazy"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          border: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
