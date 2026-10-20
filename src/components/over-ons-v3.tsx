import Image from "next/image";
import Link from "next/link";
import {
  aboutArea,
  aboutHeroImage,
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
import { Reveal } from "./scroll";
import { ImageAccordion, StickyStory } from "./signature";
import { V3Arrow, V3Block, V3Button, V3Head, V3Hero, V3Page, V3Star } from "./v3-kit";

/*
 * Over ons 03 — "Donker & premium". A dark editorial: centred cinematic hero,
 * a long-form statement with oversized figures, a full-bleed team/fleet photo
 * band, the fleet as a ledger of huge counts, countries set as big type, and
 * the reasons as a numbered index. Same content as /over-ons.
 */

/** Photos for the insurance panels and the reasons (AI placeholders, see docs/CONTENT-NEEDS.md). */
const INSURED_PHOTOS = [
  { image: "/images/generated/strap-closeup.jpg", alt: "Een wiel wordt vastgezet met een spanband" },
  { image: "/images/generated/pickup-inspection.jpg", alt: "Een chauffeur inspecteert een wagen bij ophaling" },
  { image: "/images/generated/customer-update.jpg", alt: "Een klant bekijkt foto's van haar transport" },
];
const WHY_PHOTOS = [
  { image: "/images/generated/key-handover.jpg", alt: "Sleuteloverdracht bij levering" },
  { image: "/fleet/hero-highway-sunset.jpg", alt: "Een Mcars-transporter op de snelweg" },
  { image: "/images/generated/planning-office.jpg", alt: "De planning van Mcars op kantoor" },
  { image: "/images/generated/night-motorway.jpg", alt: "Een Mcars-transporter 's nachts onderweg" },
];

export default function OverOnsV3() {
  return (
    <V3Page>
      <V3Hero image={aboutHeroImage} crumbs={[{ href: "/", label: "Home" }, { label: "Over ons" }]} title={aboutIntro.title} intro={aboutIntro.subtitle}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="/offerte">Offerte aanvragen</V3Button>
          <V3Button href="#vloot" variant="ghost">Team & vloot</V3Button>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
          {aboutIntro.badges.map((b) => (
            <span key={b} className="flex items-center gap-2"><span aria-hidden className="size-1 rounded-full bg-white/60" />{b}</span>
          ))}
          <Link href="/reviews" className="flex items-center gap-2 hover:text-white">
            <V3Star /> <span className="font-medium text-white">{site.reviews.score}/5</span> op Google
          </Link>
        </div>
      </V3Hero>

      {/* 1 · Wie zijn we — editorial statement + body columns */}
      <V3Block>
        <Reveal>
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            <span aria-hidden className="h-px w-6 bg-white/40" />
            {aboutStory.label}
          </p>
          <h2 className="mt-8 max-w-6xl text-[2.25rem] leading-[1.08] font-light tracking-[-0.035em] text-balance sm:text-6xl lg:text-[5rem]">
            {aboutStory.lead} <span className="text-white/35">{aboutStory.trail}</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[1fr_1fr_1fr] lg:gap-14">
          <span aria-hidden className="hidden lg:block" />
          {aboutStory.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className={`text-base leading-relaxed text-white/65 sm:text-lg ${i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-light first-letter:text-white" : ""}`}>
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Big figures */}
        <dl className="mt-20 grid grid-cols-2 border-t border-white/10 lg:mt-28 lg:grid-cols-4">
          {aboutStats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className={`flex flex-col-reverse py-8 lg:py-10 ${i % 2 === 1 ? "border-l border-white/10 pl-5 sm:pl-8" : "pr-5"} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <dt className="mt-3 text-sm text-white/50">{s.label}</dt>
              <dd className="text-6xl font-light tracking-[-0.05em] tabular-nums sm:text-8xl lg:text-[7.5rem] lg:leading-none">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </V3Block>

      {/* 2 · Team & fleet photo band — full bleed, team slot leads */}
      <section aria-label="Team en vloot in beeld" className="grid gap-2 px-2 sm:grid-cols-2 lg:h-[78svh] lg:grid-cols-[2fr_1fr] lg:grid-rows-2">
        <Reveal className="relative min-h-[60svh] overflow-hidden rounded-xl sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-0">
          <Image src={aboutPhotos.team.src} alt={aboutPhotos.team.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
            <p className="text-2xl font-light tracking-tight sm:text-4xl">
              {aboutStats[2].value} vaste chauffeurs. <span className="text-white/50">{aboutTeam.languages.join(" & ")}.</span>
            </p>
            <span className="rounded-full border border-white/25 px-4 py-2 text-xs tracking-[0.18em] text-white/70 uppercase backdrop-blur">Team Mcars</span>
          </div>
        </Reveal>
        <Reveal delay={100} className="relative min-h-64 overflow-hidden rounded-xl lg:min-h-0">
          <Image src={aboutPhotos.fleet.src} alt={aboutPhotos.fleet.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
        </Reveal>
        <Reveal delay={180} className="relative min-h-64 overflow-hidden rounded-xl lg:min-h-0">
          <Image src={aboutPhotos.workshop.src} alt={aboutPhotos.workshop.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
        </Reveal>
      </section>

      {/* 3 · Vloot — ledger with huge counts */}
      <V3Block id="vloot" className="scroll-mt-24">
        <V3Head label={aboutTeam.label} lead={aboutTeam.lead} trail={aboutTeam.trail} intro={aboutTeam.intro} />
        <ul className="border-t border-white/10">
          {fleet.map((f, i) => (
            <Reveal as="li" key={f.name} delay={i * 80} className="grid grid-cols-[1fr_auto] items-end gap-4 border-b border-white/10 py-6 sm:grid-cols-[3rem_1fr_1fr_auto] sm:items-center sm:py-8">
              <span className="hidden text-sm text-white/35 tabular-nums sm:block">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-2xl font-light tracking-tight sm:text-4xl">{f.name}</p>
                <p className="mt-1 text-sm text-white/45 sm:hidden">{f.note}</p>
              </div>
              <p className="hidden text-white/45 sm:block">{f.note}</p>
              <span className="text-6xl leading-none font-light tracking-[-0.05em] tabular-nums sm:text-8xl">{f.count}</span>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-white/45">
          <span>Totaal: {aboutStats[1].value} eigen autotransporters</span>
          <span>{aboutStats[2].value} vaste chauffeurs · {aboutTeam.languages.join(" & ")}</span>
        </p>
      </V3Block>

      {/* 4 · Werkgebied — countries as oversized type */}
      <V3Block className="bg-zinc-900">
        <V3Head label={aboutArea.label} lead={aboutArea.lead} trail={aboutArea.trail} intro={aboutArea.intro} />
        <ul className="grid border-t border-white/10 lg:grid-cols-2 lg:gap-x-14">
          {countries.map((c, i) => (
            <Reveal as="li" key={c.name} delay={(i % 2) * 80} className="border-b border-white/10">
              <Link href={c.href} className="group flex min-h-11 items-center gap-5 py-5 sm:py-6">
                <Image src={c.flag} alt="" width={120} height={80} className="h-7 w-auto flex-none opacity-80 sm:h-9" />
                <span className="flex-1 text-4xl font-light tracking-[-0.035em] transition-colors group-hover:text-white/60 sm:text-5xl lg:text-6xl">{c.name}</span>
                <V3Arrow className="size-5 flex-none text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/50">
          Ook actief in <span className="text-white/80">{extraCountries.join(", ")}</span>. {aboutArea.note}
        </p>
      </V3Block>

      {/* 5 · Verzekerd transport — three translucent cards */}
      <V3Block>
        <V3Head center label={aboutInsured.label} lead={aboutInsured.lead} trail={aboutInsured.trail} />
        <ImageAccordion
          items={aboutInsured.items.map((it, i) => ({ title: it.title, body: it.body, ...INSURED_PHOTOS[i % INSURED_PHOTOS.length] }))}
        />
      </V3Block>

      {/* 6 · Waarom Mcars — sticky photo that swaps per reason */}
      <V3Block className="pt-0 sm:pt-0">
        <V3Head label={aboutWhy.label} lead={aboutWhy.lead} trail={aboutWhy.trail} />
        <StickyStory
          tone="dark"
          side="right"
          steps={aboutWhy.items.map((h, i) => ({ title: h.title, body: h.body, meta: `Reden ${String(i + 1).padStart(2, "0")}`, ...WHY_PHOTOS[i % WHY_PHOTOS.length] }))}
        />
        <div className="mt-12">
          <V3Button href="/offerte">Offerte aanvragen</V3Button>
        </div>
      </V3Block>
    </V3Page>
  );
}
