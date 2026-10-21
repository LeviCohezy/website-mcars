"use client";

import { useRouter } from "next/navigation";

/**
 * Quote form for interior heroes — the working sibling of the homepage
 * `HeroSearchWidget`. Three fields and a button, either as a horizontal glass
 * bar (`layout="bar"`, service pages) or a stacked card (`layout="card"`,
 * route pages, where `defaults` prefill the corridor). On submit it hands
 * the values to `/offerte`, where `QuoteMultistep` prefills them from the
 * query string (`van`, `naar`, `datum`). Empty fields are simply left out, so
 * the bar never blocks a visitor who just wants to get to the form.
 */
export default function HeroQuoteBar({
  service,
  layout = "bar",
  title,
  subtitle,
  defaults = {},
  className = "",
}: {
  service?: string;
  layout?: "bar" | "card" | "panel";
  title?: string;
  /** Second, muted line of the panel title. */
  subtitle?: string;
  defaults?: { van?: string; naar?: string };
  className?: string;
}) {
  const card = layout === "card";
  // "panel": white card with visible labels — for heroes where the form sits beside the photo.
  const panel = layout === "panel";
  const stacked = card || panel;
  const input = panel
    ? "w-full bg-transparent text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none"
    : "w-full bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none";
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["van", "naar", "datum"]) {
      const value = String(data.get(key) ?? "").trim();
      if (value) params.set(key, value);
    }
    if (service) params.set("dienst", service);
    const qs = params.toString();
    router.push(`/offerte${qs ? `?${qs}` : ""}#offerte`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full ${
        panel
          ? "rounded-xl bg-white p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] sm:p-6"
          : card
          ? "rounded-[1.75rem] border border-white/15 bg-zinc-950/30 p-5 backdrop-blur-xl sm:p-6"
          : "max-w-5xl rounded-[1.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
      } ${className}`.trim()}
    >
      {card && title && <p className="mb-4 text-lg font-medium tracking-tight text-white">{title}</p>}
      {panel && title && (
        <p className="mb-5 text-xl leading-snug font-medium tracking-tight text-zinc-950">
          {title}
          {subtitle && <span className="block text-zinc-400">{subtitle}</span>}
        </p>
      )}
      <div className={`flex flex-col ${panel ? "gap-4" : "gap-2"} ${stacked ? "" : "lg:flex-row lg:items-center"}`}>
        <Field icon={<PinIcon />} label="Ophaaladres" panel={panel}>
          <input
            name="van"
            defaultValue={defaults.van}
            placeholder={panel ? "Straat, gemeente, land" : "Ophaaladres"}
            className={input}
          />
        </Field>
        <Field icon={<FlagIcon />} label="Leveradres" panel={panel}>
          <input
            name="naar"
            defaultValue={defaults.naar}
            placeholder={panel ? "Straat, gemeente, land" : "Leveradres"}
            className={input}
          />
        </Field>
        <Field icon={<CalendarIcon />} label="Ophaaldatum" panel={panel}>
          <input
            name="datum"
            type="text"
            placeholder={panel ? "Kies een datum" : "Ophaaldatum"}
            onFocus={(e) => (e.currentTarget.type = "date")}
            onBlur={(e) => {
              if (!e.currentTarget.value) e.currentTarget.type = "text";
            }}
            className={`${input} ${panel ? "" : "[color-scheme:dark]"}`}
          />
        </Field>
        <button
          type="submit"
          className={`group flex flex-none cursor-pointer items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
            panel
              ? "mt-1 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              : `rounded-2xl bg-white text-ink hover:bg-zinc-200 focus-visible:ring-white ${card ? "mt-2" : ""}`
          }`}
        >
          Prijs aanvragen
          <svg className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}

function Field({ icon, label, panel = false, children }: { icon: React.ReactNode; label: string; panel?: boolean; children: React.ReactNode }) {
  if (panel) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-500">{label}</span>
        <span className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3.5 text-zinc-500 ring-zinc-950 transition-shadow focus-within:ring-2">
          {icon}
          {children}
        </span>
      </label>
    );
  }
  return (
    <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3.5 text-white/80 ring-white/60 transition-shadow focus-within:ring-2">
      {icon}
      <span className="sr-only">{label}</span>
      {children}
    </label>
  );
}

function PinIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4m0 1h12l-2.5 4L17 13H5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M3 10h18" />
    </svg>
  );
}
