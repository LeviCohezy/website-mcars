/** Customer cases — shown on /cases and, one per page, on service pages. */
export type Case = {
  slug: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  /** Dutch alt text for `image` where it is shown as a content photo. */
  imageAlt: string;
  /** Slug of the related service page (/diensten/[slug]). */
  service?: string;
  /** Short "traject" line for the facts strip. */
  route?: string;
  /** Case-page story, rephrased from `body` only — no new facts. */
  challenge?: string;
  approach?: string;
  result?: string;
};

export const cases: Case[] = [
  {
    slug: "oldtimer-event",
    tag: "Oldtimer & event",
    title: "Oldtimers naar de Sloveense kust en terug",
    body: "Voor een oldtimerrit haalden we in Antwerpen een reeks klassiekers op en brachten ze tot een hotel nabij de Kroatische grens. De wagens stonden klaar vóór de start. Na de vijfdaagse rit haalden we ze weer op en brachten ze veilig terug naar Antwerpen.",
    image: "/images/generated/oldtimer-loading.jpg",
    imageAlt: "Een groene klassieke sportwagen wordt op de laadvloer van een Mcars-transporter gereden",
    service: "oldtimer-transport",
    route: "Antwerpen ⇄ Slovenië",
    challenge: "Voor een oldtimerrit moest een reeks klassiekers van Antwerpen tot aan een hotel nabij de Kroatische grens geraken — nog vóór de start.",
    approach: "We haalden de wagens op in Antwerpen en brachten ze tot aan het hotel, zodat ze er klaarstonden vóór de start.",
    result: "Na de vijfdaagse rit haalden we de klassiekers opnieuw op en brachten we ze veilig terug naar Antwerpen.",
  },
  {
    slug: "dealer-belgie",
    tag: "Dealertransport binnen België",
    title: "Acht wagens voor een handelaar, één sluitende planning",
    body: "Een handelaar uit West-Vlaanderen liet in één beweging zeven wagens ophalen in Tongeren en één in Asse. Door de adressen slim op onze route te leggen, reden we alles efficiënt in één transport tot bij de klant.",
    image: "/images/generated/dealer-loading.jpg",
    imageAlt: "Een SUV wordt bij een autohandelaar op een Mcars-transporter geladen",
    service: "autotransport-dealers",
    route: "Tongeren & Asse → West-Vlaanderen",
    challenge: "Een handelaar uit West-Vlaanderen wilde acht wagens laten ophalen op twee adressen: zeven in Tongeren en één in Asse.",
    approach: "We legden beide ophaaladressen slim op onze route, zodat alle wagens in één beweging mee konden.",
    result: "Alle acht wagens kwamen in één efficiënt transport tot bij de klant.",
  },
  {
    slug: "particulier-sportwagen",
    tag: "Particulier · sportwagen",
    title: "Een sportwagen die klaarstond na de vlucht",
    body: "Een particulier liet zijn sportwagen ophalen in Amsterdam en afleveren aan de luchthaven van Nice. Zo kon hij zorgeloos vliegen, wetende dat zijn wagen ter plaatse voor hem klaarstond bij aankomst.",
    image: "/images/generated/airport-nice.jpg",
    imageAlt: "Een sportcoupé wordt afgeladen aan de luchthaven van Nice",
    service: "autotransport-particulier",
    route: "Amsterdam → luchthaven Nice",
    challenge: "Een particulier wilde naar Nice vliegen en daar zijn eigen sportwagen ter beschikking hebben — terwijl die nog in Amsterdam stond.",
    approach: "We haalden de sportwagen op in Amsterdam en leverden hem af aan de luchthaven van Nice.",
    result: "De klant kon zorgeloos vliegen: bij aankomst stond zijn wagen ter plaatse voor hem klaar.",
  },
  {
    slug: "import-duitsland",
    tag: "Importwagen uit Duitsland",
    title: "Een buitenlands koopje veilig thuisgeleverd",
    body: "Een klant vond zijn wagen bij een Duitse verkoper. Wij haalden het voertuig rechtstreeks op, maakten de CMR op bij vertrek en leverden af tot bij de klant thuis — zonder dat die zelf de reis moest maken.",
    image: "/fleet/germany-autobahn.jpg",
    imageAlt: "Een Mcars-transporter op de Duitse autosnelweg",
    service: "auto-importeren",
    route: "Duitse verkoper → bij de klant thuis",
    challenge: "Een klant vond zijn wagen bij een Duitse verkoper, maar wilde niet zelf de reis maken om hem op te halen.",
    approach: "We haalden het voertuig rechtstreeks bij de verkoper op en maakten bij vertrek de CMR op.",
    result: "De wagen werd tot bij de klant thuis geleverd — zonder dat die zelf de reis moest maken.",
  },
  {
    slug: "niet-rijdend-project",
    tag: "Niet-rijdende wagen",
    title: "Een stilstaand project van de oprit gehaald",
    body: "Een voertuig dat al een tijd stillag en niet meer startte, trokken we met de lier veilig op de laadvloer. Verrolbaar volstaat: geen draaiende motor nodig om het project op zijn nieuwe bestemming te krijgen.",
    image: "/images/generated/nonrunning-winch.jpg",
    imageAlt: "Een beschadigde, niet-rijdende wagen wordt met de lier op de transporter getrokken",
    service: "niet-rijdende-auto",
    route: "Oprit → nieuwe bestemming",
    challenge: "Een voertuig stond al een tijd stil en startte niet meer. Op eigen kracht de laadvloer oprijden was uitgesloten.",
    approach: "Met de lier trokken we de wagen veilig op de laadvloer. Verrolbaar volstaat — een draaiende motor is niet nodig.",
    result: "Het stilstaande project geraakte veilig van de oprit naar zijn nieuwe bestemming.",
  },
  {
    slug: "bedrijf-europa",
    tag: "Europees transport voor bedrijfsklant",
    title: "Wekelijkse ritten voor een vaste bedrijfsklant",
    body: "Voor een bedrijfsklant combineren we voertuigen op onze vaste Europese routes. Meerdere wagens per rit, één aanspreekpunt en facturatie achteraf — een terugkerende samenwerking op korte lijnen.",
    image: "/fleet/spain-skyline.jpg",
    imageAlt: "Een volgeladen Mcars-transporter rijdt door een moderne stad",
    service: "fleet-wagenpark",
    route: "Vaste Europese routes",
    challenge: "Een bedrijfsklant heeft terugkerend voertuigen die over Europa verplaatst moeten worden.",
    approach: "We combineren de voertuigen op onze vaste Europese routes: meerdere wagens per rit, met één aanspreekpunt.",
    result: "Wekelijkse ritten en facturatie achteraf — een terugkerende samenwerking op korte lijnen.",
  },
];

export const getCase = (slug?: string) => cases.find((c) => c.slug === slug);
