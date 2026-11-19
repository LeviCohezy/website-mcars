/**
 * Shape of a request sent by one of the site's forms, as stored by the CMS inbox.
 * Shared by the forms (client), the API (server) and the /cms screens, so it holds types and
 * plain constants only. Everything is stored in Dutch: the Mcars office reads it.
 */

export const STATUSES = ["nieuw", "in-behandeling", "offerte-verstuurd", "afgehandeld", "archief"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  nieuw: "Nieuw",
  "in-behandeling": "In behandeling",
  "offerte-verstuurd": "Offerte verstuurd",
  afgehandeld: "Afgehandeld",
  archief: "Archief",
};

/** Which form on the site a request came from. */
export const FORM_LABEL = {
  offerte: "Offerteformulier",
  "offerte-plaats": "Offerte (dienst × plaats)",
  homepage: "Offerte (homepage)",
  snel: "Snelle aanvraag (hero)",
  contact: "Contactformulier",
} as const;
export type FormId = keyof typeof FORM_LABEL;

export type Stop = {
  /** Brought to / picked up at the Mcars depot. */
  depot?: boolean;
  land?: string;
  stad?: string;
  postcode?: string;
  straat?: string;
  /** Free-text address, for the short forms that have one field. */
  adres?: string;
  /** ISO date (yyyy-mm-dd) or a readable date. */
  datum?: string;
  zoSnelMogelijk?: boolean;
};

export type CarInput = {
  merk?: string;
  model: string;
  bouwjaar?: string;
  staat?: string;
  extra?: string;
  aantal: number;
};

export type FileRef = {
  /** Original file name. */
  name: string;
  /** Stored file name inside the request's folder. */
  file: string;
  type: string;
  size: number;
};

export type Car = CarInput & { photos: FileRef[]; docs: FileRef[] };

export type Klant = {
  type?: "Particulier" | "Bedrijf";
  naam: string;
  email: string;
  telefoon?: string;
  bedrijf?: string;
  btw?: string;
};

/** What a form sends. Files go alongside as multipart fields `car<i>.photo` / `car<i>.doc`. */
export type InboxPayload = {
  kind: "offerte" | "contact";
  form: FormId;
  /** Page the form was on, and the site language. */
  page?: string;
  locale?: string;
  service?: string;
  klant: Klant;
  onderwerp?: string;
  bericht?: string;
  rit?: { retour?: boolean; van: Stop; naar: Stop; opties?: string };
  autos?: CarInput[];
};

export type InboxItem = Omit<InboxPayload, "autos"> & {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: Status;
  /** Internal note by the office, never shown to the customer. */
  notitie?: string;
  autos?: Car[];
};

/** Dutch labels for the option ids the short forms use (their screen labels are translated). */
export const STAAT_NL: Record<string, string> = {
  runs: "Start en rijdt",
  rolls: "Start niet, wel verrolbaar",
  blocked: "Start niet, geblokkeerd",
};
export const OPTIES_NL: Record<string, string> = {
  none: "Geen topbox of fietsdrager",
  topbox: "Topbox",
  bike: "Fietsdrager",
  both: "Topbox en fietsdrager",
};
