import Globe from "@/components/globe";

/*
 * "Over de grenzen" block for /routes: four stat cards, a globe that turns to
 * Europe on scroll with the countries we drive to filled black and the depot
 * pinned, and a frosted card listing every country.
 */

// Countries from the intake ("Actief in …") plus the corridor countries on the site.
const SERVED: Record<string, string> = {
  BEL: "België",
  NLD: "Nederland",
  LUX: "Luxemburg",
  FRA: "Frankrijk",
  DEU: "Duitsland",
  ESP: "Spanje",
  ITA: "Italië",
  CHE: "Zwitserland",
  AUT: "Oostenrijk",
  POL: "Polen",
  DNK: "Denemarken",
  SWE: "Zweden",
  NOR: "Noorwegen",
  FIN: "Finland",
};
const HOME = "BEL";
// The same countries as world-atlas numeric ids, for the globe.
const GLOBE_IDS = ["056", "528", "442", "250", "276", "724", "380", "756", "040", "616", "208", "752", "578", "246"];
// Roeselare [lon, lat].
const DEPOT: [number, number] = [3.13, 50.95];

const ICONS = {
  calendar: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  truck: "M2 6h12v10H2zM14 9h4.5l3.5 3.5V16h-8zM6 18a1.8 1.8 0 1 0 0-.01M17.5 18a1.8 1.8 0 1 0 0-.01",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  route: "M6 19a2 2 0 1 0 0-.01M18 5a2 2 0 1 0 0-.01M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7",
} as const;

export default function RoutesReach({ corridors }: { corridors: number }) {
  const stats = [
    { label: "Opgericht in", value: "2009", plus: false, icon: "calendar" as const },
    { label: "Transporten", value: "10.000", plus: true, icon: "truck" as const },
    { label: "Landen", value: String(Object.keys(SERVED).length), plus: false, icon: "globe" as const },
    { label: "Routes", value: String(corridors), plus: false, icon: "route" as const },
  ];
  const list = Object.entries(SERVED).sort((a, b) => a[1].localeCompare(b[1], "nl"));

  return (
    <section className="mt-2 overflow-hidden rounded-[2rem] bg-zinc-100 px-5 pt-20 pb-6 sm:px-10 sm:pt-28 sm:pb-10 lg:px-16">
      <h2 className="text-5xl leading-[0.98] font-medium tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl">
        Thuis in België,
        <br />
        <span className="text-zinc-400">over alle grenzen.</span>
      </h2>

      {/* Stat cards */}
      <dl className="relative z-10 mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col rounded-2xl bg-white/80 p-5 ring-1 ring-black/[0.04] backdrop-blur-md sm:p-6">
            <dt className="flex items-center justify-between gap-3 text-xs font-medium tracking-[0.12em] text-zinc-500 uppercase">
              {s.label}
              <svg className="size-5 flex-none text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={ICONS[s.icon]} />
              </svg>
            </dt>
            <dd className="mt-6 flex items-start text-5xl leading-none font-medium tracking-[-0.05em] text-zinc-950 tabular-nums sm:text-6xl">
              {s.value}
              {s.plus && <span className="ml-1 text-3xl text-zinc-400 sm:text-4xl">+</span>}
            </dd>
          </div>
        ))}
      </dl>

      {/* Map on a globe */}
      <div className="relative -mt-6 h-[30rem] sm:h-[42rem] lg:h-[54rem]">
        <Globe
          preset="cap"
          theme="light"
          served={GLOBE_IDS}
          home="056"
          marker={DEPOT}
          label="Wereldbol met de landen waar Mcars naartoe rijdt"
          className="absolute inset-x-0 top-0 bottom-0 -mx-5 sm:-mx-10 lg:-mx-16"
        />
        <ul className="absolute right-0 bottom-28 hidden items-center gap-5 text-sm text-zinc-600 sm:flex">
          <li className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-zinc-800" /> Actief in
          </li>
          <li className="flex items-center gap-2">
            <span className="size-3 rounded-full border-2 border-zinc-950 bg-white" /> Depot Roeselare
          </li>
        </ul>
      </div>

      {/* Country list on frosted glass, over the bottom of the map */}
      <div className="relative z-10 -mt-20 rounded-[1.5rem] bg-white/70 p-6 ring-1 ring-black/[0.04] backdrop-blur-xl sm:-mt-24 sm:p-9">
        <p className="text-3xl font-medium tracking-[-0.03em] text-zinc-950 sm:text-4xl">Wij rijden door heel Europa</p>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {list.map(([iso, name]) => (
            <li key={iso} className="flex items-center gap-2.5 text-base text-zinc-700">
              {iso === HOME ? (
                <span aria-label="thuisbasis" className="size-3 flex-none rounded-full border-2 border-zinc-950 bg-white" />
              ) : (
                <span aria-hidden className="size-1.5 flex-none rounded-full bg-zinc-400" />
              )}
              <span className={iso === HOME ? "font-medium text-zinc-950" : ""}>{name}</span>
              {iso === HOME && <span className="text-sm text-zinc-400">thuisbasis</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
