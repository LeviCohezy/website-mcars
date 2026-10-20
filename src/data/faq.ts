import type { Faq } from "./services";

/**
 * FAQ content, grouped by the sitemap categories. Shared by every FAQ design
 * (/faq, /faq/v2, /faq/v3) so the three versions always show the same answers.
 */

export type FaqGroup = {
  /** Anchor id, e.g. "prijzen" → /faq#prijzen. */
  id: string;
  /** Category label as in the sitemap. */
  label: string;
  /** Section heading, split into a dark lead and a muted trail. */
  title: string;
  trail: string;
  items: Faq[];
};

export const faqGroups: FaqGroup[] = [
  {
    id: "prijzen",
    label: "Prijzen",
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
    id: "verzekering",
    label: "Verzekering",
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
    id: "ophaling-en-levering",
    label: "Ophaling en levering",
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
    id: "buitenland",
    label: "Buitenland",
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
    id: "niet-rijdende-voertuigen",
    label: "Niet-rijdende voertuigen",
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
    id: "documenten",
    label: "Documenten",
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
    id: "betaling",
    label: "Betaling",
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
    id: "spoedtransport",
    label: "Spoedtransport",
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

export const faqTotal = faqGroups.reduce((n, g) => n + g.items.length, 0);
