import Image from "next/image";
import Link from "next/link";
import type { Faq, Highlight, IconKey } from "@/data/services";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { FaqAccordion } from "./blocks";
import Icon from "./icon";
import { Marquee, Parallax, Reveal } from "./scroll";
import { ChecklistTabs } from "./service-sections-interactive";
import { ArrowChip, Eyebrow } from "./ui";

/*
 * Sections for the service-page template (/diensten/[slug]). Each one has its
 * own shape on purpose — photo panel, pinned story, bento, checklist, film,
 * overlapping cards, cinematic case — so the page doesn't read as five identical ruled lists.
 */

/** Dark photo panel with the highlights as white cards resting on the image. */
export function HighlightPanel({
  image,
  alt,
  label,
  lead,
  trail,
  items,
}: {
  image: string;
  alt: string;
  label: string;
  lead: string;
  trail?: string;
  items: Highlight[];
}) {
  return (
    <section className="relative flex min-h-[86vh] flex-col overflow-hidden rounded-[2rem] bg-zinc-950">
      <Parallax speed={0.06} className="absolute inset-x-0 -top-[15%] h-[130%]">
        <div role="img" aria-label={alt} className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${asset(image)})` }} />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/75 via-zinc-950/20 to-zinc-950/70" />

      <div className="relative z-10 flex flex-1 flex-col px-5 pt-12 pb-5 sm:px-10 sm:pt-16 sm:pb-8 lg:px-14">
        <Reveal>
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-white" />
            {label}
          </p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-[1.04] tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
            {lead} {trail && <span className="text-white/50">{trail}</span>}
          </h2>
        </Reveal>

        <div className={`mt-auto grid gap-3 pt-24 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""}`}>
          {items.map((h, i) => (
            <Reveal key={h.title} delay={i * 90} className="flex flex-col rounded-[1.5rem] bg-white/95 p-6 backdrop-blur-xl sm:min-h-60 sm:p-7">
              <div className="flex items-center justify-between text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex size-10 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <Icon name={h.icon} className="size-[1.1rem]" />
                </span>
              </div>
              <h3 className="mt-auto pt-6 text-xl sm:pt-10 font-medium tracking-tight text-zinc-950 sm:text-2xl">{h.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{h.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * "Inbegrepen": one full-bleed film with the promises as glass cards on top
 * and the vehicle types drifting past along the bottom.
 */
export function ExpectBento({
  benefits,
  vehicleTypes,
  video = "/hero.mp4",
  caption,
}: {
  benefits: string[];
  vehicleTypes: string[];
  video?: string;
  caption: string;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-zinc-950">
      <video aria-hidden className="absolute inset-0 -z-10 size-full object-cover opacity-70" src={asset(video)} autoPlay muted loop playsInline />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(9_9_11/0.92),rgb(9_9_11/0.55)_45%,rgb(9_9_11/0.25))]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/40" />

      <div className="grid gap-12 px-6 pt-14 pb-12 sm:px-10 sm:pt-20 lg:min-h-[36rem] lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16 lg:px-14 lg:pt-32 lg:pb-16">
        <Reveal className="flex flex-col">
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/50 uppercase">
            <span aria-hidden className="size-1.5 flex-none rounded-full bg-white" />
            Inbegrepen
          </p>
          <h2 className="mt-6 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-4xl lg:text-[3.25rem]">
            Wat u van ons <span className="text-white/40">mag verwachten.</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-white/60">{caption}</p>
          <Link
            href="/reviews"
            className="group mt-10 inline-flex items-center gap-4 self-start rounded-2xl bg-white/10 py-3 pr-3 pl-5 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/15"
          >
            <span className="flex items-center gap-1.5 text-2xl font-medium tracking-tight text-white">
              {site.reviews.score}<span className="text-base font-normal text-white/50">/5</span>
              <svg className="size-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.8L12 17.3 5.9 20.7l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>
            </span>
            <span className="text-sm text-white/60">{site.reviews.count} reviews op Google</span>
            <ArrowChip />
          </Link>
        </Reveal>

        <ul className="grid content-end gap-3 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <Reveal
              as="li"
              key={b}
              delay={i * 70}
              className="flex flex-col justify-between gap-6 rounded-[1.25rem] bg-white/[0.07] p-5 ring-1 ring-white/12 backdrop-blur-md transition-colors hover:bg-white/[0.12]"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950">
                  <Icon name="check" className="size-4" />
                </span>
                <span className="text-xs font-medium text-white/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="text-base leading-snug font-medium text-white">{b}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* What we carry — drifting past */}
      <div className="border-t border-white/10 py-6">
        <p className="sr-only">Wij vervoeren: {vehicleTypes.join(", ")}</p>
        <Marquee
          items={vehicleTypes}
          separator={<Icon name="car" className="size-6" />}
          className="text-2xl font-medium tracking-tight text-white/80 sm:text-4xl [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        />
      </div>
    </div>
  );
}

/** FAQ beside a sticky dark contact card — the fallback when the answer isn't listed. */
export function FaqWithContact({ lead, trail, items }: { lead: string; trail?: string; items: Faq[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
      {/* On mobile the card follows the questions; on desktop it sits left. */}
      <div className="order-last lg:sticky lg:top-28 lg:order-none lg:self-start">
        <Reveal className="rounded-[1.5rem] bg-zinc-950 p-7 text-white sm:p-8">
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-white/60 uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-white" />
            Persoonlijk antwoord
          </p>
          <p className="mt-6 text-2xl font-light leading-snug tracking-tight">
            Staat uw vraag er niet bij? Bel ons gerust.
          </p>
          <a href={site.phoneHref} className="group mt-8 flex items-center justify-between gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            {site.phone}
            <ArrowChip tone="dark" />
          </a>
          <a href={`mailto:${site.email}`} className="mt-3 flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/60">
            {site.email}
          </a>
          <p className="mt-6 text-sm text-white/50">{site.hours}</p>
        </Reveal>
      </div>
      <div>
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
            {lead} {trail && <span className="text-zinc-400">{trail}</span>}
          </h2>
        </Reveal>
        <div className="mt-12">
          <FaqAccordion items={items} />
        </div>
      </div>
    </div>
  );
}

export type RelatedCard = { href: string; label: string; meta: string; image: string; sub?: string };

/** Related services and routes as photo cards instead of a ruled list. */
export function RelatedCards({ items }: { items: RelatedCard[] }) {
  const cols = items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${cols}`}>
      {items.map((it, i) => (
        <Reveal as="li" key={it.href} delay={i * 70}>
          <Link href={it.href} className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[1.5rem] bg-zinc-950 sm:aspect-[3/4]">
            <Image
              src={it.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-80 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.05]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-zinc-950/30" />
            <span className="relative m-5 self-start rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-xl">
              {it.meta}
            </span>
            <div className="relative mt-auto flex items-end justify-between gap-4 p-6">
              <div>
                <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">{it.label}</h3>
                {it.sub && <p className="mt-1.5 text-sm leading-relaxed text-white/65">{it.sub}</p>}
              </div>
              <ArrowChip />
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────────────
   Practical sections. Deliberately plain for now — each one gets
   its own design in a later pass.
   ───────────────────────────────────────────────────────────── */

type Item = { title: string; body: string };

/** Pick a line icon for a price factor from its title. */
function factorIcon(title: string, i: number): IconKey {
  const t = title.toLowerCase();
  if (t.includes("afstand") || t.includes("traject") || t.includes("route")) return "route";
  if (t.includes("type") || t.includes("voertuig") || t.includes("model")) return "car";
  if (t.includes("rijd") || t.includes("staat") || t.includes("rol")) return "wrench";
  if (t.includes("depot") || t.includes("adres") || t.includes("locatie")) return "map";
  if (t.includes("planning") || t.includes("spoed") || t.includes("datum") || t.includes("tijd")) return "clock";
  if (t.includes("aantal") || t.includes("wagens") || t.includes("vloot")) return "truck";
  if (t.includes("land") || t.includes("grens") || t.includes("europa")) return "globe";
  return (["box", "spark", "shield"] as const)[i % 3];
}

/**
 * "Wat bepaalt de prijs" as a bento: one dark hero cell with the promise and
 * the CTA, the factors as icon tiles, and the saving tips as a wide card.
 */
export function PriceSection({ factors, tips }: { factors: Item[]; tips: string[] }) {
  return (
    <div className="grid grid-flow-dense gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Reveal className="relative isolate flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-zinc-950 p-7 text-white sm:col-span-2 sm:p-9 lg:row-span-2">
        <Image src="/fleet/depot-wet.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
        <span className="self-start rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-[0.18em] text-white/80 uppercase ring-1 ring-white/15 backdrop-blur-md">
          Maatwerk
        </span>
        <div>
          <p className="max-w-md text-3xl leading-[1.1] font-medium tracking-tight sm:text-4xl">
            Een eerlijke prijs, <span className="text-white/45">binnen 24 uur in uw mailbox.</span>
          </p>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white/60">
            Een mens van ons team bekijkt uw aanvraag. Wat u in de offerte ziet, betaalt u — geen verrassingen achteraf.
          </p>
          <a href="#prijs" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Prijs aanvragen
            <ArrowChip tone="dark" />
          </a>
        </div>
      </Reveal>

      {factors.map((f, i) => (
        <Reveal
          key={f.title}
          delay={(i % 4) * 60}
          className="group flex flex-col rounded-[1.75rem] bg-zinc-100 p-6 transition-colors duration-300 hover:bg-zinc-950"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-zinc-950 transition-transform duration-300 group-hover:-rotate-6">
              <Icon name={factorIcon(f.title, i)} className="size-5" />
            </span>
            <span className="text-xs font-medium text-zinc-400 tabular-nums transition-colors group-hover:text-white/40">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-8 text-lg font-medium tracking-tight text-zinc-950 transition-colors group-hover:text-white">{f.title}</h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-zinc-500 transition-colors group-hover:text-white/60">{f.body}</p>
        </Reveal>
      ))}

      {tips.length > 0 && (
        <Reveal className="rounded-[1.75rem] p-7 ring-1 ring-zinc-200 sm:col-span-2 sm:p-8">
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
            <Icon name="spark" className="size-4 text-zinc-950" />
            Zo bespaart u
          </p>
          <ol className="mt-6 flex flex-col divide-y divide-zinc-200">
            {tips.map((t, i) => (
              <li key={t} className="flex items-start gap-5 py-4 first:pt-0 last:pb-0">
                <span className="text-2xl leading-none font-medium tracking-tight text-zinc-300 tabular-nums">{i + 1}</span>
                <span className="text-[0.95rem] leading-relaxed text-zinc-700">{t}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      )}
    </div>
  );
}

/** "Wat we van u nodig hebben": a tick-off checklist per moment. */
export function NeedsSection({ needs }: { needs: { aanvraag: string[]; documenten: string[]; dagZelf: string[] } }) {
  return (
    <ChecklistTabs
      cols={[
        { title: "Bij de aanvraag", items: needs.aanvraag },
        { title: "Documenten", items: needs.documenten },
        { title: "Op de dag zelf", items: needs.dagZelf },
      ]}
    />
  );
}

/** Depannage variant: "Wat te doen bij pech". */
export function BreakdownSection() {
  return (
    <ChecklistTabs
      doneTitle="Hulp is onderweg."
      cols={[
        { title: "1 · Eerst veilig", items: ["Zet de wagen zo veilig mogelijk aan de kant en zet de alarmlichten aan.", "Trek een fluohesje aan en plaats de gevarendriehoek.", "Wacht achter de vangrail, niet in of naast de wagen."] },
        { title: "2 · Bel ons", items: ["Geef de exacte locatie door (straat, afrit of kilometerpaal).", "Vertel welk voertuig het is en wat er scheelt.", "Zeg waar de wagen naartoe moet."] },
        { title: "3 · Wij komen", items: ["U krijgt meteen een eerlijk antwoord over wanneer we er kunnen zijn.", "We laden de wagen veilig op met de lier.", "We brengen hem naar uw garage, naar huis of naar ons depot."] },
      ]}
    />
  );
}

/**
 * "Vloot & veiligheid": a wide photograph with the facts as cards overlapping
 * its bottom edge. Facts that start with a number ("9 eigen transporters")
 * lead with that number; the service's own focus point is the dark card.
 */
export function SafetySection({ items, image }: { items: Item[]; image: string }) {
  return (
    <div>
      <Reveal className="relative isolate h-[22rem] overflow-hidden rounded-[2rem] bg-zinc-950 sm:h-[28rem] lg:h-[34rem]">
        <Parallax speed={0.08} className="absolute -inset-y-16 inset-x-0 -z-10">
          <Image src={image} alt="Een transporter van Mcars" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950/60 via-transparent to-zinc-950/30" />
        <p className="max-w-xl p-7 text-2xl leading-[1.15] font-medium tracking-tight text-white sm:p-10 sm:text-4xl">
          Eigen vloot. Vaste chauffeurs. <span className="text-white/55">Geen onderaannemers.</span>
        </p>
      </Reveal>
      <ul className="relative z-10 -mt-16 grid gap-3 px-3 sm:-mt-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((s, i) => {
          const m = s.title.match(/^(\d+)\s+(.*)$/);
          const dark = i === 0;
          return (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 70}
              className={`flex flex-col rounded-[1.5rem] p-6 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)] ${dark ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}`}
            >
              {m ? (
                <p className="text-6xl leading-none font-medium tracking-tighter tabular-nums">{m[1]}</p>
              ) : (
                <span className={`flex size-12 items-center justify-center rounded-2xl ${dark ? "bg-white text-zinc-950" : "bg-zinc-100"}`}>
                  <Icon name={i === 0 ? "spark" : "shield"} className="size-6" />
                </span>
              )}
              <h3 className="mt-6 text-lg font-medium tracking-tight">{m ? m[2].charAt(0).toUpperCase() + m[2].slice(1) : s.title}</h3>
              <p className={`mt-2 text-[0.92rem] leading-relaxed ${dark ? "text-white/60" : "text-zinc-500"}`}>{s.body}</p>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

/** "Uit de praktijk": the matching customer case as one cinematic card. */
export function PracticeCase({ item }: { item: { tag: string; title: string; body: string; image: string } }) {
  return (
    <Reveal className="group relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-zinc-950 sm:min-h-[38rem]">
      <Image
        src={item.image}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(9_9_11/0.95),rgb(9_9_11/0.55)_45%,rgb(9_9_11/0.1))]" />
      <span className="absolute top-6 left-6 rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white uppercase ring-1 ring-white/20 backdrop-blur-md sm:top-8 sm:left-8">
        Case · {item.tag}
      </span>
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16 lg:p-14">
        <h3 className="text-3xl leading-[1.05] font-medium tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl">{item.title}</h3>
        <div className="rounded-[1.5rem] bg-zinc-950/55 p-6 ring-1 ring-white/10 backdrop-blur-xl sm:p-7">
          <p className="text-base leading-relaxed text-white/80">{item.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cases" className="group/btn inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
              Meer cases bekijken
              <ArrowChip tone="dark" />
            </Link>
            <a href="#prijs" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium text-white ring-1 ring-white/30 transition-colors hover:bg-white/10">
              Prijs aanvragen
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Overview: small label left, the service statement right, then three cards —
 * a dark figure card, a photo card with "Voor wie" and a light card with a
 * promise and tags.
 */
export function OverviewCards({
  intro,
  audience,
  image,
  imageAlt,
  stats,
}: {
  intro: string;
  audience: string;
  image: string;
  imageAlt: string;
  stats?: { value: string; label: string }[];
}) {
  const figures: { value: string; label: string; pill?: string }[] = stats && stats.length > 0 ? stats : [
    { value: site.reviews.clients, label: "tevreden klanten" },
    { value: String(site.founded), label: "actief sinds", pill: `Actief sinds ${site.founded}` },
  ];
  const [main, ...rest] = figures;
  const tags = ["#verzekerd", "#CMR", "#eigenvloot", "#vastechauffeurs"];
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
        <Reveal><p className="text-sm text-zinc-500">Overzicht</p></Reveal>
        <Reveal>
          <p className="text-2xl leading-[1.3] font-light tracking-[-0.02em] text-pretty text-zinc-950 sm:text-3xl lg:text-[2.4rem] lg:leading-[1.22]">{intro}</p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {/* Figure */}
        <Reveal className="flex min-h-[17rem] flex-col rounded-2xl bg-zinc-950 p-7 text-white md:min-h-[22rem]">
          <div className="flex items-start justify-between">
            <p className="text-sm text-white/50">Mcars in cijfers</p>
            <span className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <Icon name="truck" className="size-5" />
            </span>
          </div>
          {rest[0] && (
            <span className="mt-auto self-start rounded-full border border-white/20 px-3.5 py-1 text-sm text-white/70">
              {rest[0].pill ?? `${rest[0].value} ${rest[0].label}`}
            </span>
          )}
          <p className={`text-6xl font-light tracking-[-0.04em] tabular-nums sm:text-7xl ${rest[0] ? "mt-4" : "mt-auto"}`}>{main.value}</p>
          <p className="mt-2 text-lg text-white/70">{main.label}</p>
        </Reveal>

        {/* Photo + audience */}
        <Reveal delay={90} className="relative flex min-h-[19rem] flex-col overflow-hidden rounded-2xl bg-zinc-950 p-7 text-white md:min-h-[22rem]">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
          <span className="relative flex size-11 items-center justify-center self-end rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
            <Icon name="users" className="size-5" />
          </span>
          <div className="relative mt-auto">
            <h3 className="text-2xl font-medium tracking-tight">Voor wie</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-white/80">{audience}</p>
          </div>
        </Reveal>

        {/* Promise + tags */}
        <Reveal delay={180} className="flex min-h-[15rem] flex-col rounded-2xl bg-zinc-100 p-7 md:min-h-[22rem]">
          <p className="text-2xl leading-snug tracking-tight text-zinc-950">
            Persoonlijk antwoord binnen 24 uur — van iemand van ons team, niet van een calculator.
          </p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-8">
            {tags.map((t) => (
              <li key={t} className="rounded-full bg-zinc-200/80 px-4 py-2 text-sm text-zinc-700">{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
