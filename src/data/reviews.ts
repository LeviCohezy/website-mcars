import { site } from "@/lib/site";

/*
 * Review content, shared by all three designs (/reviews, /reviews/v2,
 * /reviews/v3). The quotes are anonymised placeholders until real Google
 * reviews are imported — don't add named reviewers here.
 */

export type ReviewSegment = "particulier" | "zakelijk";

export type Review = {
  quote: string;
  author: string;
  segment: ReviewSegment;
  stars: number;
};

export const segments: { id: ReviewSegment; label: string; short: string; body: string; href: string }[] = [
  {
    id: "particulier",
    label: "Particulieren",
    short: "Particulier",
    body: "Eén wagen, een verhuis, een aankoop in het buitenland of een klassieker — persoonlijk opgevolgd van offerte tot levering.",
    href: "/diensten/autotransport-particulier",
  },
  {
    id: "zakelijk",
    label: "Dealers & bedrijven",
    short: "Dealer / bedrijf",
    body: "Garages, handelaars en concessies die vaste ritten, meerdere wagens per transport en correcte administratie verwachten.",
    href: "/diensten/autotransport-dealers",
  },
];

export const segmentLabel = (s: ReviewSegment) => segments.find((x) => x.id === s)!.short;

export const reviews: Review[] = [
  {
    quote:
      "Vlotte communicatie van bij de offerte tot de levering. De chauffeur belde de dag zelf om het uur af te spreken en onze wagen kwam perfect aan.",
    author: "K. V. — particulier",
    segment: "particulier",
    stars: 5,
  },
  {
    quote:
      "Onze klassieker moest naar het buitenland en werd behandeld alsof het hun eigen wagen was. Netjes vastgezet, geen enkel krasje. Absolute aanrader.",
    author: "Particulier",
    segment: "particulier",
    stars: 5,
  },
  {
    quote:
      "Als garage werken we al jaren met Mcars. Ophaling en levering verlopen stipt, de administratie klopt altijd en de chauffeurs zijn correct.",
    author: "Autohandelaar",
    segment: "zakelijk",
    stars: 5,
  },
  {
    quote:
      "Snel antwoord op mijn aanvraag met een duidelijke prijs en planning. Geen verrassingen achteraf. Zo hoort het.",
    author: "D. M. — particulier",
    segment: "particulier",
    stars: 5,
  },
  {
    quote:
      "Meerdere wagens in één rit laten ophalen op verschillende adressen — alles kwam samen aan zoals afgesproken. Betrouwbare partner voor onze concessie.",
    author: "Dealer / bedrijf",
    segment: "zakelijk",
    stars: 5,
  },
  {
    quote:
      "Een niet-rijdende wagen laten transporteren leek me lastig, maar ze trokken hem probleemloos op de oplegger. Vriendelijk en professioneel van begin tot eind.",
    author: "Particulier",
    segment: "particulier",
    stars: 4,
  },
];

/** Initials for an avatar ("K. V. — particulier" → "KV"), or null for anonymous authors. */
export function reviewInitials(author: string): string | null {
  const m = author.match(/^([A-Z])\.\s*([A-Z])\./);
  return m ? `${m[1]}${m[2]}` : null;
}

export const googleReviewsUrl = "https://www.google.com/search?q=Mcars+Roeselare+reviews";

export const reviewsIntro = {
  title: "Wat klanten over ons zeggen.",
  subtitle: `Een ${site.reviews.score} op Google, opgebouwd door particulieren én dealers die hun wagen aan ons toevertrouwden.`,
  ratingNote:
    "Onze beoordelingen worden live via Google bijgewerkt. Hieronder een representatieve greep uit wat klanten schrijven.",
  disclaimer: "De weergegeven reacties zijn geanonimiseerd. De actuele reviews worden live via Google bijgewerkt.",
};

/** Customer watching her car arrive — AI placeholder, see docs/CONTENT-NEEDS.md. */
export const reviewsHeroImage = "/images/generated/customer-update.jpg";

export const reviewsMetadata = {
  title: "Reviews | Mcars",
  description: `Wat klanten over Mcars zeggen. Google-beoordeling ${site.reviews.score} uit ${site.reviews.count} reviews — van particulieren en van dealers en bedrijven.`,
};
