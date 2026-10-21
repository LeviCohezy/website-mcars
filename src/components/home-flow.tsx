import Image from "next/image";
import Link from "next/link";
import { sortedArticles } from "@/data/blog";
import { cases } from "@/data/cases";
import { faqGroups } from "@/data/faq";
import { reviews } from "@/data/reviews";
import { routes } from "@/data/routes";
import { defaultProcess, getService, services } from "@/data/services";
import { site } from "@/lib/site";
import CinematicSequence from "./cinematic-sequence";
import EuropeNetwork from "./europe-network";
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
  FlowFaq,
  FlowGrid,
  FlowHero,
  FlowPage,
  ImageBridge,
  IndexRow,
  InlineImageLine,
  Rise,
  StepPath,
  type FlowTone,
} from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Homepage as one composed film — same story in all three versions
 * (client sitemap):
 *
 *   hero + quote → 01 diensten → 02 populaire routes → 03 zo werkt het →
 *   04 reviews → 05 cases → 06 vragen (+ kennisbank) → close (form again)
 *
 *   01 cinema   light → paper → [bridge] dark → light curtain → paper → dark close
 *   02 film     the approved scroll film + quote chapter (dark), services
 *               index and Europe network on black, then one light curtain
 *               with Swiss hairline grids, dark close
 *   03 lines    dark throughout, reviews as the one paper interlude
 */

type Version = 1 | 2 | 3;

const TONES: Record<Version, { page: FlowTone; services: FlowTone; routes: FlowTone; process: FlowTone; reviews: FlowTone; cases: FlowTone; faq: FlowTone }> = {
  1: { page: "light", services: "light", routes: "paper", process: "dark", reviews: "light", cases: "light", faq: "paper" },
  2: { page: "dark", services: "dark", routes: "dark", process: "light", reviews: "light", cases: "light", faq: "paper" },
  3: { page: "dark", services: "dark", routes: "dark", process: "dark", reviews: "paper", cases: "dark", faq: "dark" },
};

const line = (t: FlowTone) => (t === "dark" ? "border-white/12" : t === "paper" ? "border-zinc-300/70" : "border-zinc-200");
const muted = (t: FlowTone) => (t === "dark" ? "text-white/55" : "text-zinc-500");
const EYEBROW = "font-mono text-[11px] tracking-[0.2em] uppercase";

const countryRoutes = routes.filter((r) => r.kind === "country");
const corridors = routes.filter((r) => r.kind === "corridor");
const svc = (slug: string) => getService(slug)!;

export default function HomeFlow({ version }: { version: Version }) {
  const T = TONES[version];

  const proof = (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${version === 3 ? "justify-center" : ""} text-white/70`}>
      <span><b className="font-medium text-white">{site.reviews.score}/5</b> op Google</span>
      <span aria-hidden>·</span>
      <span>{site.reviews.clients} tevreden klanten</span>
      <span aria-hidden>·</span>
      <span>Antwoord binnen 24 uur</span>
    </div>
  );

  return (
    <FlowPage tone={T.page}>
      {/* ---------------- Opening ---------------- */}
      {version === 1 && (
        <FlowHero
          variant="cinema"
          title="Autotransport dat verder gaat dan van A naar B."
          intro="Eén wagen of een volledig wagenpark: wij halen op waar u wil en leveren af waar het moet zijn — in België en heel Europa, sinds 2009."
          image="/fleet/hero-highway-sunset.jpg"
          imageAlt="Een Mcars-autotransporter op de snelweg bij zonsondergang"
          aside={proof}
          form={<QuoteFlow tone="glass" />}
        />
      )}

      {version === 2 && (
        <>
          {/* The approved scroll-controlled film is the opening shot; its first frame
              carries the QuoteFlow. Its built-in header is hidden here: the fixed
              SiteNav (PageShell) is the one nav. */}
          <div className="[&_header]:hidden">
            <CinematicSequence />
          </div>
        </>
      )}

      {version === 3 && (
        <FlowHero
          variant="lines"
          title={"Uw wagen, veilig van A\u00a0naar\u00a0B."}
          intro="Autotransport met korte lijnen, sinds 2009. Voor particulieren, dealers en bedrijven — in België en heel Europa."
          image="/images/generated/night-motorway.jpg"
          imageAlt="Een Mcars-autotransporter 's nachts op de snelweg"
          lineImages={["/images/generated/key-handover.jpg", "/fleet/city-loaded.jpg"]}
          aside={proof}
          form={<QuoteFlow tone="dark" />}
        />
      )}

      {/* ---------------- 01 Diensten ---------------- */}
      <Chapter n="01" label="Diensten" tone={T.services}>
        <ChapterIntro
          lead={version === 2 ? "Elf diensten, één aanspreekpunt." : "Eén partner voor elk transport,"}
          trail={version === 2 ? "Van één wagen tot een volledig wagenpark." : "van één wagen tot een volledig wagenpark."}
          body="Particulier of dealer, rijdend of niet, binnenland of buitenland: u spreekt rechtstreeks met het team dat uw transport ook uitvoert."
          action={<FlowButton href="/diensten" variant="ghost">Alle diensten</FlowButton>}
        />
        <div className="mt-14 sm:mt-20">
          {version === 1 && <ServicesBento />}
          {version === 2 && (
            <IndexRow items={services.map((s) => ({ title: s.nav, body: s.subtitle, href: `/diensten/${s.slug}`, image: s.heroImage, meta: s.category }))} />
          )}
          {version === 3 && <ServicesGallery tone={T.services} />}
        </div>
      </Chapter>

      {/* ---------------- 02 Routes ---------------- */}
      <Chapter n="02" label="Populaire routes" tone={T.routes} >
        <ChapterIntro
          lead="Vaste routes door heel Europa,"
          trail="vanuit onze thuisbasis in Roeselare."
          body="Dagelijks door België, meermaals per week naar Nederland, wekelijks door heel Frankrijk en een vaste route tot in Spanje. Elders in Europa rijden we op aanvraag."
          action={<FlowButton href="/routes" variant="ghost">Alle routes</FlowButton>}
        />
        {version === 1 && (
          <>
            <RouteCards />
            <CorridorPills tone={T.routes} />
          </>
        )}
        {version === 2 && (
          <>
            <FlowGrid className="mt-10 sm:mt-14">
              <EuropeNetwork eyebrow="Ons netwerk" title="Mcars transporteert auto's in heel Europa." />
            </FlowGrid>
            <RouteGrid tone={T.routes} />
          </>
        )}
        {version === 3 && <RouteBoard tone={T.routes} />}
      </Chapter>

      {version === 1 && (
        <div>
          <ImageBridge src="/images/generated/aerial-motorway.jpg" alt="" from={T.routes} to={T.process} />
        </div>
      )}

      {/* ---------------- 03 Zo werkt het ---------------- */}
      <Chapter n="03" label="Zo werkt het" tone={T.process} curtain={version === 2}>
        {version === 3 ? (
          <InlineImageLine parts={["Van aanvraag", { image: "/images/generated/pickup-inspection.jpg" }, "tot levering,", { image: "/images/generated/key-handover.jpg" }, "zonder omwegen."]} />
        ) : (
          <ChapterIntro
            lead="Van aanvraag tot levering,"
            trail="in vier heldere stappen."
            body="U weet op elk moment wat er gebeurt en wie u kan bellen. Geen calculator, geen callcenter."
            action={<FlowButton href="/hoe-werkt-het" variant="ghost">Zo werkt het</FlowButton>}
          />
        )}
        <div className="mt-14 sm:mt-20">
          <StepPath steps={defaultProcess.map((p) => ({ title: p.title, body: p.body }))} />
        </div>
        <div className="mt-20 sm:mt-28">
          <Figures
            items={[
              { value: "9", label: "Eigen transporters" },
              { value: "8", label: "Vaste chauffeurs" },
              { value: String(site.founded), label: "Sinds" },
              { value: "24u", label: "Antwoord op uw aanvraag" },
            ]}
          />
        </div>
      </Chapter>

      {/* ---------------- 04 Reviews ---------------- */}
      <Chapter n="04" label="Reviews" tone={T.reviews} curtain={T.reviews !== T.process}>
        <ChapterIntro
          lead="Wat klanten over ons zeggen."
          trail={`${site.reviews.score} op Google, van particulieren én dealers.`}
          action={<FlowButton href="/reviews" variant="ghost">Alle reviews</FlowButton>}
        />
        <Reviews tone={T.reviews} />
      </Chapter>

      {/* ---------------- 05 Cases ---------------- */}
      <Chapter n="05" label="Cases" tone={T.cases} curtain={T.cases !== T.reviews}>
        <ChapterIntro
          lead="Uit de praktijk."
          trail="Transporten die we met plezier vertellen."
          action={<FlowButton href="/cases" variant="ghost">Alle cases</FlowButton>}
        />
        <Cases tone={T.cases} />
      </Chapter>

      {/* ---------------- 06 Vragen ---------------- */}
      <Chapter n="06" label="Vragen" tone={T.faq}>
        <ChapterIntro
          lead="Veelgestelde vragen,"
          trail="kort beantwoord."
          action={<FlowButton href="/faq" variant="ghost">Alle vragen</FlowButton>}
        />
        <div className="mt-12 sm:mt-16">
          <FlowFaq items={faqGroups.slice(0, 6).map((g) => g.items[0])} />
        </div>
        <Knowledge tone={T.faq} />
      </Chapter>

      <FlowClose
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

/* ------------------------------------------------------------------ */
/* 01 — services                                                      */
/* ------------------------------------------------------------------ */

/** v1: bento of the six core services + one dark cell that opens the rest. */
function ServicesBento() {
  const featured = ["autotransport-particulier", "autotransport-dealers", "auto-importeren", "niet-rijdende-auto", "oldtimer-transport", "fleet-wagenpark"].map(svc);
  const rest = services.filter((s) => !featured.includes(s));
  return (
    <Bento>
      {featured.map((s) => (
        <Link key={s.slug} href={`/diensten/${s.slug}`} className="group absolute inset-0 block">
          <Cell image={s.heroImage} alt={`${s.nav} door Mcars`} eyebrow={s.category} title={s.nav} body={s.subtitle} />
          <CornerArrow />
        </Link>
      ))}
      <Link href="/diensten" className="group absolute inset-0 block">
        <Cell dark eyebrow="En verder" title="Alle diensten" body={rest.map((s) => s.nav).join(" · ")} />
        <CornerArrow />
      </Link>
    </Bento>
  );
}

function CornerArrow() {
  return (
    <span aria-hidden className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-zinc-950">
      <Arrow />
    </span>
  );
}

/** v3: photo gallery of six services (snap rail on mobile) + the rest as a hairline row. */
function ServicesGallery({ tone }: { tone: FlowTone }) {
  const featured = ["autotransport-particulier", "autotransport-dealers", "auto-importeren", "auto-exporteren", "niet-rijdende-auto", "oldtimer-transport"].map(svc);
  const rest = services.filter((s) => !featured.includes(s));
  return (
    <FlowGrid>
      <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {featured.map((s, i) => (
          <li key={s.slug} className="w-[80%] flex-none snap-start sm:w-auto">
            <Rise delay={(i % 3) * 80}>
              <Link href={`/diensten/${s.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[5/6]">
                <Image src={s.heroImage} alt={`${s.nav} door Mcars`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />
                <span className="absolute top-5 left-5 font-[family-name:var(--font-display)] text-4xl leading-none text-white/80">{String(i + 1).padStart(2, "0")}</span>
                <CornerArrow />
                <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className={`${EYEBROW} text-white/60`}>{s.category}</span>
                  <span className="mt-2 block text-2xl leading-tight font-light tracking-[-0.02em]">{s.nav}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/70">{s.subtitle}</span>
                </span>
              </Link>
            </Rise>
          </li>
        ))}
      </ul>
      <div className={`mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t pt-6 ${line(tone)}`}>
        <span className={`mr-3 ${EYEBROW} ${muted(tone)}`}>Ook</span>
        {rest.map((s) => (
          <Link key={s.slug} href={`/diensten/${s.slug}`} className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm ring-1 transition-colors ${tone === "dark" ? "ring-white/15 hover:bg-white hover:text-zinc-950" : "ring-zinc-950/15 hover:bg-zinc-950 hover:text-white"}`}>
            {s.nav}
          </Link>
        ))}
      </div>
    </FlowGrid>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — routes                                                        */
/* ------------------------------------------------------------------ */

/** v1: country photo cards (snap rail on mobile). */
function RouteCards() {
  return (
    <FlowGrid className="mt-12 sm:mt-16">
      <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {countryRoutes.map((r, i) => (
          <li key={r.slug} className="w-[80%] flex-none snap-start sm:w-auto">
            <Rise delay={(i % 3) * 80}>
              <Link href={`/routes/${r.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[4/3]">
                <Image src={r.heroImage} alt={`${r.nav} door Mcars`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/5 to-transparent" />
                <CornerArrow />
                <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className={`${EYEBROW} text-white/60`}>{r.frequency}</span>
                  <span className="mt-2 block text-2xl leading-tight font-light tracking-[-0.02em]">{r.nav.replace("Autotransport ", "")}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-white/70">{r.subtitle}</span>
                </span>
              </Link>
            </Rise>
          </li>
        ))}
      </ul>
    </FlowGrid>
  );
}

function CorridorPills({ tone }: { tone: FlowTone }) {
  return (
    <FlowGrid className="mt-10">
      <div className={`flex flex-wrap items-center gap-2 border-t pt-6 ${line(tone)}`}>
        <span className={`mr-3 ${EYEBROW} ${muted(tone)}`}>Vaste corridors</span>
        {corridors.map((r) => (
          <Link key={r.slug} href={`/routes/${r.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm ring-1 ring-zinc-950/10 transition-colors hover:bg-zinc-950 hover:text-white">
            {r.nav}
          </Link>
        ))}
      </div>
    </FlowGrid>
  );
}

/** v2: Swiss hairline grid of every route (countries + corridors). */
function RouteGrid({ tone }: { tone: FlowTone }) {
  return (
    <FlowGrid className="mt-10 sm:mt-14">
      <ul className={`grid border-t sm:grid-cols-2 lg:grid-cols-4 ${line(tone)}`}>
        {[...countryRoutes, ...corridors].map((r) => (
          <li key={r.slug} className={`border-b ${line(tone)}`}>
            <Link href={`/routes/${r.slug}`} className="group flex min-h-20 items-center justify-between gap-4 py-5 sm:pr-6">
              <span>
                <span className={`block ${EYEBROW} ${muted(tone)}`}>{r.frequency}</span>
                <span className="mt-2 block text-lg font-light tracking-[-0.015em] sm:text-xl">{r.nav.replace("Autotransport ", "")}</span>
              </span>
              <span className={`flex size-11 flex-none items-center justify-center rounded-full ring-1 transition-colors ${tone === "dark" ? "ring-white/20 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/15 group-hover:bg-zinc-950 group-hover:text-white"}`}>
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </FlowGrid>
  );
}

/** v3: departures-board — one hairline row per country route, corridors underneath. */
function RouteBoard({ tone }: { tone: FlowTone }) {
  return (
    <FlowGrid className="mt-12 sm:mt-16">
      <div className={`hidden grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)_2.75rem] gap-6 border-b pb-3 lg:grid ${EYEBROW} ${muted(tone)} ${line(tone)}`}>
        <span>Nr</span><span>Bestemming</span><span>Frequentie</span><span>Onderweg</span><span />
      </div>
      <ul>
        {countryRoutes.map((r, i) => (
          <li key={r.slug} className={`border-b ${line(tone)}`}>
            <Link href={`/routes/${r.slug}`} className="group grid grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-center gap-4 py-5 sm:py-6 lg:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)_2.75rem] lg:gap-6">
              <span className="relative block h-12 w-14 overflow-hidden rounded-xl lg:h-auto lg:w-auto lg:overflow-visible lg:rounded-none">
                <Image src={r.heroImage} alt="" fill sizes="4rem" className="object-cover lg:hidden" />
                <span className={`hidden font-[family-name:var(--font-display)] text-4xl leading-none lg:block ${muted(tone)}`}>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="min-w-0">
                <span className="block text-2xl font-light tracking-[-0.025em] sm:text-3xl">{r.nav.replace("Autotransport ", "")}</span>
                <span className={`mt-1 block text-sm lg:hidden ${muted(tone)}`}>{r.frequency}</span>
              </span>
              <span className={`hidden ${EYEBROW} lg:block`}>{r.frequency}</span>
              <span className={`hidden text-sm leading-relaxed lg:block ${muted(tone)}`}>{r.subtitle}</span>
              <span className={`flex size-11 items-center justify-center rounded-full ring-1 transition-colors ${tone === "dark" ? "ring-white/20 group-hover:bg-white group-hover:text-zinc-950" : "ring-zinc-950/15 group-hover:bg-zinc-950 group-hover:text-white"}`}>
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className={`mr-3 ${EYEBROW} ${muted(tone)}`}>Vaste corridors</span>
        {corridors.map((r) => (
          <Link key={r.slug} href={`/routes/${r.slug}`} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm ring-1 ring-white/15 transition-colors hover:bg-white hover:text-zinc-950">
            {r.nav}
          </Link>
        ))}
      </div>
    </FlowGrid>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — reviews                                                       */
/* ------------------------------------------------------------------ */

function Stars({ count, className = "size-4" }: { count: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${count} op 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${className} ${i < count ? "" : "opacity-25"}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
        </svg>
      ))}
    </span>
  );
}

function Reviews({ tone }: { tone: FlowTone }) {
  const [featured, ...rest] = reviews;
  return (
    <FlowGrid className="mt-14 sm:mt-20">
      <div className={`grid gap-10 border-t pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16 lg:pt-14 ${line(tone)}`}>
        <Rise>
          <Stars count={featured.stars} className="size-5" />
          <blockquote className="mt-6 text-[1.7rem] leading-[1.15] font-light tracking-[-0.03em] text-balance sm:text-4xl lg:text-[3.1rem]">
            “{featured.quote}”
          </blockquote>
          <p className={`mt-6 ${EYEBROW} ${muted(tone)}`}>{featured.author}</p>
        </Rise>
        <Rise delay={120} className={`lg:border-l lg:pl-10 ${line(tone)}`}>
          <p className={`${EYEBROW} ${muted(tone)}`}>Google reviews</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-8xl leading-none sm:text-9xl">{site.reviews.score}</p>
          <p className={`mt-3 text-sm leading-relaxed ${muted(tone)}`}>
            Gemiddeld uit {site.reviews.count} reviews · {site.reviews.clients} tevreden klanten sinds {site.founded}.
          </p>
        </Rise>
      </div>
      <ul className={`mt-12 grid border-t sm:mt-16 md:grid-cols-3 ${line(tone)}`}>
        {rest.slice(0, 3).map((r, i) => (
          <li key={r.quote} className={`border-b py-8 md:border-b-0 md:py-10 ${i > 0 ? `md:border-l md:pl-8` : ""} md:pr-8 ${line(tone)}`}>
            <Rise delay={i * 90}>
              <Stars count={r.stars} />
              <p className="mt-4 text-lg leading-snug font-light tracking-[-0.015em]">“{r.quote}”</p>
              <p className={`mt-5 ${EYEBROW} ${muted(tone)}`}>{r.author}</p>
            </Rise>
          </li>
        ))}
      </ul>
    </FlowGrid>
  );
}

/* ------------------------------------------------------------------ */
/* 05 — cases                                                         */
/* ------------------------------------------------------------------ */

function Cases({ tone }: { tone: FlowTone }) {
  const [featured, ...rest] = [cases.find((c) => c.slug === "particulier-sportwagen") ?? cases[0], ...cases.filter((c) => c.slug !== "particulier-sportwagen")];
  return (
    <>
      <FlowGrid className="mt-14 sm:mt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <ClipImage src={featured.image} alt={featured.imageAlt} parallax sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem]" />
          <div>
            <p className={`${EYEBROW} ${muted(tone)}`}>{featured.tag}{featured.route ? ` · ${featured.route}` : ""}</p>
            <h3 className="mt-5 text-3xl leading-[1.06] font-light tracking-[-0.035em] text-balance sm:text-5xl">{featured.title}</h3>
            <p className={`mt-6 text-base leading-relaxed sm:text-lg ${muted(tone)}`}>{featured.body}</p>
            <div className="mt-8">
              <FlowButton href={`/cases/${featured.slug}`} variant="ghost">Lees de case</FlowButton>
            </div>
          </div>
        </div>
      </FlowGrid>
      <div className="mt-16 sm:mt-24">
        <IndexRow items={rest.slice(0, 4).map((c) => ({ title: c.title, body: c.route, meta: c.tag, image: c.image, href: `/cases/${c.slug}` }))} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 06 — knowledge rail under the FAQ                                  */
/* ------------------------------------------------------------------ */

function Knowledge({ tone }: { tone: FlowTone }) {
  return (
    <FlowGrid className="mt-24 sm:mt-32">
      <div className="flex items-end justify-between gap-6">
        <p className={`${EYEBROW} ${muted(tone)}`}>Uit de kennisbank</p>
        <Link href="/blog" className={`inline-flex min-h-11 items-center gap-2 text-sm ${muted(tone)} ${tone === "dark" ? "hover:text-white" : "hover:text-zinc-950"}`}>
          Alle artikels <Arrow />
        </Link>
      </div>
      <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
        {sortedArticles.slice(0, 3).map((a) => (
          <li key={a.slug} className="w-[78%] flex-none snap-start sm:w-auto">
            <Link href={`/blog/${a.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[4/3]">
              <Image src={a.image} alt="" fill sizes="(min-width:640px) 30vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className={`${EYEBROW} text-[10px] text-white/60`}>{a.category}</span>
                <span className="mt-1 block text-xl leading-tight font-light tracking-[-0.02em]">{a.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </FlowGrid>
  );
}
