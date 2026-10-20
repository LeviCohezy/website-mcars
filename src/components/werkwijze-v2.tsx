import Image from "next/image";
import Link from "next/link";
import { cmr, cmrIntro, stappen, werkwijze, werkwijzeFaq } from "@/data/process";
import { site } from "@/lib/site";
import Icon from "./icon";
import { BoxedFaq } from "./route-v2";
import { Reveal } from "./scroll";
import { V2Arrow, V2Block, V2Button, V2Check, V2Head, V2Hero } from "./v2-kit";

/*
 * Werkwijze 02 — "Licht & strak". White Swiss grid: light hero with a (06)
 * counter, a numbered six-row hairline timeline, the CMR block as bordered
 * cells and a boxed FAQ. Same content as Werkwijze 01 (data/process).
 */

export default function WerkwijzeV2() {
  return (
    <div className="bg-white text-zinc-950">
      {/* 1 · Hero */}
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Hoe werkt het" }]}
        title={werkwijze.title}
        intro={werkwijze.subtitle}
        count={String(stappen.length).padStart(2, "0")}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <V2Button href="/offerte">Offerte aanvragen</V2Button>
          {werkwijze.badges.map((b) => (
            <span key={b} className="inline-flex min-h-11 items-center gap-2.5 rounded-lg border border-zinc-200 px-4 text-sm text-zinc-700">
              <V2Check /> {b}
            </span>
          ))}
        </div>
      </V2Hero>

      {/* 2 · Photo strip */}
      <div className="px-5 sm:px-12 lg:px-16">
        <div className="relative h-64 overflow-hidden rounded-xl bg-zinc-950 sm:h-96 lg:h-[30rem]">
          <Image src={werkwijze.heroImage} alt="Een transporter van Mcars onderweg" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>

      {/* 3 · Six steps — numbered hairline timeline */}
      <V2Block>
        <V2Head index="01" label="Zo werkt het" lead="Zes heldere stappen." trail="Van offerte tot levering." />
        <ol className="border-b border-zinc-200">
          {stappen.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 50}
              className="relative grid grid-cols-[2.75rem_1fr] gap-x-4 border-t border-zinc-200 py-8 sm:grid-cols-[5rem_1fr] sm:gap-x-6 lg:grid-cols-[6rem_1.1fr_1.4fr_13rem] lg:gap-x-10 lg:py-10"
            >
              {/* Number + the timeline rail running down to the next step */}
              <div className="relative row-span-3 flex flex-col items-start lg:row-span-1">
                <span className="text-3xl font-light tracking-[-0.04em] text-zinc-950 tabular-nums sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                {i < stappen.length - 1 && <span aria-hidden className="mt-3 ml-3 w-px flex-1 bg-zinc-200 sm:ml-4" />}
              </div>
              <h3 className="text-xl font-medium tracking-tight text-balance sm:text-2xl lg:pt-1.5">{s.title}</h3>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-zinc-500 sm:text-base lg:mt-0 lg:pt-2">{s.body}</p>
              <p className="mt-5 lg:mt-0 lg:justify-self-end lg:pt-1.5">
                <span className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium tracking-[0.12em] text-zinc-700 uppercase">
                  <Icon name={s.icon} className="size-3.5 text-zinc-950" /> {s.status}
                </span>
              </p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-3 flex flex-col items-start justify-between gap-4 rounded-xl bg-zinc-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <p className="text-lg">Klaar voor stap 01? U krijgt binnen 24 uur een persoonlijk antwoord.</p>
          <Link href="/offerte" className="inline-flex min-h-11 flex-none items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Offerte aanvragen <V2Arrow />
          </Link>
        </Reveal>
      </V2Block>

      {/* 4 · CMR — photo cell beside three bordered rows */}
      <V2Block className="bg-zinc-100">
        <V2Head index="02" label="Waarom deze aanpak" lead="De CMR-vrachtbrief:" trail="uw zekerheid, zwart op wit." intro={cmrIntro} />
        <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="relative min-h-72 overflow-hidden rounded-xl bg-zinc-950">
            <Image src={werkwijze.bandImage} alt={werkwijze.bandImageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <span className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-1.5 text-xs font-medium tracking-[0.14em] uppercase">Opgemaakt bij elke ophaling</span>
          </Reveal>
          <ul className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {cmr.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 70} className={`grid grid-cols-[2.75rem_1fr] gap-4 p-6 sm:p-8 ${i > 0 ? "border-t border-zinc-200" : ""}`}>
                <span className="flex size-11 items-center justify-center rounded-md border border-zinc-200">
                  <Icon name={h.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight">{h.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{h.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </V2Block>

      {/* 5 · FAQ */}
      <V2Block>
        <V2Head index="03" label="FAQ" lead="Nog vragen?" trail="Dit horen we het vaakst." />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Reveal className="order-last lg:order-none">
            <p className="text-sm text-zinc-500">Staat uw vraag er niet bij?</p>
            <a href={site.phoneHref} className="mt-3 block text-2xl font-medium tracking-tight hover:underline">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="mt-1 block break-words text-zinc-600 hover:text-zinc-950">{site.email}</a>
            <p className="mt-4 text-sm text-zinc-400">{site.hours}</p>
          </Reveal>
          <BoxedFaq items={werkwijzeFaq} />
        </div>
      </V2Block>
    </div>
  );
}
