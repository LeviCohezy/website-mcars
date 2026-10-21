"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutArea, aboutHeroImage, aboutInsured, aboutIntro, aboutPhotos, aboutStats, aboutStory, aboutTeam, aboutWhy, countries, extraCountries, fleet } from "@/data/about";
import { site } from "@/lib/site";
import {
  Bento,
  Cell,
  Chapter,
  ChapterIntro,
  ClipImage,
  Figures,
  FlowButton,
  FlowClose,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  IndexRow,
  InlineImageLine,
  Rise,
  ScrollWords,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Over ons as one composed film. Same story in every version:
 *
 *   hero+form → 01 story (2004 → 2009 → today) → 02 team & vloot →
 *   [bridge] → 03 werkgebied → 04 verzekerd → 05 waarom → close
 *
 *   01 cinema    light → paper → (bridge) dark → light curtain → light → dark close
 *   02 wordmark  light → light → (bridge) paper → paper → light curtain → dark close
 *   03 lines     dark throughout, 04 is the paper interlude
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; story: FlowTone; team: FlowTone; area: FlowTone; insured: FlowTone; why: FlowTone }> = {
  1: { page: "light", story: "light", team: "paper", area: "dark", insured: "light", why: "light" },
  2: { page: "light", story: "light", team: "light", area: "paper", insured: "paper", why: "light" },
  3: { page: "dark", story: "dark", team: "dark", area: "dark", insured: "paper", why: "dark" },
};

/** One photo per "Waarom Mcars" reason (AI placeholders, see docs/CONTENT-NEEDS.md). */
const WHY_PHOTOS = ["/images/generated/customer-update.jpg", "/images/generated/strap-closeup.jpg", "/images/generated/planning-office.jpg", "/fleet/hero-highway-sunset.jpg"];

const STAT = (label: string) => aboutStats.find((s) => s.label === label)!;

export default function OverOnsFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const [firstPara, secondPara] = aboutStory.paragraphs;
  const totalTrucks = STAT("Eigen autotransporters").value;

  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      {aboutIntro.badges.map((b, i) => (
        <span key={b} className="flex items-center gap-5">
          {i > 0 && <span aria-hidden className="hidden sm:inline">·</span>}
          {b}
        </span>
      ))}
      <span aria-hidden className="hidden sm:inline">·</span>
      <span>
        <b className={onLight ? "font-medium text-zinc-950" : "font-medium text-white"}>{site.reviews.score}/5</b> op Google
      </span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title={aboutIntro.title}
        intro={aboutIntro.subtitle}
        crumbs={[{ href: "/", label: "Home" }, { label: "Over ons" }]}
        image={version === 2 ? aboutPhotos.studio.src : aboutHeroImage}
        imageAlt={version === 2 ? aboutPhotos.studio.alt : "Een Mcars-autotransporter onderweg"}
        wordmark="VLOOT"
        lineImages={[aboutPhotos.team.src, aboutPhotos.driver.src]}
        aside={proof}
        form={<QuoteFlow tone={formTone} />}
      />

      {/* 01 — the story, scrubbed word by word: 2004 → 2009 → today */}
      <Chapter n="01" label={aboutStory.label} tone={T.story}>
        <ChapterIntro lead={aboutStory.lead} trail={aboutStory.trail} />
        <Story tone={T.story} first={firstPara} second={secondPara} />
        <div className="mt-20 sm:mt-28">
          <Figures
            items={[
              { value: totalTrucks, label: "Eigen autotransporters" },
              { value: STAT("Vaste chauffeurs").value, label: "Vaste chauffeurs" },
              { value: String(site.founded), label: "Sinds" },
              { value: STAT("Jaar ervaring").value, label: "Jaar ervaring" },
            ]}
          />
        </div>
      </Chapter>

      {/* 02 — team & fleet: bento of people and trucks, then the fleet ledger */}
      <Chapter n="02" label={aboutTeam.label} tone={T.team} className="pb-12 sm:pb-16">
        <ChapterIntro lead={aboutTeam.lead} trail={aboutTeam.trail} body={aboutTeam.intro} />
        <div className="mt-14 sm:mt-20">
          <Bento>
            <Cell image={aboutPhotos.team.src} alt={aboutPhotos.team.alt} eyebrow="Team Mcars" title={`${STAT("Vaste chauffeurs").value} vaste chauffeurs`} body={`${aboutTeam.languages.join(" én ")} — ze kennen hun vrachtwagen, hun routes en uw wagen.`} />
            <Cell image={aboutPhotos.driver.src} alt={aboutPhotos.driver.alt} eyebrow="Onderweg" title="Vaste gezichten" />
            <Cell dark eyebrow="Vloot" title={`${totalTrucks} autotransporters`} body={fleet.map((f) => `${f.count} ${f.name}`).join(" · ")} />
            <Cell image={aboutPhotos.workshop.src} alt={aboutPhotos.workshop.alt} eyebrow="Werkplaats" title="Kässbohrer-opbouw" />
            <Cell image={aboutPhotos.studio.src} alt={aboutPhotos.studio.alt} eyebrow="Mercedes & Scania" title="Eigen autotransporters" />
          </Bento>
        </div>
        <FleetLedger tone={T.team} />
      </Chapter>

      <div>
        <ImageBridge src={aboutPhotos.fleet.src} alt={aboutPhotos.fleet.alt} from={T.team} to={T.area} caption="Het depot in Roeselare" />
      </div>

      {/* 03 — werkgebied */}
      <Chapter n="03" label={aboutArea.label} tone={T.area}>
        <ChapterIntro lead={aboutArea.lead} trail={aboutArea.trail} body={aboutArea.intro} />
        <Countries tone={T.area} />
      </Chapter>

      {/* 04 — insured transport: photo + three guarantees */}
      <Chapter n="04" label={aboutInsured.label} tone={T.insured} curtain={T.insured !== T.area}>
        <ChapterIntro lead={aboutInsured.lead} trail={aboutInsured.trail} />
        <FlowGrid className="mt-12 sm:mt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
            <ClipImage src="/images/generated/strap-closeup.jpg" alt="Een wiel wordt vastgezet met een spanband" parallax sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem]" />
            <ol className={`border-t ${toneClasses(T.insured).line}`}>
              {aboutInsured.items.map((it, i) => (
                <Rise key={it.title} delay={i * 80} className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b py-7 sm:py-9 ${toneClasses(T.insured).line}`}>
                  <span className={`pt-2 font-mono text-[11px] tracking-[0.2em] ${toneClasses(T.insured).faint}`}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-2xl font-light tracking-[-0.02em] sm:text-3xl">{it.title}</h3>
                    <p className={`mt-2 max-w-md text-sm leading-relaxed sm:text-base ${toneClasses(T.insured).muted}`}>{it.body}</p>
                  </div>
                </Rise>
              ))}
            </ol>
          </div>
        </FlowGrid>
      </Chapter>

      {/* 05 — why Mcars as an oversized index */}
      <Chapter n="05" label={aboutWhy.label} tone={T.why} curtain={T.why !== T.insured}>
        {version === 3 ? (
          <InlineImageLine parts={["Persoonlijk,", { image: aboutPhotos.driver.src }, "betrouwbaar", { image: "/images/generated/strap-closeup.jpg" }, "en transparant."]} />
        ) : (
          <ChapterIntro lead={aboutWhy.lead} trail={aboutWhy.trail} action={<FlowButton href="/reviews" variant="ghost">Lees de reviews</FlowButton>} />
        )}
        <div className="mt-12 sm:mt-16">
          <IndexRow items={aboutWhy.items.map((h, i) => ({ title: h.title, body: h.body, image: WHY_PHOTOS[i % WHY_PHOTOS.length] }))} />
        </div>
      </Chapter>

      <FlowClose
        lead="Rijdt u straks"
        trail="met Mcars mee?"
        form={<QuoteFlow tone="dark" />}
        contact={
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-white/40">Rechtstreeks bellen</dt><dd className="mt-1"><a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a></dd></div>
            <div><dt className="text-white/40">Langskomen</dt><dd className="mt-1 py-2 text-lg text-white">{site.address.street}, {site.address.city}</dd></div>
          </dl>
        }
      />
    </FlowPage>
  );
}

/** Story: the first paragraph as a scroll-scrubbed statement, framed by the two founding years. */
function Story({ tone, first, second }: { tone: FlowTone; first: string; second: string }) {
  const t = toneClasses(tone);
  const years = [
    { year: "2004", label: "Filip Maertens laadt zijn eerste auto's" },
    { year: String(site.founded), label: "Mcars wordt opgericht in Roeselare" },
    { year: "Vandaag", label: `${STAT("Eigen autotransporters").value} transporters, ${STAT("Vaste chauffeurs").value} vaste chauffeurs` },
  ];
  return (
    <FlowGrid className="mt-14 sm:mt-20">
      <div className="lg:ml-[25%]">
        <p className="text-[1.45rem] leading-[1.3] font-light tracking-[-0.02em] sm:text-3xl lg:text-[2.35rem] lg:leading-[1.22]">
          <ScrollWords text={first} />
        </p>
        <p className={`mt-8 max-w-2xl text-base leading-relaxed sm:text-lg ${t.muted}`}>{second}</p>
        <ol className={`mt-14 grid border-t sm:grid-cols-3 ${t.line}`}>
          {years.map((y, i) => (
            <Rise key={y.year} delay={i * 90} className={`border-b py-6 sm:border-b-0 sm:py-8 ${t.line} ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}>
              <span className="block font-[family-name:var(--font-display)] text-5xl leading-none sm:text-6xl">{y.year}</span>
              <span className={`mt-3 block text-sm leading-relaxed ${t.muted}`}>{y.label}</span>
            </Rise>
          ))}
        </ol>
      </div>
    </FlowGrid>
  );
}

function FleetLedger({ tone }: { tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <FlowGrid className="mt-16 sm:mt-24">
      <div className="lg:ml-[25%]">
        <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.faint}`}>De vloot</p>
        <ul className={`mt-5 border-t ${t.line}`}>
          {fleet.map((f, i) => (
            <Rise key={f.name} delay={i * 80} className={`grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 border-b py-6 sm:grid-cols-[minmax(0,1fr)_14rem_auto] ${t.line}`}>
              <span className="text-2xl font-light tracking-[-0.025em] sm:text-3xl">{f.name}</span>
              <span className={`hidden text-sm sm:block ${t.muted}`}>{f.note}</span>
              <span className="font-[family-name:var(--font-display)] text-5xl leading-none sm:text-6xl">{f.count}</span>
            </Rise>
          ))}
        </ul>
      </div>
    </FlowGrid>
  );
}

function Countries({ tone }: { tone: FlowTone }) {
  const t = toneClasses(tone);
  const dark = tone === "dark";
  return (
    <FlowGrid className="mt-12 sm:mt-16">
      <ul className={`grid border-t sm:grid-cols-2 lg:grid-cols-3 ${t.line}`}>
        {countries.map((c, i) => (
          <li key={c.name} className={`border-b ${t.line}`}>
            <Link href={c.href} className={`group flex min-h-20 items-center gap-4 py-5 pr-4 transition-colors ${dark ? "hover:text-white/70" : "hover:text-zinc-500"}`}>
              <span className={`w-6 font-mono text-[11px] tracking-[0.2em] ${t.faint}`}>{String(i + 1).padStart(2, "0")}</span>
              <Image src={c.flag} alt="" width={120} height={80} className="h-8 w-auto flex-none sm:h-9" />
              <span className="min-w-0 truncate text-xl font-light tracking-[-0.02em] sm:text-2xl">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={`mt-6 max-w-2xl text-sm leading-relaxed ${t.muted}`}>
        Ook actief in {extraCountries.join(", ")}. {aboutArea.note}
      </p>
    </FlowGrid>
  );
}
