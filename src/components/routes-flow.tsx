"use client";

import Image from "next/image";
import Link from "next/link";
import { countryRoutes, corridorRoutes, flagAsset, type Route } from "@/data/routes";
import { defaultProcess } from "@/data/services";
import { getRouteGroups } from "@/lib/route-page";
import { site } from "@/lib/site";
import EuropeNetworkLight from "./europe-network-light";
import {
  Arrow,
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
  InlineImageLine,
  Rise,
  StepPath,
  toneClasses,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Routes overview as one composed film (sibling of service-flow.tsx).
 *
 *   hero+form → 01 every route, grouped → 02 destinations → [bridge] →
 *   03 the network → 04 how a ride runs → close
 *
 *   01 cinema    grouped rows · bento destinations · dark map chapter
 *   02 wordmark  four Swiss hairline columns · photo rows · paper figures
 *   03 lines     dark; paper interlude for destinations · inline-image statement
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; groups: FlowTone; countries: FlowTone; network: FlowTone; process: FlowTone }> = {
  1: { page: "light", groups: "light", countries: "paper", network: "dark", process: "light" },
  2: { page: "light", groups: "light", countries: "light", network: "paper", process: "light" },
  3: { page: "dark", groups: "dark", countries: "paper", network: "dark", process: "dark" },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Short row title: "België → Nederland" for corridors, the country name for destinations. */
const rowTitle = (r: Route) => (r.kind === "corridor" ? `${r.from!.name} → ${r.to!.name}` : r.place!.name);

export default function RoutesFlow({ version }: { version: Version }) {
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const groups = getRouteGroups();
  const crumbs = [{ href: "/", label: "Home" }, { label: "Routes" }];
  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      <span><b className={onLight ? "font-medium text-zinc-950" : "font-medium text-white"}>{site.reviews.score}/5</b> op Google</span>
      <span aria-hidden>·</span>
      <span>{countryRoutes.length} bestemmingen</span>
      <span aria-hidden>·</span>
      <span>{corridorRoutes.length} vaste corridors</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title="Tot in elke uithoek van Europa."
        intro="Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje. En verder rijden we overal naartoe."
        crumbs={crumbs}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : "/fleet/countryside-highway.jpg"}
        imageAlt="Een Mcars-transporter op de snelweg door het Franse platteland"
        wordmark="ROUTES"
        lineImages={["/images/generated/alpine-pass.jpg", "/images/generated/flemish-square.jpg"]}
        aside={proof}
        form={<QuoteFlow tone={formTone} />}
      />

      {/* 01 — every route, grouped by direction */}
      <Chapter n="01" label="Alle routes" tone={T.groups}>
        <ChapterIntro
          lead="Rechtstreeks tussen de landen,"
          trail="op vaste assen."
          body="Op deze routes rijden we op regelmatige basis. Uw wagen sluit aan op een bestaande rit — efficiënt, zonder omwegen."
        />
        <FlowGrid className="mt-12 sm:mt-16">{version === 2 ? <GroupColumns groups={groups} tone={T.groups} /> : <GroupRows groups={groups} tone={T.groups} />}</FlowGrid>
      </Chapter>

      {/* 02 — destinations */}
      <Chapter n="02" label="Bestemmingen" tone={T.countries} curtain={T.countries === "paper" && T.groups === "dark"}>
        <ChapterIntro
          lead="Autotransport"
          trail="per bestemming."
          body="Van dagelijkse ritten binnen België tot wekelijkse rondes door heel Frankrijk. Kies uw bestemming voor steden, frequentie en praktische info."
        />
        <div className="mt-12 sm:mt-16">
          {version === 1 && (
            <Bento>
              {countryRoutes.map((r) => (
                <Link key={r.slug} href={`/routes/${r.slug}`} className="absolute inset-0 block">
                  <Cell image={r.heroImage} alt={`${r.nav} met Mcars`} eyebrow={r.frequency} title={r.place!.name} body={r.subtitle} />
                </Link>
              ))}
            </Bento>
          )}
          {version === 2 && (
            <FlowGrid>
              <ul className={`border-t ${toneClasses(T.countries).line}`}>
                {countryRoutes.map((r, i) => (
                  <li key={r.slug} className={`border-b ${toneClasses(T.countries).line}`}>
                    <Link href={`/routes/${r.slug}`} className="group grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 sm:grid-cols-[3rem_9rem_minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-8">
                      <span className="hidden font-mono text-[11px] tracking-[0.2em] text-zinc-400 sm:block">{pad(i + 1)}</span>
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={r.heroImage} alt="" fill sizes="9rem" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-2xl font-light tracking-[-0.02em] sm:text-3xl">{r.place!.name}</span>
                        <span className="mt-1 block text-sm text-zinc-500 sm:hidden">{r.frequency}</span>
                      </span>
                      <span className="hidden text-sm leading-relaxed text-zinc-500 sm:block">{r.subtitle}<span className="mt-1 block font-mono text-[11px] tracking-[0.18em] uppercase">{r.frequency}</span></span>
                      <ArrowDot tone={T.countries} />
                    </Link>
                  </li>
                ))}
              </ul>
            </FlowGrid>
          )}
          {version === 3 && (
            <FlowGrid>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {countryRoutes.map((r, i) => (
                  <Rise key={r.slug} delay={(i % 3) * 80}>
                    <Link href={`/routes/${r.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                      <Image src={r.heroImage} alt={`${r.nav} met Mcars`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />
                      <span className="absolute inset-x-0 top-0 p-5 font-[family-name:var(--font-display)] text-5xl leading-none text-white/80">{pad(i + 1)}</span>
                      <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{r.frequency}</span>
                        <span className="mt-2 block text-3xl leading-tight font-light tracking-[-0.02em]">{r.place!.name}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-white/70">{r.subtitle}</span>
                      </span>
                    </Link>
                  </Rise>
                ))}
              </ul>
            </FlowGrid>
          )}
        </div>
      </Chapter>

      <div>
        <ImageBridge src="/images/generated/alpine-pass.jpg" alt="" from={T.countries} to={T.network} />
      </div>

      {/* 03 — the network: the live map on 01, figures on 02/03 */}
      <Chapter n="03" label="Ons netwerk" tone={T.network}>
        {version === 3 ? (
          <InlineImageLine parts={["Vanuit Roeselare", { image: "/images/generated/night-motorway.jpg" }, "elke week", { image: "/fleet/barcelona-sagrada.jpg" }, "tot Noord-Spanje."]} />
        ) : (
          <ChapterIntro
            lead="Vaste corridors"
            trail="door heel Europa."
            body="Wij importeren en exporteren voertuigen met vaste corridors vanuit onze thuisbasis in België. Van een oldtimer uit Italië tot een vloot richting Spanje: uw transport rijdt op routes die we elke week opnieuw rijden."
          />
        )}
        {version === 1 ? (
          <FlowGrid className="mt-4 sm:mt-8">
            {/* Embedded map: its own heading is hidden — the ChapterIntro above carries it. */}
            <div className="[&_#netwerk]:rounded-none [&_#netwerk]:bg-transparent [&_#netwerk]:px-0 [&_#netwerk]:py-0 [&_#netwerk>div:first-child]:hidden">
              <EuropeNetworkLight dark />
            </div>
          </FlowGrid>
        ) : (
          <>
            <div className="mt-14 sm:mt-20">
              <Figures items={[
                { value: String(countryRoutes.length), label: "Bestemmingen" },
                { value: String(corridorRoutes.length), label: "Vaste corridors" },
                { value: "9", label: "Eigen transporters" },
                { value: "10+", label: "Landen bereden" },
              ]} />
            </div>
            <FlowGrid className="mt-14 sm:mt-20">
              <ClipImage src="/fleet/germany-autobahn.jpg" alt="Een Mcars-transporter op de Duitse autosnelweg" parallax className="aspect-[4/3] rounded-[1.5rem] sm:aspect-[21/9] sm:rounded-[2rem]" />
            </FlowGrid>
          </>
        )}
      </Chapter>

      {/* 04 — how a ride runs, on every route */}
      <Chapter n="04" label="Werkwijze" tone={T.process} curtain={T.process !== T.network}>
        <ChapterIntro
          lead="Van aanvraag tot levering,"
          trail="op elke route dezelfde aanpak."
          body="U weet op elk moment wat er gebeurt en wie u kan bellen."
          action={<FlowButton href="/hoe-werkt-het" variant="ghost">Zo werkt het</FlowButton>}
        />
        <div className="mt-14 sm:mt-20">
          <StepPath steps={defaultProcess.map((p) => ({ title: p.title, body: p.body }))} />
        </div>
      </Chapter>

      <FlowClose
        lead="Klaar om uw route"
        trail="te boeken?"
        form={<QuoteFlow tone="dark" />}
        contact={
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-white/40">Rechtstreeks bellen</dt><dd className="mt-1"><a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a></dd></div>
            <div><dt className="text-white/40">Mailen</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="inline-block py-2 text-lg text-white">{site.email}</a></dd></div>
          </dl>
        }
      />
    </FlowPage>
  );
}

type Groups = ReturnType<typeof getRouteGroups>;

function ArrowDot({ tone }: { tone: FlowTone }) {
  return (
    <span className={`flex size-11 flex-none items-center justify-center rounded-full ring-1 transition-colors ${tone === "dark" ? "ring-white/20 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/15 group-hover:bg-zinc-950 group-hover:text-white"}`}>
      <Arrow />
    </span>
  );
}

function Flags({ r }: { r: Route }) {
  if (r.kind !== "corridor") return null;
  return (
    <span aria-hidden className="flex flex-none items-center gap-1.5">
      <Image src={flagAsset[r.from!.flag]} alt="" width={64} height={64} className="h-6 w-auto" />
      <Image src={flagAsset[r.to!.flag]} alt="" width={64} height={64} className="h-6 w-auto" />
    </span>
  );
}

/** 01 / 03: one band per group — label left, hairline rows right. */
function GroupRows({ groups, tone }: { groups: Groups; tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <div className={`border-t ${t.line}`}>
      {groups.map((g, gi) => (
        <div key={g.id} className={`grid gap-6 border-b py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16 ${t.line}`}>
          <div>
            <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
              <span className={t.text}>{pad(gi + 1)}</span> · {g.label}
            </p>
            <p className={`mt-3 max-w-xs text-sm leading-relaxed ${t.muted}`}>{g.body}</p>
          </div>
          <ul className={`border-t ${t.line}`}>
            {g.items.map((r) => (
              <li key={r.slug} className={`border-b last:border-b-0 ${t.line}`}>
                <Link href={`/routes/${r.slug}`} className="group flex min-h-20 items-center gap-5 py-5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-light tracking-[-0.025em] sm:text-3xl">{rowTitle(r)}</span>
                    <span className={`mt-1 block text-sm ${t.muted}`}>{r.subtitle}</span>
                  </span>
                  <span className="hidden sm:block"><Flags r={r} /></span>
                  <span className={`hidden font-mono text-[11px] tracking-[0.18em] uppercase md:block ${t.muted}`}>{r.frequency}</span>
                  <ArrowDot tone={tone} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** 02: four Swiss hairline columns, one per group. */
function GroupColumns({ groups, tone }: { groups: Groups; tone: FlowTone }) {
  const t = toneClasses(tone);
  return (
    <div className={`grid border-t sm:grid-cols-2 lg:grid-cols-4 ${t.line}`}>
      {groups.map((g, gi) => (
        <div key={g.id} className={`border-b py-8 sm:pr-6 lg:border-b-0 ${gi % 2 ? "sm:border-l sm:pl-6" : ""} ${gi === 2 ? "lg:border-l lg:pl-6" : ""} ${t.line}`}>
          <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${t.muted}`}>
            <span className={t.text}>{pad(gi + 1)}</span> · {g.label}
          </p>
          <p className={`mt-3 text-sm leading-relaxed ${t.muted}`}>{g.body}</p>
          <ul className="mt-8 space-y-1">
            {g.items.map((r) => (
              <li key={r.slug}>
                <Link href={`/routes/${r.slug}`} className="group flex min-h-11 items-center justify-between gap-3 py-2">
                  <span className="text-xl font-light tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">{rowTitle(r)}</span>
                  <Arrow className="size-4 flex-none opacity-40 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
