"use client";

import Link from "next/link";
import { useState } from "react";
import type { Faq, Highlight, ProcessStep, Stat } from "@/data/services";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { CountUp, Marquee, Parallax, Reveal } from "./scroll";
import { ArrowChip } from "./ui";

/**
 * Editorial feature grid: numbered columns separated by hairlines. No icon
 * tiles, no hover inversions — numbers, a title and a sentence.
 * `accent` is accepted for backwards compatibility and ignored.
 */
export function HighlightGrid({ items, accent }: { items: Highlight[]; accent?: number }) {
  void accent;
  const cols = items.length === 4 ? "lg:grid-cols-4" : items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <div className={`grid gap-x-10 gap-y-12 sm:grid-cols-2 ${cols}`}>
      {items.map((h, i) => (
        <Reveal key={h.title} delay={i * 80} className="border-t border-zinc-950 pt-6">
          <span className="text-xs font-medium tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-8 text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl">{h.title}</h3>
          <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-zinc-500">{h.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** Checklist of short benefit lines, ruled like a spec sheet. */
export function BenefitsList({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-zinc-200">
      {items.map((b, i) => (
        <Reveal as="li" key={b} delay={i * 50} className="flex items-baseline gap-5 border-b border-zinc-200 py-4">
          <span className="w-6 flex-none text-xs font-medium tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-base text-zinc-800">{b}</span>
        </Reveal>
      ))}
    </ul>
  );
}

const STAT_COLS: Record<number, string> = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };

/** Large figures separated by hairlines, counting up in view. */
export function StatRow({ items, dark = false }: { items: Stat[]; dark?: boolean }) {
  return (
    <dl className={`grid grid-cols-2 gap-y-10 ${STAT_COLS[Math.min(items.length, 4)] ?? "sm:grid-cols-3"}`}>
      {items.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col-reverse pr-6 ${i > 0 ? `sm:border-l sm:pl-8 ${dark ? "border-white/15" : "border-zinc-200"}` : ""}`}
        >
          <dt className={`mt-3 text-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{s.label}</dt>
          <dd className={`text-4xl font-medium tracking-[-0.03em] tabular-nums sm:text-5xl lg:text-6xl ${dark ? "text-white" : "text-zinc-950"}`}>
            <CountUp value={s.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Ruled accordion FAQ — one open at a time. */
export function FaqAccordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="border-t border-zinc-200">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-zinc-200">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-start gap-6 py-6 text-left"
            >
              <span className="w-6 flex-none pt-1.5 text-xs font-medium tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-lg font-medium tracking-tight text-zinc-950 sm:text-xl">{f.q}</span>
              <span
                className={`mt-0.5 flex size-8 flex-none items-center justify-center rounded-full border transition-colors duration-300 ${
                  isOpen ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-500 group-hover:border-zinc-950 group-hover:text-zinc-950"
                }`}
              >
                <svg className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pr-14 pb-7 pl-12 text-base leading-relaxed text-zinc-500">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Giant word filled with a photo (background-clip:text). Kept for the studio
 * gallery; interior pages no longer use it.
 */
export function MaskedHeading({
  text,
  image,
  video,
  className = "",
}: {
  text: string;
  image?: string;
  video?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {video && (
        <video className="pointer-events-none absolute inset-0 -z-10 size-full opacity-0" src={video} autoPlay muted loop playsInline />
      )}
      <span
        className="text-clip block font-[family-name:var(--font-display)] leading-[0.82] tracking-tight uppercase"
        style={{
          fontSize: "clamp(3rem, 15vw, 13rem)",
          backgroundImage: video ? undefined : `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/** Numbered process on a shared rail: each step fills its segment of the line. */
export function ProcessTimeline({ steps, dark = false }: { steps: ProcessStep[]; dark?: boolean }) {
  return (
    <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {steps.slice(0, 4).map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 120} className="relative">
          <div className={`relative h-px ${dark ? "bg-white/15" : "bg-zinc-200"}`}>
            <span className={`absolute inset-y-0 left-0 w-10 ${dark ? "bg-white" : "bg-zinc-950"}`} />
          </div>
          <p className={`mt-6 text-xs font-medium tracking-[0.18em] uppercase ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Stap {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className={`mt-3 text-xl font-medium tracking-tight ${dark ? "text-white" : "text-zinc-950"}`}>{s.title}</h3>
          <p className={`mt-3 text-[0.95rem] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Quiet horizontal ticker between hairlines. */
export function RibbonBand({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={`border-y border-zinc-200 py-5 ${className}`}>
      <Marquee items={items} className="text-sm font-medium tracking-[0.18em] text-zinc-500 uppercase" separator="—" />
    </div>
  );
}

/** Closing conversion panel: photograph, a direct line to a person, and the quote CTA. */
export function QuoteCta({
  title = "Klaar om uw wagen te laten vervoeren?",
  body = "Vraag vrijblijvend uw offerte aan. U krijgt binnen 24 uur antwoord met prijs en planning — persoonlijk, geen calculator.",
  image = "/fleet/hero-highway-sunset.jpg",
}: {
  title?: string;
  body?: string;
  image?: string;
}) {
  return (
    // Always the last block before the footer: the negative bottom margin
    // pulls the footer up over the panel's lower edge, so the CTA reads as
    // tucked behind it rather than floating above a gap.
    <section className="-mb-[6.5rem] pt-16 sm:pt-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950">
        <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
          <div className="size-full bg-cover bg-center opacity-45" style={{ backgroundImage: `url(${asset(image)})` }} />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-zinc-950/55" />

        <div className="relative z-10 grid gap-12 px-6 pt-16 pb-28 sm:px-10 sm:pt-24 sm:pb-36 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:px-14">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-white" />
              Offerte
            </p>
            <h2 className="mt-6 max-w-2xl text-4xl font-light leading-[1.04] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
              {title}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">{body}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/offerte"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                Offerte aanvragen
                <ArrowChip tone="dark" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60"
              >
                Contact opnemen
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:justify-self-end">
            <dl className="grid gap-6 border-t border-white/15 pt-6 text-sm lg:min-w-72">
              <div>
                <dt className="text-white/45">Rechtstreeks bellen</dt>
                <dd className="mt-1 text-xl font-medium tracking-tight text-white">
                  <a href={site.phoneHref} className="transition-colors hover:text-white/70">{site.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-white/45">Mailen</dt>
                <dd className="mt-1 text-xl font-medium tracking-tight text-white">
                  <a href={`mailto:${site.email}`} className="transition-colors hover:text-white/70">{site.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-white/45">Bereikbaar</dt>
                <dd className="mt-1 text-white/80">{site.hours}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Ruled index of links (related services/routes): label, meta, arrow. */
export function LinkList({ items }: { items: { href: string; label: string; meta?: string }[] }) {
  return (
    <ul className="grid border-t border-zinc-200 sm:grid-cols-2 sm:gap-x-10">
      {items.map((it, i) => (
        <Reveal as="li" key={it.href} delay={i * 50} className="border-b border-zinc-200">
          <Link href={it.href} className="group flex items-center gap-5 py-5">
            <span className="w-6 flex-none text-xs font-medium tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-lg font-medium tracking-tight text-zinc-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:translate-x-1">
              {it.label}
            </span>
            {it.meta && <span className="hidden text-sm text-zinc-400 sm:block">{it.meta}</span>}
            <span className="flex size-8 flex-none items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

/** Full-bleed cinematic media band with one line of copy. */
export function MediaBand({
  video,
  image,
  line,
  caption,
}: {
  video?: string;
  image?: string;
  line: string;
  caption?: string;
}) {
  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden rounded-[2rem] bg-zinc-950">
      <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
        {video ? (
          <video className="size-full object-cover opacity-75" src={asset(video)} autoPlay muted loop playsInline />
        ) : (
          <div className="size-full bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${asset(image ?? "")})` }} />
        )}
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
      <div className="relative z-10 grid w-full gap-6 px-6 pb-10 sm:px-10 sm:pb-14 lg:grid-cols-[3fr_1fr] lg:items-end lg:px-14">
        <Reveal>
          <p className="max-w-4xl text-3xl font-light leading-[1.08] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">{line}</p>
        </Reveal>
        {caption && (
          <Reveal delay={120} className="border-t border-white/20 pt-4 text-sm text-white/60 lg:justify-self-end">
            {caption}
          </Reveal>
        )}
      </div>
    </section>
  );
}
