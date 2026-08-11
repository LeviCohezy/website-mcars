"use client";

import Link from "next/link";
import { useState } from "react";
import type { Faq, Highlight, ProcessStep, Stat } from "@/data/services";
import Icon from "./icon";
import { CountUp, Marquee, Reveal } from "./scroll";

/** Grid of highlight cards — staggered reveal, one optional persistent accent card. */
export function HighlightGrid({ items, accent }: { items: Highlight[]; accent?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((h, i) => {
        const isAccent = accent === i;
        return (
          <Reveal key={h.title} delay={i * 90} variant="up">
            <div className={`group h-full rounded-3xl p-7 transition-colors duration-300 ${isAccent ? "bg-zinc-950" : "bg-zinc-100 hover:bg-zinc-950"}`}>
              <span className={`flex size-11 items-center justify-center rounded-2xl shadow-sm ${isAccent ? "bg-white text-zinc-950" : "bg-white text-zinc-950"}`}>
                <Icon name={h.icon} />
              </span>
              <h3 className={`mt-5 text-lg font-semibold transition-colors ${isAccent ? "text-white" : "text-zinc-950 group-hover:text-white"}`}>{h.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed transition-colors ${isAccent ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-300"}`}>{h.body}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Checklist of short benefit lines. */
export function BenefitsList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((b, i) => (
        <Reveal as="li" key={b} delay={i * 60} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-zinc-100">
          <span className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-full bg-zinc-950 text-white">
            <Icon name="check" className="size-3.5" />
          </span>
          <span className="text-sm text-zinc-700">{b}</span>
        </Reveal>
      ))}
    </ul>
  );
}

/** Big animated stat numbers that count up in view. */
export function StatRow({ items, dark = false }: { items: Stat[]; dark?: boolean }) {
  return (
    <dl className={`grid grid-cols-3 rounded-3xl p-2 ${dark ? "divide-white/10 bg-white/5" : "divide-zinc-200 bg-zinc-100"} divide-x`}>
      {items.map((s) => (
        <div key={s.label} className="px-4 py-5 text-center">
          <dt className={`font-[family-name:var(--font-display)] text-3xl leading-none tracking-wide sm:text-4xl ${dark ? "text-white" : "text-zinc-950"}`}>
            <CountUp value={s.value} />
          </dt>
          <dd className={`mt-2 text-xs sm:text-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Accordion FAQ list — one open at a time. */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={i * 60}>
            <div className={`rounded-2xl transition-colors ${isOpen ? "bg-zinc-950" : "bg-zinc-100"}`}>
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-6 py-5 text-left">
                <span className={`flex-1 text-base font-semibold sm:text-lg ${isOpen ? "text-white" : "text-zinc-950"}`}>{f.q}</span>
                <svg className={`size-5 flex-none transition-transform duration-300 ${isOpen ? "rotate-45 text-white" : "text-zinc-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden"><p className="px-6 pb-6 text-sm leading-relaxed text-zinc-300 sm:text-base">{f.a}</p></div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/**
 * Giant word filled with a photo/video (background-clip:text). A signature
 * "wow" moment — e.g. the country or service name painted with a truck photo.
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

/** Numbered process laid out with a dashed connector (Emons / LogiCraft style). */
export function ProcessTimeline({ steps, dark = false }: { steps: ProcessStep[]; dark?: boolean }) {
  return (
    <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.slice(0, 4).map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 120} className="relative">
          {i < 3 && (
            <span aria-hidden className={`dash-line absolute top-6 left-14 hidden h-0.5 w-[calc(100%-2rem)] lg:block ${dark ? "text-white/25" : "text-zinc-300"}`} />
          )}
          <span className={`flex size-12 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-2xl ${dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={`mt-5 text-lg font-semibold ${dark ? "text-white" : "text-zinc-950"}`}>{s.title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Diagonal marquee tape of words. */
export function RibbonBand({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={`relative overflow-hidden py-6 ${className}`}>
      <div className="ribbon bg-zinc-950 py-4 text-white">
        <Marquee items={items} className="font-[family-name:var(--font-display)] text-2xl tracking-wide uppercase sm:text-3xl" separator="✦" />
      </div>
    </div>
  );
}

/** Reusable dark conversion band pointing at the quote form. */
export function QuoteCta({
  title = "Klaar om uw wagen te laten vervoeren?",
  body = "Vraag vrijblijvend uw offerte aan. U krijgt binnen 24 uur antwoord met prijs en planning — persoonlijk, geen calculator.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="px-5 pb-8 sm:px-8">
      <Reveal variant="scale">
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-14 sm:px-14 sm:py-20">
          <div aria-hidden className="dot-grid absolute inset-0 opacity-[0.12]" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/offerte" className="group inline-flex items-center gap-3 rounded-full bg-white py-3 pr-3 pl-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                Offerte aanvragen
                <span className="flex size-8 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 py-3 pr-7 pl-7 text-sm font-medium text-white transition-colors hover:bg-white/10">
                Of neem contact op
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
