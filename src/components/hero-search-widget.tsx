"use client";

export default function HeroSearchWidget() {
  return (
    <div className="w-full rounded-[1.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3.5">
          <PinIcon />
          <input
            type="text"
            placeholder="Vertreklocatie"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="Wissel vertrek- en bestemmingslocatie"
          className="hidden size-9 flex-none items-center justify-center self-center rounded-full bg-white text-zinc-900 shadow-md transition-transform hover:scale-105 lg:flex"
        >
          <SwapIcon />
        </button>

        <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3.5">
          <FlagIcon />
          <input
            type="text"
            placeholder="Bestemmingslocatie"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
          />
        </label>

        <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3.5">
          <CalendarIcon />
          <input
            type="text"
            placeholder="Aankomstdatum"
            onFocus={(e) => (e.currentTarget.type = "date")}
            onBlur={(e) => {
              if (!e.currentTarget.value) e.currentTarget.type = "text";
            }}
            className="w-full bg-transparent text-sm text-white [color-scheme:dark] placeholder:text-white/70 focus:outline-none"
          />
        </label>

        <a
          href="#offerte"
          className="flex flex-none items-center justify-center gap-1.5 rounded-2xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          Plan transport
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg className="size-4 shrink-0 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg className="size-4 shrink-0 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4m0 1h12l-2.5 4L17 13H5" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg className="size-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v13m0 0l-3-3m3 3l3-3m7 6V7m0 0l-3 3m3-3l3 3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="size-4 shrink-0 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M3 10h18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}
