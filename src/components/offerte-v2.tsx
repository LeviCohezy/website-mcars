import { offerteFaq, offerteReassurance, offerteSteps, priceFactors } from "@/data/pricing";
import { site } from "@/lib/site";
import { FaqAccordion } from "./blocks";
import QuoteMultistep from "./quote-multistep";
import { Reveal } from "./scroll";
import { HoverRevealList, TypeMarquee } from "./signature";
import { V2Block, V2Button, V2Check, V2Head, V2Hero } from "./v2-kit";

/*
 * Offerte 02 — "Licht & strak". White Swiss grid around the existing multistep
 * quote form: reassurance cells under the hero, step cells beside the form,
 * the price factors as a large index with hover photos, a running word band
 * and a boxed FAQ.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** One photo per price factor, in the order of priceFactors. */
const FACTOR_IMAGES = [
  "/images/generated/aerial-motorway.jpg",
  "/images/generated/dealer-loading.jpg",
  "/images/generated/nonrunning-winch.jpg",
  "/fleet/city-loaded.jpg",
  "/images/generated/night-motorway.jpg",
  "/images/generated/alpine-pass.jpg",
];


export default function OfferteV2() {
  return (
    <div className="bg-white text-zinc-950">
      <V2Hero
        crumbs={[{ href: "/", label: "Home" }, { label: "Offerte aanvragen" }]}
        title="Vraag uw prijs aan."
        count="24u"
        intro="Geen calculator, geen automatische mail: wij bekijken elke aanvraag zelf en sturen u binnen 24 uur prijs en planning."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#offerte" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
            Start uw aanvraag ↓
          </a>
          <V2Button href="/contact" variant="outline">Liever contact opnemen?</V2Button>
        </div>
      </V2Hero>

      {/* Reassurance cells */}
      <section className="px-5 sm:px-12 lg:px-16">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
          {offerteReassurance.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 70} className="flex flex-col gap-4 bg-white p-6 sm:p-8">
              <V2Check />
              <span>
                <span className="block text-lg font-medium tracking-tight">{r.title}</span>
                <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-zinc-500">{r.body}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* The quote form, with step cells as its aside */}
      <div className="sm:px-4 lg:px-8">
        <QuoteMultistep
          aside={
            <div className="flex flex-col gap-10">
              <div className="border-t border-zinc-950 pt-6">
                <p className="flex gap-3 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
                  <span className="text-zinc-950">01</span>Uw aanvraag
                </p>
                <h2 className="mt-6 max-w-xl text-3xl leading-[1.08] font-medium tracking-[-0.025em] text-balance sm:text-4xl lg:text-5xl">
                  Drie korte stappen. <span className="text-zinc-400">Wij doen de rest.</span>
                </h2>
              </div>
              <ol className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200">
                {offerteSteps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-4 bg-white p-6 sm:grid-cols-[5rem_1fr]">
                    <span className="text-4xl leading-none font-medium tracking-[-0.05em] text-zinc-200 tabular-nums sm:text-5xl">{pad(i + 1)}</span>
                    <span>
                      <span className="block text-lg font-medium tracking-tight">{s.title}</span>
                      <span className="mt-1 block text-[0.95rem] leading-relaxed text-zinc-500">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
                <a href={site.phoneHref} className="flex min-h-11 flex-col bg-white p-5 transition-colors hover:bg-zinc-50">
                  <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Liever bellen?</span>
                  <span className="mt-2 font-medium tracking-tight">{site.phone}</span>
                </a>
                <a href={`mailto:${site.email}`} className="flex min-h-11 flex-col bg-white p-5 transition-colors hover:bg-zinc-50">
                  <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Liever mailen?</span>
                  <span className="mt-2 font-medium tracking-tight break-words">{site.email}</span>
                </a>
              </div>
            </div>
          }
        />
      </div>

      {/* Price factors — bordered grid */}
      <V2Block>
        <V2Head
          index="02"
          label="Wat bepaalt de prijs?"
          lead="Elke rit is anders."
          trail="Dit weegt mee in uw offerte."
          intro="We rekenen geen vaste tarieven af. Uw prijs stellen we handmatig samen op basis van deze factoren — zo klopt hij voor uw specifieke transport."
        />
        <HoverRevealList tone="light" items={priceFactors.map((f, i) => ({ title: f.title, body: f.body, image: FACTOR_IMAGES[i % FACTOR_IMAGES.length] }))} />
        <Reveal className="mt-px flex flex-col items-start justify-between gap-4 rounded-lg bg-zinc-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <p className="text-lg">Hoe vollediger uw aanvraag, hoe scherper we uw prijs kunnen bepalen.</p>
          <a href="#offerte" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Naar het formulier ↑
          </a>
        </Reveal>
      </V2Block>

      {/* Running band into the FAQ */}
      <section aria-label="Persoonlijk antwoord binnen 24 uur" className="py-6 sm:py-10">
        <TypeMarquee words={["Persoonlijk", "Binnen 24 uur", "Geen calculator"]} images={["/fleet/depot-dusk.jpg", "/images/generated/key-handover.jpg", "/fleet/countryside-highway.jpg"]} />
      </section>

      {/* FAQ — boxed accordion beside contact */}
      <V2Block>
        <V2Head index="03" label="Veelgestelde vragen" lead="Over uw offerte." trail="Kort uitgelegd." />
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Reveal className="order-last lg:order-none">
            <p className="text-sm text-zinc-500">Niet zeker welke gegevens u nodig heeft?</p>
            <a href={site.phoneHref} className="mt-3 block text-2xl font-medium tracking-tight hover:underline">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="mt-1 block text-zinc-600 hover:text-zinc-950">{site.email}</a>
            <p className="mt-4 text-sm text-zinc-400">{site.hours}</p>
            <div className="mt-6">
              <V2Button href="/faq" variant="outline">Alle vragen</V2Button>
            </div>
          </Reveal>
          <div className="rounded-lg border border-zinc-200 px-5 sm:px-6 [&>div]:border-t-0 [&>div>div:last-child]:border-b-0">
            <FaqAccordion items={offerteFaq} />
          </div>
        </div>
      </V2Block>
    </div>
  );
}
