import { asset } from "@/lib/asset";
const points = [
  "Verzekerd transport",
  "Persoonlijke aanpak",
  "Transparante prijzen",
  "Heel Europa, elke week",
  "±20 jaar ervaring",
];

const stats = [
  {
    nr: "±20 jaar",
    short: "Ervaring in autotransport",
    text: "Ervaring in autotransport — oprichter Filip Maertens laadde in 2004 zijn eerste auto's op.",
  },
  {
    nr: "10.000+",
    short: "Transporten door heel Europa",
    text: "Transporten gereden door heel Europa, voor handelaars én particulieren.",
  },
];

function Check() {
  return (
    <span className="flex size-5 flex-none items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
      <svg
        className="size-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 12.5l5 5 10-11" />
      </svg>
    </span>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="waarom" className="sticky top-0 z-20 -mx-2 h-[100svh]">
      {/* Full-bleed: breaks out of the page's 8px frame and, above the map
          (z-20), slides over the pinned map until it covers it. Exactly one
          screen tall, so it covers the map the moment its top reaches the top
          of the viewport — and then stays there (sticky) while the sections
          after it (z-30 in page.tsx) slide over it in turn. */}
      <div className="relative h-full overflow-hidden bg-zinc-950">
        {/* Aerial shot of the Mcars transporter, zoomed on the truck */}
        <video
          src={asset("/good_but_make_him_drive_faster.mp4")}
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full scale-[1.35] object-cover object-[center_35%]"
        />
        {/* Legibility overlays: darker left column and soft edges */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(9_9_11/0.6),rgb(9_9_11/0.28)_45%,rgb(9_9_11/0.12)_65%,rgb(9_9_11/0.35))]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_9_11/0.4),transparent_28%,transparent_82%,rgb(9_9_11/0.3))]"
        />

        <div className="relative flex h-full flex-col justify-between gap-6 px-6 pt-8 pb-6 sm:gap-16 sm:p-12 lg:p-16">
          {/* Top left: pill, heading, checklist, CTA */}
          <div className="max-w-xl">
            <span className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 sm:inline-flex text-xs font-medium tracking-widest text-white uppercase ring-1 ring-white/20 backdrop-blur-sm">
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
              </svg>
              Waarom voor ons kiezen?
            </span>
            <h2 className="text-[1.65rem] font-medium sm:mt-6 sm:text-4xl leading-[1.15] tracking-tight text-white lg:text-5xl">
              Autotransport waar u niet meer naar hoeft om te kijken
            </h2>

            <ul className="mt-5 grid max-w-md grid-cols-2 gap-x-4 gap-y-3 sm:mt-9 sm:gap-x-10 sm:gap-y-4">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-[0.8rem] font-medium text-white/90 sm:gap-3 sm:text-sm"
                >
                  <Check />
                  {point}
                </li>
              ))}
            </ul>

            <a
              href="#offerte"
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white py-3 pr-6 pl-4 sm:mt-11 sm:py-3.5 sm:pr-7 sm:pl-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              <svg
                className="size-5 transition-transform duration-300 motion-safe:group-hover:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Vraag uw offerte aan
            </a>
          </div>

          {/* Bottom right: glass stat cards */}
          <div className="grid grid-cols-2 gap-3 [@media(max-height:700px)]:hidden sm:flex sm:max-w-sm sm:flex-col sm:gap-4 sm:self-end">
            {stats.map((stat) => (
              <div
                key={stat.nr}
                className="rounded-2xl bg-zinc-950/40 p-4 ring-1 ring-white/15 backdrop-blur-md sm:p-6"
              >
                <p className="text-2xl font-medium tracking-tight text-white sm:text-4xl">
                  {stat.nr}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-zinc-300 sm:hidden">
                  {stat.short}
                </p>
                <p className="mt-2 hidden text-sm leading-relaxed text-zinc-300 sm:block">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
