import type { Metadata } from "next";
import { QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { ArrowButton, Eyebrow, SplitHeading } from "@/components/ui";
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
  return (
    <PageShell>
      <PageHero
        eyebrow="Reviews"
        title="Wat klanten over ons zeggen."
        subtitle="Een 4,7 op Google, opgebouwd door particulieren én dealers die hun wagen aan ons toevertrouwden."
        crumbs={[{ label: "Reviews" }]}
        image="/services/05.jpg"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Google rating summary */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-6 rounded-[2rem] bg-zinc-100 p-8 sm:p-12 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="text-center sm:text-left">
              <p className="font-[family-name:var(--font-display)] text-6xl leading-none tracking-wide text-zinc-950">
                {site.reviews.score}
              </p>
              <div className="mt-3">
                <Stars count={5} />
              </div>
              <p className="mt-2 text-sm text-zinc-500">{site.reviews.count} Google reviews</p>
            </div>
          </div>
          <div className="lg:justify-self-end lg:text-right">
            <p className="max-w-md text-base leading-relaxed text-zinc-500">
              Onze beoordelingen worden live via Google getoond en werken zichzelf continu bij.
              De quotes hieronder geven een representatief beeld van wat klanten schrijven.
            </p>
            <div className="mt-6 lg:flex lg:justify-end">
              <ArrowButton
                href="https://www.google.com/search?q=Mcars+Roeselare+reviews"
                variant="dark"
              >
                Bekijk op Google
              </ArrowButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>Klantquotes</Eyebrow>
            <SplitHeading className="mt-6" lead="Beoordelingen van particulieren" trail="en van dealers en bedrijven." />
          </div>
          <p className="text-base leading-relaxed text-zinc-500">
            Van één zorgeloos vervoerde gezinswagen tot volledige transporten voor garages —
            hieronder een greep uit de reacties.
          </p>
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {reviews.map((r) => (
            <figure
              key={r.quote}
              className="flex flex-col rounded-3xl bg-zinc-100 p-7"
            >
              <div className="flex items-center justify-between">
                <Stars count={r.stars} className="size-4" />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                  {r.segment}
                </span>
              </div>
              <blockquote className="mt-5 text-base leading-relaxed text-zinc-700">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-medium text-zinc-950">{r.author}</figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-sm text-zinc-400">
          De weergegeven reacties zijn geanonimiseerd. De actuele reviews worden live via Google
          bijgewerkt.
        </p>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
