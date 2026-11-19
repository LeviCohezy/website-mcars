/** A representative selection of customer quotes (anonymous, as agreed). */

export type Review = {
  quote: string;
  author: string;
  segment: "Particulier" | "Autohandelaar";
  stars: number;
};

export const reviews: Review[] = [
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
