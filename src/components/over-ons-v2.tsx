import Image from "next/image";
import Link from "next/link";
import {
  aboutArea,
  aboutInsured,
  aboutIntro,
  aboutPhotos,
  aboutStats,
  aboutStory,
  aboutTeam,
  aboutWhy,
  countries,
  extraCountries,
  fleet,
} from "@/data/about";
import { site } from "@/lib/site";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { V2Arrow, V2Block, V2Button, V2Head } from "./v2-kit";

/*
 * Over ons 02 — "Licht & strak". Codera-style hero (centred headline, the
 * isolated Mcars tractor unit and three small stat cards), then the story,
 * team & fleet, area, insurance and reasons as bordered Swiss-grid cells.
 * Same content as /over-ons via src/data/about.ts.
 */

const heroCards = [
  { icon: "truck" as const, stat: aboutStats[1] },
  { icon: "users" as const, stat: aboutStats[2] },
  { icon: "clock" as const, stat: aboutStats[3] },
];

function StatCard({ icon, value, label, className = "" }: { icon: "truck" | "users" | "clock"; value: string; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-[0_20px_40px_-24px_rgb(0_0_0/0.25)] sm:p-5 ${className}`}>
      <span className="flex size-11 flex-none items-center justify-center rounded-md bg-zinc-950 text-white">
        <Icon name={icon} className="size-5" />
      </span>
      <div>
        <p className="text-3xl leading-none font-medium tracking-[-0.03em] tabular-nums text-zinc-950">{value}</p>
        <p className="mt-1.5 text-sm text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

export default function OverOnsV2() {
  return (
    <div className="bg-white text-zinc-950">
      {/* 1 · Hero — centred headline, isolated truck, three stat cards */}
      <section className="px-5 pt-32 pb-12 sm:px-12 sm:pt-40 sm:pb-16 lg:px-16">
        <nav aria-label="Breadcrumb" className="flex justify-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-950">Home</Link>
          <span aria-hidden>/</span>
          <span className="text-zinc-950">Over ons</span>
        </nav>
        <div className="mx-auto mt-6 max-w-5xl text-center">
          <p className="inline-flex flex-wrap justify-center gap-x-2 rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700">
            {aboutIntro.badges.join(" · ")}
          </p>
          <h1 className="mt-6 text-[2.75rem] leading-[0.98] font-light tracking-[-0.045em] text-balance break-words sm:text-7xl lg:text-[5.5rem]">
            {aboutIntro.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">{aboutIntro.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <V2Button href="/offerte">Offerte aanvragen</V2Button>
            <V2Button href="#team" variant="outline">Ons team & vloot</V2Button>
          </div>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 px-5 py-10 sm:px-10 sm:py-14">
          {/* Swiss grid backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent" />

          <div className="relative grid items-center gap-4 lg:grid-cols-[1fr_minmax(0,40rem)_1fr] lg:gap-8">
            <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-none lg:h-full lg:grid-cols-1 lg:content-between">
              <Reveal variant="left"><StatCard icon={heroCards[0].icon} value={heroCards[0].stat.value} label={heroCards[0].stat.label} className="lg:max-w-64" /></Reveal>
              <Reveal variant="left" delay={120}><StatCard icon={heroCards[1].icon} value={heroCards[1].stat.value} label={heroCards[1].stat.label} className="lg:ml-auto lg:max-w-64" /></Reveal>
            </div>
            <Reveal variant="scale" className="order-1 mx-auto w-full max-w-2xl lg:order-none lg:max-w-none">
              {/* Studio shot on light grey: framed as a print so its background reads as intentional */}
              <Image
                src={aboutPhotos.studio.src}
                alt={aboutPhotos.studio.alt}
                width={1774}
                height={887}
                priority
                sizes="(min-width: 1024px) 40rem, 90vw"
                className="h-auto w-full rounded-md shadow-[0_30px_60px_-20px_rgb(0_0_0/0.35)] ring-1 ring-zinc-950/5"
              />
            </Reveal>
            <div className="order-3 lg:order-none">
              <Reveal variant="right" delay={200}>
                <StatCard icon={heroCards[2].icon} value={heroCards[2].stat.value} label={heroCards[2].stat.label} className="lg:max-w-64" />
              </Reveal>
              <p className="mt-4 hidden text-sm leading-relaxed text-zinc-500 lg:block lg:max-w-64">
                {site.legalName} · {site.address.city}. Actief sinds {site.founded}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Wie zijn we — story + ruled stat cells */}
      <V2Block>
        <V2Head index="01" label={aboutStory.label} lead={aboutStory.lead} trail={aboutStory.trail} />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <span aria-hidden className="hidden lg:block" />
          <div className="grid gap-8 text-base leading-relaxed text-zinc-600 sm:grid-cols-2 sm:gap-10">
            {aboutStory.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 lg:grid-cols-4">
          {aboutStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="flex min-h-40 flex-col justify-between bg-white p-5 sm:p-7">
              <dt className="text-sm text-zinc-500">{s.label}</dt>
              <dd className="mt-8 text-5xl font-light tracking-[-0.05em] tabular-nums sm:text-6xl">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </V2Block>

      {/* 3 · Team & voertuigen — team photo slot + fleet spec card */}
      <V2Block id="team" className="scroll-mt-24 bg-zinc-100">
        <V2Head index="02" label={aboutTeam.label} lead={aboutTeam.lead} trail={aboutTeam.trail} intro={aboutTeam.intro} />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="relative min-h-[26rem] overflow-hidden rounded-md bg-zinc-200 lg:min-h-[36rem]">
            <Image src={aboutPhotos.team.src} alt={aboutPhotos.team.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white px-3 py-2 text-sm font-medium">{aboutStats[2].value} vaste chauffeurs</span>
              {aboutTeam.languages.map((l) => (
                <span key={l} className="rounded-md bg-white/80 px-3 py-2 text-sm text-zinc-700 backdrop-blur">{l}</span>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4">
            <Reveal delay={100} className="overflow-hidden rounded-md border border-zinc-200 bg-white">
              <p className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase sm:px-7">
                Vloot <span className="text-zinc-950">{aboutStats[1].value} transporters</span>
              </p>
              <ul>
                {fleet.map((f) => (
                  <li key={f.name} className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-5 last:border-b-0 sm:px-7">
                    <div>
                      <p className="text-lg font-medium tracking-tight sm:text-xl">{f.name}</p>
                      <p className="mt-0.5 text-sm text-zinc-500">{f.note}</p>
                    </div>
                    <span className="text-4xl font-light tracking-[-0.04em] tabular-nums sm:text-5xl">{f.count}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160} className="relative min-h-56 overflow-hidden rounded-md bg-zinc-200">
              <Image src={aboutPhotos.workshop.src} alt={aboutPhotos.workshop.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </Reveal>
          </div>
        </div>
      </V2Block>

      {/* 4 · Werkgebied — bordered country cells linking to routes */}
      <V2Block>
        <V2Head index="03" label={aboutArea.label} lead={aboutArea.lead} trail={aboutArea.trail} intro={aboutArea.intro} />
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
          {countries.map((c, i) => (
            <Reveal as="li" key={c.name} delay={i * 50} className="bg-white">
              <Link href={c.href} className="group flex h-full min-h-36 flex-col justify-between gap-6 p-5 transition-colors hover:bg-zinc-950 hover:text-white">
                <Image src={c.flag} alt="" width={120} height={80} className="h-9 w-auto self-start" />
                <span className="flex items-center justify-between gap-2 text-lg font-medium tracking-tight">
                  {c.name}
                  <V2Arrow className="size-4 text-zinc-400 transition-colors group-hover:text-white" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-zinc-500">Ook actief in</span>
          {extraCountries.map((c) => (
            <span key={c} className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700">{c}</span>
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-500">{aboutArea.note}</p>
      </V2Block>

      {/* 5 · Verzekerd transport — the one black panel */}
      <section>
        <div className="rounded-xl bg-zinc-950 px-5 py-20 text-white sm:px-12 sm:py-28 lg:px-16">
          <V2Head index="04" label={aboutInsured.label} lead={aboutInsured.lead} trail={aboutInsured.trail} dark />
          <ol className="grid gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 sm:grid-cols-3">
            {aboutInsured.items.map((it, i) => (
              <Reveal as="li" key={it.title} delay={i * 80} className="flex min-h-64 flex-col bg-zinc-950 p-6 sm:p-8">
                <span className="flex items-center justify-between">
                  <Icon name={i === 0 ? "shield" : i === 1 ? "box" : "check"} className="size-5" />
                  <span className="text-5xl font-light tracking-[-0.05em] text-white/20 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="mt-auto pt-10 text-xl font-medium tracking-tight">{it.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/60">{it.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · Waarom kiezen voor ons — bordered row of cells */}
      <V2Block>
        <V2Head index="05" label={aboutWhy.label} lead={aboutWhy.lead} trail={aboutWhy.trail} />
        <div className="grid gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
          {aboutWhy.items.map((h, i) => (
            <Reveal key={h.title} delay={i * 80} className="flex min-h-72 flex-col bg-white p-6 sm:p-7">
              <span className="flex size-11 items-center justify-center rounded-sm border border-zinc-200">
                <Icon name={h.icon} className="size-5" />
              </span>
              <h3 className="mt-auto pt-12 text-xl font-medium tracking-tight">{h.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{h.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-px flex flex-col items-start justify-between gap-4 rounded-md bg-zinc-950 p-6 text-white sm:flex-row sm:items-center sm:p-10">
          <p className="text-lg">
            <span className="font-medium">{site.reviews.score}/5 op Google</span> <span className="text-white/60">— lees wat klanten zeggen.</span>
          </p>
          <Link href="/reviews" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Bekijk de reviews <V2Arrow />
          </Link>
        </Reveal>
      </V2Block>
    </div>
  );
}
