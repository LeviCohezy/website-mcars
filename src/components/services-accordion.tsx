"use client";

import { useEffect, useRef, useState } from "react";
import SectionPill from "./section-pill";

const services = [
  {
    nr: "01",
    title: "Import",
    body: "Wij halen uw wagen op bij dealers, veilingen of particulieren in heel Europa en leveren tot voor uw deur.",
  },
  {
    nr: "02",
    title: "Export",
    body: "Van België naar elke bestemming in Europa: gegroepeerd, verzekerd en met één duidelijke prijs.",
  },
  {
    nr: "03",
    title: "Oldtimers & specials",
    body: "Zorgvuldig vervoer voor bijzondere wagens, met extra aandacht voor lage bodems en kostbare lak.",
  },
  {
    nr: "04",
    title: "Niet-rijdende voertuigen",
    body: "Ook zonder draaiende motor laden we uw wagen veilig, met lier en kennis van zaken.",
  },
  {
    nr: "05",
    title: "Spoed & repatriëring",
    body: "Panne of ongeval in het buitenland? Eén telefoontje en we halen uw wagen terug naar huis.",
  },
  {
    nr: "06",
    title: "Vloot & wagenpark",
    body: "Meerdere voertuigen in één transport: efficiënt voor handelaars, leasing en wagenparkbeheerders.",
  },
  {
    nr: "07",
    title: "Eventtransport",
    body: "Op tijd en onberispelijk geleverd op elk salon, event of circuit — en nadien weer opgehaald.",
  },
];

export default function ServicesAccordion() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rise = (order: number) => ({
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: inView ? `${order * 120}ms` : "0ms" },
  });

  return (
    <section ref={sectionRef} className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
        <div {...rise(0)}>
          <SectionPill label="Onze diensten" />
          <h2 className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-950">Voor elk voertuig </span>
            <span className="text-zinc-400">een oplossing.</span>
          </h2>
        </div>
        <p
          {...rise(1)}
          className={`text-base leading-relaxed text-zinc-500 ${rise(1).className}`}
        >
          Van één wagen tot een volledige vloot: zeven diensten, één vast
          aanspreekpunt van offerte tot levering.
        </p>
      </div>

      <div {...rise(2)} className={`mt-14 ${rise(2).className}`}>
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <button
              key={service.nr}
              type="button"
              onClick={() => setActive(i)}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-expanded={isActive}
              className={`grid w-full cursor-pointer items-center gap-x-8 gap-y-4 border-t border-zinc-200 text-left transition-all duration-500 last:border-b lg:grid-cols-[minmax(15rem,1fr)_2fr_auto] ${
                isActive ? "dot-grid bg-zinc-50 px-5 py-8 sm:px-8" : "px-5 py-7 sm:px-8"
              }`}
            >
              <span
                className={`text-2xl font-medium tracking-tight transition-colors duration-300 sm:text-3xl ${
                  isActive ? "text-zinc-950" : "text-zinc-400"
                }`}
              >
                {service.title}
              </span>
              <span
                className={`max-w-xl text-base leading-relaxed text-zinc-500 transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "hidden opacity-0 lg:block"
                }`}
              >
                {isActive ? service.body : ""}
              </span>
              <img
                src={`/services/${service.nr}.jpg`}
                alt=""
                loading="lazy"
                className={`h-28 w-44 rounded-xl object-cover transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "hidden opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
