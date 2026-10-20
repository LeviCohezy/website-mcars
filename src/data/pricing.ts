import type { Faq, Highlight } from "./services";

/**
 * Offerte & prijzen content — shared by every offerte design (/offerte,
 * /offerte/v2, /offerte/v3). Mcars works without fixed rates or a calculator,
 * so this lists what determines a price, never the price itself.
 */

/** What determines the price ("Wat bepaalt de prijs?"). */
export const priceFactors: Highlight[] = [
  {
    icon: "route",
    title: "Afstand",
    body: "Hoe verder de rit, hoe meer kilometers en tijd. De afstand tussen ophaal- en leveradres bepaalt mee de prijs.",
  },
  {
    icon: "car",
    title: "Type voertuig",
    body: "Afmetingen en gewicht spelen een rol. Een compacte wagen laadt anders dan een bestelwagen, SUV of oldtimer. Ook een topbox of fietsdrager telt mee.",
  },
  {
    icon: "wrench",
    title: "Rijdend of niet-rijdend",
    body: "Rijdt de wagen, is hij verrolbaar of volledig geblokkeerd? Voor niet-rijdende wagens voorzien we lier of heftruck.",
  },
  {
    icon: "truck",
    title: "Open transport",
    body: "We rijden uitsluitend met open transporters — de voordeligste manier van autotransport. Gesloten transport bieden we niet aan; elke wagen wordt wel professioneel vastgezet en gedocumenteerd.",
  },
  {
    icon: "clock",
    title: "Spoed of normale planning",
    body: "Sluit uw rit aan op onze bestaande routes, of moet het dringend? De planning weegt mee in de prijs.",
  },
  {
    icon: "globe",
    title: "Land van ophaling en levering",
    body: "Binnen België of tot ver in Europa: het land van ophaling en levering bepaalt mee de route en de kost.",
  },
];

/** Why requesting a quote is low-effort. */
export const offerteReassurance = [
  {
    title: "Antwoord binnen 24 uur",
    body: "U krijgt snel een prijs en een mogelijke planning terug — geen dagenlang wachten.",
  },
  {
    title: "Persoonlijk, geen calculator",
    body: "Elke offerte wordt handmatig door ons team opgesteld, afgestemd op uw situatie.",
  },
  {
    title: "Wij antwoorden zelf",
    body: "Geen automatische bevestigingsmail. U hoort rechtstreeks van een mens bij Mcars.",
  },
];

/** The three steps from request to planning. */
export const offerteSteps = [
  { title: "U vult de aanvraag in", body: "Ophaal- en leveradres, het voertuig en de gewenste periode." },
  { title: "Wij bekijken ze persoonlijk", body: "Geen calculator: een planner stelt uw prijs samen." },
  { title: "Binnen 24 uur antwoord", body: "Met prijs en een concrete planning. Pas na uw akkoord plannen we in." },
];

export const offerteFaq: Faq[] = [
  {
    q: "Hoe snel krijg ik een antwoord op mijn aanvraag?",
    a: "U krijgt binnen 24 uur een persoonlijk antwoord met de prijs en de mogelijke planning. Elke aanvraag wordt handmatig bekeken — u ontvangt dus geen automatische bevestigingsmail, wij antwoorden zelf.",
  },
  {
    q: "Welke gegevens heb ik nodig om een offerte aan te vragen?",
    a: "Handig om bij de hand te hebben: of u particulier of bedrijf bent, het ophaal- en leveradres (of ons depot), het voertuig en de staat ervan (start en rijdt, verrolbaar of geblokkeerd, met of zonder topbox), en de gewenste datum. Hoe vollediger uw aanvraag, hoe scherper we uw prijs kunnen bepalen.",
  },
  {
    q: "Kan ik op ons depot laten leveren of ophalen?",
    a: "Ja. Levering of ophaling op ons depot in Roeselare kan en is doorgaans voordeliger dan aan huis. Vermeld het bij uw aanvraag, dan houden we er rekening mee.",
  },
  {
    q: "Hoe verloopt de betaling?",
    a: "Particulieren betalen vóór ophaling. Bedrijven betalen eenvoudig op factuur. De praktische afspraken stemmen we vooraf met u af.",
  },
];
