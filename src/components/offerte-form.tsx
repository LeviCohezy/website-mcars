"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

/*
 * Offerte autotransport — the full quote form on /offerte.
 * Structure from the client's reference (Oct 2026), in Mcars black & white:
 *   Enkele rit / Heen en terug
 *   Vertrek  |  Bestemming   (Depot Mcars or own address · land · stad ·
 *                            postcode · datum)
 *   Autogegevens  (per car: merk · model · bouwjaar · staat · extra info ·
 *                  foto's/volmacht; "+ Voeg nog een auto toe")
 *   Contactgegevens (particulier/bedrijf · naam · e-mail · telefoon · bericht)
 *   trust row → "Offerte aanvragen"
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
  { id: "rijdt", label: "Start en rijdt" },
  { id: "rolbaar", label: "Start niet, maar is rolbaar" },
  { id: "niet-rolbaar", label: "Niet rolbaar" },
] as const;

type Leg = { mode: "depot" | "adres"; land: string; stad: string; postcode: string; straat: string; datum: string };
type Car = { id: number; merk: string; model: string; bouwjaar: string; staat: string; extra: string; files: string[] };

const emptyLeg = (): Leg => ({ mode: "depot", land: "", stad: "", postcode: "", straat: "", datum: "" });
const emptyCar = (id: number): Car => ({ id, merk: "", model: "", bouwjaar: "", staat: "rijdt", extra: "", files: [] });

const subscribeNone = () => () => {};

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
      <div className="rounded-3xl bg-zinc-950 p-8 text-white sm:p-12">
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
    <form onSubmit={submit} noValidate className="space-y-6">
      {/* Trip type */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { v: false, t: "Enkele rit", s: "Van A naar B" },
          { v: true, t: "Heen en terug", s: "Van A naar B en terug" },
        ].map((o) => (
          <button
            key={o.t}
            type="button"
            onClick={() => setRetour(o.v)}
            aria-pressed={retour === o.v}
            className={`flex min-h-16 items-center gap-4 rounded-2xl px-5 py-4 text-left ring-1 transition-colors ${
              retour === o.v ? "bg-zinc-950 text-white ring-zinc-950" : "bg-white text-zinc-950 ring-zinc-200 hover:ring-zinc-400"
            }`}
          >
            <span className={`flex size-5 flex-none items-center justify-center rounded-full ring-2 ${retour === o.v ? "ring-white" : "ring-zinc-300"}`}>
              {retour === o.v && <span className="size-2.5 rounded-full bg-white" />}
            </span>
            <span>
              <span className="block font-medium">{o.t}</span>
              <span className={`block text-sm ${retour === o.v ? "text-white/60" : "text-zinc-500"}`}>{o.s}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Vertrek / Bestemming */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LegCard title="Vertrek" question="Hoe wilt u het voertuig aanleveren?" adresLabel="Ophalen op adres" depotNote="Uw voertuig wordt aangeleverd aan ons depot in Roeselare." leg={vertrek} set={setVertrek} tried={tried} />
        <LegCard title="Bestemming" question="Hoe wilt u het voertuig afleveren?" adresLabel="Levering op adres" depotNote="Uw voertuig wordt afgehaald aan ons depot in Roeselare." leg={bestemming} set={setBestemming} tried={tried} />
      </div>

      {/* Autogegevens */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-tight text-zinc-950">Autogegevens</h2>
          <button
            type="button"
            onClick={() => setCars((cs) => [...cs, emptyCar(Math.max(...cs.map((c) => c.id)) + 1)])}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium text-zinc-950 ring-1 ring-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white"
          >
            <span aria-hidden className="text-lg leading-none">+</span> Voeg nog een auto toe
          </button>
        </div>
        <div className="mt-6 space-y-6">
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
        <h2 className="text-2xl font-medium tracking-tight text-zinc-950">Contactgegevens</h2>
        <div className="mt-6 grid gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <Label req>Type klant</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["Particulier", "Bedrijf"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKlant(k)}
                    aria-pressed={klant === k}
                    className={`min-h-12 rounded-xl text-sm font-medium ring-1 transition-colors ${
                      klant === k ? "bg-zinc-950 text-white ring-zinc-950" : "bg-white text-zinc-950 ring-zinc-200 hover:ring-zinc-400"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            {klant === "Bedrijf" && (
              <Field label="Bedrijfsnaam" value={contact.bedrijf} onChange={(v) => setContact({ ...contact, bedrijf: v })} autoComplete="organization" />
            )}
            <Field label="Naam" req value={contact.naam} onChange={(v) => setContact({ ...contact, naam: v })} autoComplete="name" invalid={tried && !contact.naam.trim()} />
            <Field label="E-mailadres" req type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} autoComplete="email" placeholder="voorbeeld@domein.be" invalid={tried && !/\S+@\S+\.\S+/.test(contact.email)} />
          </div>
          <div className="space-y-5">
            <Field label="Telefoonnummer" req type="tel" value={contact.telefoon} onChange={(v) => setContact({ ...contact, telefoon: v })} autoComplete="tel" placeholder="Bijv. 0470 12 34 56" invalid={tried && contact.telefoon.trim().length < 6} />
            <Area label="Bericht" value={contact.bericht} onChange={(v) => setContact({ ...contact, bericht: v })} placeholder="Nog extra informatie? Laat het ons weten." />
          </div>
        </div>
      </Card>

      {/* Trust row + submit */}
      <div className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200 sm:p-8">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Veilig transport", s: "Uw voertuig in goede handen" },
            { t: "Snelle service", s: "Antwoord binnen 24 uur" },
            { t: "Transparante prijzen", s: "Geen verrassingen" },
            { t: "Europa", s: "België · Nederland · Frankrijk & verder" },
          ].map((it) => (
            <li key={it.t} className="flex items-start gap-3">
              <span aria-hidden className="mt-1.5 size-2 flex-none rounded-full bg-zinc-950" />
              <span>
                <span className="block text-sm font-medium text-zinc-950">{it.t}</span>
                <span className="block text-sm text-zinc-500">{it.s}</span>
              </span>
            </li>
          ))}
        </ul>
        {tried && !valid && (
          <p role="alert" className="mt-6 text-sm font-medium text-red-600">
            Vul de verplichte velden (*) in om uw aanvraag te versturen.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-base font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Offerte aanvragen
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className="mt-3 text-center text-sm text-zinc-500">
          Vrijblijvende aanvraag — geen definitieve boeking. Wij nemen zo snel mogelijk contact met u op.
        </p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200 sm:p-8">{children}</div>;
}

function Label({ children, req, optional, htmlFor }: { children: React.ReactNode; req?: boolean; optional?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-950">
      {children}
      {req && <span className="text-zinc-400"> *</span>}
      {optional && <span className="font-normal text-zinc-400"> (optioneel)</span>}
    </label>
  );
}

const inputCls = (invalid?: boolean) =>
  `mt-2 block min-h-12 w-full rounded-xl bg-white px-4 text-base text-zinc-950 ring-1 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 sm:text-sm ${
    invalid ? "ring-red-500" : "ring-zinc-200"
  }`;

function Field({
  label, value, onChange, req, optional, type = "text", placeholder, autoComplete, invalid, list,
}: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; optional?: boolean; type?: string;
  placeholder?: string; autoComplete?: string; invalid?: boolean; list?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} req={req} optional={optional}>{label}</Label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} list={list} aria-invalid={invalid || undefined} className={inputCls(invalid)} />
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, req, invalid }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string; req?: boolean; invalid?: boolean }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} req={req}>{label}</Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} className={`${inputCls(invalid)} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2371717a%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10 ${value ? "" : "text-zinc-400"}`}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Area({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} optional>{label}</Label>
      <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls()} min-h-28 py-3`} />
    </div>
  );
}

function LegCard({
  title, question, adresLabel, depotNote, leg, set, tried,
}: {
  title: string; question: string; adresLabel: string; depotNote: string; leg: Leg; set: (l: Leg) => void; tried: boolean;
}) {
  const p = (patch: Partial<Leg>) => set({ ...leg, ...patch });
  return (
    <Card>
      <h2 className="text-2xl font-medium tracking-tight text-zinc-950">{title}</h2>
      <p className="mt-4 text-sm font-medium text-zinc-950">
        {question}
        <span className="text-zinc-400"> *</span>
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => p({ mode: "depot" })}
          aria-pressed={leg.mode === "depot"}
          className={`min-h-16 rounded-xl px-4 py-3 text-left text-sm ring-1 transition-colors ${
            leg.mode === "depot" ? "bg-zinc-950 text-white ring-zinc-950" : "bg-white text-zinc-950 ring-zinc-200 hover:ring-zinc-400"
          }`}
        >
          <span className="block font-medium">Depot Mcars</span>
          <span className={`block ${leg.mode === "depot" ? "text-white/60" : "text-zinc-500"}`}>
            {site.address.street}, {site.address.city}
          </span>
        </button>
        <button
          type="button"
          onClick={() => p({ mode: "adres" })}
          aria-pressed={leg.mode === "adres"}
          className={`min-h-16 rounded-xl px-4 py-3 text-left text-sm font-medium ring-1 transition-colors ${
            leg.mode === "adres" ? "bg-zinc-950 text-white ring-zinc-950" : "bg-white text-zinc-950 ring-zinc-200 hover:ring-zinc-400"
          }`}
        >
          {adresLabel}
        </button>
      </div>

      {leg.mode === "depot" ? (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-zinc-600 ring-1 ring-zinc-200">{depotNote}</p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Select label="Land" req value={leg.land} onChange={(v) => p({ land: v })} options={LANDEN} placeholder="Selecteer land" invalid={tried && !leg.land} />
          <Field label="Stad / Plaats" req value={leg.stad} onChange={(v) => p({ stad: v })} placeholder="Bijv. Roeselare" autoComplete="address-level2" invalid={tried && !leg.stad.trim()} />
          <Field label="Postcode" req value={leg.postcode} onChange={(v) => p({ postcode: v })} placeholder="Bijv. 8800" autoComplete="postal-code" invalid={tried && !leg.postcode.trim()} />
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
    <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-950">Auto {index + 1}</h3>
        {canRemove && (
          <button type="button" onClick={remove} className="min-h-11 rounded-xl px-3 text-sm text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-950 hover:ring-zinc-400">
            Verwijderen
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        <Select label="Merk" req value={car.merk} onChange={(v) => set({ merk: v })} options={MERKEN} placeholder="Selecteer merk" invalid={tried && !car.merk} />
        <Field label="Model" req value={car.model} onChange={(v) => set({ model: v })} placeholder="Bijv. Golf, X5, 911" invalid={tried && !car.model.trim()} />
        <Field label="Bouwjaar" optional value={car.bouwjaar} onChange={(v) => set({ bouwjaar: v.replace(/\D/g, "").slice(0, 4) })} placeholder="Bijv. 2022" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-zinc-950">
            Staat van het voertuig<span className="text-zinc-400"> *</span>
          </p>
          <div className="mt-2 space-y-2" role="radiogroup" aria-label="Staat van het voertuig">
            {STAAT.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={car.staat === s.id}
                onClick={() => set({ staat: s.id })}
                className={`flex min-h-12 w-full items-center rounded-xl px-4 text-left text-sm ring-1 transition-colors ${
                  car.staat === s.id ? "bg-zinc-950 text-white ring-zinc-950" : "bg-white text-zinc-950 ring-zinc-200 hover:ring-zinc-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <Area
          label="Extra informatie"
          value={car.extra}
          onChange={(v) => set({ extra: v })}
          placeholder="Bijv. schade, niet-rijdbaar, meerdere voertuigen, topbox, fietsdragers, speciale afmetingen, …"
        />
        <div>
          <Label htmlFor={fileId} optional>Foto&apos;s voertuig / volmacht</Label>
          <label
            htmlFor={fileId}
            className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-5 text-center text-sm text-zinc-600 transition-colors hover:border-zinc-500"
          >
            <span className="font-medium text-zinc-950">Kies foto&apos;s of een volmacht</span>
            <span className="mt-1 text-xs text-zinc-500">JPG, PNG of PDF · meerdere bestanden mogelijk</span>
            {car.files.length > 0 && <span className="mt-2 text-xs text-zinc-950">{car.files.length} bestand(en) gekozen</span>}
          </label>
          <input
            id={fileId}
            type="file"
            multiple
            accept="image/jpeg,image/png,application/pdf"
            className="sr-only"
            onChange={(e) => set({ files: [...(e.target.files ?? [])].map((f) => f.name) })}
          />
        </div>
      </div>
    </div>
  );
}
