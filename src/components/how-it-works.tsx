"use client";

import { useState } from "react";

const steps = [
  {
    title: "Offerte aanvragen",
    body: "Vraag uw transport aan via de website, telefonisch of via WhatsApp. U krijgt binnen 24 uur een antwoord met de prijs en wanneer we het kunnen inplannen.",
  },
  {
    title: "Transport inplannen",
    body: "Na uw goedkeuring leggen we samen de ophaaldatum vast. Op de dag zelf belt de chauffeur wanneer hij ter plaatse zal zijn.",
  },
  {
    title: "Ophaling met CMR",
    body: "We halen uw wagen op waar u wil. Ter plaatse maken we de CMR-vrachtbrief op en inspecteren we het voertuig — alles correct gedocumenteerd. Leveren op ons depot in Roeselare kan 24/7 en is voordeliger.",
  },
  {
    title: "Levering & betaling",
    body: "We bellen wanneer we bij het leveradres aankomen en zetten uw wagen veilig af. Particulieren betalen vóór de ophaling, bedrijven eenvoudig op factuur.",
  },
];

export default function HowItWorks() {
  const [open, setOpen] = useState(0);

  return (
    <section id="werkwijze" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid w-full gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="mb-4 text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Hoe werkt het
          </p>
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-950">Van aanvraag tot levering </span>
            <span className="text-zinc-400">in vier eenvoudige stappen.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
            Geen ingewikkelde procedures. U vraagt aan, wij plannen, rijden en
            leveren — en u weet op elk moment waar u aan toe bent.
          </p>
          <a
            href="#offerte"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-950"
          >
            <span className="underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-950">
              Start met stap één
            </span>
            <svg
              className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <ol className="flex flex-col gap-3">
          {steps.map((step, i) => {
            const isOpen = open === i;
            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  className={`w-full cursor-pointer rounded-2xl p-6 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-7 ${
                    isOpen
                      ? "bg-zinc-950"
                      : "bg-zinc-100 hover:bg-zinc-200/70"
                  }`}
                >
                  <span className="flex items-center gap-5">
                    <span
                      className={`flex size-9 flex-none items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                        isOpen
                          ? "bg-white text-zinc-950"
                          : "bg-white text-zinc-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`flex-1 text-lg font-semibold sm:text-xl ${
                        isOpen ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {step.title}
                    </span>
                    <svg
                      className={`size-5 flex-none transition-transform duration-300 ${
                        isOpen ? "rotate-45 text-white" : "text-zinc-400"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-4 pl-14 text-sm leading-relaxed text-zinc-400 sm:text-base">
                        {step.body}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
