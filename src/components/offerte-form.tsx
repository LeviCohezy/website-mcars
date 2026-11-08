"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

/*
 * Offerte autotransport — the full quote form on /offerte.
 * Flow from the client's reference (Oct/Nov 2026), on a black screen:
 *   Enkele rit / Heen en terug
 *   Vertrek  |  Bestemming   (Depot Mcars or own address · land · stad ·
 *                            postcode · datum)
 *   Autogegevens  (per car: merk · model · bouwjaar · staat · extra info ·
 *                  foto's/volmacht; "+ Voeg nog een auto toe")
 *   Contactgegevens (particulier/bedrijf · naam · e-mail · telefoon · bericht)
 *   trust row → "Offerte aanvragen"
 * The reference's orange accent becomes white-on-black here.
 *
 * Delivery: like the rest of the site, submitting opens a pre-filled e-mail to
 * info@mcars.be (no backend yet). E-mail links can't carry attachments, so the
 * confirmation lists the chosen photos and asks to attach them.
 * Prefill: /offerte?van=…&naar=…&datum=… (sent by the Home 02 quote bar).
 */

const LANDEN = [
  "België", "Nederland", "Frankrijk", "Duitsland", "Luxemburg", "Spanje", "Italië",
  "Zwitserland", "Oostenrijk", "Portugal", "Polen", "Ander land",
];

const MERKEN = [
  "Audi", "BMW", "Citroën", "Cupra", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia",
  "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche",
  "Renault", "Seat", "Škoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Ander merk",
];

const STAAT = [
  { id: "rijdt", label: "Start en rijdt", icon: "car" },
  { id: "rolbaar", label: "Start niet, maar is rolbaar", icon: "push" },
  { id: "niet-rolbaar", label: "Niet rolbaar", icon: "ban" },
] as const;

type Leg = { mode: "depot" | "adres"; land: string; stad: string; postcode: string; straat: string; datum: string };
type Car = { id: number; merk: string; model: string; bouwjaar: string; staat: string; extra: string; files: string[] };

const emptyLeg = (): Leg => ({ mode: "depot", land: "", stad: "", postcode: "", straat: "", datum: "" });
const emptyCar = (id: number): Car => ({ id, merk: "", model: "", bouwjaar: "", staat: "rijdt", extra: "", files: [] });

const subscribeNone = () => () => {};

/* Line icons used only by this form (24px, stroke). */
const ICONS = {
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  swap: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  flag: <path d="M5 21V4h11l-2 4 2 4H5" />,
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  truck: <><path d="M2 6h12v10H2zM14 9h4.5l3.5 3.5V16h-8z" /><circle cx="6" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>,
  car: <><path d="M4 13l1.7-5a2 2 0 0 1 1.9-1.4h8.8a2 2 0 0 1 1.9 1.4L20 13v5h-2.5v-2h-11v2H4z" /><path d="M4 13h16" /><circle cx="8" cy="15.2" r=".6" /><circle cx="16" cy="15.2" r=".6" /></>,
  push: <><path d="M9 14l1.2-3.5A1.5 1.5 0 0 1 11.6 9.5h6.8a1.5 1.5 0 0 1 1.4 1L21 14v3.5h-2V16h-8v1.5H9z" /><path d="M2 12l4 2M3 17h4" /></>,
  ban: <><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  building: <path d="M4 21V4h11v17M15 9h5v12M2 21h20M8 8h3M8 12h3M8 16h3" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  phone: <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V20a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  upload: <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8a4.5 4.5 0 0 1-1 10M12 12v9M8.5 15.5L12 12l3.5 3.5" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  shield: <><path d="M12 3l7 3v6c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  euro: <path d="M18 6.5A7 7 0 0 0 7 12a7 7 0 0 0 11 5.5M4 10h10M4 14h9" />,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
  send: <path d="M21 3L3 10.5l7 2.5 2.5 7zM10 13l5-5" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
} as const;
type IconName = keyof typeof ICONS;

function I({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

export default function OfferteForm() {
  // Read the query once on the client; remount the form with the prefill.
  const search = useSyncExternalStore(subscribeNone, () => window.location.search, () => "");
  return <OfferteFormInner key={search} search={search} />;
}

function OfferteFormInner({ search }: { search: string }) {
  const q = new URLSearchParams(search);
  const van = q.get("van") ?? "";
  const naar = q.get("naar") ?? "";
  const datum = q.get("datum") ?? "";

  const [retour, setRetour] = useState(false);
  const [vertrek, setVertrek] = useState<Leg>(() => (van ? { ...emptyLeg(), mode: "adres", stad: van, datum } : { ...emptyLeg(), datum }));
  const [bestemming, setBestemming] = useState<Leg>(() => (naar ? { ...emptyLeg(), mode: "adres", stad: naar } : emptyLeg()));
  const [cars, setCars] = useState<Car[]>([emptyCar(1)]);
  const [klant, setKlant] = useState<"Particulier" | "Bedrijf">("Particulier");
  const [contact, setContact] = useState({ bedrijf: "", naam: "", email: "", telefoon: "", bericht: "" });
  const [sent, setSent] = useState<string[] | null>(null);
  const [tried, setTried] = useState(false);

  const legOk = (l: Leg) => l.mode === "depot" || (l.land && l.stad.trim() && l.postcode.trim());
  const carsOk = cars.every((c) => c.merk && c.model.trim() && c.staat);
  const contactOk = contact.naam.trim() && /\S+@\S+\.\S+/.test(contact.email) && contact.telefoon.trim().length >= 6;
  const valid = legOk(vertrek) && legOk(bestemming) && carsOk && contactOk;

  const depot = `Depot Mcars, ${site.address.street}, ${site.address.city}`;
  const legText = (l: Leg) =>
    l.mode === "depot" ? depot : [l.straat, [l.postcode, l.stad].filter(Boolean).join(" "), l.land].filter(Boolean).join(", ");
  const fmt = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "geen voorkeur");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid) return;
    const files = cars.flatMap((c) => c.files);
    const lines = [
      `Type rit: ${retour ? "Heen en terug" : "Enkele rit"}`,
      ``,
      `VERTREK: ${vertrek.mode === "depot" ? "aanleveren op het depot" : "ophalen op adres"}`,
      `  ${legText(vertrek)}`,
      `  Datum: ${fmt(vertrek.datum)}`,
      `BESTEMMING: ${bestemming.mode === "depot" ? "afhalen op het depot" : "levering op adres"}`,
      `  ${legText(bestemming)}`,
      `  Datum: ${fmt(bestemming.datum)}`,
      ``,
      ...cars.flatMap((c, i) => [
        `AUTO ${i + 1}: ${c.merk} ${c.model}${c.bouwjaar ? ` (${c.bouwjaar})` : ""}`,
        `  Staat: ${STAAT.find((s) => s.id === c.staat)?.label}`,
        ...(c.extra.trim() ? [`  Extra: ${c.extra.trim()}`] : []),
        ...(c.files.length ? [`  Foto's/volmacht: ${c.files.join(", ")} (als bijlage)`] : []),
      ]),
      ``,
      `KLANT: ${klant}${klant === "Bedrijf" && contact.bedrijf ? ` — ${contact.bedrijf}` : ""}`,
      `Naam: ${contact.naam}`,
      `E-mail: ${contact.email}`,
      `Telefoon: ${contact.telefoon}`,
      ...(contact.bericht.trim() ? [``, `Bericht: ${contact.bericht.trim()}`] : []),
    ];
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Offerteaanvraag autotransport")}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(files);
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-white/[0.04] p-8 text-white ring-1 ring-white/10 sm:p-12">
        <p className="text-sm font-medium tracking-widest text-white/50 uppercase">Bijna klaar</p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">Uw aanvraag staat klaar in uw e-mail.</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
          Verstuur de e-mail die nu openging naar {site.email}. U krijgt zo snel mogelijk een persoonlijke prijs en planning — wij antwoorden zelf, er volgt geen automatische mail.
        </p>
        {sent.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
            <p className="text-sm font-medium">Vergeet niet uw bestanden als bijlage toe te voegen:</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-white/70">
              {sent.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-6 text-sm text-white/60">
          Lukt het niet? Bel of WhatsApp <a href={site.phoneHref} className="text-white underline underline-offset-4">{site.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4 text-white sm:space-y-5">
      {/* Trip type */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {[
          { v: false, t: "Enkele rit", s: "Van A naar B", icon: "arrow" as const },
          { v: true, t: "Heen en terug", s: "Van A naar B en terug", icon: "swap" as const },
        ].map((o) => {
          const on = retour === o.v;
          return (
            <button
              key={o.t}
              type="button"
              onClick={() => setRetour(o.v)}
              aria-pressed={on}
              className={`flex min-h-20 items-center gap-4 rounded-2xl px-5 py-4 text-left ring-1 transition-all duration-300 ${
                on ? "bg-white text-zinc-950 ring-white" : "bg-white/[0.04] text-white ring-white/10 hover:bg-white/[0.07] hover:ring-white/25"
              }`}
            >
              <span className={`flex size-6 flex-none items-center justify-center rounded-full ring-2 ${on ? "ring-zinc-950" : "ring-white/30"}`}>
                <span className={`size-3 rounded-full bg-zinc-950 transition-transform duration-300 ${on ? "scale-100" : "scale-0"}`} />
              </span>
              <I name={o.icon} className="size-6 flex-none" />
              <span>
                <span className="block text-base font-medium">{o.t}</span>
                <span className={`block text-sm ${on ? "text-zinc-500" : "text-white/50"}`}>{o.s}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Vertrek / Bestemming */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <LegCard
          step="01" icon="pin" title="Vertrek" question="Hoe wilt u het voertuig aanleveren?" adresLabel="Ophalen op adres"
          depotNote="Uw voertuig wordt aangeleverd aan ons depot in Roeselare." stadPlaceholder="Bijv. Roeselare" postcodePlaceholder="Bijv. 8800"
          leg={vertrek} set={setVertrek} tried={tried}
        />
        <LegCard
          step="02" icon="flag" title="Bestemming" question="Hoe wilt u het voertuig afleveren?" adresLabel="Levering op adres"
          depotNote="Uw voertuig wordt afgehaald aan ons depot in Roeselare." stadPlaceholder="Bijv. Nice" postcodePlaceholder="Bijv. 06000"
          leg={bestemming} set={setBestemming} tried={tried}
        />
      </div>

      {/* Autogegevens */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle step="03" icon="car">Autogegevens</CardTitle>
          <button
            type="button"
            onClick={() => setCars((cs) => [...cs, emptyCar(Math.max(...cs.map((c) => c.id)) + 1)])}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium text-white ring-1 ring-white/30 transition-colors hover:bg-white hover:text-zinc-950"
          >
            <I name="plus" className="size-4" /> Voeg nog een auto toe
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {cars.map((c, i) => (
            <CarFields
              key={c.id}
              index={i}
              car={c}
              canRemove={cars.length > 1}
              tried={tried}
              set={(patch) => setCars((cs) => cs.map((x) => (x.id === c.id ? { ...x, ...patch } : x)))}
              remove={() => setCars((cs) => cs.filter((x) => x.id !== c.id))}
            />
          ))}
        </div>
      </Card>

      {/* Contactgegevens */}
      <Card>
        <CardTitle step="04" icon="user">Contactgegevens</CardTitle>
        <div className="mt-6 grid gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <Label req>Type klant</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([
                  { k: "Particulier", icon: "user" },
                  { k: "Bedrijf", icon: "building" },
                ] as const).map(({ k, icon }) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKlant(k)}
                    aria-pressed={klant === k}
                    className={`flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium ring-1 transition-colors ${
                      klant === k ? "bg-white text-zinc-950 ring-white" : "bg-white/[0.04] text-white ring-white/10 hover:ring-white/30"
                    }`}
                  >
                    <I name={icon} className="size-4" />
                    {k}
                  </button>
                ))}
              </div>
            </div>
            {klant === "Bedrijf" && (
              <Field label="Bedrijfsnaam" icon="building" value={contact.bedrijf} onChange={(v) => setContact({ ...contact, bedrijf: v })} autoComplete="organization" placeholder="Naam van uw bedrijf" />
            )}
            <Field label="Naam" req icon="user" value={contact.naam} onChange={(v) => setContact({ ...contact, naam: v })} autoComplete="name" placeholder="Uw naam" invalid={tried && !contact.naam.trim()} />
            <Field label="E-mailadres" req icon="mail" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} autoComplete="email" placeholder="voorbeeld@domein.be" invalid={tried && !/\S+@\S+\.\S+/.test(contact.email)} />
          </div>
          <div className="flex flex-col gap-5">
            <Field label="Telefoonnummer" req icon="phone" type="tel" value={contact.telefoon} onChange={(v) => setContact({ ...contact, telefoon: v })} autoComplete="tel" placeholder="Bijv. 0470 12 34 56" invalid={tried && contact.telefoon.trim().length < 6} />
            <Area label="Bericht" icon="chat" value={contact.bericht} onChange={(v) => setContact({ ...contact, bericht: v })} placeholder="Nog extra informatie? Laat het ons weten." grow />
          </div>
        </div>
      </Card>

      {/* Trust row + submit */}
      <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-8">
        <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {([
            { t: "Veilig transport", s: "Uw voertuig in goede handen", icon: "shield" },
            { t: "Snelle service", s: "Antwoord binnen 24 uur", icon: "clock" },
            { t: "Transparante prijzen", s: "Geen verrassingen", icon: "euro" },
            { t: "Heel Europa", s: "België · Nederland · Frankrijk & verder", icon: "map" },
          ] as const).map((it) => (
            <li key={it.t} className="flex items-start gap-3 lg:px-5 lg:first:pl-0">
              <I name={it.icon} className="mt-0.5 size-7 flex-none text-white" />
              <span>
                <span className="block text-sm font-medium text-white">{it.t}</span>
                <span className="block text-sm text-white/50">{it.s}</span>
              </span>
            </li>
          ))}
        </ul>
        {tried && !valid && (
          <p role="alert" className="mt-6 text-sm font-medium text-red-400">
            Vul de verplichte velden (*) in om uw aanvraag te versturen.
          </p>
        )}
        <button
          type="submit"
          className="group mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          <I name="send" className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          Offerte aanvragen
        </button>
        <p className="mt-3 text-center text-sm text-white/50">
          Vrijblijvende aanvraag — geen definitieve boeking.
          <br className="hidden sm:block" /> Wij nemen zo snel mogelijk contact met u op.
        </p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-8">{children}</div>;
}

function CardTitle({ step, icon, children }: { step: string; icon: IconName; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-4 text-2xl font-medium tracking-tight text-white sm:text-[1.75rem]">
      <span className="flex size-12 flex-none items-center justify-center rounded-2xl bg-white text-zinc-950">
        <I name={icon} className="size-6" />
      </span>
      <span>
        <span className="block text-xs font-medium tracking-[0.2em] text-white/40 tabular-nums">{step}</span>
        {children}
      </span>
    </h2>
  );
}

function Label({ children, req, optional, htmlFor }: { children: React.ReactNode; req?: boolean; optional?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-white">
      {children}
      {req && <span className="text-white/40"> *</span>}
      {optional && <span className="font-normal text-white/40"> (optioneel)</span>}
    </label>
  );
}

const inputCls = (invalid?: boolean, icon?: boolean) =>
  `block min-h-12 w-full rounded-xl bg-white/[0.06] text-base text-white ring-1 [color-scheme:dark] placeholder:text-white/35 transition-shadow focus:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-white sm:text-sm ${
    icon ? "pl-11 pr-4" : "px-4"
  } ${invalid ? "ring-red-400" : "ring-white/10 hover:ring-white/25"}`;

function Field({
  label, value, onChange, req, optional, type = "text", placeholder, autoComplete, invalid, icon,
}: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; optional?: boolean; type?: string;
  placeholder?: string; autoComplete?: string; invalid?: boolean; icon?: IconName;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} req={req} optional={optional}>{label}</Label>
      <div className="relative mt-2">
        {icon && <I name={icon} className="pointer-events-none absolute top-1/2 left-4 size-[1.1rem] -translate-y-1/2 text-white/45" />}
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={invalid || undefined} className={inputCls(invalid, !!icon)} />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, req, invalid }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string; req?: boolean; invalid?: boolean }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} req={req}>{label}</Label>
      <div className="relative mt-2">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} className={`${inputCls(invalid)} appearance-none pr-10 ${value ? "" : "text-white/35"}`}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <I name="chevron" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-white/60" />
      </div>
    </div>
  );
}

function Area({ label, value, onChange, placeholder, icon, grow }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: IconName; grow?: boolean }) {
  const id = useId();
  return (
    <div className={grow ? "flex flex-1 flex-col" : ""}>
      <Label htmlFor={id} optional>{label}</Label>
      <div className={`relative mt-2 ${grow ? "flex flex-1" : ""}`}>
        {icon && <I name={icon} className="pointer-events-none absolute top-3.5 left-4 size-[1.1rem] text-white/45" />}
        <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls(false, !!icon)} min-h-32 resize-y py-3 ${grow ? "flex-1" : ""}`} />
      </div>
    </div>
  );
}

/** Custom listbox so each "staat" option can carry an icon, as in the reference. */
function StaatSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const listId = useId();
  const current = STAAT.find((s) => s.id === value) ?? STAAT[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (i: number) => {
    onChange(STAAT[i].id);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setActive(STAAT.indexOf(current));
        return setOpen(true);
      }
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : STAAT.length - 1)) % STAAT.length);
    }
    if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <div ref={ref} className="relative self-start">
      <p id={labelId} className="text-sm font-medium text-white">
        Staat van het voertuig<span className="text-white/40"> *</span>
      </p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        aria-controls={listId}
        onClick={() => {
          setActive(STAAT.indexOf(current));
          setOpen((o) => !o);
        }}
        onKeyDown={onKey}
        className={`mt-2 flex min-h-12 w-full items-center gap-3 rounded-xl bg-white/[0.06] px-4 text-left text-base text-white ring-1 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm ${
          open ? "ring-2 ring-white" : "ring-white/10 hover:ring-white/25"
        }`}
      >
        <I name={current.icon} className="size-5 flex-none" />
        <span className="flex-1">{current.label}</span>
        <I name="chevron" className={`size-4 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        className={`absolute inset-x-0 top-full z-20 mt-2 origin-top overflow-hidden rounded-xl bg-zinc-900 p-1.5 shadow-2xl ring-1 ring-white/15 transition-all duration-200 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {STAAT.map((s, i) => {
          const selected = s.id === current.id;
          return (
            <li
              key={s.id}
              role="option"
              aria-selected={selected}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                selected ? "bg-white text-zinc-950" : active === i ? "bg-white/10 text-white" : "text-white/80"
              }`}
            >
              <I name={s.icon} className="size-5 flex-none" />
              {s.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LegCard({
  step, icon, title, question, adresLabel, depotNote, stadPlaceholder, postcodePlaceholder, leg, set, tried,
}: {
  step: string; icon: IconName; title: string; question: string; adresLabel: string; depotNote: string;
  stadPlaceholder: string; postcodePlaceholder: string; leg: Leg; set: (l: Leg) => void; tried: boolean;
}) {
  const p = (patch: Partial<Leg>) => set({ ...leg, ...patch });
  const option = (on: boolean) =>
    `flex min-h-[4.5rem] items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ring-1 transition-colors ${
      on ? "bg-white text-zinc-950 ring-white" : "bg-white/[0.04] text-white ring-white/10 hover:ring-white/30"
    }`;
  return (
    <Card>
      <CardTitle step={step} icon={icon}>{title}</CardTitle>
      <p className="mt-6 text-sm font-medium text-white">
        {question}
        <span className="text-white/40"> *</span>
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-[1.35fr_1fr]">
        <button type="button" onClick={() => p({ mode: "depot" })} aria-pressed={leg.mode === "depot"} className={option(leg.mode === "depot")}>
          <I name="home" className="size-6 flex-none" />
          <span>
            <span className="block font-medium">Depot Mcars</span>
            <span className={`block ${leg.mode === "depot" ? "text-zinc-500" : "text-white/50"}`}>
              {site.address.street}, {site.address.city}
            </span>
          </span>
        </button>
        <button type="button" onClick={() => p({ mode: "adres" })} aria-pressed={leg.mode === "adres"} className={`${option(leg.mode === "adres")} font-medium`}>
          <I name="truck" className="size-6 flex-none" />
          {adresLabel}
        </button>
      </div>

      {leg.mode === "depot" ? (
        <p className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white/70">
          <I name="pin" className="size-4 flex-none text-white" />
          {depotNote}
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Select label="Land" req value={leg.land} onChange={(v) => p({ land: v })} options={LANDEN} placeholder="Selecteer land" invalid={tried && !leg.land} />
          <Field label="Stad / Plaats" req value={leg.stad} onChange={(v) => p({ stad: v })} placeholder={stadPlaceholder} autoComplete="address-level2" invalid={tried && !leg.stad.trim()} />
          <Field label="Postcode" req value={leg.postcode} onChange={(v) => p({ postcode: v })} placeholder={postcodePlaceholder} autoComplete="postal-code" invalid={tried && !leg.postcode.trim()} />
          <Field label="Straat en nr." optional value={leg.straat} onChange={(v) => p({ straat: v })} autoComplete="street-address" />
        </div>
      )}
      <div className="mt-5">
        <Field label="Datum" optional type="date" value={leg.datum} onChange={(v) => p({ datum: v })} />
      </div>
    </Card>
  );
}

function CarFields({
  index, car, set, remove, canRemove, tried,
}: {
  index: number; car: Car; set: (patch: Partial<Car>) => void; remove: () => void; canRemove: boolean; tried: boolean;
}) {
  const fileId = useId();
  return (
    <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2.5 text-lg font-medium text-white">
          <I name="car" className="size-5" /> Auto {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={remove}
            aria-label={`Auto ${index + 1} verwijderen`}
            className="flex size-11 items-center justify-center rounded-xl text-white/60 ring-1 ring-white/15 transition-colors hover:bg-red-500/10 hover:text-red-400 hover:ring-red-400/50"
          >
            <I name="trash" className="size-5" />
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        <Select label="Merk" req value={car.merk} onChange={(v) => set({ merk: v })} options={MERKEN} placeholder="Selecteer merk" invalid={tried && !car.merk} />
        <Field label="Model" req value={car.model} onChange={(v) => set({ model: v })} placeholder="Bijv. Golf, X5, 911" invalid={tried && !car.model.trim()} />
        <Field label="Bouwjaar" optional value={car.bouwjaar} onChange={(v) => set({ bouwjaar: v.replace(/\D/g, "").slice(0, 4) })} placeholder="Bijv. 2022" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <StaatSelect value={car.staat} onChange={(v) => set({ staat: v })} />
        <Area
          label="Extra informatie"
          value={car.extra}
          onChange={(v) => set({ extra: v })}
          placeholder="Bijv. schade, niet-rijdbaar, meerdere voertuigen, rolbaar, front lift functie, topbox, fietsdragers, speciale afmetingen, …"
        />
        <div>
          <Label htmlFor={fileId} optional>Foto&apos;s voertuig / volmacht</Label>
          <label
            htmlFor={fileId}
            className="group mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/[0.03] px-4 py-5 text-center text-sm transition-colors hover:border-white/60 hover:bg-white/[0.06]"
          >
            <I name="upload" className="size-8 text-white transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="mt-2 text-white">Klik om foto&apos;s van het voertuig en/of een volmacht te uploaden</span>
            <span className="mt-1 text-xs text-white/45">JPG, PNG of PDF (max. 10 MB)</span>
            <span className="mt-1 flex items-center gap-1 text-xs text-white/45">
              <I name="info" className="size-3.5" /> Meerdere bestanden mogelijk
            </span>
          </label>
          <input
            id={fileId}
            type="file"
            multiple
            accept="image/jpeg,image/png,application/pdf"
            className="sr-only"
            onChange={(e) => set({ files: [...(e.target.files ?? [])].map((f) => f.name) })}
          />
          {car.files.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {car.files.map((f) => (
                <li key={f} className="max-w-full truncate rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
