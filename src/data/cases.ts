/** Customer cases — shown on /cases and, one per page, on service pages. */
export type Case = {
  slug: string;
  tag: string;
  title: string;
  body: string;
  image: string;
};

export const cases: Case[] = [
  {
    slug: "oldtimer-event",
    tag: "Oldtimer & event",
    title: "Oldtimers naar de Sloveense kust en terug",
    body: "Voor een oldtimerrit haalden we in Antwerpen een reeks klassiekers op en brachten ze tot een hotel nabij de Kroatische grens. De wagens stonden klaar vóór de start. Na de vijfdaagse rit haalden we ze weer op en brachten ze veilig terug naar Antwerpen.",
    image: "/fleet/mountain-suvs.jpg",
  },
  {
    slug: "dealer-belgie",
    tag: "Dealertransport binnen België",
    title: "Acht wagens voor een handelaar, één sluitende planning",
    body: "Een handelaar uit West-Vlaanderen liet in één beweging zeven wagens ophalen in Tongeren en één in Asse. Door de adressen slim op onze route te leggen, reden we alles efficiënt in één transport tot bij de klant.",
    image: "/fleet/depot-dusk.jpg",
  },
  {
    slug: "particulier-sportwagen",
    tag: "Particulier · sportwagen",
    title: "Een sportwagen die klaarstond na de vlucht",
    body: "Een particulier liet zijn sportwagen ophalen in Amsterdam en afleveren aan de luchthaven van Nice. Zo kon hij zorgeloos vliegen, wetende dat zijn wagen ter plaatse voor hem klaarstond bij aankomst.",
    image: "/fleet/actros-motion.jpg",
  },
  {
    slug: "import-duitsland",
    tag: "Importwagen uit Duitsland",
    title: "Een buitenlands koopje veilig thuisgeleverd",
    body: "Een klant vond zijn wagen bij een Duitse verkoper. Wij haalden het voertuig rechtstreeks op, maakten de CMR op bij vertrek en leverden af tot bij de klant thuis — zonder dat die zelf de reis moest maken.",
    image: "/fleet/germany-autobahn.jpg",
  },
  {
    slug: "niet-rijdend-project",
    tag: "Niet-rijdende wagen",
    title: "Een stilstaand project van de oprit gehaald",
    body: "Een voertuig dat al een tijd stillag en niet meer startte, trokken we met de lier veilig op de laadvloer. Verrolbaar volstaat: geen draaiende motor nodig om het project op zijn nieuwe bestemming te krijgen.",
    image: "/fleet/depot-wet.jpg",
  },
  {
    slug: "bedrijf-europa",
    tag: "Europees transport voor bedrijfsklant",
    title: "Wekelijkse ritten voor een vaste bedrijfsklant",
    body: "Voor een bedrijfsklant combineren we voertuigen op onze vaste Europese routes. Meerdere wagens per rit, één aanspreekpunt en facturatie achteraf — een terugkerende samenwerking op korte lijnen.",
    image: "/fleet/spain-skyline.jpg",
  },
];

export const getCase = (slug?: string) => cases.find((c) => c.slug === slug);
