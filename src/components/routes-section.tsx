"use client";

import { useEffect, useRef, useState } from "react";

const destinations = [
  { name: "Frankrijk", pct: 100, tag: "Wekelijks" },
  { name: "België (binnenland)", pct: 92, tag: "Heel België" },
  { name: "Spanje", pct: 80, tag: "Vaste route" },
  { name: "Duitsland & Nederland", pct: 72, tag: "Vaste route" },
  { name: "Italië & Polen", pct: 55, tag: "Op aanvraag" },
  { name: "Scandinavië", pct: 45, tag: "Op aanvraag" },
];

export default function RoutesSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  return (
    <section id="routes" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
        {/* Countries with route-frequency bars */}
        <div>
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Onze routes
          </p>
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-950">Tot in elke uithoek </span>
            <span className="text-zinc-400">van Europa.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
            Onze niche: België en Nederland richting Frankrijk tot Noord-Spanje,
            met Nederlandstalige en Franstalige chauffeurs. Elke week halen we
            wagens op over heel Frankrijk, tot in de stockageparken.
          </p>

          <ul ref={listRef} className="mt-10 flex flex-col gap-5">
            {destinations.map((dest, i) => (
              <li key={dest.name}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="text-base font-semibold text-zinc-950">
                    {dest.name}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    {dest.tag}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-950 transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                    style={{
                      width: inView ? `${dest.pct}%` : "0%",
                      transitionDelay: `${i * 120}ms`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#offerte"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-950 py-3 pr-3 pl-7 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Vraag uw route aan
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

        {/* The Mcars transporter */}
        <img
          src="/fast-shipping.png"
          alt="Mcars autotransporter geladen met wagens"
          className="w-full max-w-2xl justify-self-center lg:justify-self-end"
        />
      </div>
    </section>
  );
}
