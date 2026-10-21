"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";

/*
 * QuoteFlow — the hero quote form used on every page.
 *
 * It opens as ONE question with quick-pick chips. Nothing else is visible: no
 * step counter, no field list. Only after the first answer does a hairline
 * progress bar fade in at the top. Each answer condenses into a small chip
 * above the question (tap a chip to edit it) and the next question slides in.
 *
 * The questions are exactly the quote fields from the client intake
 * (docs/mcars-website-intake-briefing.md §7 "Velden offerteformulier"):
 *   particulier/bedrijf · ophaaladres · leveradres (optie Mcars-depot) ·
 *   start hij? → zo nee: verrolbaar? · topbox of fietsdrager? ·
 *   beschikbaar voor ophaling (optie "onmiddellijk") · gewenste leverdatum
 * plus the vehicle type (§3), the return-transport option for private
 * customers the client liked on crosseurope.be (§2), and contact details.
 *
 * Submitting opens a pre-filled e-mail to info@mcars.be — the same delivery
 * the rest of the site uses until a real mail flow is connected. No automatic
 * confirmation mail (client request).
 */

type Tone = "light" | "dark" | "glass";

type Answers = {
  voertuig?: string;
  klant?: "Particulier" | "Bedrijf";
  ophaal?: string;
  lever?: string;
  rijdt?: "Ja" | "Nee";
  verrolbaar?: "Ja" | "Nee";
  extras?: string;
  ophaling?: string;
  levering?: string;
  retour?: "Ja" | "Nee";
};

type StepId = keyof Answers | "contact";

const VEHICLES = ["Personenwagen", "SUV of 4x4", "Camionette", "Oldtimer", "Sportwagen", "Moto", "Boot, buggy of aanhangwagen"];

const LABEL: Record<StepId, string> = {
  voertuig: "Voertuig",
  klant: "Klant",
  ophaal: "Ophalen",
  lever: "Leveren",
  rijdt: "Start",
  verrolbaar: "Verrolbaar",
  extras: "Topbox/fietsdrager",
  ophaling: "Ophaling",
  levering: "Levering",
  retour: "Retour",
  contact: "Contact",
};

function stepsFor(a: Answers): StepId[] {
  const s: StepId[] = ["voertuig", "klant", "ophaal", "lever", "rijdt"];
  if (a.rijdt === "Nee") s.push("verrolbaar");
  s.push("extras", "ophaling", "levering");
  if (a.klant === "Particulier") s.push("retour");
  s.push("contact");
  return s;
}

const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

export default function QuoteFlow({
  tone = "light",
  size = "hero",
  preset = {},
  service,
  className = "",
}: {
  tone?: Tone;
  /** "hero" = large question type; "compact" = for narrow side panels. */
  size?: "hero" | "compact";
  /** Prefill (e.g. route pages pass the corridor). Prefilled values are still asked, just filled in. */
  preset?: { voertuig?: string; ophaal?: string; lever?: string };
  /** Service the visitor came from — added to the e-mail subject. */
  service?: string;
  className?: string;
}) {
  const [a, setA] = useState<Answers>({});
  const [step, setStep] = useState<StepId>("voertuig");
  const [dir, setDir] = useState<1 | -1>(1);
  const [sent, setSent] = useState(false);
  const steps = useMemo(() => stepsFor(a), [a]);
  const index = steps.indexOf(step);
  const started = index > 0 || sent;
  const progress = sent ? 1 : index / (steps.length - 1);

  const t = THEME[tone];
  const big = size === "hero";

  const go = (next: StepId, d: 1 | -1 = 1) => {
    setDir(d);
    setStep(next);
  };

  /** Save an answer and move to the next question (computed with the new answer). */
  const answer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    const nextA = { ...a, [key]: value };
    if (key === "rijdt" && value === "Ja") delete nextA.verrolbaar;
    if (key === "klant" && value === "Bedrijf") delete nextA.retour;
    setA(nextA);
    const s = stepsFor(nextA);
    const after = s[s.indexOf(key as StepId) + 1];
    // Skip questions that were already answered while editing a chip.
    const firstOpen = s.slice(s.indexOf(key as StepId) + 1).find((id) => id === "contact" || nextA[id as keyof Answers] === undefined);
    go(firstOpen ?? after);
  };

  const back = () => index > 0 && go(steps[index - 1], -1);

  const answered = steps.filter((id) => id !== "contact" && a[id as keyof Answers] !== undefined && id !== step);

  function submit(contact: { naam: string; email: string; telefoon: string; bedrijf: string; opmerking: string }) {
    const lines = [
      `Voertuig: ${a.voertuig}`,
      `Klant: ${a.klant}${contact.bedrijf ? ` — ${contact.bedrijf}` : ""}`,
      `Ophaaladres: ${a.ophaal}`,
      `Leveradres: ${a.lever}`,
      `Start het voertuig: ${a.rijdt}`,
      ...(a.rijdt === "Nee" ? [`Verrolbaar: ${a.verrolbaar}`] : []),
      `Topbox of fietsdrager: ${a.extras}`,
      `Beschikbaar voor ophaling: ${a.ophaling}`,
      `Gewenste levering: ${a.levering}`,
      ...(a.klant === "Particulier" ? [`Retourtransport gewenst: ${a.retour}`] : []),
      ``,
      `Naam: ${contact.naam}`,
      `E-mail: ${contact.email}`,
      `Telefoon: ${contact.telefoon}`,
      `Opmerkingen (merk, model, …): ${contact.opmerking || "-"}`,
    ];
    const subject = `Offerteaanvraag transport${service ? ` — ${service}` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  return (
    <div data-quote-flow className={`relative overflow-hidden ${t.shell} ${big ? "rounded-[1.75rem] p-5 sm:p-7" : "rounded-2xl p-5"} ${className}`}>
      {/* Progress — invisible until the first answer, then a hairline that fades in */}
      <div aria-hidden className={`absolute inset-x-0 top-0 h-[3px] transition-opacity duration-700 ${started ? "opacity-100" : "opacity-0"}`}>
        <div className={`h-full ${t.bar} transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]`} style={{ width: `${Math.max(progress, 0.04) * 100}%` }} />
      </div>
      <p className="sr-only" aria-live="polite">
        {started && !sent ? `Vraag ${index + 1} van ${steps.length}` : ""}
      </p>

      {/* Condensed answers */}
      {answered.length > 0 && !sent && (
        <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap">
          {answered.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id, -1)}
              title={`${LABEL[id]} wijzigen`}
              className={`qf-chip-in flex min-h-8 flex-none items-center gap-1.5 rounded-full px-3 text-xs transition-colors ${t.answered}`}
            >
              <span className={t.answeredKey}>{LABEL[id]}</span>
              <span className="max-w-[11rem] truncate font-medium">{a[id as keyof Answers]}</span>
            </button>
          ))}
        </div>
      )}

      {sent ? (
        <div className="qf-in-1 py-2">
          <p className={`${big ? "text-2xl sm:text-3xl" : "text-xl"} font-light tracking-[-0.02em]`}>Bedankt — uw aanvraag staat klaar.</p>
          <p className={`mt-3 max-w-md text-sm leading-relaxed ${t.muted}`}>
            Verstuur de e-mail die nu openging. U krijgt binnen 24 uur een persoonlijke prijs en planning van ons team.
            Liever bellen? <a href={site.phoneHref} className="underline underline-offset-4">{site.phone}</a>
          </p>
        </div>
      ) : (
        <div key={step} className={dir === 1 ? "qf-in-1" : "qf-in-0"}>
          <Step id={step} a={a} preset={preset} answer={answer} submit={submit} t={t} big={big} />
        </div>
      )}

      {/* Footer: back + discreet dots, only once started */}
      {started && !sent && (
        <div className="qf-fade mt-5 flex items-center justify-between gap-4">
          <button type="button" onClick={back} className={`-ml-2 min-h-11 rounded-full px-2 text-sm transition-colors ${t.back}`}>
            ← Terug
          </button>
          <div aria-hidden className="flex items-center gap-1.5">
            {steps.map((id, i) => (
              <span
                key={id}
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? `w-4 ${t.dotOn}` : `w-1 ${i < index ? t.dotDone : t.dotOff}`}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Step({
  id,
  a,
  preset,
  answer,
  submit,
  t,
  big,
}: {
  id: StepId;
  a: Answers;
  preset: { voertuig?: string; ophaal?: string; lever?: string };
  answer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  submit: (c: { naam: string; email: string; telefoon: string; bedrijf: string; opmerking: string }) => void;
  t: Theme;
  big: boolean;
}) {
  const q = (text: string, sub?: string) => (
    <div className="mb-5">
      <p className={`${big ? "text-[1.65rem] leading-[1.1] sm:text-[2rem]" : "text-xl leading-tight"} font-light tracking-[-0.025em] text-balance`}>{text}</p>
      {sub && <p className={`mt-2 text-sm ${t.muted}`}>{sub}</p>}
    </div>
  );

  switch (id) {
    case "voertuig":
      return (
        <>
          {q("Wat mogen we voor u vervoeren?")}
          <Chips options={VEHICLES} value={a.voertuig ?? preset.voertuig} onPick={(v) => answer("voertuig", v)} t={t} />
          <TextAnswer placeholder="Iets anders? Typ het hier" initial="" onSubmit={(v) => answer("voertuig", v)} t={t} compact />
        </>
      );
    case "klant":
      return (
        <>
          {q("Vraagt u dit aan als particulier of als bedrijf?")}
          <Chips options={["Particulier", "Bedrijf"]} value={a.klant} onPick={(v) => answer("klant", v as Answers["klant"])} t={t} large />
        </>
      );
    case "ophaal":
      return (
        <>
          {q("Waar halen we het voertuig op?", "Adres of gemeente is genoeg.")}
          <TextAnswer address placeholder="Ophaaladres" initial={a.ophaal ?? preset.ophaal ?? ""} onSubmit={(v) => answer("ophaal", v)} t={t} />
        </>
      );
    case "lever":
      return (
        <>
          {q("En waar mag het naartoe?")}
          <TextAnswer address placeholder="Leveradres" initial={a.lever ?? preset.lever ?? ""} onSubmit={(v) => answer("lever", v)} t={t} />
          <div className="mt-3">
            <Chips options={["Levering op het Mcars-depot (Roeselare)"]} value={a.lever} onPick={(v) => answer("lever", v)} t={t} />
          </div>
        </>
      );
    case "rijdt":
      return (
        <>
          {q("Start het voertuig?")}
          <Chips options={["Ja", "Nee"]} value={a.rijdt} onPick={(v) => answer("rijdt", v as "Ja" | "Nee")} t={t} large />
        </>
      );
    case "verrolbaar":
      return (
        <>
          {q("Is het voertuig verrolbaar?", "Verrolbare wagens trekken we met de lier op de vrachtwagen.")}
          <Chips options={["Ja", "Nee"]} value={a.verrolbaar} onPick={(v) => answer("verrolbaar", v as "Ja" | "Nee")} t={t} large />
        </>
      );
    case "extras":
      return (
        <>
          {q("Staat er een topbox of fietsdrager op?")}
          <Chips options={["Nee", "Topbox", "Fietsdrager", "Allebei"]} value={a.extras} onPick={(v) => answer("extras", v)} t={t} large />
        </>
      );
    case "ophaling":
      return (
        <>
          {q("Vanaf wanneer staat het klaar voor ophaling?")}
          <DateAnswer quick={["Onmiddellijk"]} value={a.ophaling} onSubmit={(v) => answer("ophaling", v)} t={t} />
        </>
      );
    case "levering":
      return (
        <>
          {q("Tegen wanneer moet het geleverd zijn?")}
          <DateAnswer quick={["Zo snel mogelijk", "Flexibel"]} value={a.levering} onSubmit={(v) => answer("levering", v)} t={t} />
        </>
      );
    case "retour":
      return (
        <>
          {q("Moet het voertuig later ook terug?", "Bv. na een rally, beurs of verblijf in het buitenland.")}
          <Chips options={["Nee, enkel heen", "Ja, ook retour"]} value={a.retour === "Ja" ? "Ja, ook retour" : a.retour === "Nee" ? "Nee, enkel heen" : undefined} onPick={(v) => answer("retour", v.startsWith("Ja") ? "Ja" : "Nee")} t={t} large />
        </>
      );
    case "contact":
      return <ContactStep isCompany={a.klant === "Bedrijf"} onSubmit={submit} t={t} big={big} q={q} />;
  }
}

function Chips({ options, value, onPick, t, large = false }: { options: string[]; value?: string; onPick: (v: string) => void; t: Theme; large?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          style={{ animationDelay: `${60 + i * 35}ms` }}
          className={`qf-chip-in min-h-11 rounded-full px-4 text-sm transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${large ? "min-w-24 sm:px-6" : ""} ${
            value === o ? t.chipOn : t.chip
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function NextButton({ t, disabled, label = "Verder" }: { t: Theme; disabled?: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex min-h-12 flex-none items-center gap-2 rounded-full px-5 text-sm font-medium transition-[opacity,background-color] disabled:opacity-35 ${t.next}`}
    >
      {label}
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

function TextAnswer({
  placeholder,
  initial,
  onSubmit,
  t,
  address = false,
  compact = false,
}: {
  placeholder: string;
  initial: string;
  onSubmit: (v: string) => void;
  t: Theme;
  address?: boolean;
  compact?: boolean;
}) {
  const [v, setV] = useState(initial);
  const [sugg, setSugg] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (!compact) ref.current?.focus({ preventScroll: true });
  }, [compact]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const lookup = (q: string) => {
    if (!address) return;
    clearTimeout(timer.current);
    if (q.trim().length < 3) return setSugg([]);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=4`);
        const json = await res.json();
        type P = { name?: string; housenumber?: string; street?: string; postcode?: string; city?: string; country?: string };
        const opts = (json.features ?? []).map(({ properties: p }: { properties: P }) =>
          [[p.street ?? p.name, p.housenumber].filter(Boolean).join(" "), [p.postcode, p.city].filter(Boolean).join(" "), p.country].filter(Boolean).join(", "),
        );
        setSugg([...new Set(opts as string[])].slice(0, 4));
      } catch {
        // suggestions are best-effort
      }
    }, 280);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (v.trim()) onSubmit(v.trim());
      }}
      className={compact ? "mt-3" : ""}
    >
      <div className={`flex items-center gap-2 rounded-full p-1.5 pl-5 ${t.field}`}>
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        <input
          ref={ref}
          id={id}
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            lookup(e.target.value);
          }}
          placeholder={placeholder}
          autoComplete={address ? "off" : undefined}
          className={`min-w-0 flex-1 bg-transparent py-2 text-base focus:outline-none ${t.input}`}
        />
        <NextButton t={t} disabled={!v.trim()} />
      </div>
      {sugg.length > 0 && (
        <ul className={`mt-2 overflow-hidden rounded-2xl ${t.menu}`}>
          {sugg.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => onSubmit(s)} className={`block min-h-11 w-full px-5 py-2.5 text-left text-sm ${t.menuItem}`}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

function DateAnswer({ quick, value, onSubmit, t }: { quick: string[]; value?: string; onSubmit: (v: string) => void; t: Theme }) {
  const [d, setD] = useState("");
  const id = useId();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <Chips options={quick} value={value} onPick={onSubmit} t={t} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (d) onSubmit(fmt(d));
        }}
        className="mt-3"
      >
        <div className={`flex items-center gap-2 rounded-full p-1.5 pl-5 ${t.field}`}>
          <label htmlFor={id} className={`flex-none text-sm ${t.muted}`}>Of kies een datum</label>
          <input id={id} type="date" min={today} value={d} onChange={(e) => setD(e.target.value)} className={`min-w-0 flex-1 bg-transparent py-2 text-base focus:outline-none ${t.input} ${t.dateScheme}`} />
          <NextButton t={t} disabled={!d} />
        </div>
      </form>
    </>
  );
}

function ContactStep({
  isCompany,
  onSubmit,
  t,
  big,
  q,
}: {
  isCompany: boolean;
  onSubmit: (c: { naam: string; email: string; telefoon: string; bedrijf: string; opmerking: string }) => void;
  t: Theme;
  big: boolean;
  q: (text: string, sub?: string) => React.ReactNode;
}) {
  const [c, setC] = useState({ naam: "", email: "", telefoon: "", bedrijf: "", opmerking: "" });
  const ok = c.naam.trim() && /\S+@\S+\.\S+/.test(c.email) && c.telefoon.trim().length >= 6;
  const field = (key: keyof typeof c, label: string, type = "text", autoComplete?: string) => (
    <label className={`block rounded-2xl px-4 pt-2.5 pb-2 ${t.field}`}>
      <span className={`block text-[11px] tracking-wide uppercase ${t.muted}`}>{label}</span>
      <input
        type={type}
        autoComplete={autoComplete}
        value={c[key]}
        onChange={(e) => setC({ ...c, [key]: e.target.value })}
        className={`w-full bg-transparent py-1 text-base focus:outline-none ${t.input}`}
      />
    </label>
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) onSubmit(c);
      }}
    >
      {q("Waar mogen we de prijs naartoe sturen?", "U krijgt binnen 24 uur een persoonlijke prijs en planning.")}
      <div className={`grid gap-2 ${big ? "sm:grid-cols-2" : ""}`}>
        {field("naam", "Naam", "text", "name")}
        {isCompany && field("bedrijf", "Bedrijf", "text", "organization")}
        {field("email", "E-mail", "email", "email")}
        {field("telefoon", "Telefoon", "tel", "tel")}
        <div className={big ? "sm:col-span-2" : ""}>{field("opmerking", "Merk, model of opmerking (optioneel)")}</div>
      </div>
      <div className="mt-4 flex justify-end">
        <NextButton t={t} disabled={!ok} label="Vraag mijn prijs aan" />
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */

type Theme = Record<
  "shell" | "bar" | "muted" | "chip" | "chipOn" | "answered" | "answeredKey" | "field" | "input" | "next" | "back" | "dotOn" | "dotDone" | "dotOff" | "menu" | "menuItem" | "dateScheme",
  string
>;

const THEME: Record<Tone, Theme> = {
  light: {
    shell: "bg-white text-zinc-950 shadow-[0_30px_80px_-30px_rgb(9_9_11/0.35)] ring-1 ring-zinc-950/5",
    bar: "bg-zinc-950",
    muted: "text-zinc-500",
    chip: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
    chipOn: "bg-zinc-950 text-white",
    answered: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
    answeredKey: "text-zinc-400",
    field: "bg-zinc-100 focus-within:ring-2 focus-within:ring-zinc-950/80",
    input: "text-zinc-950 placeholder:text-zinc-400",
    next: "bg-zinc-950 text-white hover:bg-zinc-800",
    back: "text-zinc-500 hover:text-zinc-950",
    dotOn: "bg-zinc-950",
    dotDone: "bg-zinc-400",
    dotOff: "bg-zinc-200",
    menu: "bg-white ring-1 ring-zinc-200",
    menuItem: "text-zinc-700 hover:bg-zinc-100",
    dateScheme: "[color-scheme:light]",
  },
  dark: {
    shell: "bg-zinc-900 text-white ring-1 ring-white/10",
    bar: "bg-white",
    muted: "text-white/50",
    chip: "bg-white/[0.07] text-white/85 hover:bg-white/15",
    chipOn: "bg-white text-zinc-950",
    answered: "bg-white/[0.07] text-white/85 hover:bg-white/15",
    answeredKey: "text-white/40",
    field: "bg-white/[0.07] focus-within:ring-2 focus-within:ring-white/70",
    input: "text-white placeholder:text-white/40",
    next: "bg-white text-zinc-950 hover:bg-zinc-200",
    back: "text-white/50 hover:text-white",
    dotOn: "bg-white",
    dotDone: "bg-white/45",
    dotOff: "bg-white/15",
    menu: "bg-zinc-800 ring-1 ring-white/10",
    menuItem: "text-white/80 hover:bg-white/10",
    dateScheme: "[color-scheme:dark]",
  },
  glass: {
    shell: "bg-zinc-950/55 text-white ring-1 ring-white/15 backdrop-blur-2xl",
    bar: "bg-white",
    muted: "text-white/60",
    chip: "bg-white/10 text-white hover:bg-white/20",
    chipOn: "bg-white text-zinc-950",
    answered: "bg-white/10 text-white/90 hover:bg-white/20",
    answeredKey: "text-white/50",
    field: "bg-white/10 focus-within:ring-2 focus-within:ring-white/70",
    input: "text-white placeholder:text-white/55",
    next: "bg-white text-zinc-950 hover:bg-zinc-200",
    back: "text-white/60 hover:text-white",
    dotOn: "bg-white",
    dotDone: "bg-white/50",
    dotOff: "bg-white/20",
    menu: "bg-zinc-900/95 ring-1 ring-white/10",
    menuItem: "text-white/85 hover:bg-white/10",
    dateScheme: "[color-scheme:dark]",
  },
};
