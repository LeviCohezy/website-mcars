"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { sendToInbox } from "@/lib/inbox/client";

/**
 * Route-local contact form (not a shared component). On submit the message goes
 * to the CMS inbox (/cms); without an inbox (the static preview) it builds a
 * mailto: to site.email so the visitor's own mail client opens prefilled.
 */
export default function ContactForm() {
  const t = useTranslations("ContactForm");
  const ti = useTranslations("Inbox");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [bericht, setBericht] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const ok = await sendToInbox({
      kind: "contact",
      form: "contact",
      klant: { naam, email, telefoon },
      onderwerp,
      bericht,
    });
    setBusy(false);
    if (ok) return setSent(true);
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

  if (sent) {
    return (
      <div role="status" className="border-l-2 border-zinc-950 py-2 pl-6">
        <p className="text-2xl font-medium tracking-tight text-zinc-950">{ti("sentTitle")}</p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-500">{ti("sentBody")}</p>
      </div>
    );
  }

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
        disabled={busy}
        aria-busy={busy || undefined}
        className="group mt-10 inline-flex disabled:cursor-wait disabled:opacity-70 items-center gap-3 rounded-full bg-zinc-950 py-2 pr-2 pl-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        {busy ? ti("sending") : t("submit")}
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
