"use client";

/**
 * Scroll-experience primitives shared across the experiential templates:
 * in-view reveals, parallax, count-up numbers, marquees and a scroll cue.
 * All respect prefers-reduced-motion.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Fade/slide an element in when it scrolls into view. */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className = "",
  once = true,
}: {
  children: ReactNode;
  as?: keyof HTMLElementTagNameMap;
  variant?: "up" | "scale" | "left" | "right";
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          if (once) io.disconnect();
        } else if (!once) {
          el.classList.remove("is-in");
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const variantClass =
    variant === "scale" ? "reveal-scale" : variant === "left" ? "reveal-left" : variant === "right" ? "reveal-right" : "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = Tag as any;
  return (
    <T ref={ref} className={`reveal ${variantClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </T>
  );
}

/** Translate a layer at a fraction of scroll speed (parallax). */
export function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, reduced]);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/** Count a number up from 0 → target when it scrolls into view. */
export function CountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  // Split leading number from any prefix/suffix (e.g. "3000+", "24u", "4,7").
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? match[1] + "0" + match[3] : value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, pre, num, post] = match;
    const decimals = num.includes(",") ? 1 : 0;
    const target = parseFloat(num.replace(",", "."));
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const dur = 1200;
      let start = 0;
      const step = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = target * eased;
        const shown = decimals ? cur.toFixed(1).replace(".", ",") : Math.round(cur).toString();
        setDisplay(pre + shown + post);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{display}</span>;
}

/** Infinite horizontal marquee of items (optionally reversed). */
export function Marquee({
  items,
  reverse = false,
  className = "",
  separator = "•",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  separator?: ReactNode;
}) {
  const row = (
    <div className={`flex shrink-0 items-center gap-8 pr-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-8">
          <span>{it}</span>
          <span aria-hidden className="opacity-40">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee flex overflow-hidden ${className}`}>
      {row}
      {row}
    </div>
  );
}

/** Bouncing "scroll" cue for hero sections. */
export function ScrollCue({ label = "Scroll", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-xs font-medium tracking-widest text-white/70 uppercase ${className}`}>
      <span>{label}</span>
      <span className="scroll-bob flex size-8 items-center justify-center rounded-full border border-white/25">
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}
