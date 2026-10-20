import type { Metadata } from "next";
import { FaqAccordion, QuoteCta } from "@/components/blocks";
import PageHero from "@/components/page-hero";
import PageShell from "@/components/page-shell";
import Section from "@/components/section";
import { ArrowButton, Eyebrow } from "@/components/ui";
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
        a: "Elke prijs is maatwerk. We kijken naar het ophaal- en leveradres, de afstand, het voertuig (afmetingen en of het rijdt, rolt of geblokkeerd is), spoed of normaal en het land van bestemming. Zo krijgt u altijd een correcte prijs voor uw situatie.",
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

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function FaqPage() {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title="Veelgestelde vragen."
        subtitle="De meest gestelde vragen over autotransport, per onderwerp. Staat uw vraag er niet bij? We helpen u graag persoonlijk verder."
        crumbs={[{ label: "FAQ" }]}
        image="/fleet/countryside-highway.jpg"
        badges={[{ label: `${total} antwoorden` }, { label: `${groups.length} onderwerpen` }]}
        primaryCta={{ label: "Offerte aanvragen", href: "/offerte" }}
      />

      {/* Topic index */}
      <Section space="tight">
        <nav aria-label="Onderwerpen" className="grid gap-6 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <Eyebrow>Onderwerpen</Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {groups.map((g, i) => (
              <li key={g.eyebrow}>
                <a
                  href={`#${slugify(g.eyebrow)}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950"
                >
                  <span className="text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  {g.eyebrow}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section space="flush-top">
        <div className="flex flex-col gap-24">
          {groups.map((g, i) => (
            <div
              key={g.eyebrow}
              id={slugify(g.eyebrow)}
              className="grid scroll-mt-28 gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center justify-between gap-4 lg:block">
                  <Eyebrow>{g.eyebrow}</Eyebrow>
                  <span className="text-xs tabular-nums text-zinc-400 lg:mt-3 lg:block lg:pl-4">{String(i + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl">
                  {g.title} <span className="text-zinc-400">{g.trail}</span>
                </h2>
                <div className="mt-10">
                  <FaqAccordion items={g.items} defaultOpen={i === 0 ? 0 : null} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Still a question */}
      <Section space="none">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr]">
          <Eyebrow>Nog een vraag?</Eyebrow>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-2xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-zinc-950 sm:text-4xl lg:text-[3.25rem]">
                Staat uw vraag er niet bij? <span className="text-zinc-400">Wij helpen u persoonlijk.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
                U krijgt een duidelijk antwoord van iemand die uw transport ook echt kan inplannen.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <ArrowButton href="/contact">Neem contact op</ArrowButton>
              <a href={site.phoneHref} className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
                Of bel {site.phone}
              </a>
            </div>
          </div>
        </div>
      </Section>

      <QuoteCta />
    </PageShell>
  );
}
