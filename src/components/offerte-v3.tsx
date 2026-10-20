import { offerteFaq, offerteReassurance, offerteSteps, priceFactors } from "@/data/pricing";
import { site } from "@/lib/site";
import { DarkAccordion } from "./faq-v3";
import QuoteMultistep from "./quote-multistep";
import { Reveal } from "./scroll";
import { HorizontalRail, MosaicGallery } from "./signature";
import { V3Block, V3Button, V3Head, V3Hero, V3Page, V3Star, V3Tick } from "./v3-kit";

/*
 * Offerte 03 — "Donker & premium". Cinematic hero with a stats row, then a
 * dark band that holds the multistep quote form inline (its first step is the
 * quick quote: addresses + date), the price factors as a sideways photo rail,
 * a photo mosaic behind the quote and a dark FAQ.
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


export default function OfferteV3() {
  return (
    <V3Page>
      <V3Hero
        image="/fleet/depot-wet.jpg"
        crumbs={[{ href: "/", label: "Home" }, { label: "Offerte aanvragen" }]}
        title="Vraag uw prijs aan."
        intro="Geen calculator, geen automatische mail: wij bekijken elke aanvraag zelf en sturen u binnen 24 uur prijs en planning."
      >
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#offerte" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
            Start uw aanvraag ↓
          </a>
          <V3Button href="/contact" variant="ghost">Liever contact opnemen?</V3Button>
        </div>
        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-3 border-t border-white/10 text-left">
          {[
            { v: "24u", k: "persoonlijk antwoord" },
            { v: site.reviews.clients, k: "klanten" },
            { v: site.reviews.score, k: "op Google", star: true },
          ].map((s, i) => (
            <div key={s.k} className={`flex flex-col-reverse pt-6 ${i > 0 ? "border-l border-white/10 pl-4 sm:pl-8" : "pr-4"}`}>
              <dt className="mt-2 flex items-center gap-1.5 text-xs text-white/50 sm:text-sm">{s.star && <V3Star />}{s.k}</dt>
              <dd className="text-3xl font-light tracking-[-0.04em] tabular-nums sm:text-5xl lg:text-6xl">{s.v}</dd>
            </div>
          ))}
        </dl>
      </V3Hero>

      {/* Dark band with the quote form inline */}
      <section className="px-2 pt-8 sm:px-6 sm:pt-12">
        <div className="rounded-[1.5rem] border border-white/10 bg-zinc-900">
          <QuoteMultistep
            aside={
              <div className="flex flex-col justify-between gap-12">
                <div>
                  <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
                    <span aria-hidden className="h-px w-6 bg-white/40" />
                    Uw aanvraag
                  </p>
                  <h2 className="mt-6 max-w-xl text-4xl leading-[1.04] font-light tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                    Drie korte stappen. <span className="text-white/35">Wij doen de rest.</span>
                  </h2>
                </div>
                <ol>
                  {offerteSteps.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-white/10 py-6 sm:grid-cols-[5rem_1fr]">
                      <span className="font-[family-name:var(--font-display)] text-5xl leading-none text-white/20">{pad(i + 1)}</span>
                      <span>
                        <span className="block text-xl font-medium tracking-tight">{s.title}</span>
                        <span className="mt-1 block text-[0.95rem] leading-relaxed text-white/55">{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <ul className="flex flex-col gap-3">
                  {offerteReassurance.map((r) => (
                    <li key={r.title} className="flex items-start gap-3 text-[0.95rem] text-white/75">
                      <V3Tick /> <span><span className="font-medium text-white">{r.title}</span> — {r.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </div>
      </section>

      {/* Price factors — cards travelling sideways while you scroll */}
      <section className="px-5 pt-20 sm:px-10 sm:pt-32 lg:px-14">
        <V3Head
          label="Wat bepaalt de prijs?"
          lead="Elke rit is anders."
          trail="Dit weegt mee in uw offerte."
          intro="We rekenen geen vaste tarieven af. Uw prijs stellen we handmatig samen op basis van deze factoren."
        />
        <HorizontalRail
          items={priceFactors.map((f, i) => ({ title: f.title, body: f.body, image: FACTOR_IMAGES[i % FACTOR_IMAGES.length], meta: pad(i + 1) }))}
        />
      </section>

      {/* A look behind the quote */}
      <V3Block>
        <MosaicGallery
          tone="dark"
          images={[
            { title: "Ons depot", image: "/images/generated/depot-night.jpg", alt: "Het depot van Mcars in Roeselare bij nacht" },
            { title: "Planning", image: "/images/generated/planning-office.jpg", alt: "Een planner van Mcars aan het werk" },
            { title: "Ophaling", image: "/images/generated/pickup-inspection.jpg", alt: "Controle van een wagen bij ophaling" },
            { title: "Levering", image: "/images/generated/key-handover.jpg", alt: "Overhandiging van de sleutels" },
          ]}
          figure={{ value: "24u", label: "Persoonlijk antwoord", body: "Geen calculator: een planner stelt uw prijs samen." }}
        />
      </V3Block>

      {/* FAQ */}
      <V3Block className="bg-zinc-900">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <V3Head label="Veelgestelde vragen" lead="Over uw offerte." trail="Kort uitgelegd." />
            <Reveal className="-mt-6 text-white/60">
              Niet zeker welke gegevens u nodig heeft? Bel{" "}
              <a href={site.phoneHref} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.phone}</a>
              {" "}of mail{" "}
              <a href={`mailto:${site.email}`} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{site.email}</a>.
            </Reveal>
            <div className="mt-8">
              <V3Button href="/faq" variant="ghost">Alle vragen</V3Button>
            </div>
          </div>
          <DarkAccordion items={offerteFaq} />
        </div>
      </V3Block>
    </V3Page>
  );
}
