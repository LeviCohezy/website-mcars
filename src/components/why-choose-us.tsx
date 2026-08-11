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
    text: "Ervaring in autotransport — oprichter Filip Maertens laadde in 2004 zijn eerste auto's op.",
  },
  {
    nr: "10.000+",
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
    <section id="waarom" className="relative z-20">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
        {/* Aerial shot of the Mcars transporter, zoomed on the truck */}
        <video
          src="/good_but_make_him_drive_faster.mp4"
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

        <div className="relative flex flex-col justify-between gap-16 p-8 sm:p-12 lg:p-16">
          {/* Top left: pill, heading, checklist, CTA */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-white uppercase ring-1 ring-white/20 backdrop-blur-sm">
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
            <h2 className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Autotransport waar u niet meer naar hoeft om te kijken
            </h2>

            <ul className="mt-9 grid max-w-md gap-x-10 gap-y-4 sm:grid-cols-2">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm font-medium text-white/90"
                >
                  <Check />
                  {point}
                </li>
              ))}
            </ul>

            <a
              href="#offerte"
              className="group mt-11 inline-flex items-center gap-3 rounded-full bg-white py-3.5 pr-7 pl-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
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
          <div className="flex flex-col gap-4 self-end sm:max-w-sm">
            {stats.map((stat) => (
              <div
                key={stat.nr}
                className="rounded-2xl bg-zinc-950/40 p-6 ring-1 ring-white/15 backdrop-blur-md"
              >
                <p className="text-4xl font-medium tracking-tight text-white">
                  {stat.nr}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
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
