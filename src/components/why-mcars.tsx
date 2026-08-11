const links = [
  { label: "Vaste prijs, geen verrassingen", href: "#offerte" },
  { label: "CMR & inspectie bij elke ophaling", href: "#werkwijze" },
  { label: "Eén aanspreekpunt, korte lijnen", href: "#offerte" },
];

function PhotoCard({
  img,
  tag,
  title,
  className = "",
}: {
  img: string;
  tag: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        backgroundImage: `linear-gradient(to top, rgb(9 9 11 / 0.8), rgb(9 9 11 / 0.15) 50%, rgb(9 9 11 / 0.1)), url(/services/${img}.jpg), linear-gradient(160deg, #3f3f46, #18181b)`,
        backgroundSize: "cover, cover, cover",
        backgroundPosition: "center, center, center",
      }}
    >
      <span className="absolute top-4 left-4 rounded-full bg-zinc-950/60 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
        {tag}
      </span>
      <p className="absolute right-5 bottom-5 left-5 text-lg leading-snug font-semibold text-white sm:text-xl">
        {title}
      </p>
    </div>
  );
}

export default function WhyMcars() {
  return (
    <section id="waarom" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="w-full">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
              Waarom Mcars
            </p>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-zinc-950">Wie één keer met Mcars </span>
              <span className="text-zinc-400">rijdt, blijft.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-zinc-500">
            Betrouwbaar, spontaan en transparant — we houden het simpel. Sinds
            2004 vervoeren we voertuigen voor handelaars én particulieren, en
            de meesten komen telkens terug.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-[1.35fr_1fr_1fr]">
          <PhotoCard
            img="06"
            tag="Onze vloot"
            title="9 eigen autotransporters met Kässbohrer-opbouw, 8 vaste chauffeurs"
            className="min-h-[320px] lg:min-h-[440px]"
          />

          <div className="grid grid-rows-2 gap-4">
            <PhotoCard
              img="03"
              tag="Sinds 2004"
              title="±20 jaar ervaring in autotransport"
              className="min-h-[210px]"
            />
            <PhotoCard
              img="04"
              tag="Alles kan mee"
              title="Elk voertuig, ook niet-rijdend"
              className="min-h-[210px]"
            />
          </div>

          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex flex-1 items-start justify-between gap-4 rounded-2xl bg-zinc-100 p-6 transition-colors duration-300 hover:bg-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span className="max-w-[12rem] text-lg leading-snug font-semibold text-zinc-950 transition-colors duration-300 group-hover:text-white sm:text-xl">
                  {link.label}
                </span>
                <span className="flex size-10 flex-none items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
