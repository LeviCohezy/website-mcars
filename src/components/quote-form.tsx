"use client";

import { useRef, useState } from "react";
import Section from "./section";
import { site } from "@/lib/site";

/**
 * QuoteForm — the canonical, reusable conversion element for the site.
 *
 *   <QuoteForm />                     full quote request (dark panel + pitch)
 *   <QuoteForm variant="inline" />    compact 3-field CTA to embed mid-page
 *
 * Both variants validate on the client (required fields, e-mail format) with
 * inline error messages and correct aria wiring, then hand off to the visitor's
 * mail client — there is no backend, matching the existing site behaviour.
 *
 * This is the ONE quote component page work should reach for. The larger
 * `quote-multistep` / `quote-contact` components are page-specific legacy and
 * are documented as such in CONVENTIONS.md.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white ring-1 transition-colors placeholder:text-zinc-500 focus:ring-2 focus:outline-none";
const labelClass = "mb-2 block text-sm font-medium text-muted-soft";

function inputCls(hasError: boolean, extra = "") {
  return `${inputBase} ${
    hasError ? "ring-red-400/70 focus:ring-red-400" : "ring-white/10 focus:ring-white/60"
  } ${extra}`.trim();
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

/** House submit button — white pill with a black arrow chip. */
function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="group inline-flex cursor-pointer items-center justify-center gap-3 self-start rounded-full bg-white py-3 pr-3 pl-7 text-sm font-medium text-ink transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
    >
      {children}
      <span className="flex size-8 items-center justify-center rounded-full bg-ink text-white">
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
  );
}

function mailto(subject: string, lines: string[]) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n")
  )}`;
}

/** Focus the first field carrying an error so keyboard/AT users land on it. */
function focusFirstError(form: HTMLFormElement | null, errors: Record<string, string>) {
  if (!form) return;
  const first = Object.keys(errors).find((k) => errors[k]);
  if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}

export default function QuoteForm({
  variant = "full",
  className = "",
}: {
  variant?: "full" | "inline";
  className?: string;
}) {
  return variant === "inline" ? (
    <InlineQuote className={className} />
  ) : (
    <FullQuote className={className} />
  );
}

/* ─────────────────────────────────────────────────────────────
   Full quote request
   ───────────────────────────────────────────────────────────── */

function FullQuote({ className }: { className: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"particulier" | "bedrijf">("particulier");
  const [depot, setDepot] = useState(false);
  const [asap, setAsap] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: FormData): Record<string, string> {
    const next: Record<string, string> = {};
    const req = (name: string, label: string) => {
      if (!String(data.get(name) ?? "").trim()) next[name] = `${label} is verplicht.`;
    };
    req("ophaal", "Ophaaladres");
    if (!depot) req("lever", "Leveradres");
    req("voertuig", "Voertuig");
    req("naam", "Naam");
    req("telefoon", "Telefoon");

    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "E-mail is verplicht.";
    else if (!EMAIL_RE.test(email)) next.email = "Vul een geldig e-mailadres in.";

    return next;
  }

  function revalidateField(name: string) {
    if (!formRef.current) return;
    // Only refresh an error that is already showing — never surprise the
    // user with a fresh error the moment they tab out of an untouched field.
    if (!errors[name]) return;
    const found = validate(new FormData(formRef.current));
    setErrors((prev) => ({ ...prev, [name]: found[name] ?? "" }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      focusFirstError(formRef.current, found);
      return;
    }

    window.location.href = mailto("Offerteaanvraag transport", [
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
    ]);
  }

  return (
    <Section id="offerte" className={className}>
      <div className="relative overflow-hidden rounded-3xl bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_70%_at_85%_15%,rgb(255_255_255/0.06),transparent_70%)]"
        />
        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:p-16">
          {/* Left: pitch */}
          <div>
            <p className="mb-4 text-sm font-medium tracking-widest text-muted uppercase">
              Offerte aanvragen
            </p>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
              <span className="text-white">Vertel ons wat er moet rijden. </span>
              <span className="text-muted">Binnen 24 uur hebt u een prijs.</span>
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Persoonlijk antwoord van ons team — geen automatische mails",
                "Vaste prijs, zonder verborgen kosten",
                "Ophaling waar u wil, levering op ons depot kan 24/7",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-soft"
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
            <div className="mt-10 border-t border-white/10 pt-6 text-sm leading-relaxed text-muted">
              Liever per mail?{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {site.email}
              </a>
              <br />
              {site.address.street}, {site.address.city}
            </div>
          </div>

          {/* Right: the form */}
          <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
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
                      ? "bg-white text-ink"
                      : "bg-white/5 text-muted-soft ring-1 ring-white/10 hover:text-white"
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
                  placeholder="Straat, gemeente, land"
                  aria-invalid={!!errors.ophaal}
                  aria-describedby={errors.ophaal ? "err-ophaal" : undefined}
                  onBlur={() => revalidateField("ophaal")}
                  className={inputCls(!!errors.ophaal)}
                />
                <FieldError id="err-ophaal" message={errors.ophaal} />
              </div>
              <div>
                <label htmlFor="lever" className={labelClass}>
                  Leveradres
                </label>
                <input
                  id="lever"
                  name="lever"
                  disabled={depot}
                  placeholder={depot ? "Mcars-depot, Roeselare" : "Straat, gemeente, land"}
                  aria-invalid={!!errors.lever}
                  aria-describedby={errors.lever ? "err-lever" : undefined}
                  onBlur={() => revalidateField("lever")}
                  className={inputCls(!!errors.lever, "disabled:opacity-50")}
                />
                <FieldError id="err-lever" message={errors.lever} />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-soft">
              <input
                type="checkbox"
                checked={depot}
                onChange={(e) => {
                  setDepot(e.target.checked);
                  if (e.target.checked) setErrors((p) => ({ ...p, lever: "" }));
                }}
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
                  placeholder="Merk en model"
                  aria-invalid={!!errors.voertuig}
                  aria-describedby={errors.voertuig ? "err-voertuig" : undefined}
                  onBlur={() => revalidateField("voertuig")}
                  className={inputCls(!!errors.voertuig)}
                />
                <FieldError id="err-voertuig" message={errors.voertuig} />
              </div>
              <div>
                <label htmlFor="toestand" className={labelClass}>
                  Toestand
                </label>
                <select
                  id="toestand"
                  name="toestand"
                  className={inputCls(false, "appearance-none [&>option]:text-ink")}
                >
                  <option>Start en rijdt</option>
                  <option>Start niet, maar is verrolbaar</option>
                  <option>Start niet en is geblokkeerd</option>
                </select>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-soft">
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
                  className={inputCls(false, "disabled:opacity-50 [color-scheme:dark]")}
                />
                <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-muted-soft">
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
                  className={inputCls(false, "[color-scheme:dark]")}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="naam" className={labelClass}>
                  Naam
                </label>
                <input
                  id="naam"
                  name="naam"
                  aria-invalid={!!errors.naam}
                  aria-describedby={errors.naam ? "err-naam" : undefined}
                  onBlur={() => revalidateField("naam")}
                  className={inputCls(!!errors.naam)}
                />
                <FieldError id="err-naam" message={errors.naam} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  onBlur={() => revalidateField("email")}
                  className={inputCls(!!errors.email)}
                />
                <FieldError id="err-email" message={errors.email} />
              </div>
              <div>
                <label htmlFor="telefoon" className={labelClass}>
                  Telefoon
                </label>
                <input
                  id="telefoon"
                  name="telefoon"
                  type="tel"
                  aria-invalid={!!errors.telefoon}
                  aria-describedby={errors.telefoon ? "err-telefoon" : undefined}
                  onBlur={() => revalidateField("telefoon")}
                  className={inputCls(!!errors.telefoon)}
                />
                <FieldError id="err-telefoon" message={errors.telefoon} />
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
                className={inputCls(false, "resize-none")}
              />
            </div>

            <SubmitButton>Verstuur aanvraag</SubmitButton>
            <p className="text-xs leading-relaxed text-zinc-600">
              Uw aanvraag opent in uw mailprogramma en komt rechtstreeks bij ons team terecht. Wij
              antwoorden zelf — binnen 24 uur.
            </p>
          </form>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inline CTA — a compact three-field capture to embed anywhere
   ───────────────────────────────────────────────────────────── */

function InlineQuote({ className }: { className: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: FormData): Record<string, string> {
    const next: Record<string, string> = {};
    if (!String(data.get("ophaal") ?? "").trim()) next.ophaal = "Vul een ophaaladres in.";
    if (!String(data.get("lever") ?? "").trim()) next.lever = "Vul een leveradres in.";
    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "Vul uw e-mail in.";
    else if (!EMAIL_RE.test(email)) next.email = "Ongeldig e-mailadres.";
    return next;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      focusFirstError(formRef.current, found);
      return;
    }
    window.location.href = mailto("Snelle offerteaanvraag transport", [
      `Ophaaladres: ${data.get("ophaal")}`,
      `Leveradres: ${data.get("lever")}`,
      `E-mail: ${data.get("email")}`,
    ]);
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-ink p-6 sm:p-8 ${className}`.trim()}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_70%_at_85%_15%,rgb(255_255_255/0.06),transparent_70%)]"
      />
      <div className="relative">
        <p className="text-sm font-medium tracking-widest text-muted uppercase">Snel een prijs</p>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
          Waar mag uw wagen heen?
        </h3>
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start"
        >
          <div>
            <label htmlFor="inline-ophaal" className="sr-only">
              Ophaaladres
            </label>
            <input
              id="inline-ophaal"
              name="ophaal"
              placeholder="Ophaaladres"
              aria-invalid={!!errors.ophaal}
              aria-describedby={errors.ophaal ? "err-inline-ophaal" : undefined}
              className={inputCls(!!errors.ophaal)}
            />
            <FieldError id="err-inline-ophaal" message={errors.ophaal} />
          </div>
          <div>
            <label htmlFor="inline-lever" className="sr-only">
              Leveradres
            </label>
            <input
              id="inline-lever"
              name="lever"
              placeholder="Leveradres"
              aria-invalid={!!errors.lever}
              aria-describedby={errors.lever ? "err-inline-lever" : undefined}
              className={inputCls(!!errors.lever)}
            />
            <FieldError id="err-inline-lever" message={errors.lever} />
          </div>
          <div>
            <label htmlFor="inline-email" className="sr-only">
              E-mail
            </label>
            <input
              id="inline-email"
              name="email"
              type="email"
              placeholder="E-mail"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-inline-email" : undefined}
              className={inputCls(!!errors.email)}
            />
            <FieldError id="err-inline-email" message={errors.email} />
          </div>
          <SubmitButton>Vraag prijs</SubmitButton>
        </form>
      </div>
    </div>
  );
}
