"use client";

import { useEffect, useRef } from "react";
import SectionPill from "./section-pill";

const problems = [
  {
    nr: "//01",
    img: "05",
    title: "Onduidelijke planning",
    body: "Wanneer wordt de wagen opgehaald? Vandaag, morgen, ergens deze week? Uw dag staat on hold.",
  },
  {
    nr: "//02",
    img: "02",
    title: "Weinig updates",
    body: "Eens de wagen vertrokken is, blijft het stil tot aan de levering. U belt zelf achter nieuws aan.",
  },
  {
    nr: "//03",
    img: "04",
    title: "Versnipperde communicatie",
    body: "Telefoontjes, mails en tussenpersonen — niemand heeft het volledige overzicht.",
  },
  {
    nr: "//04",
    img: "03",
    title: "Onzekere verzekering",
    body: "Is de wagen wel verzekerd tijdens het transport? Bij schade begint de discussie pas echt.",
  },
  {
    nr: "//05",
    img: "06",
    title: "Papierwerk & documenten",
    body: "Vrachtbrieven, douanedocumenten, exportplaten: één ontbrekend papier legt alles stil.",
  },
  {
    nr: "//06",
    img: "07",
    title: "Verborgen kosten",
    body: "De offerte lijkt scherp, tot er toeslagen bijkomen voor brandstof, tol of wachttijd.",
  },
];

export default function ProblemsGrid() {
  const wrapperRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Pinned section: the problem cards sweep sideways while the user scrolls.
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
    <section ref={wrapperRef} className="relative h-[300vh]">
      <div
        ref={stickyRef}
        className="dot-grid sticky top-0 flex h-screen flex-col justify-center overflow-hidden rounded-3xl bg-zinc-50"
      >
        <div className="mb-6 flex flex-col items-center px-5 text-center">
          <SectionPill label="Het probleem" />
          <h2 className="mt-5 max-w-2xl text-2xl font-medium leading-[1.12] tracking-tight text-zinc-950 sm:text-3xl">
            De echte problemen in autotransport
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Transport voelt vaak traag, ondoorzichtig en onbetrouwbaar — zo
            lossen wij dat op.
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-5 px-5 will-change-transform sm:px-8"
        >
          {problems.map((problem, i) => {
            const flip = i % 2 === 1;
            const text = (
              <div className="flex-1 rounded-xl border border-zinc-100 bg-zinc-50 p-5">
                <h3 className="text-lg font-semibold text-zinc-950">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {problem.body}
                </p>
              </div>
            );
            const photo = (
              <img
                src={`/services/${problem.img}.jpg`}
                alt={problem.title}
                loading="lazy"
                className="aspect-square max-h-[46vh] w-full rounded-xl object-cover"
              />
            );
            return (
              <article
                key={problem.nr}
                className="flex w-[19rem] shrink-0 flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 lg:w-[calc((100vw-7.5rem)/3)]"
              >
                <div className="flex items-baseline justify-between px-1">
                  <span className="text-sm font-medium tracking-widest text-zinc-950 uppercase">
                    Probleem
                  </span>
                  <span className="text-sm font-medium text-zinc-400">
                    {problem.nr}
                  </span>
                </div>
                {flip ? (
                  <>
                    {text}
                    {photo}
                  </>
                ) : (
                  <>
                    {photo}
                    {text}
                  </>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center px-5">
          <div className="h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200">
            <div ref={barRef} className="h-full w-full origin-left bg-zinc-950" style={{ scale: "0 1" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
