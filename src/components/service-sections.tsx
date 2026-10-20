import Image from "next/image";
import Link from "next/link";
import type { Faq, Highlight, ProcessStep } from "@/data/services";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { FaqAccordion } from "./blocks";
import Icon from "./icon";
import { Parallax, Reveal } from "./scroll";
import { ArrowChip, Eyebrow } from "./ui";

/*
 * Sections for the service-page template (/diensten/[slug]). Each one has its
 * own shape on purpose — photo panel, vertical rail, bento, contact card,
 * image cards — so the page doesn't read as five identical ruled lists.
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

/** Process as a vertical rail, with a sticky heading and a CTA back to the hero form. */
export function StepsRail({
  label,
  lead,
  trail,
  intro,
  steps,
  ctaHref = "#prijs",
}: {
  label: string;
  lead: string;
  trail?: string;
  intro?: string;
  steps: ProcessStep[];
  ctaHref?: string;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Reveal>
          <Eyebrow>{label}</Eyebrow>
          <h2 className="mt-6 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
            {lead} {trail && <span className="text-zinc-400">{trail}</span>}
          </h2>
          {intro && <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-500">{intro}</p>}
          <a
            href={ctaHref}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pr-2 pl-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Prijs aanvragen
            <ArrowChip />
          </a>
        </Reveal>
      </div>

      <ol className="relative">
        <span aria-hidden className="absolute top-3 bottom-3 left-[1.1875rem] w-px bg-zinc-200" />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 90} className="relative flex gap-6 pb-12 last:pb-0 sm:gap-8">
            <span className="relative z-10 flex size-10 flex-none items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-medium tabular-nums text-zinc-950">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-1.5">
              <h3 className="text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl">{s.title}</h3>
              <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-zinc-500 sm:text-base">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/** "What to expect" as a bento on a muted panel: checklist · film · tiles. */
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
    <div className="rounded-[2rem] bg-zinc-100 p-3 sm:p-4">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.15fr_1fr_0.95fr]">
        {/* Checklist */}
        <Reveal className="flex flex-col rounded-[1.5rem] bg-white p-7 sm:p-9">
          <Eyebrow>Inbegrepen</Eyebrow>
          <h2 className="mt-6 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl">
            Wat u van ons <span className="text-zinc-400">mag verwachten.</span>
          </h2>
          <ul className="mt-10 flex flex-col gap-4 lg:mt-auto lg:pt-12">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3.5 text-base text-zinc-800">
                <span className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-full bg-zinc-950 text-white">
                  <Icon name="check" className="size-3.5" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Film */}
        <Reveal delay={90} className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-zinc-950 lg:min-h-[34rem]">
          <video className="absolute inset-0 size-full object-cover opacity-85" src={asset(video)} autoPlay muted loop playsInline />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          <p className="absolute inset-x-6 bottom-6 text-sm leading-relaxed text-white/80">{caption}</p>
        </Reveal>

        {/* Tiles */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
          <Reveal delay={150} className="rounded-[1.5rem] bg-white p-7">
            <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">Wij vervoeren</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {vehicleTypes.map((v) => (
                <li key={v} className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-sm text-zinc-700">{v}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={210}>
            <Link href="/reviews" className="group flex h-full items-center justify-between gap-4 rounded-[1.5rem] bg-zinc-950 p-7 text-white transition-colors hover:bg-zinc-800">
              <span>
                <span className="flex items-center gap-2 text-3xl font-medium tracking-tight">
                  {site.reviews.score}<span className="font-normal text-white/50">/5</span>
                  <svg className="size-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.8L12 17.3 5.9 20.7l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>
                </span>
                <span className="mt-1 block text-sm text-white/60">{site.reviews.count} reviews op Google</span>
              </span>
              <ArrowChip />
            </Link>
          </Reveal>
        </div>
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

/** "Wat bepaalt de prijs": factors (no amounts), saving tips and a CTA. */
export function PriceSection({ factors, tips }: { factors: Item[]; tips: string[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
      <ul className="grid gap-x-10 border-t border-zinc-200 sm:grid-cols-2">
        {factors.map((f) => (
          <Reveal as="li" key={f.title} className="border-b border-zinc-200 py-6">
            <h3 className="text-lg font-medium tracking-tight text-zinc-950">{f.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{f.body}</p>
          </Reveal>
        ))}
      </ul>
      <Reveal className="self-start rounded-[1.5rem] bg-zinc-100 p-7">
        {tips.length > 0 && (
          <>
            <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Zo bespaart u</p>
            <ul className="mt-5 flex flex-col gap-4">
              {tips.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-zinc-700">
                  <Icon name="check" className="mt-1 size-4 flex-none text-zinc-950" />
                  {t}
                </li>
              ))}
            </ul>
          </>
        )}
        <p className={`text-[0.95rem] leading-relaxed text-zinc-700 ${tips.length > 0 ? "mt-6 border-t border-zinc-200 pt-6" : ""}`}>
          Elke prijs is maatwerk. U krijgt binnen 24 uur een persoonlijk antwoord.
        </p>
        <a href="#prijs" className="group mt-6 inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pr-2 pl-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
          Prijs aanvragen
          <ArrowChip />
        </a>
      </Reveal>
    </div>
  );
}

/** "Wat we van u nodig hebben": three columns of what to prepare. */
export function NeedsSection({ needs }: { needs: { aanvraag: string[]; documenten: string[]; dagZelf: string[] } }) {
  const cols = [
    { title: "Bij de aanvraag", items: needs.aanvraag },
    { title: "Documenten", items: needs.documenten },
    { title: "Op de dag zelf", items: needs.dagZelf },
  ];
  return <ChecklistColumns cols={cols} />;
}

/** Depannage variant: "Wat te doen bij pech". */
export function BreakdownSection() {
  const cols = [
    { title: "1 · Eerst veilig", items: ["Zet de wagen zo veilig mogelijk aan de kant en zet de alarmlichten aan.", "Trek een fluohesje aan en plaats de gevarendriehoek.", "Wacht achter de vangrail, niet in of naast de wagen."] },
    { title: "2 · Bel ons", items: ["Geef de exacte locatie door (straat, afrit of kilometerpaal).", "Vertel welk voertuig het is en wat er scheelt.", "Zeg waar de wagen naartoe moet."] },
    { title: "3 · Wij komen", items: ["U krijgt meteen een eerlijk antwoord over wanneer we er kunnen zijn.", "We laden de wagen veilig op met de lier.", "We brengen hem naar uw garage, naar huis of naar ons depot."] },
  ];
  return <ChecklistColumns cols={cols} />;
}

function ChecklistColumns({ cols }: { cols: { title: string; items: string[] }[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {cols.map((c, i) => (
        <Reveal key={c.title} delay={i * 70} className="rounded-[1.5rem] bg-zinc-100 p-7">
          <h3 className="text-lg font-medium tracking-tight text-zinc-950">{c.title}</h3>
          <ul className="mt-5 flex flex-col gap-3.5">
            {c.items.map((it) => (
              <li key={it} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-zinc-700">
                <Icon name="check" className="mt-1 size-4 flex-none text-zinc-950" />
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

/** "Vloot & veiligheid": the service's key safety point first, then the fleet facts. */
export function SafetySection({ items, image, alt = "Een autotransporter van Mcars" }: { items: Item[]; image: string; alt?: string }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-zinc-950">
        <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </Reveal>
      <ul className="grid content-start gap-x-10 border-t border-zinc-200 sm:grid-cols-2">
        {items.map((s) => (
          <Reveal as="li" key={s.title} className="border-b border-zinc-200 py-6">
            <h3 className="text-lg font-medium tracking-tight text-zinc-950">{s.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{s.body}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/** "Uit de praktijk": one matching customer case. */
export function PracticeCase({ item }: { item: { tag: string; title: string; body: string; image: string } }) {
  return (
    <Reveal className="grid overflow-hidden rounded-[1.5rem] border border-zinc-200 lg:grid-cols-2">
      <div className="relative min-h-[18rem] bg-zinc-950">
        <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col p-7 sm:p-10">
        <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{item.tag}</p>
        <h3 className="mt-5 text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">{item.title}</h3>
        <p className="mt-4 text-base leading-relaxed text-zinc-500">{item.body}</p>
        <Link href="/cases" className="mt-auto pt-8 text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950">
          Meer cases bekijken
        </Link>
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
