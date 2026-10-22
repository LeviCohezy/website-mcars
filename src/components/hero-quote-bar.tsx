"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * Hero quote form, in three steps (fields from the client intake briefing §7):
 *
 *   1  Ophaaladres · Leveradres · Ophaaldatum       (looks exactly as before)
 *   2  Uw voertuig: merk & model · toestand · topbox/fietsdrager · levering
 *   3  Uw gegevens: particulier/bedrijf · naam · e-mail · telefoon
 *
 * Steps slide in smoothly; steps 2 and 3 have a back button. On the last step
 * the request opens in the visitor's mail client to info@mcars.be (no backend,
 * same as the other forms), then a short confirmation replaces the fields.
 *
 * Layouts (unchanged look):
 *   bar    horizontal glass bar          (service pages)
 *   card   stacked dark glass card       (route pages; `defaults` prefill the corridor)
 *   panel  white card with visible labels (Dienst 02 hero)
 *   home   homepage hero bar: swap button + dark "Plan transport" CTA
 */

type Layout = "bar" | "card" | "panel" | "home";
type Values = Record<string, string>;

const STEPS = ["Route", "Uw voertuig", "Uw gegevens"] as const;

const TOESTAND = ["Start en rijdt", "Start niet, wel verrolbaar", "Start niet, geblokkeerd"];
const EXTRAS = ["Geen topbox of fietsdrager", "Topbox", "Fietsdrager", "Topbox en fietsdrager"];
const LEVERING = ["Levering op het leveradres", "Levering op het Mcars-depot (voordeliger, 24/7)"];
const KLANT = ["Particulier", "Bedrijf"];

export default function HeroQuoteBar({
  service,
  layout = "bar",
  title,
  subtitle,
  defaults = {},
  className = "",
}: {
  service?: string;
  layout?: Layout;
  title?: string;
  /** Second, muted line of the panel title. */
  subtitle?: string;
  defaults?: { van?: string; naar?: string };
  className?: string;
}) {
  const card = layout === "card";
  const panel = layout === "panel";
  const home = layout === "home";
  const stacked = card || panel;
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [v, setV] = useState<Values>({
    van: defaults.van ?? "",
    naar: defaults.naar ?? "",
    datum: "",
    voertuig: "",
    toestand: TOESTAND[0],
    extras: EXTRAS[0],
    levering: LEVERING[0],
    klant: KLANT[0],
    naam: "",
    email: "",
    telefoon: "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  const input = panel
    ? "w-full min-w-0 bg-transparent text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none"
    : "w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none";
  const select = `${input} cursor-pointer appearance-none pr-6 [&>option]:text-zinc-950`;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Native validation for the fields of the step on screen.
    if (!formRef.current?.reportValidity()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const lines = [
      service ? `Dienst: ${service}` : "",
      `Type klant: ${v.klant}`,
      `Naam: ${v.naam}`,
      `E-mail: ${v.email}`,
      `Telefoon: ${v.telefoon || "-"}`,
      "",
      `Ophaaladres: ${v.van}`,
      `Leveradres: ${v.levering === LEVERING[1] ? "Mcars-depot, Roeselare" : v.naar}`,
      `Beschikbaar voor ophaling: ${v.datum || "zo snel mogelijk"}`,
      "",
      `Voertuig: ${v.voertuig}`,
      `Toestand: ${v.toestand}`,
      `Topbox / fietsdrager: ${v.extras}`,
    ].filter((l, i) => l !== "" || i > 0);
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Offerteaanvraag transport")}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  const back = () => setStep((s) => Math.max(0, s - 1));
  const last = step === STEPS.length - 1;
  const cta = step === 0 ? (home ? "Plan transport" : "Prijs aanvragen") : last ? "Verstuur aanvraag" : "Volgende";

  const button = (
    <button
      type="submit"
      className={`group flex flex-none cursor-pointer items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
        panel
          ? "mt-1 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          : home
          ? "rounded-2xl bg-zinc-950 font-semibold text-white hover:bg-zinc-800 focus-visible:ring-white"
          : `rounded-2xl bg-white text-ink hover:bg-zinc-200 focus-visible:ring-white ${card ? "mt-2" : ""}`
      }`}
    >
      {cta}
      <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );

  const muted = panel ? "text-zinc-500" : "text-white/70";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate={false}
      className={`w-full ${
        panel
          ? "rounded-xl bg-white p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] sm:p-6"
          : card
          ? "rounded-[1.75rem] border border-white/15 bg-zinc-950/30 p-5 backdrop-blur-xl sm:p-6"
          : "max-w-5xl rounded-[1.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
      } ${className}`.trim()}
    >
      {card && title && step === 0 && !sent && <p className="mb-4 text-lg font-medium tracking-tight text-white">{title}</p>}
      {panel && title && step === 0 && !sent && (
        <p className="mb-5 text-xl leading-snug font-medium tracking-tight text-zinc-950">
          {title}
          {subtitle && <span className="block text-zinc-400">{subtitle}</span>}
        </p>
      )}

      {/* Step header (steps 2 and 3): back button + progress */}
      {step > 0 && !sent && (
        <div className={`flex items-center justify-between gap-4 ${stacked ? "mb-4" : "mb-2.5 px-1 pt-0.5"}`}>
          <button type="button" onClick={back} className={`flex min-h-9 cursor-pointer items-center gap-1.5 text-sm font-medium ${panel ? "text-zinc-950" : "text-white"} hover:opacity-70`}>
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Terug
          </button>
          <p className={`text-sm ${muted}`}>
            Stap {step + 1} van {STEPS.length} · <span className={panel ? "text-zinc-950" : "text-white"}>{STEPS[step]}</span>
          </p>
        </div>
      )}

      {sent ? (
        <Pane key="sent">
          <div className={`flex flex-col items-start gap-1 ${stacked ? "" : "px-2 py-1.5"}`}>
            <p className={`text-base font-medium ${panel ? "text-zinc-950" : "text-white"}`}>Bedankt — uw aanvraag staat klaar in uw mailprogramma.</p>
            <p className={`text-sm ${muted}`}>Verstuur de mail en u krijgt binnen 24 uur een persoonlijk antwoord.</p>
            <button type="button" onClick={() => { setSent(false); setStep(0); }} className={`mt-2 cursor-pointer text-sm underline underline-offset-4 ${muted}`}>
              Nieuwe aanvraag
            </button>
          </div>
        </Pane>
      ) : (
        <Pane key={step}>
          <div className={`flex flex-col ${panel ? "gap-4" : "gap-2"} ${stacked ? "" : "lg:flex-row lg:items-center"}`}>
            {step === 0 && (
              <>
                <Field icon={<PinIcon />} label="Ophaaladres" panel={panel}>
                  <input name="van" required value={v.van} onChange={set("van")} placeholder={panel ? "Straat, gemeente, land" : home ? "Vertreklocatie" : "Ophaaladres"} className={input} />
                </Field>
                {home && (
                  <button
                    type="button"
                    aria-label="Wissel vertrek- en bestemmingslocatie"
                    onClick={() => setV((p) => ({ ...p, van: p.naar, naar: p.van }))}
                    className="hidden size-9 flex-none cursor-pointer items-center justify-center self-center rounded-full bg-white text-zinc-900 shadow-md transition-transform hover:scale-105 lg:flex"
                  >
                    <SwapIcon />
                  </button>
                )}
                <Field icon={<FlagIcon />} label="Leveradres" panel={panel}>
                  <input name="naar" required value={v.naar} onChange={set("naar")} placeholder={panel ? "Straat, gemeente, land" : home ? "Bestemmingslocatie" : "Leveradres"} className={input} />
                </Field>
                <Field icon={<CalendarIcon />} label="Ophaaldatum" panel={panel}>
                  <input
                    name="datum"
                    type={v.datum ? "date" : "text"}
                    value={v.datum}
                    onChange={set("datum")}
                    placeholder={panel ? "Kies een datum" : home ? "Aankomstdatum" : "Ophaaldatum"}
                    onFocus={(e) => (e.currentTarget.type = "date")}
                    onBlur={(e) => {
                      if (!e.currentTarget.value) e.currentTarget.type = "text";
                    }}
                    className={`${input} ${panel ? "" : "[color-scheme:dark]"}`}
                  />
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <Field icon={<CarIcon />} label="Merk en model" panel={panel}>
                  <input name="voertuig" required value={v.voertuig} onChange={set("voertuig")} placeholder={panel ? "Bv. Volkswagen Golf" : "Merk en model"} className={input} />
                </Field>
                <Field icon={<KeyIcon />} label="Toestand" panel={panel} select>
                  <select name="toestand" value={v.toestand} onChange={set("toestand")} className={select}>
                    {TOESTAND.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field icon={<BoxIcon />} label="Topbox of fietsdrager" panel={panel} select>
                  <select name="extras" value={v.extras} onChange={set("extras")} className={select}>
                    {EXTRAS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field icon={<FlagIcon />} label="Levering" panel={panel} select>
                  <select name="levering" value={v.levering} onChange={set("levering")} className={select}>
                    {LEVERING.map((o) => <option key={o} value={o}>{o === LEVERING[1] && !panel && !stacked ? "Op het Mcars-depot (24/7)" : o}</option>)}
                  </select>
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field icon={<UserIcon />} label="Particulier of bedrijf" panel={panel} select>
                  <select name="klant" value={v.klant} onChange={set("klant")} className={select}>
                    {KLANT.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field icon={<UserIcon />} label="Naam" panel={panel}>
                  <input name="naam" required autoComplete="name" value={v.naam} onChange={set("naam")} placeholder={panel ? "Voor- en achternaam" : "Naam"} className={input} />
                </Field>
                <Field icon={<MailIcon />} label="E-mail" panel={panel}>
                  <input name="email" type="email" required autoComplete="email" value={v.email} onChange={set("email")} placeholder={panel ? "naam@voorbeeld.be" : "E-mail"} className={input} />
                </Field>
                <Field icon={<PhoneIcon />} label="Telefoon" panel={panel}>
                  <input name="telefoon" type="tel" autoComplete="tel" value={v.telefoon} onChange={set("telefoon")} placeholder={panel ? "Optioneel" : "Telefoon (optioneel)"} className={input} />
                </Field>
              </>
            )}

            {button}
          </div>
        </Pane>
      )}
    </form>
  );
}

/** Slides each step in from the right with a short fade. */
function Pane({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        shown ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function Field({ icon, label, panel = false, select = false, children }: { icon: React.ReactNode; label: string; panel?: boolean; select?: boolean; children: React.ReactNode }) {
  const chevron = select && (
    <svg className="pointer-events-none -ml-5 size-4 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
  if (panel) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-500">{label}</span>
        <span className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3.5 text-zinc-500 ring-zinc-950 transition-shadow focus-within:ring-2">
          {icon}
          {children}
          {chevron}
        </span>
      </label>
    );
  }
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3.5 text-white/80 ring-white/60 transition-shadow focus-within:ring-2">
      {icon}
      <span className="sr-only">{label}</span>
      {children}
      {chevron}
    </label>
  );
}

const ic = "size-4 shrink-0";
const svgProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function PinIcon() {
  return <svg className={ic} {...svgProps}><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}
function FlagIcon() {
  return <svg className={ic} {...svgProps}><path d="M5 21V4m0 1h12l-2.5 4L17 13H5" /></svg>;
}
function CalendarIcon() {
  return <svg className={ic} {...svgProps}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></svg>;
}
function CarIcon() {
  return <svg className={ic} {...svgProps}><path d="M5 13l1.5-4.5A2 2 0 018.4 7h7.2a2 2 0 011.9 1.5L19 13M5 13h14v4H5zM7 17v2M17 17v2" /><circle cx="8" cy="15" r=".5" /><circle cx="16" cy="15" r=".5" /></svg>;
}
function KeyIcon() {
  return <svg className={ic} {...svgProps}><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3" /></svg>;
}
function BoxIcon() {
  return <svg className={ic} {...svgProps}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>;
}
function UserIcon() {
  return <svg className={ic} {...svgProps}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg>;
}
function MailIcon() {
  return <svg className={ic} {...svgProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
}
function PhoneIcon() {
  return <svg className={ic} {...svgProps}><path d="M5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>;
}
function SwapIcon() {
  return <svg className="size-4 rotate-90" {...svgProps}><path d="M7 4v13m0 0l-3-3m3 3l3-3m7 6V7m0 0l-3 3m3-3l3 3" /></svg>;
}
