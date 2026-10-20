import { site } from "@/lib/site";

/**
 * Contact channels — shared by every contact design (/contact, /contact/v2,
 * /contact/v3). Every value is read from `site`, nothing is hardcoded.
 */
export type ContactMethod = {
  id: "telefoon" | "whatsapp" | "email" | "adres" | "uren";
  label: string;
  value: string;
  sub?: string;
  href?: string;
  /** Link text for the action, e.g. "Bel ons". */
  action?: string;
};

export const contactMethods: ContactMethod[] = [
  { id: "telefoon", label: "Telefoon", value: site.phone, sub: "Rechtstreeks een planner aan de lijn.", href: site.phoneHref, action: "Bel ons" },
  { id: "whatsapp", label: "WhatsApp", value: "Stuur een bericht", sub: "Snel een foto of vraag doorsturen.", href: site.whatsapp, action: "Open WhatsApp" },
  { id: "email", label: "E-mail", value: site.email, sub: "Persoonlijk antwoord binnen 24 uur.", href: `mailto:${site.email}`, action: "Mail ons" },
  { id: "adres", label: "Depot", value: `${site.address.street}, ${site.address.city}`, sub: `${site.address.country} — standplaats van onze vloot.`, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`, action: "Routebeschrijving" },
  { id: "uren", label: "Openingsuren", value: site.hours, sub: site.hoursNote },
];

/** Contact photos (AI placeholders until real photography — see docs/CONTENT-NEEDS.md). */
export const contactPhotos = {
  hero: { src: "/images/generated/depot-night.jpg", alt: "Vier Mcars-autotransporters 's avonds voor het verlichte depot in Roeselare" },
  desk: { src: "/images/generated/planning-office.jpg", alt: "Een planner van Mcars aan zijn bureau, met de vrachtwagens zichtbaar door het raam" },
};

export const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.mapsQuery)}&output=embed`;

export const isExternal = (href: string) => href.startsWith("http");
