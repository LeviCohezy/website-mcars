"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 transition-colors placeholder:text-zinc-500 focus:ring-2 focus:ring-white/60 focus:outline-none";
const labelClass = "mb-2 block text-sm font-medium text-zinc-400";

export default function QuoteForm() {
  const [type, setType] = useState<"particulier" | "bedrijf">("particulier");
  const [depot, setDepot] = useState(false);
  const [asap, setAsap] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [
      `Type klant: ${type}`,
      `Naam: ${data.get("naam")}`,
      `E-mail: ${data.get("email")}`,
      `Telefoon: ${data.get("telefoon")}`,
      ``,
      `Ophaaladres: ${data.get("ophaal")}`,
      `Leveradres: ${depot ? "Mcars-depot, Roeselare" : data.get("lever")}`,
      ``,
      `Voertuig: ${data.get("voertuig")}`,
      `Toestand: ${data.get("toestand")}`,
      `Topbox of fietsdrager: ${data.get("topbox") ? "ja" : "nee"}`,
      ``,
      `Beschikbaar voor ophaling: ${asap ? "zo snel mogelijk" : data.get("ophaaldatum")}`,
      `Gewenste leverdatum: ${data.get("leverdatum") || "-"}`,
      ``,
      `Opmerkingen: ${data.get("opmerking") || "-"}`,
    ];
    const mailto = `mailto:info@mcars.be?subject=${encodeURIComponent(
      "Offerteaanvraag transport"
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
  };

  return (
    <section id="offerte" className="px-5 py-16 sm:px-8 sm:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_70%_at_85%_15%,rgb(255_255_255/0.06),transparent_70%)]"
        />
        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:p-16">
          {/* Left: pitch */}
          <div>
            <p className="mb-4 text-sm font-medium tracking-widest text-zinc-500 uppercase">
              Offerte aanvragen
            </p>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
              <span className="text-white">Vertel ons wat er moet rijden. </span>
              <span className="text-zinc-500">
                Binnen 24 uur hebt u een prijs.
              </span>
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Persoonlijk antwoord van ons team — geen automatische mails",
                "Vaste prijs, zonder verborgen kosten",
                "Ophaling waar u wil, levering op ons depot kan 24/7",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-zinc-400"
                >
                  <svg
                    className="mt-0.5 size-4 flex-none text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 12.5l5 5 10-11" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-white/10 pt-6 text-sm leading-relaxed text-zinc-500">
              Liever per mail?{" "}
              <a
                href="mailto:info@mcars.be"
                className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                info@mcars.be
              </a>
              <br />
              Moorseelsesteenweg 16B, 8800 Roeselare
            </div>
          </div>

          {/* Right: the form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {/* Type */}
            <div className="flex gap-2" role="radiogroup" aria-label="Type klant">
              {(["particulier", "bedrijf"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={type === option}
                  onClick={() => setType(option)}
                  className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                    type === option
                      ? "bg-white text-zinc-950"
                      : "bg-white/5 text-zinc-400 ring-1 ring-white/10 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ophaal" className={labelClass}>
                  Ophaaladres
                </label>
                <input
                  id="ophaal"
                  name="ophaal"
                  required
                  placeholder="Straat, gemeente, land"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lever" className={labelClass}>
                  Leveradres
                </label>
                <input
                  id="lever"
                  name="lever"
                  required={!depot}
                  disabled={depot}
                  placeholder={depot ? "Mcars-depot, Roeselare" : "Straat, gemeente, land"}
                  className={`${inputClass} disabled:opacity-50`}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={depot}
                onChange={(e) => setDepot(e.target.checked)}
                className="size-4 accent-white"
              />
              Levering op het Mcars-depot (voordeliger, ophalen kan 24/7)
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="voertuig" className={labelClass}>
                  Voertuig
                </label>
                <input
                  id="voertuig"
                  name="voertuig"
                  required
                  placeholder="Merk en model"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="toestand" className={labelClass}>
                  Toestand
                </label>
                <select
                  id="toestand"
                  name="toestand"
                  className={`${inputClass} appearance-none [&>option]:text-zinc-950`}
                >
                  <option>Start en rijdt</option>
                  <option>Start niet, maar is verrolbaar</option>
                  <option>Start niet en is geblokkeerd</option>
                </select>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
              <input type="checkbox" name="topbox" className="size-4 accent-white" />
              Topbox of fietsdrager aanwezig
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ophaaldatum" className={labelClass}>
                  Beschikbaar voor ophaling
                </label>
                <input
                  id="ophaaldatum"
                  name="ophaaldatum"
                  type="date"
                  disabled={asap}
                  className={`${inputClass} disabled:opacity-50 [color-scheme:dark]`}
                />
                <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={asap}
                    onChange={(e) => setAsap(e.target.checked)}
                    className="size-4 accent-white"
                  />
                  Zo snel mogelijk
                </label>
              </div>
              <div>
                <label htmlFor="leverdatum" className={labelClass}>
                  Gewenste leverdatum
                </label>
                <input
                  id="leverdatum"
                  name="leverdatum"
                  type="date"
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="naam" className={labelClass}>
                  Naam
                </label>
                <input id="naam" name="naam" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="telefoon" className={labelClass}>
                  Telefoon
                </label>
                <input
                  id="telefoon"
                  name="telefoon"
                  type="tel"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="opmerking" className={labelClass}>
                Opmerkingen <span className="text-zinc-600">(optioneel)</span>
              </label>
              <textarea
                id="opmerking"
                name="opmerking"
                rows={3}
                placeholder="Bijzonderheden over het voertuig of transport"
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="group mt-2 inline-flex cursor-pointer items-center justify-center gap-3 self-start rounded-full bg-white py-3 pr-3 pl-7 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              Verstuur aanvraag
              <span className="flex size-8 items-center justify-center rounded-full bg-zinc-950 text-white">
                <svg
                  className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
            <p className="text-xs leading-relaxed text-zinc-600">
              Uw aanvraag opent in uw mailprogramma en komt rechtstreeks bij ons
              team terecht. Wij antwoorden zelf — binnen 24 uur.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
