"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Route-local contact form (not a shared component). On submit it builds a
 * mailto: to site.email so the visitor's own mail client opens with a
 * prefilled message — no backend, no automatic confirmation mail.
 */
export default function ContactForm() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [bericht, setBericht] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = onderwerp || `Contactaanvraag via mcars.be`;
    const body = [
      `Naam: ${naam}`,
      `E-mail: ${email}`,
      `Telefoon: ${telefoon}`,
      "",
      bericht,
    ].join("\n");
    const href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  const field =
    "w-full rounded-2xl bg-white px-4 py-3 text-sm text-zinc-900 ring-1 ring-zinc-200 outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-950";
  const label = "mb-1.5 block text-sm font-medium text-zinc-700";

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-zinc-100 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="naam" className={label}>
            Naam
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            required
            autoComplete="name"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            className={field}
            placeholder="Uw naam"
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            placeholder="naam@voorbeeld.be"
          />
        </div>
        <div>
          <label htmlFor="telefoon" className={label}>
            Telefoon
          </label>
          <input
            id="telefoon"
            name="telefoon"
            type="tel"
            autoComplete="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className={field}
            placeholder="+32 4xx xx xx xx"
          />
        </div>
        <div>
          <label htmlFor="onderwerp" className={label}>
            Onderwerp
          </label>
          <input
            id="onderwerp"
            name="onderwerp"
            type="text"
            value={onderwerp}
            onChange={(e) => setOnderwerp(e.target.value)}
            className={field}
            placeholder="Waarover gaat het?"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="bericht" className={label}>
          Bericht
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={5}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          className={`${field} resize-y`}
          placeholder="Vertel ons kort wat u nodig heeft — ophaal- en leveradres, voertuig en gewenste periode."
        />
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex items-center gap-3 rounded-full bg-zinc-950 py-3 pr-3 pl-7 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Bericht versturen
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-white text-zinc-950">
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

      <p className="mt-4 text-xs leading-relaxed text-zinc-400">
        Uw bericht opent in uw eigen e-mailprogramma en wordt verstuurd naar {site.email}. U
        ontvangt geen automatische bevestiging — we antwoorden persoonlijk.
      </p>
    </form>
  );
}
