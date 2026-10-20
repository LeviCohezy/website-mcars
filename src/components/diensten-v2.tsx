"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { defaultProcess, defaultVehicleTypes, services } from "@/data/services";
import { site } from "@/lib/site";
import { Reveal } from "./scroll";
import { V2Arrow, V2Block, V2Button, V2Check, V2Head, V2Hero } from "./v2-kit";

/*
 * Diensten 02 — "Licht & strak". White Swiss grid. The centrepiece is a
 * HIMON-style numbered index: large light-weight rows, the active row turns
 * black and a photo + blurb for that service shows on the right (desktop).
 * On touch/mobile each row carries its own subtitle, so nothing is hover-only.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export default function DienstenV2() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <div className="bg-white text-zinc-950">
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Diensten" }]}
        title="Voor elk voertuig de juiste aanpak."
        count={pad(services.length)}
        intro="Van één particuliere wagen tot een volledig wagenpark — transportoplossingen in België en heel Europa. U spreekt met de mensen die de rit ook effectief uitvoeren."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <V2Button href="/offerte">Offerte aanvragen</V2Button>
          <V2Button href="#overzicht" variant="outline">Alle diensten</V2Button>
        </div>
      </V2Hero>

      {/* 01 · Numbered services index */}
      <V2Block id="overzicht">
        <V2Head
          index="01"
          label="Overzicht"
          lead={`${services.length} diensten,`}
          trail="één team dat het regelt."
          intro="Of het nu gaat om een gezinswagen, een voorraad voor de showroom of een klassieker die niet meer rijdt."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          <ol className="border-t border-zinc-950">
            {services.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.slug} className="border-b border-zinc-200">
                  <Link
                    href={`/diensten/${s.slug}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`group grid min-h-11 grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-3 py-5 transition-colors duration-300 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-6 sm:px-5 sm:py-6 ${
                      on ? "lg:bg-zinc-950 lg:text-white" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className={`self-start pt-1 text-sm font-medium tabular-nums sm:text-base ${on ? "text-zinc-950 lg:text-white/50" : "text-zinc-400"}`}>
                      ({pad(i + 1)})
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xl leading-tight font-light tracking-[-0.03em] break-words sm:text-4xl lg:text-[2.6rem]">{s.nav}</span>
                      <span className={`mt-1.5 block text-sm leading-relaxed ${on ? "text-zinc-500 lg:text-white/60" : "text-zinc-500"} lg:hidden`}>
                        {s.subtitle}
                      </span>
                      <span className={`mt-1 hidden text-xs font-medium tracking-[0.18em] uppercase lg:block ${on ? "text-white/50" : "text-zinc-400"}`}>
                        {s.category}
                      </span>
                    </span>
                    <span
                      className={`flex size-11 flex-none items-center justify-center rounded-lg border transition-colors ${
                        on ? "border-zinc-950 lg:border-white lg:bg-white lg:text-zinc-950" : "border-zinc-300 text-zinc-500 group-hover:border-zinc-950 group-hover:text-zinc-950"
                      }`}
                    >
                      <V2Arrow />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* Preview panel — desktop only; mobile rows show their own subtitle */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-100">
                {services.map((s, i) => (
                  <Image
                    key={s.slug}
                    src={s.heroImage}
                    alt={i === active ? `${s.nav} door Mcars` : ""}
                    fill
                    sizes="40vw"
                    className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <span className="absolute top-4 left-4 rounded-md bg-white px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-zinc-950 uppercase">
                  {current.category}
                </span>
              </div>
              <div className="mt-6 border-t border-zinc-950 pt-5">
                <p className="text-xl font-medium tracking-tight">{current.subtitle}</p>
                <p className="mt-3 line-clamp-4 text-[0.95rem] leading-relaxed text-zinc-500">{current.intro}</p>
                <Link href={`/diensten/${current.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
                  Meer over {current.nav.toLowerCase()} <V2Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </V2Block>

      {/* 02 · Vehicle types — bordered cells */}
      <V2Block className="pt-0 sm:pt-0">
        <V2Head index="02" label="Voertuigen" lead="Wat we vervoeren." trail="Rijdend of niet." />
        <ul className="grid grid-cols-1 border-t border-l border-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
          {defaultVehicleTypes.map((v, i) => (
            <Reveal as="li" key={v} delay={(i % 4) * 60} className="flex min-h-28 flex-col justify-between gap-6 border-r border-b border-zinc-200 p-5 sm:min-h-36 sm:p-6">
              <span className="text-xs font-medium tabular-nums text-zinc-400">{pad(i + 1)}</span>
              <span className="flex items-start gap-3 text-lg leading-snug font-medium tracking-tight">
                <V2Check className="mt-1" />
                {v}
              </span>
            </Reveal>
          ))}
        </ul>
      </V2Block>

      {/* 03 · Process — one working method for every service */}
      <V2Block className="pt-0 sm:pt-0">
        <V2Head
          index="03"
          label="Werkwijze"
          lead="Eén werkwijze,"
          trail="voor elke dienst."
          intro={`Al ${site.reviews.clients} klanten gingen u voor. Zo verloopt elk transport.`}
        />
        <ol className="grid border-t border-zinc-950 sm:grid-cols-2 lg:grid-cols-4">
          {defaultProcess.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 80}
              className={`border-b border-zinc-200 py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 ${i > 0 ? "lg:border-l" : ""} ${i % 2 === 1 ? "sm:border-l" : ""}`}
            >
              <span className="text-5xl font-light tracking-[-0.04em] tabular-nums">{pad(i + 1)}</span>
              <h3 className="mt-6 text-lg font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </V2Block>
    </div>
  );
}
