"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

/**
 * Route-local contact form (not a shared component). On submit it builds a
 * mailto: to site.email so the visitor's own mail client opens with a
 * prefilled message — no backend, no automatic confirmation mail.
 */
export default function ContactForm() {
  const t = useTranslations("ContactForm");
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [bericht, setBericht] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // The e-mail stays Dutch in every language: the office reads it.
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
    "w-full border-0 border-b border-zinc-300 bg-transparent px-0 py-3 text-lg text-zinc-950 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-950";
  const label = "block text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        <div>
          <label htmlFor="naam" className={label}>
            {t("name")}
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
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            {t("email")}
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
            placeholder={t("emailPlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="telefoon" className={label}>
            {t("phone")}
          </label>
          <input
            id="telefoon"
            name="telefoon"
            type="tel"
            autoComplete="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className={field}
            placeholder={t("phonePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="onderwerp" className={label}>
            {t("subject")}
          </label>
          <input
            id="onderwerp"
            name="onderwerp"
            type="text"
            value={onderwerp}
            onChange={(e) => setOnderwerp(e.target.value)}
            className={field}
            placeholder={t("subjectPlaceholder")}
          />
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="bericht" className={label}>
          {t("message")}
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={4}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          className={`${field} resize-y`}
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <button
        type="submit"
        className="group mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pr-2 pl-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        {t("submit")}
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
        {t("note", { email: site.email })}
      </p>
    </form>
  );
}
