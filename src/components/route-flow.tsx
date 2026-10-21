import Image from "next/image";
import Link from "next/link";
import { flagAsset } from "@/data/routes";
import { defaultProcess, type IconKey } from "@/data/services";
import type { RoutePageData } from "@/lib/route-page";
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
  FlowFaq,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  InlineImageLine,
  Rise,
  StepPath,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Route page as one composed film — a sibling of service-flow.tsx.
 *
 *   hero+form (prefilled corridor) → 01 about → 02 where we drive → [bridge] →
 *   03 the ride (steps) → 04 the ride in short (spec sheet) → 05 questions + related →
 *   close (dark, form again)
 *
 *   01 cinema    light → paper → dark → light → paper → dark close
 *   02 wordmark  light / paper only, Swiss hairlines, dark only at the close
 *   03 lines     dark throughout, one paper interlude (04)
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; about: FlowTone; cities: FlowTone; ride: FlowTone; specs: FlowTone; faq: FlowTone }> = {
  1: { page: "light", about: "light", cities: "paper", ride: "dark", specs: "light", faq: "paper" },
  2: { page: "light", about: "light", cities: "light", ride: "paper", specs: "light", faq: "light" },
  3: { page: "dark", about: "dark", cities: "dark", ride: "dark", specs: "paper", faq: "dark" },
};

/** A photo per highlight, chosen by what the highlight is about. */
function highlightImage(icon: IconKey, i: number) {
  const byIcon: Partial<Record<IconKey, string>> = {
    shield: "/images/generated/pickup-inspection.jpg",
    users: "/images/generated/driver-portrait.jpg",
    truck: "/images/generated/dealer-loading.jpg",
    map: "/images/generated/aerial-motorway.jpg",
  };
  return byIcon[icon] ?? ["/images/generated/depot-night.jpg", "/images/generated/team-depot.jpg"][i % 2];
}

export default function RouteFlow({ data, version }: { data: RoutePageData; version: Version }) {
  const { route, isCorridor, from, to, place, related, detailImage, specs, preset, cityGroups } = data;
  const T = TONES[version];
  const formTone = version === 1 ? "glass" : version === 2 ? "light" : "dark";
  const onLight = version === 2;
  const crumbs = [{ href: "/", label: "Home" }, { href: "/routes", label: "Routes" }, { label: route.nav }];
  const secondImage = route.portraitImage ?? "/images/generated/key-handover.jpg";
  const bridgeImage = route.heroImage === "/fleet/countryside-highway.jpg" ? "/fleet/sunset-parking.jpg" : "/fleet/countryside-highway.jpg";
  const wordmark = (isCorridor ? to!.name : place!.name).toUpperCase();

  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 text-sm ${onLight ? "text-zinc-500" : "text-white/70"}`}>
      {isCorridor && (
        <span className="flex items-center gap-3">
          <Flag flag={from!.flag} />
          <span aria-hidden className={`h-px w-6 ${onLight ? "bg-zinc-950/25" : "bg-white/30"}`} />
          <Flag flag={to!.flag} />
          <span className="sr-only">{route.nav}</span>
        </span>
      )}
      <span><b className={onLight ? "font-medium text-zinc-950" : "font-medium text-white"}>{site.reviews.score}/5</b> op Google</span>
      <span aria-hidden>·</span>
      <span>{route.frequency}</span>
      <span aria-hidden>·</span>
      <span>CMR bij elke ophaling</span>
    </div>
  );

  const line = (tone: FlowTone) => (tone === "dark" ? "border-white/12" : tone === "paper" ? "border-zinc-300/70" : "border-zinc-200");
  const muted = (tone: FlowTone) => (tone === "dark" ? "text-white/55" : "text-zinc-500");

  return (
    <FlowPage tone={T.page}>
      <FlowHero
        variant={version === 1 ? "cinema" : version === 2 ? "wordmark" : "lines"}
        title={route.title}
        intro={route.subtitle}
        crumbs={crumbs}
        image={version === 2 ? "/images/generated/truck-studio.jpg" : route.heroImage}
        imageAlt={`${route.nav} met Mcars`}
        wordmark={wordmark}
        lineImages={[detailImage, secondImage]}
        aside={proof}
        form={<QuoteFlow tone={formTone} service={route.nav} preset={preset} />}
      />

      {/* 01 — about the route: statement + bento of highlights and route facts */}
      <Chapter n="01" label={isCorridor ? "Over deze route" : "Over deze bestemming"} tone={T.about}>
        <ChapterIntro lead={route.intro} />
        <div className="mt-14 sm:mt-20">
          <Bento>
            <Cell image={detailImage} alt={`${route.nav} — onderweg met Mcars`} eyebrow={route.frequency} title={route.highlights[0]?.title} body={route.highlights[0]?.body} />
            {route.highlights.slice(1, 3).map((h) => (
              <Cell key={h.title} eyebrow="Inbegrepen" title={h.title} body={h.body} />
            ))}
            <Cell dark eyebrow={route.stats[0]?.label} title={route.stats[0]?.value} body={route.stats.slice(1).map((s) => `${s.value} ${s.label}`).join(" · ")} />
            <Cell image={highlightImage(route.highlights[2]?.icon ?? "truck", 1)} alt="Wagens worden op een Mcars-transporter geladen" eyebrow="Google reviews" title={`${site.reviews.score}/5`} body={`${site.reviews.count} reviews · ${site.reviews.clients} tevreden klanten`} />
          </Bento>
        </div>
      </Chapter>

      {/* 02 — where we drive: cities as a hairline grid beside a photo */}
      <Chapter n="02" label={isCorridor ? "Ophaal- en leverpunten" : "Waar we rijden"} tone={T.cities}>
        <ChapterIntro
          lead={isCorridor ? "Van deur tot deur," : route.slug === "autotransport-europa" ? "Actief in heel Europa," : `Actief in heel ${place!.name},`}
          trail={isCorridor ? "waar u ook zit." : "en daarbuiten."}
          body="Uw stad of adres er niet bij? Geen probleem — we halen op en leveren waar u het nodig heeft."
        />
        <FlowGrid className="mt-12 sm:mt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <ClipImage src={secondImage} alt={`Onderweg naar ${isCorridor ? to!.name : place!.name}`} sizes="(min-width:1024px) 30vw, 100vw" className="hidden aspect-[3/4] self-start rounded-[1.5rem] lg:block" />
            <div className="space-y-12">
              {cityGroups.map((g) => (
                <div key={g.label}>
                  <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${muted(T.cities)}`}>{g.label}</p>
                  <ul className={`mt-4 grid grid-cols-2 border-t sm:grid-cols-3 ${line(T.cities)}`}>
                    {g.cities.map((c, i) => (
                      <Rise key={c} delay={(i % 3) * 60} className={`border-b py-5 pr-4 ${line(T.cities)}`}>
                        <span className={`font-mono text-[11px] tracking-[0.2em] ${T.cities === "dark" ? "text-white/35" : "text-zinc-400"}`}>{String(i + 1).padStart(2, "0")}</span>
                        <span className="mt-2 block text-xl font-light tracking-[-0.02em] sm:text-2xl">{c}</span>
                      </Rise>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FlowGrid>
      </Chapter>

      <div>
        <ImageBridge src={bridgeImage} alt="" from={T.cities} to={T.ride} />
      </div>

      {/* 03 — the ride: connected steps + fleet figures */}
      <Chapter n="03" label="Zo verloopt de rit" tone={T.ride}>
        {version === 3 ? (
          <InlineImageLine parts={["Van aanvraag", { image: "/images/generated/pickup-inspection.jpg" }, "tot levering,", { image: "/images/generated/key-handover.jpg" }, "zonder omwegen."]} />
        ) : (
          <ChapterIntro lead="Van aanvraag tot levering," trail="helder en zonder omwegen." body="U weet op elk moment wat er gebeurt en wie u kan bellen." action={<FlowButton href="/hoe-werkt-het" variant="ghost">Zo werkt het</FlowButton>} />
        )}
        <div className="mt-14 sm:mt-20">
          <StepPath steps={defaultProcess.map((p) => ({ title: p.title, body: p.body }))} />
        </div>
        <div className="mt-20 sm:mt-28">
          <Figures items={[
            { value: "9", label: "Eigen transporters" },
            { value: "8", label: "Vaste chauffeurs" },
            { value: String(site.founded), label: "Sinds" },
            { value: "24u", label: "Antwoord op uw aanvraag" },
          ]} />
        </div>
      </Chapter>

      {/* 04 — the ride in short: spec sheet */}
      <Chapter n="04" label="De rit in het kort" tone={T.specs} curtain={T.specs !== T.ride}>
        <ChapterIntro lead="Alles wat vastligt," trail="voor elke rit op deze route." body="Elke prijs is maatwerk: u krijgt binnen 24 uur een persoonlijke prijs en planning." />
        <FlowGrid className="mt-12 sm:mt-16">
          <dl className={`grid border-t sm:grid-cols-2 lg:grid-cols-3 ${line(T.specs)}`}>
            {specs.map((s, i) => (
              <Rise key={s.label} delay={(i % 3) * 80} className={`border-b py-8 sm:pr-8 ${line(T.specs)}`}>
                <dt className="font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">{String(i + 1).padStart(2, "0")} · {s.label}</dt>
                <dd className="mt-4 text-2xl font-light tracking-[-0.02em]">{s.value}</dd>
              </Rise>
            ))}
          </dl>
        </FlowGrid>
      </Chapter>

      {/* 05 — questions, then related as a slim photo rail */}
      <Chapter n="05" label="Vragen" tone={T.faq} curtain={T.faq !== T.specs}>
        <ChapterIntro lead="Vragen" trail="over deze route." />
        <div className="mt-12 sm:mt-16">
          <FlowFaq items={route.faq} />
        </div>
        {related.length > 0 && (
          <FlowGrid className="mt-24 sm:mt-32">
            <p className={`font-mono text-[11px] tracking-[0.2em] uppercase ${muted(T.faq)}`}>Verder op de route</p>
            <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {related.slice(0, 4).map((r) => (
                <li key={r.href} className="w-[78%] flex-none snap-start sm:w-auto">
                  <Link href={r.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                    <Image src={r.image} alt="" fill sizes="(min-width:1024px) 22vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{r.meta}</span>
                      <span className="mt-1 block text-xl font-light tracking-[-0.02em]">{r.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FlowGrid>
        )}
      </Chapter>

      <FlowClose
        lead="Klaar om deze route"
        trail="te boeken?"
        form={<QuoteFlow tone="dark" service={route.nav} preset={preset} />}
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

function Flag({ flag }: { flag: keyof typeof flagAsset }) {
  return <Image src={flagAsset[flag]} alt="" width={64} height={64} className="h-8 w-auto" />;
}
