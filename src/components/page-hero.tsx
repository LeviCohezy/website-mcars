"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowChip } from "./ui";
import { Parallax, ScrollCue } from "./scroll";

export type Crumb = { label: string; href?: string };
export type Badge = { label: string; icon?: React.ReactNode };

/**
 * Cinematic interior hero. Full-bleed rounded slate panel with a video/parallax
 * background, an oversized translucent wordmark that overlaps the subject
 * (CarLux style), glass badges, an optional info card and a scroll cue.
 * Entrance is choreographed on mount. Backwards compatible with the simple
 * `{eyebrow,title,subtitle,image,crumbs,ctas}` usage on content pages.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  crumbs = [],
  image,
  video,
  align = "left",
  size = "compact",
  bigWord,
  badges,
  card,
  scrollCue = false,
  primaryCta,
  secondaryCta,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  image?: string;
  video?: string;
  align?: "left" | "center";
  size?: "compact" | "full";
  /** Oversized translucent word painted across the top, overlapping the media. */
  bigWord?: string;
  badges?: Badge[];
  card?: { title: string; sub?: string; href: string };
  scrollCue?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  children?: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const rise = (d: number) =>
    `transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
      shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;
  const delay = (ms: number) => ({ transitionDelay: `${shown ? ms : 0}ms` });

  const minH = size === "full" ? "min-h-[92vh]" : "min-h-[64vh]";

  return (
    <section className={`relative flex ${minH} flex-col overflow-hidden rounded-[2rem] bg-zinc-950`}>
      {/* Media */}
      <div className="absolute inset-0">
        <Parallax speed={0.12} className="absolute inset-0 h-[118%]">
          {video ? (
            <video className="slow-zoom size-full object-cover" src={video} autoPlay muted loop playsInline />
          ) : image ? (
            <div className="slow-zoom size-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          ) : (
            <div className="size-full" style={{ backgroundImage: "linear-gradient(135deg,#0c1c33,#14365c 45%,#2d6aa3 80%,#7fb3d9)" }} />
          )}
        </Parallax>
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/92 via-zinc-950/45 to-zinc-950/60" />
      <div aria-hidden className="dot-grid absolute inset-0 opacity-[0.12] mix-blend-screen" />

      {/* Oversized overlapping wordmark */}
      {bigWord && (
        <Parallax speed={-0.06} className="pointer-events-none absolute inset-x-0 top-[14%] z-0 flex justify-center px-4">
          <span className={`hero-wordmark block truncate uppercase ${rise(150)}`}>{bigWord}</span>
        </Parallax>
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex flex-1 flex-col justify-end px-6 pt-32 pb-9 sm:px-10 sm:pt-36 sm:pb-11 ${
          align === "center" ? "items-center text-center" : ""
        }`}
      >
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={`mb-5 flex flex-wrap items-center gap-2 text-xs text-white/60 ${rise(120)} ${align === "center" ? "justify-center" : ""}`}>
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span className="text-white/30">/</span>
                {c.href ? <Link href={c.href} className="transition-colors hover:text-white">{c.label}</Link> : <span className="text-white/90">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span className={`mb-5 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest text-white/90 uppercase backdrop-blur-xl ${rise(200)}`} style={delay(200)}>
            {eyebrow}
          </span>
        )}

        <h1 className={`max-w-4xl text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[4.25rem] ${rise(280)} ${align === "center" ? "mx-auto" : ""}`} style={delay(280)}>
          {title}
        </h1>

        {subtitle && (
          <p className={`mt-5 max-w-2xl text-lg leading-relaxed text-white/75 ${rise(360)} ${align === "center" ? "mx-auto" : ""}`} style={delay(360)}>
            {subtitle}
          </p>
        )}

        {badges && badges.length > 0 && (
          <div className={`mt-6 flex flex-wrap gap-2.5 ${rise(420)} ${align === "center" ? "justify-center" : ""}`} style={delay(420)}>
            {badges.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl">
                {b.icon}
                {b.label}
              </span>
            ))}
          </div>
        )}

        {(primaryCta || secondaryCta) && (
          <div className={`mt-8 flex flex-wrap gap-3 ${rise(480)} ${align === "center" ? "justify-center" : ""}`} style={delay(480)}>
            {primaryCta && (
              <Link href={primaryCta.href} className="group inline-flex items-center gap-3 rounded-full bg-white py-3 pr-3 pl-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                {primaryCta.label}
                <span className="flex size-8 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-3 pr-3 pl-7 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/20">
                {secondaryCta.label}
                <ArrowChip />
              </Link>
            )}
          </div>
        )}

        {children}
      </div>

      {/* Bottom-right glass info card (Eryon style) */}
      {card && (
        <Link
          href={card.href}
          className={`group absolute right-4 bottom-4 z-20 hidden max-w-xs rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl transition-colors hover:bg-white/15 sm:right-6 sm:bottom-6 lg:block ${rise(560)}`}
          style={delay(560)}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-white">{card.title}</p>
            <span className="flex size-8 flex-none items-center justify-center rounded-full bg-white text-zinc-950">
              <svg className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
            </span>
          </div>
          {card.sub && <p className="mt-2 text-xs leading-relaxed text-white/70">{card.sub}</p>}
        </Link>
      )}

      {/* Scroll cue */}
      {scrollCue && (
        <div className={`absolute bottom-6 left-1/2 z-20 -translate-x-1/2 ${rise(620)}`} style={delay(620)}>
          <ScrollCue />
        </div>
      )}
    </section>
  );
}
