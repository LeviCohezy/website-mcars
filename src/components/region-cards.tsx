"use client";

import { useEffect, useRef } from "react";

type Region = {
  nr: string;
  name: string;
  tag: string;
  text: string;
  stat: string;
  flags: string[][]; // each flag is a list of stripe colors
};

const regions: Region[] = [
  {
    nr: "01",
    name: "Frankrijk",
    tag: "Wekelijks",
    text: "Onze specialiteit: elke week halen we wagens op over heel Frankrijk, van Rijsel tot aan de Côte d'Azur. Ophaling tot in de stockageparken, met Franstalige chauffeurs die er de weg kennen.",
    stat: "Levering binnen 3–5 werkdagen",
    flags: [["#0055A4", "#FFFFFF", "#EF4135"]],
  },
  {
    nr: "02",
    name: "België & Nederland",
    tag: "Heel de Benelux",
    text: "Binnenlands transport van dealer tot dealer, van veiling tot particulier. Kust of Ardennen, Randstad of Limburg: de Benelux rijden we dagelijks, vaak geleverd binnen 48 uur.",
    stat: "Dagelijkse ritten",
    flags: [
      ["#000000", "#FDDA24", "#EF3340"],
      ["#AE1C28", "#FFFFFF", "#21468B"],
    ],
  },
  {
    nr: "03",
    name: "Spanje",
    tag: "Vaste route",
    text: "Vaste route richting Noord-Spanje: Bilbao, Zaragoza en Barcelona. Door slim te combineren met retourvracht houden we de prijs per wagen scherp, ook voor één enkele auto.",
    stat: "Vaste wekelijkse afvaart",
    flags: [["#AA151B", "#F1BF00", "#AA151B"]],
  },
  {
    nr: "04",
    name: "Duitsland",
    tag: "Vaste route",
    text: "Import uit Duitse veilingen en dealers? Wij pikken uw wagens op van München tot Hamburg en brengen ze gegroepeerd naar België. Ideaal voor handelaars die er regelmatig kopen.",
    stat: "Ophaling op veiling & dealer",
    flags: [["#000000", "#DD0000", "#FFCE00"]],
  },
  {
    nr: "05",
    name: "Italië & Polen",
    tag: "Op aanvraag",
    text: "Van oldtimers uit Milaan tot vlootwagens uit Warschau: op aanvraag plannen we transporten van en naar Italië en Polen, gecombineerd met onze vaste Europese routes.",
    stat: "Offerte binnen 24 uur",
    flags: [
      ["#008C45", "#F4F5F0", "#CD212A"],
      ["#FFFFFF", "#DC143C", "#FFFFFF"],
    ],
  },
  {
    nr: "06",
    name: "Scandinavië",
    tag: "Op aanvraag",
    text: "Denemarken, Zweden en Noorwegen bereiken we via betrouwbare partners en eigen ritten. Ook voor het hoge noorden krijgt u één aanspreekpunt en één duidelijke prijs.",
    stat: "Eén aanspreekpunt, één prijs",
    flags: [["#005293", "#FECB00", "#005293"]],
  },
];

/* Top-down car transporter, nose pointing down (it drives downward) */
function FlagTruck({ flag }: { flag: string[] }) {
  return (
    <svg width="40" height="125" viewBox="0 0 30 94" fill="none" aria-hidden>
      {/* trailer with the flag on its roof */}
      <rect x="3.5" y="1.5" width="23" height="60" rx="3" fill="#fff" stroke="#d4d4d8" />
      {flag.map((color, i) => (
        <rect
          key={i}
          x={5 + i * (20 / flag.length)}
          y="3"
          width={20 / flag.length}
          height="57"
          fill={color}
        />
      ))}
      {/* coupling */}
      <rect x="13" y="61" width="4" height="6" rx="1" fill="#a1a1aa" />
      {/* cab */}
      <rect x="4.5" y="66" width="21" height="24" rx="4.5" fill="#27272a" />
      {/* windshield at the front (bottom) */}
      <rect x="7" y="83" width="16" height="4.5" rx="1.5" fill="#a1a1aa" />
      {/* mirrors */}
      <rect x="1.5" y="68" width="3" height="7" rx="1.5" fill="#3f3f46" />
      <rect x="25.5" y="68" width="3" height="7" rx="1.5" fill="#3f3f46" />
    </svg>
  );
}

/* Lanes the trucks drive down, spread across the section width */
const lanes = [
  { left: "7%", flag: regions[0].flags[0], duration: 17, delay: -4, mobile: true },
  { left: "32%", flag: regions[3].flags[0], duration: 23, delay: -14, mobile: false },
  { left: "66%", flag: regions[1].flags[0], duration: 14, delay: -8, mobile: false },
  { left: "91%", flag: regions[2].flags[0], duration: 20, delay: -1, mobile: true },
];

export default function RegionCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!wrapper || !sticky || !track) return;

    let raf = 0;
    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const maxShift = Math.max(0, track.scrollWidth - sticky.clientWidth);
      track.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;
      if (barRef.current) {
        barRef.current.style.scale = `${progress} 1`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="regios" ref={wrapperRef} className="relative h-[320vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-zinc-50"
      >
        {/* Trucks driving from top to bottom behind the cards */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {lanes.map((lane, i) => (
            <div
              key={i}
              className={`absolute inset-y-0 ${lane.mobile ? "" : "hidden md:block"}`}
              style={{ left: lane.left }}
            >
              <div className="absolute inset-y-0 left-[19px] border-l border-dashed border-zinc-200" />
              <div
                className="drive-down absolute top-[-140px] opacity-70"
                style={{
                  animationDuration: `${lane.duration}s`,
                  animationDelay: `${lane.delay}s`,
                }}
              >
                <FlagTruck flag={lane.flag} />
              </div>
            </div>
          ))}
        </div>

        <div className="relative mb-10 px-5 sm:px-8">
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Onze regio&apos;s
          </p>
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-950">Van de Benelux </span>
            <span className="text-zinc-400">tot diep in Europa.</span>
          </h2>
        </div>

        <div ref={trackRef} className="relative flex w-max gap-5 px-5 will-change-transform sm:px-8">
          {regions.map((region) => (
            <article
              key={region.nr}
              className="flex w-[19rem] shrink-0 flex-col rounded-3xl border border-zinc-200 bg-white p-7 sm:w-[22rem]"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {region.flags.map((flag, i) => (
                    <span
                      key={i}
                      className="flex h-5 w-8 overflow-hidden rounded border border-zinc-200"
                    >
                      {flag.map((color, j) => (
                        <span key={j} className="flex-1" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-zinc-400">{region.nr}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-zinc-950">
                {region.name}
              </h3>
              <span className="mt-1 inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                {region.tag}
              </span>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-500">{region.text}</p>
              <p className="mt-6 border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-400">
                {region.stat}
              </p>
            </article>
          ))}
        </div>

        <div className="relative mt-10 px-5 sm:px-8">
          <div className="h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-zinc-950" />
          </div>
        </div>
      </div>
    </section>
  );
}
