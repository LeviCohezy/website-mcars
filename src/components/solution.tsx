const fixes = [
  {
    title: "Vaste afspraak, vooraf ingepland",
    body: "U weet vóór het transport wanneer we komen. Op de dag zelf belt de chauffeur wanneer hij ter plaatse zal zijn.",
  },
  {
    title: "De chauffeur belt, u hoeft niet te bellen",
    body: "Bij ophaling én levering neemt onze chauffeur zelf contact op. Geen radiostilte, geen achternabellen.",
  },
  {
    title: "Eén aanspreekpunt van offerte tot levering",
    body: "U vertelt uw verhaal één keer. Dezelfde mensen volgen uw transport op, van aanvraag tot aflevering.",
  },
];

export default function Solution() {
  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_80%_at_15%_20%,rgb(255_255_255/0.06),transparent_70%)]"
        />
        <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:p-16">
          <div className="flex flex-col">
            <p className="mb-4 text-sm font-medium tracking-widest text-zinc-500 uppercase">
              Onze oplossing
            </p>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
              <span className="text-white">Zo hoort transport te zijn: </span>
              <span className="text-zinc-500">geregeld, gemeld, geleverd.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Op een eenvoudige manier voertuigen transporteren van A naar B,
              rekening houdend met uw wensen. Zo simpel houden wij het al ruim
              vijftien jaar.
            </p>
            <a
              href="#werkwijze"
              className="group mt-8 inline-flex items-center gap-3 self-start rounded-full bg-white py-2.5 pr-2.5 pl-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Bekijk onze aanpak
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
            </a>
          </div>

          <ul className="flex flex-col gap-3">
            {fixes.map((fix, i) => (
              <li
                key={fix.title}
                className="flex items-start gap-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
              >
                <span className="flex size-9 flex-none items-center justify-center rounded-full bg-white text-sm font-semibold text-zinc-950">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg leading-snug font-semibold text-white">
                    {fix.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                    {fix.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
