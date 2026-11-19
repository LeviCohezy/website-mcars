import Image from "next/image";
import type { LocalKind, LocalPage } from "@/data/local";
import type { Shot } from "@/data/local-images";
import { Reveal } from "./scroll";

/*
 * Sections for the researched part of a service × place page: quick facts,
 * the long-form story with photos, and the "good to know here" cards.
 */

const KIND: Record<LocalKind, string> = { event: "Event", regel: "Regel", plek: "Plek", tip: "Tip" };

export function FactGrid({ facts }: { facts: LocalPage["facts"] }) {
  return (
    <dl className="grid border-t border-zinc-950 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((f, i) => (
        <Reveal key={f.label} delay={i * 60} className="border-b border-zinc-200 py-6 sm:pr-8 lg:border-b-0">
          <dt className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{f.label}</dt>
          <dd className="mt-3 text-lg leading-snug font-medium tracking-tight text-zinc-950">{f.value}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

function Prose({ s, index }: { s: LocalPage["sections"][number]; index: number }) {
  return (
    <>
      <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase tabular-nums">{String(index + 1).padStart(2, "0")}</p>
      <h2 className="mt-4 text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance text-zinc-950 sm:text-4xl">{s.heading}</h2>
      {s.body.map((p, i) => (
        <p key={i} className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-[1.05rem]">{p}</p>
      ))}
      {s.points && s.points.length > 0 && (
        <ul className="mt-6 border-t border-zinc-200">
          {s.points.map((p) => (
            <li key={p} className="flex gap-3 border-b border-zinc-200 py-3 text-[0.95rem] leading-relaxed text-zinc-700">
              <svg className="mt-1 size-4 flex-none text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              {p}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Long-form sections: photo beside text, alternating sides; text-only ones share a grey panel. */
export function LocalStory({ sections, shots }: { sections: LocalPage["sections"]; shots: Shot[] }) {
  const withPhoto = sections.slice(0, Math.min(shots.length, 3));
  const rest = sections.slice(withPhoto.length);
  return (
    <div className="space-y-16 sm:space-y-28">
      {withPhoto.map((s, i) => (
        <article key={s.heading} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-zinc-100 ${i % 2 ? "lg:order-2" : ""}`}>
            <Image src={shots[i].src} alt={shots[i].alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={80}>
            <Prose s={s} index={i} />
          </Reveal>
        </article>
      ))}
      {rest.length > 0 && (
        <div className={`grid gap-4 ${rest.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {rest.map((s, i) => (
            <Reveal key={s.heading} delay={i * 80} className="rounded-[2rem] bg-zinc-100 p-7 sm:p-10">
              <Prose s={s} index={withPhoto.length + i} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/** "Goed om te weten": events, rules, places and tips for this place, on a photo. */
export function LocalCards({ items, title, trail, image }: { items: LocalPage["local"]; title: string; trail: string; image: Shot }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-zinc-950">
      <Image src={image.src} alt="" fill sizes="100vw" className="object-cover opacity-35" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950/90" />
      <div className="relative z-10 px-5 pt-12 pb-5 sm:px-10 sm:pt-16 sm:pb-8 lg:px-14">
        <Reveal>
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-white" />
            Goed om te weten
          </p>
          <h2 className="mt-6 max-w-3xl text-4xl leading-[1.04] font-light tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
            {title} <span className="text-white/50">{trail}</span>
          </h2>
        </Reveal>
        <div className={`mt-14 grid gap-3 sm:mt-24 sm:grid-cols-2 ${items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {items.map((l, i) => (
            <Reveal key={l.title} delay={i * 80} className="flex flex-col rounded-[1.5rem] bg-white/95 p-6 backdrop-blur-xl sm:p-7">
              <p className="self-start rounded-full border border-zinc-300 px-3 py-1 text-[0.65rem] font-medium tracking-[0.16em] text-zinc-500 uppercase">{KIND[l.kind]}</p>
              <h3 className="mt-8 text-xl font-medium tracking-tight text-zinc-950">{l.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-600">{l.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Collapsed list of the sources behind the page, plus the "rules change" note. */
export function Sources({ urls }: { urls: string[] }) {
  const hosts = urls.map((u) => { try { return { u, host: new URL(u).hostname.replace(/^www\./, "") }; } catch { return null; } }).filter((x): x is { u: string; host: string } => Boolean(x));
  return (
    <div className="border-t border-zinc-200 pt-6 text-sm leading-relaxed text-zinc-500">
      <p className="max-w-2xl">Regels, data van evenementen en verkeersmaatregelen kunnen wijzigen. Kijk ze na bij de bevoegde instantie of de organisator voor u iets vastlegt.</p>
      {hosts.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-zinc-700 underline-offset-4 hover:underline">Bronnen ({hosts.length})</summary>
          <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {hosts.map((h) => (
              <li key={h.u} className="truncate"><a href={h.u} rel="nofollow noopener" target="_blank" className="hover:text-zinc-950">{h.host}</a></li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
