import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import { Eyebrow, SplitHeading } from "@/components/ui";
import type { Faq } from "@/data/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | Mcars",
  description:
    "Antwoorden op veelgestelde vragen over autotransport: prijzen, verzekering, ophaling en levering, buitenland, niet-rijdende voertuigen, documenten, betaling en spoed.",
};

type Group = { eyebrow: string; title: string; trail: string; items: Faq[] };

const groups: Group[] = [
  {
    eyebrow: "Prijzen",
    title: "Wat kost",
    trail: "een transport?",
    items: [
      {
        q: "Hoe wordt de prijs bepaald?",
        a: "Elke prijs is maatwerk. We kijken naar het ophaal- en leveradres, de afstand, het voertuig (afmetingen en of het rijdt, rolt of geblokkeerd is), open of gesloten transport, spoed of normaal en het land van bestemming. Zo krijgt u altijd een correcte prijs voor uw situatie.",
      },
      {
        q: "Krijg ik meteen een prijs?",
        a: "We rekenen niet met een automatische calculator. Elke aanvraag wordt handmatig bekeken, zodat de prijs klopt. U krijgt binnen 24 uur een persoonlijk antwoord met prijs en planning.",
      },
    ],
  },
  {
    eyebrow: "Verzekering",
    title: "Is mijn wagen",
    trail: "verzekerd?",
    items: [
      {
        q: "Is mijn voertuig tijdens het transport verzekerd?",
        a: "Ja. Uw voertuig is verzekerd tijdens het transport. De CMR-vrachtbrief documenteert bovendien de staat van de wagen bij ophaling, zodat er nadien geen discussie mogelijk is.",
      },
      {
        q: "Wat gebeurt er bij schade?",
        a: "Onze chauffeurs leggen intern de staat van elke wagen vast bij vertrek. Zou er onverhoopt iets gebeuren, dan dient dat bewijs samen met de CMR als basis om alles correct af te handelen.",
      },
    ],
  },
  {
    eyebrow: "Ophaling en levering",
    title: "Ophaling",
    trail: "en levering.",
    items: [
      {
        q: "Word ik verwittigd wanneer de chauffeur langskomt?",
        a: "Zeker. De chauffeur belt u de dag zelf om het ophaalmoment af te stemmen. Bij aankomst op de bestemming bellen we u opnieuw voor de levering.",
      },
      {
        q: "Kan ik mijn wagen ook in het depot afhalen of achterlaten?",
        a: "Dat kan. Ons depot in Roeselare is 24/7 toegankelijk in overleg en vaak voordeliger dan levering aan huis. We bespreken samen wat voor u het handigst is.",
      },
      {
        q: "Kunnen jullie op een afgelegen adres ophalen?",
        a: "Ja. We halen op en leveren zowel in de stad als op meer afgelegen adressen. Het adres is wel een van de factoren die de prijs mee bepalen.",
      },
    ],
  },
  {
    eyebrow: "Buitenland transport",
    title: "Transport",
    trail: "naar het buitenland.",
    items: [
      {
        q: "Naar welke landen rijden jullie?",
        a: "We zijn actief in heel Europa, met onder meer België, Nederland, Frankrijk, Spanje, Duitsland, Italië, Polen en Scandinavië. Wekelijks rijden we over heel Frankrijk tot in Noord-Spanje.",
      },
      {
        q: "Spreken jullie chauffeurs de taal ter plaatse?",
        a: "We hebben zowel Nederlands- als Franstalige chauffeurs. Dat maakt ophaling en levering in binnen- en buitenland vlot en duidelijk.",
      },
    ],
  },
  {
    eyebrow: "Niet-rijdende voertuigen",
    title: "Niet-rijdende",
    trail: "voertuigen.",
    items: [
      {
        q: "Vervoeren jullie ook wagens die niet rijden?",
        a: "Ja. Een wagen die niet meer start of niet meer rijdt, trekken we met een lier (winch) op de oplegger. Waar nodig zetten we een heftruck in. Zo raakt ook een defecte of projectwagen veilig op transport.",
      },
      {
        q: "Wat als de wielen geblokkeerd zijn?",
        a: "Laat het ons weten bij uw aanvraag. Of een wagen rijdt, rolt of geblokkeerd is, bepaalt mee de aanpak en de prijs. We bekijken per situatie de beste en veiligste manier van laden.",
      },
    ],
  },
  {
    eyebrow: "Documenten",
    title: "Welke documenten",
    trail: "heb ik nodig?",
    items: [
      {
        q: "Welke documenten heb ik nodig voor het transport?",
        a: "Voor het transport zelf is de CMR-vrachtbrief het enige nodige document. Die vult de chauffeur bij ophaling in. Ze bewijst dat uw wagen is opgehaald en documenteert de staat bij vertrek.",
      },
      {
        q: "Moet ik zelf iets opmaken?",
        a: "Nee. De CMR wordt door ons verzorgd bij de ophaling. U hoeft vooraf geen documenten op te stellen.",
      },
    ],
  },
  {
    eyebrow: "Betaling",
    title: "Hoe verloopt",
    trail: "de betaling?",
    items: [
      {
        q: "Wanneer en hoe betaal ik?",
        a: "Voor particulieren gebeurt de betaling vóór de ophaling. Bedrijven en handelaars betalen op factuur. Bij uw offerte leggen we duidelijk uit wat voor u van toepassing is.",
      },
      {
        q: "Krijg ik een automatische bevestigingsmail?",
        a: "We werken bewust persoonlijk. U ontvangt geen geautomatiseerde bevestiging, maar wel een concreet antwoord van iemand van ons team met prijs en planning.",
      },
    ],
  },
  {
    eyebrow: "Spoedtransport",
    title: "Dringend",
    trail: "vervoer.",
    items: [
      {
        q: "Kunnen jullie een dringend transport regelen?",
        a: "Vermeld bij uw aanvraag dat het spoed is. We bekijken meteen wat mogelijk is binnen onze planning. Spoed of normaal is een van de factoren die de aanpak en de prijs mee bepalen.",
      },
      {
        q: "Hoe vraag ik een spoedtransport aan?",
        a: "Bel ons gerust rechtstreeks of vraag een offerte aan en geef aan dat het dringend is. Zo kunnen we snel schakelen en u laten weten wat haalbaar is.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title="Veelgestelde vragen."
        subtitle="De meest gestelde vragen over autotransport, overzichtelijk per onderwerp. Staat uw vraag er niet bij? We helpen u graag persoonlijk verder."
        crumbs={[{ label: "FAQ" }]}
        image="/fleet/countryside-highway.jpg"
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-16">
          {groups.map((g) => (
            <div key={g.eyebrow} className="grid gap-8 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>{g.eyebrow}</Eyebrow>
                <SplitHeading className="mt-5" lead={g.title} trail={g.trail} />
              </div>
              <FaqAccordion items={g.items} />
            </div>
          ))}
        </div>
      </section>

      {/* Staat uw vraag er niet bij? */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="rounded-[2rem] bg-zinc-100 p-8 sm:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Eyebrow>Nog een vraag?</Eyebrow>
              <SplitHeading className="mt-5" lead="Staat uw vraag er niet bij?" trail="Wij helpen u persoonlijk." />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
                Bel ons gerust of stuur een bericht. U krijgt een duidelijk antwoord van iemand
                die uw transport ook echt kan inplannen.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 py-3 pr-3 pl-7 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Neem contact op
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950">
                  <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
              <a
                href={site.phoneHref}
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
              >
                Of bel {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <QuoteCta />
    </PageShell>
  );
}
