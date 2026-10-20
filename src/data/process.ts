/**
 * "Zo werkt het" content — the six steps from the sitemap plus the CMR and
 * FAQ blocks. Shared by all three versions of /hoe-werkt-het.
 */

import type { Faq, Highlight, IconKey } from "./services";

export type WorkStep = {
  title: string;
  body: string;
  icon: IconKey;
  /** Short status label, as it would read in a tracking overview. */
  status: string;
  /** Landscape photo for this step (Werkwijze 03 HUD panel). */
  image: string;
  imageAlt: string;
};

export const werkwijze = {
  eyebrow: "Werkwijze",
  title: "Van aanvraag tot levering in zes stappen.",
  subtitle: "Een duidelijke, persoonlijke aanpak zonder verrassingen — van uw eerste aanvraag tot de afrekening.",
  heroImage: "/fleet/countryside.jpg",
  /** CMR section photo — the pickup check with the customer. */
  bandImage: "/images/generated/pickup-inspection.jpg",
  bandImageAlt: "Een chauffeur van Mcars en de klant controleren samen de wagen met een tablet bij ophaling",
  badges: ["Antwoord binnen 24 uur", "CMR bij elke ophaling"],
  seo: {
    title: "Hoe werkt het? | Mcars",
    description:
      "Van offerte tot levering in zes stappen. Ontdek hoe Mcars uw autotransport aanpakt — persoonlijk, met CMR-vrachtbrief en duidelijke afspraken.",
  },
};

export const stappen: WorkStep[] = [
  {
    title: "Offerte aanvragen",
    body: "U vraagt uw transport aan via de website, telefonisch of via WhatsApp. U krijgt binnen 24 uur een persoonlijk antwoord met de prijs en de mogelijke planning. Geen verplichtingen tot u bevestigt.",
    icon: "phone",
    status: "Aanvraag ontvangen",
    image: "/images/generated/planning-office.jpg",
    imageAlt: "Een planner van Mcars bekijkt een aanvraag aan zijn bureau, met een Europese routekaart op het scherm",
  },
  {
    title: "Transportplanning",
    body: "Bent u akkoord met de prijs en de planning? Dan leggen we samen de ophaaldatum vast en plannen we uw wagen in op onze routes. Op de dag zelf belt de chauffeur wanneer hij ter plaatse zal zijn.",
    icon: "clock",
    status: "Ingepland",
    image: "/images/generated/aerial-motorway.jpg",
    imageAlt: "Een Mcars-transporter op de Belgische snelweg, van bovenaf gezien",
  },
  {
    title: "Voertuig ophalen",
    body: "We halen uw wagen op waar u wil: thuis, bij een garage of op een bedrijfsterrein. Rijdt hij niet meer? Verrolbare wagens trekken we met de lier op de transporter.",
    icon: "truck",
    status: "Opgehaald",
    image: "/images/generated/strap-closeup.jpg",
    imageAlt: "Een chauffeur van Mcars zet een wiel vast met een spanband",
  },
  {
    title: "Controle en transportdocumenten (CMR)",
    body: "Ter plaatse inspecteren en fotograferen we het voertuig als intern bewijsstuk van de staat bij vertrek, en maken we de CMR-vrachtbrief op.",
    icon: "shield",
    status: "CMR opgemaakt",
    image: "/images/generated/pickup-inspection.jpg",
    imageAlt: "Een chauffeur van Mcars en de klant controleren samen de wagen met een tablet",
  },
  {
    title: "Levering op locatie",
    body: "We bellen wanneer we bij het leveradres aankomen. Levering op ons depot in Roeselare kan 24/7 en is doorgaans voordeliger dan levering aan huis.",
    icon: "map",
    status: "Geleverd",
    image: "/images/generated/customer-update.jpg",
    imageAlt: "Een klant kijkt met haar smartphone in de hand toe hoe haar wagen aankomt op de transporter",
  },
  {
    title: "Betaling / factuur",
    body: "Particulieren betalen vóór ophaling, bedrijven eenvoudig op factuur. De praktische afspraken stemmen we vooraf duidelijk met u af.",
    icon: "check",
    status: "Afgerond",
    image: "/images/generated/key-handover.jpg",
    imageAlt: "Een chauffeur van Mcars overhandigt de sleutels aan de klant op de oprit",
  },
];

export const cmr: Highlight[] = [
  {
    icon: "shield",
    title: "Bewijst de ophaling",
    body: "De CMR-vrachtbrief toont zwart op wit dat uw wagen door Mcars is opgehaald, wanneer en waar. Zekerheid voor beide partijen.",
  },
  {
    icon: "box",
    title: "Documenteert de staat",
    body: "Bij ophaling leggen we de staat van het voertuig vast met foto's. Zo staat de toestand bij vertrek onbetwistbaar geregistreerd.",
  },
  {
    icon: "check",
    title: "Belangrijk bij een claim",
    body: "Mocht er ooit discussie of schade zijn, dan is de CMR met de vastgelegde staat het referentiepunt. Rustig geregeld op voorhand.",
  },
];

export const cmrIntro =
  "De CMR die we bij elke ophaling opmaken, legt vast wat, wanneer en in welke staat werd opgehaald — bescherming voor u én voor ons.";

export const werkwijzeFaq: Faq[] = [
  {
    q: "Welke documenten heb ik nodig?",
    a: "Enkel een CMR-vrachtbrief is nodig, en die maken wij bij ophaling op. Zo heeft u meteen bewijs dat uw wagen door Mcars is opgehaald.",
  },
  {
    q: "Moet mijn wagen rijden om opgehaald te worden?",
    a: "Nee. Verrolbare wagens trekken we met de lier op de transporter. Is de wagen volledig geblokkeerd, dan voorzien we een heftruck ter plaatse. Vermeld de staat bij uw aanvraag.",
  },
  {
    q: "Kan ik op uw depot laten leveren of ophalen?",
    a: "Ja. Levering en ophaling op ons depot in Roeselare kan 24/7 en is doorgaans voordeliger dan aan huis. Handig als u flexibel wil zijn.",
  },
];
