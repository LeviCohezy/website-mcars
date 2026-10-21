"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowChip } from "./ui";
import { Parallax } from "./scroll";
import { asset } from "@/lib/asset";
import ClientMarquee from "./client-marquee";

export type Crumb = { label: string; href?: string };
export type Badge = { label: string; icon?: React.ReactNode };

/**
 * Interior hero. A rounded dark panel with photo/video, a large light headline
 * and an editorial meta bar (subtitle · facts · actions) separated by a
 * hairline. Deliberately restrained: no overlay wordmarks, no glass chips —
 * the photography and the type carry it. Followed by the "Onze klanten"
 * marquee on every interior page.
 *
 * `bigWord`, `card` and `scrollCue` are accepted for backwards compatibility
 * but no longer rendered.
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
  badges,
  primaryCta,
  secondaryCta,
  marquee = "plain",
  screen = false,
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
  bigWord?: string;
  badges?: Badge[];
  card?: { title: string; sub?: string; href: string };
  scrollCue?: boolean;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Client marquee under the hero: plain strip (default), a black card, or none. */
  marquee?: "plain" | "card" | false;
  /** Fill exactly one viewport (minus the 8px page frame). */
  screen?: boolean;
  children?: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const rise = (ms: number) => ({
    className: `transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
      shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
    }`,
    style: { transitionDelay: `${shown ? ms : 0}ms` },
  });

  const full = size === "full";
  const centered = align === "center";
  const hasMeta = subtitle || (badges && badges.length > 0) || primaryCta || secondaryCta;

  return (
    <>
    <section
      className={`relative flex flex-col overflow-hidden rounded-[2rem] bg-zinc-950 ${
        screen ? "min-h-[calc(100svh-1rem)]" : full ? "min-h-[88vh] sm:min-h-[92vh]" : "min-h-[62vh] sm:min-h-[68vh]"
      }`}
    >
      {/* Media */}
      <div className="absolute inset-0">
        <Parallax speed={0.1} className="absolute inset-0 h-[115%]">
          {video ? (
            <video className="slow-zoom size-full object-cover" src={asset(video)} autoPlay muted loop playsInline />
          ) : image ? (
            <div className="slow-zoom size-full bg-cover bg-center" style={{ backgroundImage: `url(${asset(image)})` }} />
          ) : (
            <div className="size-full bg-zinc-900" />
          )}
        </Parallax>
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-zinc-950/25" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-32 pb-6 sm:px-10 sm:pt-40 sm:pb-8 lg:px-14">
        <div className={`mt-auto ${centered ? "mx-auto text-center" : ""}`}>
          {(crumbs.length > 0 || eyebrow) && (
            <div
              {...rise(80)}
              className={`mb-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium tracking-[0.18em] text-white/55 uppercase ${
                rise(80).className
              } ${centered ? "justify-center" : ""}`}
            >
              {eyebrow && (
                <span className="flex items-center gap-2.5 text-white/85">
                  <span aria-hidden className="size-1.5 rounded-full bg-white" />
                  {eyebrow}
                </span>
              )}
              {crumbs.length > 0 && (
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 normal-case tracking-normal">
                  <Link href="/" className="transition-colors hover:text-white">Home</Link>
                  {crumbs.map((c) => (
                    <span key={c.label} className="flex items-center gap-2">
                      <span aria-hidden className="text-white/25">/</span>
                      {c.href ? (
                        <Link href={c.href} className="transition-colors hover:text-white">{c.label}</Link>
                      ) : (
                        <span className="text-white/80">{c.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}
            </div>
          )}

          <h1
            {...rise(180)}
            className={`max-w-5xl font-light tracking-[-0.035em] text-balance text-white ${
              full
                ? "text-[2.75rem] leading-[1] sm:text-6xl lg:text-[5.75rem]"
                : "text-[2.5rem] leading-[1.02] sm:text-6xl lg:text-[4.75rem]"
            } ${rise(180).className} ${centered ? "mx-auto" : ""}`}
          >
            {title}
          </h1>

          {children && <div {...rise(300)}>{children}</div>}
        </div>

        {hasMeta && (
          <div
            {...rise(320)}
            className={`mt-10 grid gap-6 border-t border-white/15 pt-6 sm:mt-14 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end lg:gap-10 ${rise(320).className}`}
          >
            <div>
              {subtitle && <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{subtitle}</p>}
            </div>
            <div>
              {badges && badges.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                  {badges.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {b.icon && <span className="text-white/90 [&_svg]:size-4">{b.icon}</span>}
                      {b.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
                  >
                    {primaryCta.label}
                    <ArrowChip tone="dark" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
    {marquee && <ClientMarquee variant={marquee} />}
    </>
  );
}
