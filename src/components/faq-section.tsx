"use client";

import { useState } from "react";
import SectionPill from "./section-pill";

const faqs = [
  {
    q: "Hoe snel krijg ik een offerte?",
    a: "Binnen 24 uur. U krijgt een persoonlijk antwoord van ons team met de prijs en wanneer het transport ingepland kan worden — geen automatische mails.",
  },
  {
    q: "Kan een niet-rijdende wagen mee?",
    a: "Ja. Onze vrachtwagens zijn uitgerust met een winch waarmee we verrolbare wagens veilig op de oplegger trekken. Voor wagens die geblokkeerd zijn, bekijken we samen de beste oplossing.",
  },
  {
    q: "Welke documenten heb ik nodig?",
    a: "Enkel een CMR (vrachtbrief). Die maken we op bij de ophaling, met het ophaaladres, leveradres en de voertuiggegevens. Zo hebt u ook bewijs dat de wagen door Mcars is opgehaald.",
  },
  {
    q: "Waar kan ik mijn wagen laten leveren?",
    a: "Op elk adres dat u kiest, in binnen- of buitenland. Levering op ons depot in Roeselare is voordeliger en ophalen kan er 24/7.",
  },
  {
    q: "Rijden jullie ook buiten de Benelux?",
    a: "Zeker. Elke week rijden we door heel Frankrijk tot in Noord-Spanje, en daarnaast naar Duitsland, Italië, Polen en Scandinavië. Voor andere bestemmingen staan we altijd open.",
  },
  {
    q: "Hoe verloopt de betaling?",
    a: "Particulieren betalen vóór de ophaling, bedrijven betalen op factuur. De prijs die u in de offerte krijgt, is de prijs die u betaalt.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionPill label="FAQ" />
          <h2 className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
            <span className="text-zinc-950">Veelgestelde </span>
            <span className="text-zinc-400">vragen.</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-zinc-500">
            Staat uw vraag er niet tussen? Mail ons op{" "}
            <a
              href="mailto:info@mcars.be"
              className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950"
            >
              info@mcars.be
            </a>{" "}
            — u krijgt snel een persoonlijk antwoord.
          </p>
        </div>

        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none"
                >
                  <span className="text-base font-medium text-zinc-950 sm:text-lg">
                    {faq.q}
                  </span>
                  <span
                    className={`flex size-8 flex-none items-center justify-center rounded-full border border-zinc-200 text-zinc-950 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 text-sm leading-relaxed text-zinc-500">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
