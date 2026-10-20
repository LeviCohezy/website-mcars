import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Reveal } from "@/components/scroll";
import Section from "@/components/section";
import { ArrowButton, Eyebrow, SectionHeader } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reviews | Mcars",
  description:
    "Wat klanten over Mcars zeggen. Google-beoordeling 4,7 uit 37 reviews — van particulieren en van dealers en bedrijven.",
};

/** Inline gold star row. `count` filled stars out of 5. */
function Stars({ count = 5, className = "size-5" }: { count?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${className} ${i < count ? "text-amber-400" : "text-zinc-300"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
        </svg>
      ))}
    </span>
  );
}

type Review = {
  quote: string;
  author: string;
  segment: "Particulier" | "Autohandelaar";
  stars: number;
};

const reviews: Review[] = [
  {
    quote:
      "Vlotte communicatie van bij de offerte tot de levering. De chauffeur belde de dag zelf om het uur af te spreken en onze wagen kwam perfect aan.",
    author: "K. V. — particulier",
    segment: "Particulier",
    stars: 5,
  },
  {
    quote:
      "Onze klassieker moest naar het buitenland en werd behandeld alsof het hun eigen wagen was. Netjes vastgezet, geen enkel krasje. Absolute aanrader.",
    author: "Particulier",
    segment: "Particulier",
    stars: 5,
  },
  {
    quote:
      "Als garage werken we al jaren met Mcars. Ophaling en levering verlopen stipt, de administratie klopt altijd en de chauffeurs zijn correct.",
    author: "Autohandelaar",
    segment: "Autohandelaar",
    stars: 5,
  },
  {
    quote:
      "Snel antwoord op mijn aanvraag met een duidelijke prijs en planning. Geen verrassingen achteraf. Zo hoort het.",
    author: "D. M. — particulier",
    segment: "Particulier",
    stars: 5,
  },
  {
    quote:
      "Meerdere wagens in één rit laten ophalen op verschillende adressen — alles kwam samen aan zoals afgesproken. Betrouwbare partner voor onze concessie.",
    author: "Dealer / bedrijf",
    segment: "Autohandelaar",
    stars: 5,
  },
  {
    quote:
      "Een niet-rijdende wagen laten transporteren leek me lastig, maar ze trokken hem probleemloos op de oplegger. Vriendelijk en professioneel van begin tot eind.",
    author: "Particulier",
    segment: "Particulier",
    stars: 4,
  },
];

export default function ReviewsPage() {
  const [featured, ...rest] = reviews;
  return (
    <PageShell>
      <PageHero
        eyebrow="Reviews"
        title="Wat klanten over ons zeggen."
        subtitle="Een 4,7 op Google, opgebouwd door particulieren én dealers die hun wagen aan ons toevertrouwden."
        crumbs={[{ label: "Reviews" }]}
        image="/fleet/spain-palms.jpg"
        badges={[{ label: `${site.reviews.score} / 5 op Google` }, { label: `${site.reviews.clients} klanten` }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Rating */}
      <Section space="loose">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Google-beoordeling</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-20">
            <Reveal>
              <p className="text-[7rem] leading-[0.85] font-light tracking-[-0.05em] text-zinc-950 sm:text-[10rem]">{site.reviews.score}</p>
              <div className="mt-6 flex items-center gap-4">
                <Stars count={5} />
                <span className="text-sm text-zinc-500">{site.reviews.count} reviews</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-md text-lg leading-relaxed text-zinc-500">
                Onze beoordelingen worden live via Google bijgewerkt. Hieronder een representatieve greep uit wat klanten schrijven.
              </p>
              <div className="mt-8">
                <ArrowButton href="https://www.google.com/search?q=Mcars+Roeselare+reviews">Bekijk op Google</ArrowButton>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Featured quote */}
      <Section space="none" bleed>
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
          <figure className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-10">
            <div>
              <Stars count={featured.stars} className="size-4" />
            </div>
            <div>
              <Reveal>
                <blockquote className="max-w-4xl text-3xl font-light leading-[1.2] tracking-[-0.025em] text-balance text-white sm:text-4xl lg:text-5xl">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
              </Reveal>
              <figcaption className="mt-10 flex items-center gap-4 border-t border-white/15 pt-6 text-sm">
                <span className="font-medium text-white">{featured.author}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </Section>

      {/* All quotes */}
      <Section space="loose">
        <SectionHeader
          label="Klantquotes"
          index={String(reviews.length).padStart(2, "0")}
          lead="Van particulieren"
          trail="en van dealers en bedrijven."
          className="mb-16"
        />
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((r, i) => (
            <Reveal key={r.quote} delay={(i % 3) * 80}>
              <figure className="flex h-full flex-col border-t border-zinc-950 pt-6">
                <div className="flex items-center justify-between">
                  <Stars count={r.stars} className="size-3.5" />
                  <span className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">{r.segment}</span>
                </div>
                <blockquote className="mt-8 flex-1 text-lg leading-relaxed tracking-tight text-zinc-800">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-8 text-sm font-medium text-zinc-950">{r.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-16 text-sm text-zinc-400">
          De weergegeven reacties zijn geanonimiseerd. De actuele reviews worden live via Google bijgewerkt.
        </p>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
