export default function CtaBanner() {
  return (
    <section className="px-5 pb-8 sm:px-8">
      <div className="flex flex-col gap-8 rounded-3xl bg-zinc-100 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="max-w-xl text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
            Liever rechtstreeks contact? Zo simpel houden we het graag.
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-zinc-950" />
              Bereikbaar van 8u tot 18u
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-zinc-400" />
              Moorseelsesteenweg 16B, Roeselare
            </span>
          </div>
        </div>
        <a
          href="mailto:info@mcars.be"
          className="group inline-flex flex-none items-center justify-between gap-3 self-stretch rounded-full bg-zinc-950 py-3.5 pr-5 pl-7 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:justify-start sm:self-start lg:self-auto"
        >
          Mail info@mcars.be
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-zinc-950">
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
        </a>
      </div>
    </section>
  );
}
