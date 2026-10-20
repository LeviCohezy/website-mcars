import Image from "next/image";
import Link from "next/link";
import { defaultProcess, defaultVehicleTypes, services, type IconKey } from "@/data/services";
import { site } from "@/lib/site";
import Icon from "./icon";
import { Reveal } from "./scroll";
import { HoverRevealList, ImageAccordion } from "./signature";
import { V3Block, V3Button, V3Head, V3Hero, V3Star } from "./v3-kit";

/*
 * Diensten 03 — "Donker & premium". Black page, centred cinematic hero, then a
 * giant outlined "DIENSTEN" wordmark behind the white Mcars truck with a dark
 * 4-column icon row beneath it. Services follow as tall photo cards with
 * oversized numbers.
 */

const pad = (n: number) => String(n).padStart(2, "0");

const STEP_IMAGES = [
  "/images/generated/customer-update.jpg",
  "/images/generated/planning-office.jpg",
  "/images/generated/pickup-inspection.jpg",
  "/images/generated/night-motorway.jpg",
];

const PROMISES: { icon: IconKey; title: string; body: string }[] = [
  { icon: "shield", title: "Verzekerd, met CMR", body: "Elke wagen geïnspecteerd en gefotografeerd bij ophaling." },
  { icon: "route", title: "Ophaling waar u wil", body: "Thuis, bij de verkoper of op ons depot in Roeselare." },
  { icon: "truck", title: "Eigen vloot", body: `Eigen transporters en vaste chauffeurs, sinds ${site.founded}.` },
  { icon: "phone", title: "Antwoord binnen 24u", body: "Geen callcenter — u spreekt rechtstreeks met het team." },
];

export default function DienstenV3() {
  return (
    <>
      <V3Hero
        image="/fleet/sunset-parking.jpg"
        crumbs={[{ href: "/", label: "Home" }, { label: "Diensten" }]}
        title="Voor elk voertuig de juiste aanpak."
        intro="Van één particuliere wagen tot een volledig wagenpark — in België en heel Europa."
      >
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <V3Button href="/offerte">Offerte aanvragen</V3Button>
          <V3Button href="#diensten-lijst" variant="ghost">Bekijk de {services.length} diensten</V3Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
          <Link href="/reviews" className="flex min-h-11 items-center gap-2 hover:text-white">
            <V3Star /> <span className="font-medium text-white">{site.reviews.score}/5</span> op Google
          </Link>
          <span className="flex min-h-11 items-center gap-2">
            <Icon name="users" className="size-4 text-white" /> {site.reviews.clients} tevreden klanten
          </span>
        </div>
      </V3Hero>

      {/* Giant word + truck silhouette + dark icon row */}
      <V3Block className="pt-8 sm:pt-12">
        <div className="relative mx-auto max-w-6xl">
          <p
            aria-hidden
            className="pointer-events-none text-center font-[family-name:var(--font-display)] text-[23vw] leading-[0.8] tracking-[0.01em] text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.28)] lg:text-[17rem]"
          >
            DIENSTEN
          </p>
          <Reveal className="relative mx-auto -mt-[15vw] w-[62%] max-w-md lg:-mt-40">
            <Image src="/truck-no-trailer.png" alt="Mcars-trekker van onze eigen vloot" width={1061} height={976} sizes="(min-width: 1024px) 28rem, 62vw" className="h-auto w-full" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-zinc-950 to-transparent" />
          </Reveal>
        </div>

        <ul className="mx-auto mt-4 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="bg-zinc-900 p-6 sm:p-7">
              <span className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h3 className="mt-6 text-lg font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </V3Block>

      {/* Services — large typographic index, photo floats beside the cursor */}
      <V3Block id="diensten-lijst" className="bg-zinc-900">
        <V3Head
          label={`${pad(services.length)} diensten`}
          lead="Elf manieren om uw wagen te verplaatsen,"
          trail="één team dat het regelt."
          intro="U spreekt met de mensen die de rit ook effectief uitvoeren — voor particulier en bedrijf."
        />
        <HoverRevealList
          tone="dark"
          items={services.map((s, i) => ({
            title: s.nav,
            body: s.subtitle,
            image: s.heroImage,
            href: `/diensten/${s.slug}`,
            meta: pad(i + 1),
          }))}
        />
      </V3Block>

      {/* Vehicle types — light pill cloud */}
      <V3Block>
        <V3Head label="Voertuigen" lead="Wat we vervoeren." trail="Rijdend of niet." center />
        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {defaultVehicleTypes.map((v) => (
            <li key={v} className="rounded-full border border-white/15 px-5 py-3 text-base font-light text-white/85 sm:text-lg">
              {v}
            </li>
          ))}
        </ul>
      </V3Block>

      {/* Process — expanding photo panels */}
      <V3Block className="pt-0 sm:pt-0">
        <V3Head label="Werkwijze" lead="Eén werkwijze," trail="voor elke dienst." />
        <ImageAccordion
          items={defaultProcess.map((p, i) => ({
            title: p.title,
            body: p.body,
            image: STEP_IMAGES[i % STEP_IMAGES.length],
            meta: `Stap ${pad(i + 1)}`,
          }))}
        />
      </V3Block>
    </>
  );
}
